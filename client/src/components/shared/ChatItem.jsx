import React, { memo } from "react";
import { Link } from "../styles/StyledComponents";
import { Box, Stack, Typography } from "@mui/material";
import AvatarCard from "./AvatarCard";

const ChatItem = ({
  avatar = [],
  name,
  _id,
  groupChat = false,
  sameSender,
  isOnline,
  newMessageAlert,
  index = 0,
  handleDeleteChat}
) => {
  return (
    <Link
    
    sx={{
      padding:"0"
    }}
      to={`/chat/${_id}`}
      onContextMenu={(e) => handleDeleteChat(e, _id, groupChat)}
    >
      <div
  className={`${
    sameSender
      ? "text-white bg-black"
      : "hover:bg-gray-300 text-black bg-white"
  } transition-colors duration-100 delay-50 flex items-center justify-between p-[1rem] gap-[1rem] relative`}
>
        <AvatarCard avatar={avatar}/>

        <Stack>
          <Typography>{name}</Typography>

          {newMessageAlert && (
            <Typography>{newMessageAlert.count} New messages</Typography>
          )}
        </Stack>

        {isOnline && (
          <Box
            sx={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: "green",
              position: "absolute",
              top: "50%",
              right: "1rem",
              transform: "translateY(-50%)",
            }}
          />
        )}
      
      </div>
    </Link>
  );
};

export default memo(ChatItem);
