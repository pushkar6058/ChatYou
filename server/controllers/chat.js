import {
  ALERT,
  NEW_MESSAGE,
  NEW_MESSAGE_ALERT,
  REFETCH_CHATS,
} from "../constants/events.js";
import { getOtherMember } from "../lib/helper.js";
import { tryCatch } from "../middlewares/error.js";
import { Chat } from "../models/chat.js";
import { User } from "../models/user.js";
import { deleteFilesFromCloudinary, emitEvent, uploadFilesToCloudinary } from "../utils/features.js";
import { ErrorHandler } from "../utils/utility.js";
import { Message } from "../models/message.js";

const newGroupChat = tryCatch(async (req, res, next) => {
  const { name, members } = req.body;

  
  const allMembers = [...members, req.user];
  const chat = await Chat.create({
    name,
    groupChat: true,
    creator: req.user,
    members: allMembers,
  });
  emitEvent(req, ALERT, allMembers, `Welcome to ${name} group`);

  // as new user join,then all chats will be fetched to him
  emitEvent(req, REFETCH_CHATS, members);

  return res.status(201).json({
    success: true,
    message: "Group Created",
  });
});

const getMyChats = tryCatch(async (req, res, next) => {
  const chats = await Chat.find({ members: req.user }).populate(
    "members",
    "name avatar"
  );

  const tranformedChats = chats.map(({ _id, name, members, groupChat }) => {
    const otherMember = getOtherMember(members, req.user);
    return {
      _id,
      groupChat,
      avatar: groupChat
        ? members.slice(0, 3).map(({ avatar }) => avatar.url)
        : [otherMember.avatar.url],
      name: groupChat ? name : otherMember.name,
      members: members.reduce((prev, curr) => {
        if (curr._id.toString() !== req.user.toString()) {
          prev.push(curr._id);
        }
        return prev;
      }, []),
    };
  });

  return res.status(200).json({
    success: true,
    chats: tranformedChats,
  });
});

const getMyGroups = tryCatch(async (req, res, next) => {
  const chats = await Chat.find({
    members: req.user,
    groupChat: true,
    creator: req.user,
  }).populate("members", "name avatar");

  const groups = chats.map(({ members, _id, groupChat, name }) => ({
    _id,
    name,
    groupChat,
    avatar: members.slice(0, 3).map(({ avatar }) => avatar.url),
  }));

  return res.status(200).json({
    success: true,
    groups,
  });
});

const addNewMembers = tryCatch(async (req, res, next) => {
  const { chatId, members } = req.body;


  const group = await Chat.findById(chatId);
  if (!group) {
    return next(new ErrorHandler("Chat not found", 404));
  }
  if (!group.groupChat) {
    return next(new ErrorHandler("this is not a groupChat", 400));
  }

  if (group.creator.toString() !== req.user.toString()) {
    return next(new ErrorHandler("You are not allowed to add members", 403));
  }

  const allNewMemberPromise = members.map((i) => User.findById(i, "name"));
  const allNewMembers = await Promise.all(allNewMemberPromise);

  const uniqueMembers = allNewMembers
    .filter((i) => !group.members.includes(i._id.toString()))
    .map((i) => i._id);

  group.members.push(...uniqueMembers);

  if (group.members.length > 100) {
    return next(new ErrorHandler("Group members limit reached", 400));
  }

  await group.save();

  const allUserName = allNewMembers.map((i) => i.name).join(",");

  emitEvent(
    req,
    ALERT,
    group.members,
    `${allUserName} are added to the group successfully`
  );
  emitEvent(req, REFETCH_CHATS, group.members);

  return res.status(200).json({
    success: true,
    message: "members added successfully",
  });
});

const removeMembers = tryCatch(async (req, res, next) => {
  const { chatId, userId } = req.body;
  const [chat, userToRemove] = await Promise.all([
    Chat.findById(chatId),
    User.findById(userId, "name"),
  ]);

  if (!chat) {
    return next(new ErrorHandler("Group does not exists", 404));
  }

  if (!chat.groupChat) {
    return next(new ErrorHandler("This is not a groupChat", 400));
  }

  if (chat.creator.toString() !== req.user.toString()) {
    return next(new ErrorHandler("You are not allowed to remove members", 403));
  }

  if (chat.members.length <= 3) {
    return new ErrorHandler("group must have 3 members", 400);
  }

  chat.members = chat.members.filter(
    (mem) => mem.toString() !== userId.toString()
  );

  await chat.save();

  emitEvent(
    req,
    ALERT,
    chat.members,
    `${userToRemove} has been removed from group`
  );
  emitEvent(req, REFETCH_CHATS, chat.members);

  return res.status(200).json({
    success: true,
    message: "Member removed successfully",
  });
});

const leaveGroup = tryCatch(async (req, res, next) => {
  const  chatId  = req.params.id;
  console.log(req.user);

  const chat = await Chat.findById(chatId);

  if (!chat) {
    return next(new ErrorHandler("Group does not exists", 404));
  }
  if (!chat.groupChat) {
    return next(new ErrorHandler("This is not a groupChat", 400));
  }

  const remainingMem = chat.members.filter(
    (member) => member.toString() !== req.user.toString()
  );

  if (chat.creator.toString() === req.user.toString()) {
    const randomEle = Math.floor(Math.random() * remainingMem.length);

    newCreator = remainingMem[randomEle];
    chat.creator = newCreator;
  }

  chat.members = remainingMem;
  const [user] = await Promise.all([
    User.findById(req.user, "name"),
    chat.save(),
  ]);

  emitEvent(req, ALERT, chat.members, `${user.name} has left the group`);
  emitEvent(req, REFETCH_CHATS, chat.members);

  return res.status(200).json({
    success: true,
    message: "Youleft the group",
  });
});

