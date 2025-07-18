import {
  Grid,
  Tooltip,
  IconButton,
  Box,
  Drawer,
  Stack,
  Typography,
  TextField, Button,
  Backdrop,
} from "@mui/material";
import React, { lazy, memo, Suspense, use, useEffect, useState } from "react";
import { orange } from "../constants/color";
import {
  KeyboardBackspace as KeyBoardBackspaceIcon,
  Menu as MenuIcon,
  Edit as EditIcon,
  Done as DoneIcon,
  Add as AddIcon,
  Delete as DeleteIcon,

} from "@mui/icons-material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Link } from "../components/styles/StyledComponents";
import AvatarCard from "../components/shared/AvatarCard";
import { sampleChats, sampleUsers } from "../constants/sampleData";
const DeleteDialog= lazy(()=>import("../components/dialogs/DeleteDialog")) ;
const AddMemberDialog= lazy(()=>import("../components/dialogs/AddMemberDialog"))
import UserItem from "../components/shared/UserItem";
const Groups = () => {
  const navigate = useNavigate();
  const chatId = useSearchParams()[0].get("group");

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [groupName,setGroupName]=useState("Group");
  const [groupNameUpdated,setGroupNameUpdated]=useState("");
  const [confirmDeleteDialog,setConfirmDeleteDialog]=useState(false);
  const isAddMember=false;

  
  const updateGroupName=()=>{
    setIsEdit(false);
    setGroupName(groupNameUpdated);

  }
  useEffect(()=>{
    
   if(chatId){
     setGroupName(`Group name ${chatId}`);
    setGroupNameUpdated(`Group name ${chatId}`);
   }

    return()=>{
      setGroupName("");
      setGroupNameUpdated("");
      setIsEdit(false);
    }

  },[chatId]);

  const handleMobile = () => {
    setIsMobileMenuOpen((e) => !e);
  };

  const handleMobileClose = () => {
    setIsMobileMenuOpen(false);
  };

  const handleClick = () => {
    navigate("/");
  };

  const openAddMember=()=>{

  }

  const deleteHandler=()=>{
    closeconfirmDeleteHandler();
    console.log("deleted");
  }
  const openconfirmDeleteHandler=()=>{
    setConfirmDeleteDialog(true);
    console.log("delete dialog opened");
  }
  const closeconfirmDeleteHandler=()=>{
    setConfirmDeleteDialog(false);
    console.log("delete dialog closed");
  }


  const removeMemberHandler=(id)=>{
    console.log("removed",id);
    
  }
  const iconBtns = (
    <>
      <Box
        sx={{
          display: {
            xs: "block",
            sm: "none",
            position: "fixed",
            right: "1rem",
            top: "1rem",
          },
        }}
        onClick={handleMobile}
      >
        <IconButton>
          <MenuIcon />
        </IconButton>
      </Box>
      <Tooltip title="Back">
        <IconButton
          sx={{
            position: "absolute",
            top: "2rem",
            left: "2rem",
            bgcolor: "rgba(0,0,0,0.8)",
            color: "white",
            "&:hover": {
              bgcolor: "black",
            },
          }}
          onClick={handleClick}
        >
          <KeyBoardBackspaceIcon />
        </IconButton>
      </Tooltip>
    </>
  );

  const groupNameComponent = (
    <Stack direction={"row"} 
    alignItems={"center"}
    justifyContent={"center"}
    p={"3rem"}
    spacing={"1rem"}
    >
      {isEdit ? (
        <>
         <TextField value={groupNameUpdated} onChange={(e)=>setGroupNameUpdated(e.target.value)}/>
         <IconButton onClick={updateGroupName}>
            <DoneIcon/>
         </IconButton>
        </>
      ) : (
        <>
          <Typography variant="h4">{groupName} </Typography>
          <IconButton onClick={() => setIsEdit(true)}>
            <EditIcon />
          </IconButton>
        </>
      )}
    </Stack>
  );

  const ButtonGroup=<>
    <Stack direction={{
      sm:"row",
      xs:"column-reverse",
    }}
    spacing={"1rem"}
    p={{
      xs:"0",
      sm:"1rem",
      md:"1rem 4rem"

    }}
    >

    <Button size="large"  variant="contained" startIcon={<AddIcon/>} onClick={openAddMember}>Add Member</Button>
    <Button size="large" color="error" startIcon={<DeleteIcon/>} onClick={openconfirmDeleteHandler}>Delete Group</Button>
   
    </Stack>
  </>

  return (
    <div className="flex h-screen flex-col sm:flex-row">
      {/* Sidebar - hidden on small screens */}
      <div className={`hidden sm:block sm:w-1/3 bg-[#e9b9b9] `}>
        <GroupsList myGroups={sampleChats} chatId={chatId} />
      </div>

      {/* Main Content */}
      <div className="w-full sm:w-2/3 flex flex-col items-center relative px-12 py-4">
        {iconBtns}
        {groupName && <>
        
        {groupNameComponent}

        <Typography 
          margin={"2rem"}
          alignSelf={"flex-start"}
          variant="body1"

       >Members</Typography>

       <Stack 
       maxWidth={"45rem"}
       width={"100%"}
       boxSizing={"border-box"}
       padding={{
        sm:"1rem",
        xs:"0",
        md:"1rem 4rem"
       }}
       spacing={"2rem"}
      
       height={"50vh"}
       overflow={"auto"}
       
       >

        {sampleUsers.map((i)=>(
          <UserItem 
          user={i} 
          key={i._id} 
          isAdded 
          styling={{
            boxShadow:"0 0 0.5rem rgba(0, 0 ,0,0.2)",
            padding:"1rem 2rem",
            borderRadius:"1rem",
          }} 
          handler={removeMemberHandler}
          />
        ))}

       </Stack>

       {ButtonGroup}
        
        </>}
      </div>

      {
        isAddMember && <Suspense fallback={<Backdrop open />}>

          <AddMemberDialog  />
        </Suspense>
      }


       {confirmDeleteDialog && <Suspense fallback={<Backdrop open/>}>
       <DeleteDialog open={confirmDeleteDialog} handleClose={closeconfirmDeleteHandler} deleteHandler={deleteHandler}/>
       </Suspense>}

      <Drawer
        sx={{
          display: {
            xs: "block",
            sm: "none",
          },
        }}
        open={isMobileMenuOpen}
        onClose={handleMobileClose}
      >
        <GroupsList w={"50vw"} myGroups={sampleChats} chatId={chatId} />
      </Drawer>
    </div>
  );
};

