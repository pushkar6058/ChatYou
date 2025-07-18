import express from "express";
import { adminLogin, adminLogout, allChats, allMessages, allUsers, getAdminData, getDashboardStats } from "../controllers/admin.js";
import { adminLoginValidator, validateHandler } from "../lib/validators.js";
import { adminOnly } from "../middlewares/auth.js";

const adminRoute=express.Router();

adminRoute.post("/verify",adminLoginValidator(),validateHandler,adminLogin)

adminRoute.get("/logout",adminLogout); 


// only admin can access to below apis
adminRoute.use(adminOnly);
adminRoute.get("/",getAdminData);
adminRoute.get("/users",allUsers);
adminRoute.get("/chats",allChats);
adminRoute.get("/messages",allMessages);
adminRoute.get("/stats",getDashboardStats);


export { adminRoute };

