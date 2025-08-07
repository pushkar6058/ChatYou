import React, { useCallback, useEffect, useRef, useState } from 'react'
import AppLayout from '../components/layout/AppLayout'
import { Stack, IconButton, Skeleton } from '@mui/material';
import { grayColor, orange } from '../constants/color';
import { AttachFile as AttachFileIcon, Send as SendIcon} from '@mui/icons-material';
import { InputBox } from '../components/styles/StyledComponents';
import FileMenu from '../components/dialogs/FileMenu';
import MessageComponent from '../components/shared/MessageComponent';
import { useSocket } from '../socket';
import { NEW_MESSAGE, NEW_MESSAGE_ALERT, START_TYPING, STOP_TYPING } from '../constants/events';
import { useChatDetailsQuery, useGetOldMessagesQuery } from '../redux/api/api';
import { useErrors, useSocketEvents } from '../hooks/hook';
import { useInfiniteScrollTop } from '6pp';
import { useDispatch } from 'react-redux';
import { setIsFileMenu } from '../redux/reducers/misc';
import { removeNewMessagesAlert, setNewMessageAlert } from '../redux/reducers/chat';
import { getOrSaveFromStorage } from '../libs/features';
import { TypingLoader } from '../components/layout/Loader';




const Chat = ({chatId,user}) => {


  const containerRef=useRef(null);
  const bottomRef=useRef(null);
  const socket=useSocket();
  const dispatch=useDispatch();

  const[iAmTyping,setIAmTyping]=useState(false);
  const[userTyping,setUserTyping]=useState(false);
  const typingTimeOut=useRef(null);
  console.log(userTyping);
  
  
  const [message,setMessage]=useState("");
  const[messages,setMessages]=useState([]);
  const [fileMenuAnchor,setFileMenuAnchor]=useState(null);
  const [page,setPage]=useState(1);

  const chatDetails= useChatDetailsQuery({chatId,skip:!chatId});
  const members=chatDetails?.data?.chat?.members;

  const oldMessagesChunk=useGetOldMessagesQuery({
    chatId,
    page:page,
  });

  const {data:oldMessages,setData:setOldMessages}=useInfiniteScrollTop(containerRef,
                                oldMessagesChunk.data?.totalPages,
                                page,
                                setPage,
                                oldMessagesChunk.data?.messages);

 
  const allMessages=[...oldMessages,...messages];
  

  const errors=[{isError:chatDetails.isError,error:chatDetails.error},
                {isError:oldMessagesChunk.isError,error:oldMessagesChunk.error}
  ];

  
  
  const submitHandler=(e)=>{
    e.preventDefault();

    if(!message.trim())return;

    // emitting message to the server
    socket.emit(NEW_MESSAGE,{chatId,members,message});
    setMessage("");
  };

  const newMessageHandler=useCallback((data)=>{

    if (data.chatId !== chatId) return;
  setMessages((prev) => [...prev, data.message]);
  },[chatId])


  const startTypingListener=(data)=>{
    // socket.on(START_TYPING,()=>{
      if(data.chatId!==chatId)return;
      // console.log("typing",data);
      setUserTyping(true);
  }
  const stopTypingListener=(data)=>{
    // socket.on(START_TYPING,()=>{
      if(data.chatId!==chatId)return;
      // console.log("stop typing",data);
      setUserTyping(false);
  }

  const eventHandler={
    [NEW_MESSAGE]:newMessageHandler,
    [START_TYPING]:startTypingListener,
    [STOP_TYPING]:stopTypingListener,

  
  };
  useSocketEvents(socket,eventHandler);

  const handleFileOpen=(e)=>{
    dispatch(setIsFileMenu(true));
    setFileMenuAnchor(e.currentTarget); 
  }

  const messageChangeHandler=(e)=>{
    setMessage(e.target.value);

    if(!iAmTyping){
      socket.emit(START_TYPING,{members,chatId});
      setIAmTyping(true);

    }
    if(typingTimeOut.current) clearTimeout(typingTimeOut.current);

     typingTimeOut.current=setTimeout(()=>{
      socket.emit(STOP_TYPING,{members,chatId});
        setIAmTyping(false);
      },2000);
   
  }

  useErrors(errors);

  

  useEffect(()=>{

    dispatch(removeNewMessagesAlert(chatId));

    return ()=>{
      setMessages([]);
      setMessage("");
      setOldMessages([]);
      setPage(1);
    }
  },[chatId, dispatch, setOldMessages]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  

  return chatDetails.isLoading ? <Skeleton/> :(
    <>
    
    <Stack 
    ref={containerRef}
    boxSizing={"border-box"}
    padding={"1rem"}
    spacing={"1rem"}
    bgcolor={grayColor}
    height={"90%"}
    sx={{
      overflowX:"hidden",
      overflowY:"auto"
    }}

    >

      {/* Chats */}
      
      {
        allMessages.map((i,idx)=>{
          return <MessageComponent key={i._id || idx} message={i} user={user}/> 
          
        })
        
      }

      {userTyping && <TypingLoader/>}

      <div/>
      <div ref={bottomRef}/>

   
      
    </Stack>

    <form onSubmit={submitHandler}
    style={{
      height:"10%"
      
    }}>
      <Stack 
      direction={"row"} 
      height={"100%"}
      padding={"1rem"}
      alignItems={"center"}
      position={"relative"}
      >
        <IconButton sx={{
          position:"absolute",
          left:"1.5rem"
        }}
        onClick={handleFileOpen}
       
        >
          <AttachFileIcon/>
        </IconButton>


        <InputBox style={{flex:1,
          padding:"3rem"
        }}placeholder='Enter Message Here...'
         value={message} 
         onChange={messageChangeHandler}/>



        <IconButton type='submit' sx={{
          background:orange,
          color:"white",
          marginLeft:"1rem",
          padding:"0.5rem",
          "&:hover":{
            bgcolor:"error.dark"
          }
        }}>
          <SendIcon/>
        </IconButton>
      </Stack>
    </form>
    
        <FileMenu anchorE1={fileMenuAnchor} chatId={chatId}/>

    </>
  )
}

export default AppLayout(Chat);