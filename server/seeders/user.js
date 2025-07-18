import { Chat } from "../models/chat.js";
import { User } from "../models/user.js";
import { faker, simpleFaker } from "@faker-js/faker";

const createSampleUser = async (numUsers) => {
  try {
    const userPromise = [];

    for (let i = 0; i < numUsers; i++) {
      const tempUser = User.create({
        name: faker.person.fullName(),
        username: faker.internet.userName(),
        bio: faker.lorem.sentence(),
        password: "password",
        avatar: {
          url: faker.image.avatar(),
          public_id: faker.system.fileName(),
        },
      });
      userPromise.push(tempUser);
    }
    await Promise.all(userPromise);
    console.log("users created", numUsers);
    process.exit(1);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};


export { createSampleUser,
     
    };
