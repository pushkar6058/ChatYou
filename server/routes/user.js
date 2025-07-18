import express from 'express';
import {  acceptFriendRequest, getMyFriends, getMyNotifications, getMyProfile, login, logout, newUser, searchUser, sendFriendRequest } from '../controllers/user.js';
import { singleAvatar } from '../middlewares/multer.js';
import { isAuthenticated } from '../middlewares/auth.js';
import { acceptFriendReqValidator, loginValidator, registerValidator, sendFriendReqValidator, validateHandler } from '../lib/validators.js';

const userRoute=express.Router();

userRoute.post("/new",singleAvatar, registerValidator(),validateHandler,newUser);
userRoute.post("/login",loginValidator(),validateHandler,login);

// after this user must be logged in to use below routes
userRoute.use(isAuthenticated);
userRoute.get("/me",getMyProfile);
userRoute.get("/logout",logout);
userRoute.get("/search",searchUser);
userRoute.put("/sendrequest",sendFriendReqValidator(),validateHandler, sendFriendRequest);
userRoute.put("/acceptrequest",acceptFriendReqValidator(),validateHandler, acceptFriendRequest);
userRoute.get("/notifications",getMyNotifications);
userRoute.get("/friends",getMyFriends);




export default userRoute;