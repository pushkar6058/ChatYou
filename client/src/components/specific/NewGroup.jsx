import { } from "@mui/icons-material";
import { Button, Dialog, DialogTitle, Stack, TextField, Typography } from "@mui/material";
import {sampleUsers as users} from "../../constants/sampleData";
import UserItem from "../shared/UserItem"
import {useInputValidation} from "6pp";
import { use, useState } from "react";



const NewGroup = () => {
  const groupName=useInputValidation("");

  const [members,setMembers]=useState(users);
  const [selectedMembers,setSelectedMembers]=useState([]);
 

  const selectMemberHandler=(id)=>{
    setSelectedMembers((prev)=>prev.includes(id)?prev.filter((ele)=>ele!==id):[...prev,id]); 
  }

  const submitHandler=()=>{

  }

  const closeHandler=()=>{

  }
  return (
    <Dialog open onClose={closeHandler}>
          <Stack p={{ xs: "1rem", sm: "3rem" }} width={"25rem"} spacing={"2rem"}>
            <DialogTitle textAlign={"center"} variant="h4">New Group</DialogTitle>
            <TextField
              value={groupName.value}
              onChange={groupName.changeHandler}
              label="Group Name"
              
            />
            <Typography variant="body1" color="initial">Members</Typography>
    
            <Stack>
              {members.map((i)=>{
                        return <UserItem user={i} key={i._id} handler={selectMemberHandler} isAdded={selectedMembers.includes(i._id)? true:false}  />
                      })}
            </Stack>

            <Stack direction={"row"} justifyContent={"space-evenly"}>
              <Button variant="text" color="error">Cancel</Button>
              <Button variant="contained" onClick={submitHandler}>Create</Button>
            </Stack>
          </Stack>
        </Dialog>
  )
}

export default NewGroup