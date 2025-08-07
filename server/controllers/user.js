import { compare } from "bcrypt";
import { User } from "../models/user.js";
import { Chat } from "../models/chat.js";
import { Request } from "../models/request.js";

import { cookieOptions, emitEvent, sendTokens, uploadFilesToCloudinary } from "../utils/features.js";
import { tryCatch } from "../middlewares/error.js";
import { ErrorHandler } from "../utils/utility.js";
import { NEW_REQUEST, REFETCH_CHATS } from "../constants/events.js";
import { getOtherMember } from "../lib/helper.js";
import { Types } from "mongoose";

const newUser =tryCatch( async (req, res,next) => {
  const { name, username, password, bio } = req.body;
  const file=req.file;
  if(!file){
    console.log("Please attach file");
    return next(new ErrorHandler("Please upload file...",400));
    
  }
  const result= await uploadFilesToCloudinary([file]);
  const avatar = {
    public_id: result[0].public_id,
    url: result[0].url,
  };
  // upload avatar to cloudinary
  const userCreated = await User.create({
    name: name,
    bio: bio,
    username: username,
    password: password,
    avatar,
  });

  sendTokens(res, userCreated, 201, "Created successfully");
});

const login = tryCatch(async (req, res, next) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid username or password", 404));
  }

  const isMatch = await compare(password, user.password);

  if (!isMatch) {
    return next(new ErrorHandler("Invalid Username/Password", 404));
  }

  sendTokens(res, user, 200, `Welcome back, ${user.name}`);
});

const getMyProfile = tryCatch(async (req, res) => {
  try {
    const user = await User.findById(req.user);
  
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
  }
});

const logout = tryCatch(async (req, res) => {
  return res
    .status(200)
    .cookie("chatu-token", "", { ...cookieOptions, maxAge: 0 })
    .json({
      success: true,
      message: "Logged out successfully",
    });
});

// const searchUser = tryCatch(async (req, res) => {
//   const searchName = req.query.name || "";

//   // Step 1: Get all 1-to-1 chats
//   const myChats = await Chat.find({
//     groupChat: false,
//     members: req.user,
//   }).select("members");

//   // Step 2: Extract friend IDs
//   const friendIds = new Set();
//   myChats.forEach(chat => {
//     chat.members.forEach(memberId => {
//       if (memberId.toString() !== req.user.toString()) {
//         friendIds.add(memberId.toString());
//       }
//     });
//   });

//   // Step 3: Find users not in chats and matching name
//   const users = await User.find({
//     _id: {
//       $ne: req.user,
//       $nin: Array.from(friendIds)
//     },
//     name: { $regex: searchName, $options: "i" },
//   }).select("name avatar");
//   const formattedUsers = users.map(({ _id, name, avatar }) => ({
//     _id,
//     name,
//     avatar: avatar?.url || "",
//   }));

//   res.status(200).json({
//     success: true,
//     formattedUsers
//   });
// });


// const searchUser = tryCatch(async (req, res) => {
//   const { name = "" } = req.query;

//   // Step 1: Get all 1-to-1 (non-group) chats for current user
//   const myChats = await Chat.find({
//     groupChat: false,
//     members: req.user,
//   });

//   // Step 2: Extract all members from these chats
//   const allUsersFromMyChats = myChats.flatMap(chat =>
//     chat.members.map(member => member.toString())
//   );

//   // Step 3: Create a Set of IDs to exclude (friends + self)
//   const exclusionSet = new Set([...allUsersFromMyChats, req.user.toString()]);


//   // Step 4: Find users not in the exclusion list and matching the name
//   const users = await User.find({
//     _id: { $nin: Array.from(exclusionSet) },
//     name: { $regex: name, $options: "i" },
//   });
  
 

//   // Step 5: Format the output
//   const formattedUsers = users.map(({ _id, name, avatar }) => ({
//     _id,
//     name,
//     avatar: avatar?.url || "",
//   }));
  

//   return res.status(200).json({
//     success: true,
//     users: formattedUsers,
//   });
// });


