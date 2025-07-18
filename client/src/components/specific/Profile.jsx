import { Avatar, Stack, Typography } from "@mui/material";
import React from "react";
import {
  Face as FaceIcon,
  AlternateEmail as UserNameIcon,
  CalendarMonth as CalenderIcon,
  CallToAction,
} from "@mui/icons-material";
import moment from "moment"

const Profile = () => {
  return (
    <Stack spacing={"2rem"} direction={"column"} alignItems={"center"}>
      <Avatar
        sx={{
          width: 200,
          height: 200,
          objectFit: "contain",
          marginBottom: "1rem",
          border: "5px solid white",
        }}
      />
      <ProfileCard heading={"Bio"} text={"ranefnei ve vkjebv vebn"} />
      <ProfileCard
        heading={"Username"}
        text={"pushkar_bastara"}
        Icon={<UserNameIcon />}
      />
      <ProfileCard heading={"Joined"} text={moment("2025-06-27T17:31:04.023Z").fromNow()} Icon={<CalenderIcon />} />
    </Stack>
  );
};

const ProfileCard = ({ text, Icon, heading }) => (
  <Stack
    direction={"row"}
    alignItems={"center"}
    spacing={"1rem"}
    color={"white"}
    textAlign={"center"}
  >
    {Icon && Icon}

    <Stack>
      <Typography color={"gray"} variant="caption">
        {heading}
      </Typography>
      <Typography variant="body1">{text}</Typography>
    </Stack>
  </Stack>
);

export default Profile;
