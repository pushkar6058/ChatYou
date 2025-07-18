import { use } from "react";

export const sampleChats = [
  {
    avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
    name: "John Doe",
    _id: "1",
    groupChat: false,
    members: ["1", "2"],
  },
  {
    avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
    name: "John Hoe",
    _id: "2",
    groupChat: false,
    members: ["1", "2"],
  },
];

export const sampleUsers = [
  {
    avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
    name: "John Doe",
    _id: "1",
  },
  {
    avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
    name: "John Hoe",
    _id: "2",
  },
];

export const sampleNotifications = [
  {
    sender: {
      avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
      name: "John doe",
    },
    _id: "1",
  },
  {
    sender: {
      avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
      name: "John hoe ",
    },
    _id: "2",
  },
];

export const sampleMessages = [
  {
    attachments: [
      {
        public_id: "asddff",
        url: "https://www.w3schools.com/howto/img_avatar.png",
      },
    ],
    content: "I am mf starboy",
    _id: "vkjngejgakjgrnewkj",
    sender: {
      _id: "ekjn",
      name: "Khushi",
    },
    chat: "chatId",
    createdAt: "2025-06-29T13:09:14.264Z",
  },
  {
    attachments: [
      {
        public_id: "asddff",
        url: "https://www.w3schools.com/howto/img_avatar.png",
      },
    ],
    content: "lkbosjbsjb b kmbnby",
    _id: "vkjngejgakjgrnewkj",
    sender: {
      _id: "ekjn",
      name: "Khushi",
    },
    chat: "chatId",
    createdAt: "2025-06-29T13:09:14.264Z",
  },
];

export const dashboardData = {
  users: [
    {
      name: "John Doe",
      avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
      _id: "1",
      username: "john_doe",
      friends: 32,
      groups: 2,
    },
    {
      name: "John Hoe",
      avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
      _id: "2",
      username: "john_hoe",
      friends: 12,
      groups: 3,
    },
  ],
  chats: [
    {
      name: "John Doe",
      avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
      _id: "1",
      groupChat: false,
      members: [
        {
          id: "1",
          avatar: "https://www.w3schools.com/howto/img_avatar.png",
        },
        {
          id: "2",
          avatar: "https://www.w3schools.com/howto/img_avatar.png",
        },
      ],
      totalMembers: 2,
      totalMessages: 10,
      creator: {
        _id: "1",
        name: "John Doe",
        avatar:"https://www.w3schools.com/howto/img_avatar.png",
      },
    },
    {
      name: "John Hoe",
      avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
      _id: "2",
      groupChat: true,

      members: [
        {
          id: "1",
          avatar: "https://www.w3schools.com/howto/img_avatar.png",
        },
        {
          id: "2",
          avatar: "https://www.w3schools.com/howto/img_avatar.png",
        },
      ],
      totalMembers: 2,
      totalMessages: 12,
      creator: {
        _id: "2",
        name: "John Hoe",
        avatar: "https://www.w3schools.com/howto/img_avatar.png",
      },
    },
  ],

  messages:[
    {
        attachments: [],
        content: "I am mf starboy",
        _id: "vkrnewkj",
        sender: {
            _id: "ekjn",
            name: "Khushi",
            avatar:"https://www.w3schools.com/howto/img_avatar.png"
        },
        chat: "chatId",
        groupChat: false,
        createdAt: "2025-06-29T13:09:14.264Z",
        },
        {
        attachments: [
            {
            public_id: "asddff",
            url: "https://www.w3schools.com/howto/img_avatar.png",
            avatar: "https://www.w3schools.com/howto/img_avatar.png",
            },
        ],
        content: "lkbosjbsjb b kmbnby",
        _id: "vkjngejgakjgrnewkj",
        sender: {
            _id: "ekjn",
            name: "Khushi",
            avatar:"https://www.w3schools.com/howto/img_avatar.png"
        },
        chat: "chatId",
        groupChat: false,
        createdAt: "2025-06-29T13:09:14.264Z",
    }
  ]


};
