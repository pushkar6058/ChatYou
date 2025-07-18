import { envMode } from "../app.js";

const errorMiddleware=(err,req,res,next)=>{
 err.message||="Internal Server error";
 err.statusCode||=500;

if(err.code===11000){
   // duplicate key error
   const error=Object.keys(err.keyPattern).join(",");
   err.message=`duplicate field ${error}`;
   err.statusCode||=400;

   
}

if(err.name==="CastError"){
   const errPath=err.path;
   err.message=`Invalid format of path ${errPath}`,
   err.statusCode=400
}


 return res.status(err.statusCode).json({
    success:false,
    message:envMode==="DEVELOPMENT" ?err :err.message
 });
};

const tryCatch=(passedFn)=>async(req,res,next)=>{
    try {
       await passedFn(req,res,next); 
    } catch (error) {
       next(error); 
    }
}

export {errorMiddleware,tryCatch};