import { adminSecretKey } from "../app.js";
import { ErrorHandler } from "../utils/utility.js";
import { tryCatch } from "./error.js";
import jwt from "jsonwebtoken";

const isAuthenticated=(req,res,next)=>{
    const token=req.cookies["chatu-token"];
    if(!token){
        return next(new ErrorHandler("Please Login to access this page...",401));
    }

    const decodedData =jwt.verify(token,process.env.JWT_SECRET);
    req.user= decodedData._id;

    next();
}
const adminOnly=(req,res,next)=>{
    const token=req.cookies["chatu-admin-token"];
    if(!token){
        return next(new ErrorHandler("Only admin can access this page...",401));
    }

    const secretKey =jwt.verify(token,process.env.JWT_SECRET);
    const isMatch= secretKey===adminSecretKey;
     if(!isMatch){
        return next(new ErrorHandler("Invalid admin key",401));
    }

    next();
}

export {isAuthenticated,adminOnly};