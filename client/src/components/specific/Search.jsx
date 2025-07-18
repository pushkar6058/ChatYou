import { Dialog, DialogTitle, Stack, TextField,InputAdornment,List} from '@mui/material'
import {useInputValidation} from '6pp'
import React, { useState } from 'react'
import {Search as SearchIcon} from "@mui/icons-material"
import UserItem from '../shared/UserItem'
import { sampleUsers } from '../../constants/sampleData'


const Search = () => {
  const search=useInputValidation("");
  const [users,setUsers]=useState(sampleUsers);
  let isLoadingSendFriendRequest=false;

  const addFriendHandler=(id)=>{
    console.log(id);

  }

  
  
  return (
    <Dialog open>
      <Stack p={"2rem"} direction={"column"} width={"25rem"} >
      <DialogTitle textAlign={"center"}>Find People</DialogTitle>
      <TextField
        id=""
        label=""
        value={search.value}
        onChange={search.changeHandler}
        variant='outlined'
        size='small'
        InputProps={{
          startAdornment:(
            <InputAdornment position="start">
              <SearchIcon/>
            </InputAdornment>
          )
        }}
        
      />

      <List>
        {users.map((i)=>{
          return <UserItem user={i} key={i._id} handler={addFriendHandler} handlerIsLoading={isLoadingSendFriendRequest} />
        })}
      </List>
      </Stack>
    </Dialog>
  )
}

export default Search