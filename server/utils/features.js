import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const cookieOptions={
        maxAge:15*24*60*60*1000,
        sameSite:"none",
        httpOnly:true,
        secure:true
    }

const connectDb=(uri)=>{
    mongoose.connect(uri,{dbName:"ChatYou"})
    .then((data)=>console.log("mongoDb connected successfully"))
    .catch((e)=>{throw e});
}

const sendTokens=(res,user,code,message)=>{
    const token=jwt.sign({_id:user._id,},process.env.JWT_SECRET);
    return res.status(code).cookie("chatu-token",token,cookieOptions).json({
        success:true,
        token,
        message,
        user,
    })
}

const emitEvent=(req,event,users,data)=>{
    console.log("emitting event",event);
}

const deleteFilesFromCloudinary=async(public_ids)=>{

}



export {connectDb,sendTokens,cookieOptions,emitEvent,deleteFilesFromCloudinary};