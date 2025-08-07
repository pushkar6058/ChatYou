import { Avatar, Stack, Typography } from "@mui/material";
import React from "react";
import {
  Face as FaceIcon,
  AlternateEmail as UserNameIcon,
  CalendarMonth as CalenderIcon,
  CallToAction,
} from "@mui/icons-material";
import moment from "moment"
import { transformImage } from "../../libs/features";

const Profile = ({user}) => {
  return (
    <Stack spacing={"2rem"} direction={"column"} alignItems={"center"}>
      <Avatar
      src={transformImage(user?.avatar?.url)}
        sx={{
          width: 200,
          height: 200,
          objectFit: "contain",
          marginBottom: "1rem",
          border: "5px solid white",
        }}
      />
      <ProfileCard
        heading={"Username"}
        text={user.username}
        Icon={<UserNameIcon />}
      />
      <ProfileCard
        heading={"Name"}
        text={user.name}
        Icon={<FaceIcon />}
      />
      <ProfileCard heading={"Bio"} text={user.bio} />
      <ProfileCard heading={"Joined"} text={moment(user.createdAt).fromNow()} Icon={<CalenderIcon />} />
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
      <Typography variant="body1" fontWeight="bold">{text}</Typography>
    </Stack>
  </Stack>
);

export default Profile;
