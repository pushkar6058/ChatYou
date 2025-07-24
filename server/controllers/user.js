import { compare } from "bcrypt";
import { User } from "../models/user.js";
import { Chat } from "../models/chat.js";
import { Request } from "../models/request.js";

import { cookieOptions, emitEvent, sendTokens, uploadFilesToCloudinary } from "../utils/features.js";
import { tryCatch } from "../middlewares/error.js";
import { ErrorHandler } from "../utils/utility.js";
import { NEW_REQUEST, REFETCH_CHATS } from "../constants/events.js";
import { getOtherMember } from "../lib/helper.js";

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

const searchUser = tryCatch(async (req, res) => {
  const { name } = req.query;

  // finding all myChats

  const myChats = await Chat.find({
    groupChat: false,
    members: req.user,
  });

  // all users from my chats means my friends or people i have chatted with
  const allUsersFromMyChats = myChats.flatMap((chat) => chat.members);

  // finding all users except me and myFriends
  const allUsersExceptMeAndFriends = await User.find({
    _id: { $nin: allUsersFromMyChats },
    name: { $regex: name, $options: "i" },
  });

  const users = allUsersExceptMeAndFriends.map(({ _id, name, avatar }) => ({
    _id,
    name,
    avatar: avatar.url,
  }));

  // i need to find out the chats in
  // which i am member and it is not a groupChat
  return res.status(200).json({
    success: true,
    users,
  });
});

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
