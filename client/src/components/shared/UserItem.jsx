import { Avatar, ListItem, ListItemText, Stack, Typography, IconButton } from '@mui/material';
import React, { memo } from 'react'
import {Add as AddIcon, Remove as RemoveIcon} from '@mui/icons-material'
import { transformImage } from '../../libs/features';


const UserItem = ({user,handler,handlerIsLoading,isAdded=false,styling={}}) => {

    const {name,_id,avatar}=user;
  return (
        <ListItem >
            <Stack 
            direction={"row"} 
            alignItems={"center"} 
            spacing={"1rem"} 
            width={"100%"}
            {...styling}
            >
                <Avatar src={transformImage(avatar)}/>
                <Typography variant='body1' 
                    sx={{
                        flexGrow:1,
                        display:"-webkit-box",
                        WebkitLineClamp:1,
                        WebkitBoxOrient:"vertical",
                        overflow:"hidden",
                        textOverflow:"ellipsis",
                        width:"100%"
                    }}
                >{name}</Typography>

                <IconButton 
                sx={{
                    bgcolor:isAdded?"error.main":"primary.main",

                    color:"white",
                    "&:hover":{
                        bgcolor:"primary.dark"
                    }
                }}
                onClick={()=>handler(_id)} disabled={handlerIsLoading} >
                  {isAdded===false? <AddIcon/> :<RemoveIcon/>}
                </IconButton>
            </Stack>
        </ListItem>
  )
}

export default memo(UserItem)