import React from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import {
  Box,
  Button,
  Container,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import {
  AdminPanelSettings as AdminPanelSettingsIcon,
  Group as GroupIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
  
  Message as MessageIcon,
  Chat as ChatIcon
  
} from "@mui/icons-material";
import moment from "moment";
import {
  SearchField,
  CurvedButton,
} from "../../components/styles/StyledComponents";
import { DoughnutChart, LineChart } from "../../components/specific/Charts";

const AdminDashboard = () => {
  const Appbar = (
    <Paper
      elevation={3}
      sx={{
        padding: "1rem",
        margin: "2rem 0",
        borderRadius: "1rem",
      }}
    >
      <Stack direction={"row"} alignItems={"center"} spacing={"1rem"} >
        <AdminPanelSettingsIcon
          sx={{
            fontSize: "3rem",
            marginBottom: "1rem",
          }}
        />

        <SearchField placeholder="Search" />

        <CurvedButton>lknl</CurvedButton>

        <Box flexGrow={1} />

        <Typography
          sx={{
            display: {
              xs: "none",
              lg: "block",
            },
            color: "rgba(0,0,0,0.7)",
            textAlign: "center",
          }}
        >
          {moment().format("MMMM Do YYYY, h:mm:ss a")}
        </Typography>

        <IconButton
          sx={{
            color: "black",
          }}
        >
          <NotificationsIcon />
        </IconButton>
      </Stack>
    </Paper>
  );

  const Widgets = (
  <Stack direction={{
    xs:"column",
    sm: "row",
  }}
  spacing={"2rem"}
  justifyContent={"space-between"}
  alignItems={"center"}
  margin={"2rem 0"}
>

    <Widget title={"Users"} value={34} Icon={<PersonIcon/>} />
    <Widget title={"Chats"} value={4} Icon={<GroupIcon/>} />
    <Widget title={"Messages"} value={554} Icon={<MessageIcon/>}  />

  </Stack>
);

  return (
    <AdminLayout>
  <Container component="main">
    {Appbar}

    <Stack
      direction={{ xs: "column", lg: "row" }}
      alignItems={{
        xs:"center",
        lg:"stretch"
      }}
      flexWrap="wrap"

      sx={{
        gap:"2rem"
      }}
    >
      {/* Line Chart Paper */}
      <Paper
        elevation={3}
        sx={{
          padding: "2rem 3.5rem",
          borderRadius: "1rem",
          flex: 1,
          minWidth: { xs: "100%", md: "60%" },
          boxSizing: "border-box",
        }}
      >
        <Typography margin="2rem 0" variant="h4" textAlign="center">
          Last Messages
        </Typography>
        <LineChart value={[23, 45, 6, 453, 23, 566]} />
      </Paper>

      {/* Doughnut Chart Paper */}
      <Paper
        elevation={3}
        sx={{
          padding: "1rem",
          borderRadius: "1rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
          minWidth: { xs: "100%", md: "35%" },
          position: "relative",
          boxSizing: "border-box",
        }}
      >
        <DoughnutChart labels={["Single Chat", "Group Chats"]} value={[23, 66]} />

        {/* Center Overlay Icons */}
        <Stack
          position="absolute"
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={0.5}
          width="100%"
          height="100%"
        >
          <GroupIcon />
          <Typography>VS</Typography>
          <PersonIcon />
        </Stack>
      </Paper>
    </Stack>

    {Widgets}
  </Container>
</AdminLayout>

  );
};


const Widget=({title,value,Icon})=>(
  <Paper elevation={3} sx={{
    padding:"2rem ",
    margin:"2rem 0",
    borderRadius:"1rem",
    width:"20rem",
  }}>

    <Stack alignItems={"center"} spacing={"1rem"} >
      <Typography sx={{
        color:"rgba(0,0,0,0.7)",
        borderRadius:"50%",
        border:"5px solid black",
        width:"5rem",
        height:"5rem",
        display:"flex",
        justifyContent:"center",
        alignItems:"center"
      }}>
        {value}
      </Typography>
      <Stack direction={"row"} alignItems={"center"} spacing={"1rem" }>
        {Icon}
      <Typography>{title}</Typography>
      </Stack>
    </Stack>
     
  
  </Paper>
  )


export default AdminDashboard;