const GroupsList = ({ w = "100%", myGroups = [], chatId }) => (
  <Stack width={w} 
  sx={{
    height:"100vh",
    overflow:"auto"
  }}>
    {myGroups.length > 0 ? (
      myGroups.map((group) => (
        <GroupListItem key={group._id} group={group} chatId={chatId} />
      ))
    ) : (
      <Typography textAlign={"center"} p={"1rem"}>
        No Groups
      </Typography>
    )}
  </Stack>
);

const GroupListItem = memo(({ group, chatId }) => {
  const { name, avatar, _id } = group;

  return (
    <Link
      to={`?group=${_id}`}
      onClick={(e) => {
        if (chatId === _id) {
          e.preventDefault();
        }
      }}
    >
      <Stack direction={"row"} 
      spacing={"1rem"} 
      alignItems={"center"}
      sx={{
        ":hover":chatId!==_id?{
          bgcolor:"#999999",
          color:"white",
          transition: 'background-color 0.2s ease',
          

        }:{
          

        },
        bgcolor:chatId===_id? "black":"unset",
        color:chatId===_id? "white":"unset",
        transitionDelay: '0.05s',
       
      }}>
        <AvatarCard avatar={avatar} />
        <Typography>{name}</Typography>
      </Stack>
    </Link>
  );
});
export default Groups;
