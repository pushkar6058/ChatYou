import React, { useRef } from 'react'
import AppLayout from '../components/layout/AppLayout'
import { Stack, IconButton } from '@mui/material';
import { grayColor, orange } from '../constants/color';
import { AttachFile as AttachFileIcon, Send as SendIcon} from '@mui/icons-material';
import { InputBox } from '../components/styles/StyledComponents';
import FileMenu from '../components/dialogs/FileMenu';
import { sampleMessages } from '../constants/sampleData';
import MessageComponent from '../components/shared/MessageComponent';

const Chat = () => {

  const containerRef=useRef(null);
  const user={
    _id:"ekjn",
    name:"Pussy Cat"
  }
  
  return (
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
        sampleMessages.map((msg,i)=>{
          return <MessageComponent key={i} message={msg} user={user}/> 
          
        })
      }
      
    </Stack>

    <form style={{
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
       
        >
          <AttachFileIcon/>
        </IconButton>


        <InputBox style={{flex:1,
          padding:"3rem"
        }}placeholder='Enter Message Here...'/>



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
    
        <FileMenu />

    </>
  )
}

export default AppLayout()(Chat);