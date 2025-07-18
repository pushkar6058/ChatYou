import { } from "@mui/icons-material";
import { Avatar, Button, Dialog, DialogTitle, ListItem, Stack, Typography } from "@mui/material";
import { memo } from "react";
import { sampleNotifications } from "../../constants/sampleData";

const Notifications = () => {

  const friendRequestHandler=({_id,accept})=>{

  }
  return (
    <Dialog open>
      <Stack p={{ xs: "1rem", sm: "2rem" }} maxWidth={"25rem"}>
        <DialogTitle>Notifications</DialogTitle>

        {sampleNotifications.length > 0 ? (
          sampleNotifications.map((i) => {
            return  <NotificationItem
              key={i._id}
              sender={i.sender}
              _id={i._id}
              handler={friendRequestHandler}
            />;
          })
        ) : (
          <Typography textAlign={"center"}>No Notifications</Typography>
        )}
      </Stack>
    </Dialog>
  );
};

const NotificationItem = memo(({ sender, _id, handler }) => {
  return (
    <ListItem >
            <Stack direction={"row"} alignItems={"center"} spacing={"1rem"} width={"100%"}>
                <Avatar avatar={sender.avatar}/>
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
                >{`${sender.name} sent you a friend request.`}</Typography>
            <Stack direction={{
              sx:"column",
              sm:"row"
            }}>
              <Button onClick={()=>handler({_id,accept:true})}>Accept</Button>
              <Button color="error" onClick={()=>handler({_id,accept:false})}>Decline</Button>
            </Stack>
               
            </Stack>
        </ListItem>
  )
});

export default Notifications;
