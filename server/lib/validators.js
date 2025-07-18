import { body, check, param, query, validationResult } from "express-validator";
import { ErrorHandler } from "../utils/utility.js";

const validateHandler = (req, res, next) => {
  const errors = validationResult(req);

  const errorMsg = errors
    .array()
    .map((error) => error.msg)
    .join(", ");

  if (errors.isEmpty()) {
    return next();
  } else {
    next(new ErrorHandler(errorMsg, 400));
  }
};
const registerValidator = () => [
  body("name", "Please enter the name ").notEmpty(),
  body("username", "Please enter the username ").notEmpty(),
  body("password", "please enter password").notEmpty(),
  body("bio", "Please enter the bio ").notEmpty(),
  ];
const loginValidator = () => [
  body("username", "Please enter the username ").notEmpty(),
  body("password", "please enter password").notEmpty(),
];
const newGroupChatValidator = () => [
  body("name", "Please enter the name ").notEmpty(),
  body("members")
    .notEmpty()
    .withMessage("please enter members")
    .isArray({ min: 2, max: 100 })
    .withMessage("members should be 2-100"),
];
const addNewMembersValidator = () => [
  body("chatId", "Please enter the ChatId ").notEmpty(),
  body("members")
    .notEmpty()
    .withMessage("please enter members")
    .isArray({ min: 1, max: 97 })
    .withMessage("members should be 1-97"),
];
const removeMemberValidator = () => [
  body("chatId", "Please enter the ChatId ").notEmpty(),
  body("userId", "Please enter the userId ").notEmpty(),
];
const leaveGroupValidator = () => [
  param("id", "Please enter the ChatId ").notEmpty(),
];

const sendAttachmentsValidator = () => [
  body("chatId", "Please enter the ChatId ").notEmpty(),
   
];

const getMessagesValidator = () => [
  param("id", "Please enter the ChatId ").notEmpty(),
];
const getChatDetailsValidator = () => [
  param("id", "Please enter the ChatId ").notEmpty(),
];
const renameGroupValidator = () => [
  param("id", "Please enter the ChatId ").notEmpty(),
  body("name","Please enter the name").notEmpty(),
];

const deleteChatValidator = () => [
  param("id", "Please enter the ChatId").notEmpty(),
];

const sendFriendReqValidator=()=>[
    body("userId","please enter userId").notEmpty(),
]
const acceptFriendReqValidator=()=>[
    body("requestId","please enter requestId").notEmpty(),
    body("accept")
        .notEmpty()
        .withMessage("please add accept")
        .isBoolean()
        .withMessage("Accept must be boolean"),
]


const adminLoginValidator=()=>[
  body("secretKey","Please Enter the secret Key").notEmpty(),

]



export {
  registerValidator,
  loginValidator,
  removeMemberValidator,
  addNewMembersValidator,
  newGroupChatValidator,
  leaveGroupValidator,
  validateHandler,
  sendAttachmentsValidator,
  getMessagesValidator,
  getChatDetailsValidator,
  renameGroupValidator,
  deleteChatValidator,
  sendFriendReqValidator,
  acceptFriendReqValidator,
  adminLoginValidator
};
