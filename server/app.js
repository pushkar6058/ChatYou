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
import { NEW_MESSAGE, NEW_MESSAGE_ALERT, START_TYPING, STOP_TYPING } from './constants/events.js';
import {v4 as uuid} from "uuid";
import { getSockets } from './lib/helper.js';
import { Message } from './models/message.js';
import cors from "cors";
import {v2 as cloudinary} from "cloudinary"
import { corsOptions } from './constants/config.js';
import { socketAuthenticator } from './middlewares/auth.js';
import { createSampleUser } from './seeders/user.js';



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
const io=new Server(server,{
    cors:corsOptions,
});

app.set("io",io);

app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

(async () => {
  try {
    await connectDb(process.env.MONGO_URI);
  } catch (error) {
    console.error("MongoDB connection failed", error);
  }
})();





cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
})


app.use("/api/v1/user",userRoute);
app.use("/api/v1/chat",chatRoute);
app.use("/api/v1/admin",adminRoute);

app.get("/",(req,res)=>{
    return res.send("Welcome to the home page");
});

io.use((socket,next)=>{
    cookieParser()(socket.request,socket.request.res,async(err)=> await socketAuthenticator(err,socket,next))
})

io.on("connection",(socket)=>{

    const user=socket.user;
    
    userSocketIds.set(user._id.toString(),socket.id);
    console.log("a user connected",socket.id);
    console.log(userSocketIds);

    socket.on(NEW_MESSAGE,async({chatId,members,message})=>{

        const messageForRealTime={
            content:message,
            _id:uuid(),
            sender:{
                _id:user._id,
                name:user.name,
            },
            members:members,
            chat:chatId,
            createdAt:new Date().toISOString()
        }
        const messageForDb={
            content:message,
            sender:user._id,
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

    socket.on(START_TYPING,({members,chatId})=>{
        console.log("Typingg...",chatId);
        const userSocketIds=getSockets(members);

        socket.to(userSocketIds).emit(START_TYPING,{chatId});
        
    })

    socket.on(STOP_TYPING,({members,chatId})=>{
        console.log("Stopped typing",chatId);
        const userSocketIds=getSockets(members);
        socket.to(userSocketIds).emit(STOP_TYPING,{chatId});
        
    });

    socket.on("disconnect",()=>{
        userSocketIds.delete(user._id.toString());
        console.log("user disconnected");
    })
})

app.use(errorMiddleware);

server.listen(port,()=>{
    return console.log(`Server listening on ${port} in ${envMode} mode`);
    
})

export {envMode,adminSecretKey,userSocketIds};

export default app;