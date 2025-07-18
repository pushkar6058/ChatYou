import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import {
  addNewMembers,
  deleteChat,
  getChatDetails,
  getMessages,
  getMyChats,
  getMyGroups,
  leaveGroup,
  newGroupChat,
  removeMembers,
  renameGroup,
  sendAttachments,
} from "../controllers/chat.js";
import { addNewMembersValidator, deleteChatValidator, getChatDetailsValidator, getMessagesValidator, leaveGroupValidator, newGroupChatValidator, removeMemberValidator, renameGroupValidator, sendAttachmentsValidator, validateHandler } from "../lib/validators.js";
import { attachmentsMulter, multerUpload } from "../middlewares/multer.js";

const chatRoute = express.Router();

chatRoute.use(isAuthenticated);

chatRoute.post("/new",newGroupChatValidator(),validateHandler, newGroupChat);
chatRoute.get("/my", getMyChats);
chatRoute.get("/my/groups", getMyGroups);
chatRoute.put("/addmembers",addNewMembersValidator(),validateHandler, addNewMembers);
chatRoute.put("/removemember",removeMemberValidator(),validateHandler, removeMembers);
chatRoute.delete("/leave/:id",leaveGroupValidator(),validateHandler,leaveGroup);
chatRoute.post("/message",attachmentsMulter,sendAttachmentsValidator(),validateHandler,sendAttachments);
chatRoute.get("/message/:id",getMessagesValidator(),validateHandler, getMessages);

chatRoute.route("/:id")
  .get(getChatDetailsValidator(),validateHandler,getChatDetails)
  .put(renameGroupValidator(),validateHandler,renameGroup)
  .delete(deleteChatValidator(),validateHandler,deleteChat);

// send attachment
// get messages
// get chat details,rename,delete

export default chatRoute;
