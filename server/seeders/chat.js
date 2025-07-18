import { Chat } from "../models/chat.js";
import { User } from "../models/user.js";
import { Message } from "../models/message.js";
import { faker, simpleFaker } from "@faker-js/faker";


const createSingleChat = async (chatCount) => {
  try {
    const users = await User.find().select("_id");
    const chatPromise = [];

    for (let i = 0; i < users.length; i++) {
      for (let j = i + 1; j < users.length; j++) {
        const tempChat = Chat.create({
          name: faker.lorem.words(2),
          members: [users[i], users[j]],
        }
        
    
    );
    chatPromise.push(tempChat);
      }
    }
    await Promise.all(chatPromise);
    console.log("single chats created successfully");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const createGroupChats = async (chatCount) => {
  try {
    const users = await User.find().select("_id");

    const chatsPromise = [];

    for (let i = 0; i < chatCount; i++) {
      const numMembers = simpleFaker.number.int({ min: 3, max: users.length });
      const members = [];

      for (let i = 0; i < numMembers; i++) {
        const randomIdx = Math.floor(Math.random() * users.length);
        const randomUser = users[randomIdx];

        if (!members.includes(randomUser)) {
          members.push(randomUser);
        }

        const chat = Chat.create({
          groupChat: true,
          name: faker.lorem.words(1),
          members,
          creator: members[0],
        });

        chatsPromise.push(chat);
      }

    }
    await Promise.all(chatsPromise);

    console.log("groupChats created successfully");
    process.exit();
    
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

const createSampleMsg = async (numMsgs) => {
  try {
    const users = await User.find().select("_id");
    const chats = await Chat.find().select("_id");

    const msgPromise = [];

    for (let i = 0; i < numMsgs; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const randomChat = chats[Math.floor(Math.random() * chats.length)];

      msgPromise.push(
        Message.create({
          chat: randomChat,
          sender: randomUser,
          content: faker.lorem.sentence(),
        })
      );
    }

    await Promise.all(msgPromise);

    console.log("sampleMsgs created successfully");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const createMsgInChat=async(chatId,numMsgs)=>{
    try {
        
        const users = await User.find().select("_id");
         const msgPromise = [];

    for (let i = 0; i < numMsgs; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      msgPromise.push(
        Message.create({
          chat: chatId,
          sender: randomUser,
          content: faker.lorem.sentence(),
        })

      );
    }

     await Promise.all(msgPromise);
     console.log("sampleGroupMsgs created successfully");
    process.exit();

    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

export {
     createSingleChat,
      createGroupChats,
    createSampleMsg,
    createMsgInChat
    };
