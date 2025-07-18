import express from 'express';
import userRoute from './routes/user.js';
import { connectDb } from './utils/features.js';
import dotenv from 'dotenv';
import { errorMiddleware } from './middlewares/error.js';
import  cookieParser from 'cookie-parser';
import chatRoute from './routes/chat.js';
import { adminRoute } from './routes/admin.js';
import {Server} from "socket.io";
import { createServer } from 'http';
import { NEW_MESSAGE, NEW_MESSAGE_ALERT } from './constants/events.js';
import {v4 as uuid} from "uuid";
import { getSockets } from './lib/helper.js';
import { Message } from './models/message.js';



dotenv.config({
    path:"./.env",
});

const mongoURI=process.env.MONGO_URI;
const port=process.env.PORT || 3000;
 const envMode=process.env.NODE_ENV.trim() || "PRODUCTION";
 const adminSecretKey=process.env.ADMIN_SECRET_KEY || "pushkar123#";
 const userSocketIds=new Map();



// middlewares are used here...


const app=express();
const server=createServer(app);
const io=new Server(server,{});

app.use(express.json());
app.use(cookieParser());

connectDb(mongoURI);



app.use("/user",userRoute);
app.use("/chat",chatRoute);
app.use("/admin",adminRoute);

app.get("/",(req,res)=>{
    return res.send("Welcome to the home page");
});

io.use((socket,next)=>{
    
})

io.on("connection",(socket)=>{

    const tempUser={
        _id:"fenj",
        name:"rengjbiebg",

    };

    userSocketIds.set(tempUser._id.toString(),socket.id);
    console.log("a user connected",socket.id);
    console.log(userSocketIds);

    socket.on(NEW_MESSAGE,async({chatId,members,message})=>{

        const messageForRealTime={
            content:message,
            _id:uuid(),
            sender:{
                _id:tempUser._id,
                name:tempUser.name,
            },
            members:members,
            chat:chatId,
            createdAt:new Date().toISOString()
        }
        const messageForDb={
            content:message,
            sender:tempUser._id,
            chat:chatId,
            
        }

        const usersSocket = getSockets(members);


        io.to(usersSocket).emit(NEW_MESSAGE,{
            chatId,
            message:messageForRealTime
        })

        io.to(usersSocket).emit(NEW_MESSAGE_ALERT,{
            chatId
        })

        try {
          await Message.create(messageForDb);
        } catch (error) {
            console.log(error);
        }
    })

    socket.on("disconnect",()=>{
        userSocketIds.delete(tempUser._id.toString());
        console.log("user disconnected");
    })
})

app.use(errorMiddleware);

server.listen(port,()=>{
    return console.log(`Server listening on ${port} in ${envMode} mode`);
    
})

export {envMode,adminSecretKey,userSocketIds};

export default app;