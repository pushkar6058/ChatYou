import React from "react";
import Title from "../shared/Title";
import Header from "./Header";
import ChatList from "../specific/ChatList";
import { sampleChats } from "../../constants/sampleData";
import { useParams } from "react-router-dom";
import Profile from "../specific/Profile";

const AppLayout = () => (WrappedComponent) => {
  return (props) => {
    const params=useParams();
    const chatId=params.chatId;

    console.log(chatId);

    const handleDeleteChat=(e,_id,groupChat)=>{
      e.preventDefault();
      console.log("delete Chat",_id,groupChat);
    }

    return (
      <>
        <Title />
        <Header />

        {/* Full height container */}
        <div className="w-full h-[calc(100vh-4rem)] flex flex-row">
          {/* Left Section — hidden on xs */}
          <div className="hidden sm:block sm:w-1/3 md:w-1/4 h-full ">
            <ChatList
              chats={sampleChats}
              chatId={chatId}
              handleDeleteChat={handleDeleteChat}
            />
          </div>

          {/* Center Section — full width on xs, 8/12 on sm, 5/12 on md, 6/12 on lg */}
          <div className="w-full sm:w-2/3 md:w-5/12 lg:w-1/2 h-full ">
            <WrappedComponent {...props} />
          </div>

          {/* Right Section — hidden on xs and sm, visible md+ */}
          <div className="hidden md:flex md:w-1/3 lg:w-1/4 h-full bg-neutral-700 p-8 flex justify-center ">
            <Profile/>
          </div>
        </div>
      </>
    );
  };
};

export default AppLayout;
