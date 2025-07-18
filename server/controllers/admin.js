import { tryCatch } from "../middlewares/error.js";
import { Chat } from "../models/chat.js";
import { Message } from "../models/message.js";
import { User } from "../models/user.js";
import { ErrorHandler } from "../utils/utility.js";
import jwt from "jsonwebtoken";
import {cookieOptions} from '../utils/features.js'


const adminLogin=tryCatch(async(req,res)=>{

    const {secretKey}=req.body;

    const adminSecretKey=process.env.ADMIN_SECRET_KEY || "pushkar123#";

    const isMatch= secretKey===adminSecretKey;
    if(!isMatch){
        return next(new ErrorHandler("Invalid admin key",401));
    }
    const token=jwt.sign(secretKey,process.env.JWT_SECRET);

    return res.status(200).cookie("chatu-admin-token",token,{...cookieOptions,maxAge:1000*60*15}).json({
        success:true,
        message:"Welcome to the Admin Panel"
    })


})

const adminLogout=tryCatch(async(req,res)=>{
    return res.status(200).cookie("chatu-admin-token","",{
        ...cookieOptions,
        maxAge:0,
    }).json({
        success:true,
        message:"Logged out sucessfully"
    })
})

const getAdminData=tryCatch(async(req,res,next)=>{
    return res.status(200).json({
        admin:true
    })
})

const allUsers=tryCatch(async(req,res,next)=>{
    const users=await User.find({});
    const transformedUsers=await Promise.all(users.map(async({_id,name,avatar,username})=>{
        const [groups,friends]=await Promise.all([
            Chat.countDocuments({groupChat:true,members:_id }),
            Chat.countDocuments({groupChat:false,members:_id }),
        ]);

       return {
            name,
            username,
            avatar:avatar.url,
            _id,groups,
            friends
        }
    }))
 return res.status(200).json({
        transformedUsers
    })

})

const allChats=tryCatch(async(req,res,next)=>{
    const chats=await Chat.find({}).populate("members","name avatar").populate("creator","name avatar");

    const transformedChats=await Promise.all(
        chats.map(async({members,_id,groupChat,name,creator})=>{

            const totalMessages=await Message.countDocuments({
                chatId:_id,
            })

            return {
                _id,
                groupChat,
                name,
                avatar:members.slice(0,3).map((member)=>member.avatar.url),
                members:members.map(({_id,name,avatar})=>({
                    _id,
                    name,
                    avatar:avatar.url,
                    
                   
                })),
                creator:{
                        name:creator?.name || "None",
                        avatar:creator?.avatar.url || "",
                    },
                 totalMembers:members.length,
                    totalMessages,

            }
        })
    )

    return res.status(200).json({
        transformedChats
    })

})

const allMessages=tryCatch(async(req,res,next)=>{

    const messages=await Message.find({})
    .populate("sender","name avatar")
    .populate("chat","groupChat");

    const transformedMsgs=messages.map(({_id,sender,content,attachments,createdAt,chat})=>({
        _id,
        attachments,
        content,
        createdAt,
        chat:chat._id,
        groupChat:chat.groupChat,
        sender:{
            _id:sender._id,
            name:sender.name,
            avatar:sender.avatar.url,
        }
    }))
    
    return res.status(200).json({
        success:true,
        messages:transformedMsgs
    })
})


const getDashboardStats=tryCatch(async(req,res,next)=>{
    const [groupsCount,usersCount,msgsCount,totalChatsCount]=await Promise.all([
        Chat.countDocuments({groupChat:true}),
        User.countDocuments(),
        Message.countDocuments(),
        Chat.countDocuments(),

    ])

    const today=new Date();
    const last7Days=new Date();
    last7Days.setDate(last7Days.getDate()-7);

    const last7DaysMsgs=await Message.find({
        createdAt:{
            $gte:last7Days,
            $lte:today,
        }
    }).select("createdAt");

    const msgs=new Array(7).fill(0);

    const dayinMilliSec=1000*60*60*24;

    last7DaysMsgs.forEach((msg)=>{
        const idxApprox=Math.floor((today.getTime()-msg.createdAt.getTime())/dayinMilliSec);

        msgs[6-idxApprox]++;

    })


    const stats={
        groupsCount,
        usersCount,
        msgsCount,
        totalChatsCount,
        msgs

    }

    return res.status(200).json({
        success:true,
        stats
    })
})


export {allUsers,allChats,allMessages,getDashboardStats,adminLogin,adminLogout,getAdminData};