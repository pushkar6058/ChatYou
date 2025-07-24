import React from "react";
import Title from "../shared/Title";
import Header from "./Header";
import ChatList from "../specific/ChatList";
import { sampleChats } from "../../constants/sampleData";
import { useParams } from "react-router-dom";
import Profile from "../specific/Profile";
import { useMyChatsQuery } from "../../redux/api/api";
import { Drawer, Skeleton, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setIsMobile } from "../../redux/reducers/misc";
import { useErrors } from "../../hooks/hook";

// HOC that wraps a component with the layout
const AppLayout = (WrappedComponent) => {
  const Layout = (props) => {
    const params = useParams();
    const chatId = params.chatId;
    const dispatch=useDispatch();
    const {isMobile}=useSelector((state)=>state.misc);
    const { isLoading, isError, error, data, refetch } = useMyChatsQuery("");

    useErrors([{isError,error}]);
    

    const handleDeleteChat = (e, _id, groupChat) => {
      e.preventDefault();
      console.log("delete Chat", _id, groupChat);
    };

    const handleMobileClose=()=>{
      dispatch(setIsMobile(false));
    }

    return (
      <>
        <Title />
        <Header />

        {
          isLoading ? <Skeleton/> :

          <Drawer open={isMobile} onClose={handleMobileClose}>
          
            <ChatList
              w="70vw"
              chats={data?.chats}
              chatId={chatId}
              handleDeleteChat={handleDeleteChat}
            />
          </Drawer>
        }

        <div className="w-full h-[calc(100vh-4rem)] flex flex-row">
          {/* Left Sidebar */}
          <div className="hidden sm:block sm:w-1/3 md:w-1/4 h-full">
           {
            isLoading ? <Skeleton/> : <ChatList
              chats={data?.chats}
              chatId={chatId}
              handleDeleteChat={handleDeleteChat}
            />
           }
          </div>

          {/* Center Content */}
          <div className="w-full sm:w-2/3 md:w-5/12 lg:w-1/2 h-full">
            <WrappedComponent {...props} />
          </div>

          {/* Right Sidebar */}
          <div className="hidden md:flex md:w-1/3 lg:w-1/4 h-full bg-neutral-700 p-8 justify-center">
            <Profile />
          </div>
        </div>
      </>
    );
  };

  return Layout;
};

export default AppLayout;
