import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import { v4 as uuid } from "uuid";
import { getBase64, getSockets } from "../lib/helper.js";

const cookieOptions = {
  maxAge: 15 * 24 * 60 * 60 * 1000,
  sameSite: "none",
  httpOnly: true,
  secure: true,
};

const connectDb = async (uri) => {
  try {
    await mongoose.connect(uri, { dbName: "ChatYou" });
    console.log("mongoDb connected successfully");
  } catch (error) {
    throw error;
  }
};

const sendTokens = (res, user, code, message) => {
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
  return res.status(code).cookie("chatu-token", token, cookieOptions).json({
    success: true,
    token,
    message,
    user,
  });
};

const emitEvent = (req, event, users, data) => {
  const io=req.app.get("io");
  const userSockets=getSockets(users);

  io.to(userSockets).emit(event,data);
};

const uploadFilesToCloudinary = async (files = []) => {
  const uploadPromises = files.map((file) => {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        getBase64(file),
        {
          resource_type: "auto",
          public_id: uuid(),
        },
        (err, res) => {
          if (err) {
            return reject(err);
          }
          return resolve(res);
        }
      );
    });
  });

  try {
    const results = await Promise.all(uploadPromises);
    const formattedResults = results.map((res) => ({
      public_id: res.public_id,
      url: res.secure_url,
    }));
    return formattedResults;
  } catch (error) {
   
    throw new Error("Error uploading the files");
  }
};

const deleteFilesFromCloudinary = async (public_ids) => {};

export {
  connectDb,
  sendTokens,
  cookieOptions,
  emitEvent,
  deleteFilesFromCloudinary,
  uploadFilesToCloudinary,
};