const searchUser = tryCatch(async (req, res, next) => { // Added 'next' for error handling if tryCatch uses it
  try {
    const { name = "" } = req.query;
  const userId = req.user; // Assuming req.user contains the ObjectId of the current user

  // 1. Get all one-on-one chats where the current user is a member.
  // We only need the 'members' field.
  const myOneOnOneChats = await Chat.find({
    groupChat: false,
    members: userId,
  }).select("members");

  // 2. Extract the IDs of all users (friends) the current user has already chatted with.
  // Crucially, filter out the current user's own ID from each chat's members array.
  const chattedUserIds = myOneOnOneChats.flatMap((chat) =>
    chat.members.filter((memberId) => !memberId.equals(userId))
  );

  // 3. Create a comprehensive list of user IDs to exclude from the search.
  // This list includes:
  //    a) The current user's ID (to prevent searching for themselves).
  //    b) All users already chatted with.
  // Use a Set to ensure uniqueness and efficient lookup, then convert back to array.
  const excludeUserIds = [...new Set([...chattedUserIds, new Types.ObjectId(userId)])];
  // Note: Using new Types.ObjectId(userId) to ensure userId is a proper ObjectId
  // for robust comparison, especially if req.user comes as a string.

  // 4. Search for users who are NOT in the exclude list and whose name matches the query.
  const users = await User.find({
    _id: { $nin: excludeUserIds }, // Exclude current user and already chatted users
    name: { $regex: name, $options: "i" }, // Case-insensitive partial name match
  }).select("_id name avatar"); // Select only necessary fields for performance

  // 5. Format the results for the frontend.
  const formattedUsers = users.map(({ _id, name, avatar }) => ({
    _id,
    name,
    avatar: avatar.url, // Assuming avatar is an object with a 'url' property
  }));

  return res.status(200).json({
    success: true,
    users: formattedUsers,
  });
  } catch (error) {
    console.log(error);
  }
});




// const searchUser = tryCatch(async (req, res) => {
//   const { name="" } = req.query;

//   // Get all chats where user is a member
//   const myChats = await Chat.find({
//     groupChat: false,
//     members: req.user,
//   });

//   // Extract friend IDs (excluding self)
//   const allUsersFromMyChats = myChats
//     .flatMap((chat) => chat.members);

//   // Exclude self and already chatted users
//   const allUsersExceptMeAndFriends = await User.find({
//     _id: { $nin: [...allUsersFromMyChats, req.user] },
//     name: { $regex: name, $options: "i" },
//   });

//   const users = allUsersExceptMeAndFriends.map(({ _id, name, avatar }) => ({
//     _id,
//     name,
//     avatar: avatar.url,
//   }));

//   return res.status(200).json({
//     success: true,
//     users,
//   });
// });




const sendFriendRequest = tryCatch(async (req, res, next) => {
  const { userId } = req.body;

  const request = await Request.findOne({
    $or: [
      { sender: req.user, reciever: userId },
      { sender: userId, reciever: req.user },
    ],
  });

  if (request) {
    return next(new ErrorHandler("request already sent", 400));
  }
  await Request.create({
    sender: req.user,
    reciever: userId,
  });

  emitEvent(req, NEW_REQUEST, [userId]);

  return res.status(200).json({
    status: "success",
    message: "Friend request sent successfully",
  });
});

const acceptFriendRequest = tryCatch(async (req, res, next) => {
    const {requestId, accept}=req.body;
   

    const request=await Request.findById(requestId)
        .populate("sender","name")
        .populate("reciever","name");

    console.log(request);

    if(!request)return next(new ErrorHandler("Request not found",400));
    if(request.reciever._id.toString()!==req.user.toString()){
        return next(new ErrorHandler("You are not authorized to accept this req",401));
    }

    if(!accept){
        await request.deleteOne();

        return res.status(200).json({
            success:true,
            message:"Friend request rejected"
        })

    }

    const members=[request.sender._id,request.reciever._id]

    await Promise.all([Chat.create({
        members:members,
        name:`${request.sender.name}-${request.reciever.name}`
    }),request.deleteOne()]);

    emitEvent(req,REFETCH_CHATS,members);

    return res.status(200).json({
    status: "success",
    message: "Friend request accepted successfully",
    senderId:request.sender._id
  });




}
 );


 const getMyNotifications=tryCatch(async(req,res,next)=>{
  const requests=await Request.find({reciever:req.user}).populate("sender","name avatar");

  const allRequests= requests.map(({_id,sender})=>({
    _id,
    sender:{
    _id:sender._id,
    name:sender.name,
    avatar:sender.avatar.url
    }
  }))

return res.status(200).json({
  success:true,
  allRequests
})
 });


const getMyFriends=tryCatch(async(req,res)=>{
  const chatId= req.query.chatId;

  const chats=await Chat.find({
    members:req.user,
    groupChat:false,
  }).populate("members","name avatar");

  const friends= chats.map(({members})=>{
    const otherUser=getOtherMember(members,req.user);


    return {
      _id:otherUser._id,
      name:otherUser.name,
      avatar:otherUser.avatar.url,
    }
  })

  if(chatId){
    const chat=await Chat.findById(chatId);
    const availableFriends=friends.filter(
      (friend)=>(
      !chat.members.includes(friend._id)
    ))

    return res.status(200).json({
      success:true,
      friends:availableFriends,
    })
  }

  else{
    return res.status(200).json({
      success:true,
      friends
    })
  }
 



})



export { login,
   newUser,
    getMyProfile,
     logout,
      searchUser,
       sendFriendRequest,
       acceptFriendRequest,
       getMyNotifications,
       getMyFriends };
