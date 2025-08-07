import React, { useCallback, useEffect } from "react";
import Title from "../shared/Title";
import Header from "./Header";
import ChatList from "../specific/ChatList";
import { useParams } from "react-router-dom";
import Profile from "../specific/Profile";
import { useMyChatsQuery } from "../../redux/api/api";
import { Drawer, Skeleton, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setIsMobile } from "../../redux/reducers/misc";
import { useErrors, useSocketEvents } from "../../hooks/hook";
import { useSocket } from "../../socket";
import { NEW_MESSAGE_ALERT, NEW_REQUEST } from "../../constants/events";
import { incrementNotification, setNewMessageAlert } from "../../redux/reducers/chat";
import { getOrSaveFromStorage } from "../../libs/features";

// HOC that wraps a component with the layout
const AppLayout = (WrappedComponent) => {
  const Layout = (props) => {
    const dispatch=useDispatch();
    const params = useParams();
    const socket=useSocket();

   

    const {isMobile}=useSelector((state)=>state.misc);
    const {user}=useSelector((state)=>state.auth);
    const {newMessageAlert}=useSelector((state)=>state.chat);
    const { isLoading, isError, error, data, refetch } = useMyChatsQuery("");


    const chatId = params.chatId;

    useErrors([{isError,error}]);

    useEffect(()=>{
    getOrSaveFromStorage({key:NEW_MESSAGE_ALERT,value:newMessageAlert})
  },[]);

    const newMessageAlertHandler=useCallback((data)=>{
      if(data.chatId===chatId){
        return;
      }
      dispatch(setNewMessageAlert(data));
    },[chatId,dispatch]);

    const newRequestHandler=useCallback(()=>{
      dispatch(incrementNotification());
    },[dispatch]);
    
    const eventHandlers={
      [NEW_MESSAGE_ALERT]:newMessageAlertHandler,
      [NEW_REQUEST]:newRequestHandler
    }
    useSocketEvents(socket,eventHandlers);
    

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

        <div className="w-full h-[calc(100vh-4rem)] flex flex-row overflow-hidden">
  {/* Left Sidebar */}
  <div className="hidden sm:block sm:w-1/3 md:w-1/4 h-full overflow-y-auto">
    {isLoading ? <Skeleton /> : (
      <ChatList
        chats={data?.chats}
        chatId={chatId}
        handleDeleteChat={handleDeleteChat}
        newMessagesAlert={newMessageAlert}
      />
    )}
  </div>

  {/* Center Content */}
  <div className="w-full sm:w-2/3 md:w-5/12 lg:w-1/2 h-full overflow-y-auto">
    <WrappedComponent {...props} socket={socket} chatId={chatId} user={user} />
  </div>

  {/* Right Sidebar */}
  <div className="hidden md:flex md:w-1/3 lg:w-1/4 h-full bg-neutral-700 p-8 justify-center overflow-y-auto">
    <Profile user={user}/>
  </div>
</div>
      </>
    );
  };

  return Layout;
};

export default AppLayout;
