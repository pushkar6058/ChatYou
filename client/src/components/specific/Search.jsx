import { Dialog, DialogTitle, Stack, TextField,InputAdornment,List} from '@mui/material'
import {useInputValidation} from '6pp'
import React, { useEffect, useState } from 'react'
import {Search as SearchIcon} from "@mui/icons-material"
import UserItem from '../shared/UserItem'
import { useDispatch, useSelector } from 'react-redux'
import { setIsSearch } from '../../redux/reducers/misc'
import { useLazySearchUserQuery, useSendFriendRequestMutation } from '../../redux/api/api';
import {toast} from "react-hot-toast"
import { useAsyncMutation } from '../../hooks/hook'


const Search = () => {

  const {isSearch}=useSelector((state)=>state.misc);
  const [searchUser]=useLazySearchUserQuery();
  const [sendFriendRequest,isLoadingSendFriendRequest]=useAsyncMutation(useSendFriendRequestMutation);
  const dispatch=useDispatch();
  const search=useInputValidation("");

  const [users,setUsers]=useState([]);


  const addFriendHandler=async(id)=>{
    await sendFriendRequest("Sending Friend Request",{userId:id});
  }
  
  const searchCloseHandler=()=>{
    dispatch(setIsSearch(false));
  }

 useEffect(() => {
  const timeOutId = setTimeout(() => {
    if (search.value?.trim()) {
      searchUser({ name: search.value })
        .then(({ data }) =>{
         setUsers(data.users);
          
        })
        .catch((err) => console.error(err));
    }
  }, 1000);

  return () => clearTimeout(timeOutId);
}, [search.value]);
  
  
  return (
    <Dialog open={isSearch} onClose={searchCloseHandler}>
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
        {users.length >0 ?users?.map((i)=>{
          return <UserItem user={i} key={i._id} handler={addFriendHandler} handlerIsLoading={isLoadingSendFriendRequest} />
        }) : <div className='text-center text-gray-400'>No matching users</div>}
      </List>
      </Stack>
    </Dialog>
  )
}

export default Search