const sendAttachments = tryCatch(async (req, res, next) => {
  const { chatId } = req.body;
  const files = req.files || [];

  // Validate file count
  if (files.length < 1 || files.length > 5) {
    return next(new ErrorHandler("Attachments must be 1-5", 400));
  }

  // Fetch chat & user
  const [chat, me] = await Promise.all([
    Chat.findById(chatId),
    User.findById(req.user, "name"),
  ]);

  if (!chat) {
    return next(new ErrorHandler("Chat not found", 404));
  }

  // Upload files to Cloudinary
    const attachments = await uploadFilesToCloudinary(files);
 
  

  // Create message
  const messageForDb = {
    content: "",
    attachments,
    sender: me._id,
    chat: chatId,
  };



  const messageForRealTime = {
    content: "",
    attachments,
    chat: chatId,
    sender: {
      _id: me._id,
      name: me.name,
    },
  };

  const message = await Message.create(messageForDb);

  // Emit socket events
  emitEvent(req, NEW_MESSAGE, chat.members, {
    message: messageForRealTime,
    chatId,
  });

  emitEvent(req, NEW_MESSAGE_ALERT, chat.members, { chatId });

  return res.status(200).json({
    success: true,
    message,
  });
});


const getChatDetails = tryCatch(async (req, res, next) => {

  if(req.query.populate==="true"){
    const chat=await Chat.findById(req.params.id).populate("members","name avatar").lean();

    if(!chat){
      return next(new ErrorHandler("Chat not found",404));
    }

    chat.members=chat.members.map(({_id,name,avatar})=>({
      _id,
      name,
      avatar:avatar.url
    }))

    return res.status(200).json({
      success:true,
      chat
    })

  }
  else{

    const chat=await Chat.findById(req.params.id);

    if(!chat){
      return next(new ErrorHandler("Chat not found",404));
    }

    return res.status(200).json({
      success:true,
      chat
    })

  }



});

const renameGroup=tryCatch(async(req,res,next)=>{
  const {id}=req.params;
  const {name}=req.body;

  const chat=await Chat.findById(id);

  if(!chat){
    return next(new ErrorHandler("chat not found",404));
  }

   if (!chat.groupChat) {
    return next(new ErrorHandler("this is not a groupChat", 400));
  }

  if (chat.creator.toString() !== req.user.toString()) {
    return next(new ErrorHandler("You are not allowed to rename group", 403));
  }

  chat.name=name;

  await chat.save();
  emitEvent(req,REFETCH_CHATS,chat.members);

  return res.status(200).json({
    success:true,
    name:`group name changed to ${name} `
  })

})

const deleteChat=tryCatch(async(req,res,next)=>{
  const chatId=req.params.id;
  const chat = await Chat.findById(chatId);

  if (!chat) {
    return next(new ErrorHandler("Group does not exists", 404));
  }

  const members=chat.members;

  if(chat.groupChat && chat.creator.toString()!==req.user.toString()){
    return next(new ErrorHandler("You are not allowed to delete group",403));
  }
  if(chat.groupChat && !chat.members.includes(req.user.toString())){
    return next(new ErrorHandler("You are not allowed to delete group",403));
  }

  // delete all msgs,files(attachments) from cloudinary

  const messageWithAttachments=await Message.find({
    chat:chatId,
    attachments: {$exists:true, $ne:[]}
  })
  
  const public_ids=[];

  messageWithAttachments.forEach(({attachments})=>{
    attachments.forEach(({public_id})=>public_ids.push(public_id))
  });

  await Promise.all([
    // delete files from cloudinary
    deleteFilesFromCloudinary(public_ids),
    chat.deleteOne(),
    Message.deleteMany({chat:chatId}),
  ]);

  emitEvent(req,REFETCH_CHATS,members);

  return res.status(200).json({
    success:true,
    message:"Chat deleted successfully",
  })

})

const getMessages=tryCatch(async(req,res,next)=>{

  const chatId=req.params.id;

  const {page=1}=req.query;
  const res_per_page=20;
  const skip=(page-1)*(res_per_page);



  const [messages,totalMessagesCount]=await Promise.all([
    Message.find({chat:chatId})
              .sort({createdAt:-1})
              .skip(skip)
              .limit(res_per_page)
              .populate("sender","name")
              .lean(), Message.countDocuments({chat:chatId}),
  ])

  const totalPages=Math.ceil(totalMessagesCount/res_per_page);

  return res.status(200).json({
    success:true,
    messages:messages.reverse(),
    totalPages
  })

})


export {
  newGroupChat,
  getMyChats,
  getMyGroups,
  addNewMembers,
  removeMembers,
  leaveGroup,
  getChatDetails,
  renameGroup,
  deleteChat,
  getMessages,
  sendAttachments
};
