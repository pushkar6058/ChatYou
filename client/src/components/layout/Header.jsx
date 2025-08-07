import React, { lazy, Suspense, useState } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Tooltip,
  Backdrop,
} from "@mui/material";
import { orange } from "../../constants/color";
import {
  Add as AddIcon,
  Group as GroupIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../../constants/config";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { userNotExists } from "../../redux/reducers/auth";
import { setIsMobile, setIsNotification, setIsSearch } from "../../redux/reducers/misc";

const SearchDialog= lazy(()=>import("../specific/Search"))
const NotificationDialog= lazy(()=>import("../specific/Notifications"))
const NewGroupDialog=lazy(()=>import("../specific/NewGroup"))

const Header = () => {
  const navigate = useNavigate();
  const dispatch=useDispatch();
  
  const {isSearch,isNotification}=useSelector((state)=>state.misc);
  
  const [isNewGroup, setIsNewGroup] = useState(false);

  const handleMobile = () => {
    // console.log("mobile");
    dispatch(setIsMobile(true));
  };

  const openSearch = () => {
    dispatch(setIsSearch(true));
  };
  const opemNewGroup = () => {
    setIsNewGroup((prev) => !prev);
  };
  const openNotification = () => {
    dispatch(setIsNotification(true));
  };

  const navigateToGroups = () => {
    navigate("/groups");
  };

  const LogoutHandler = async() => {
    try {
      const {data}=await axios.get(`${server}/api/v1/user/logout`,{withCredentials:true});
      toast.success(data.message);
      dispatch(userNotExists());
      
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong...");
    }
  };
  return (
    <>
      <Box sx={{ flexGrow: 1 }} height={"4rem"}>
        <AppBar
          position="static"
          sx={{
            bgcolor: orange,
          }}
        >
          <Toolbar>
            <Typography
              variant="h6"
              sx={{
                display: { xs: "none", sm: "block" },
              }}
            >
              TalkYou
            </Typography>

            <Box
              sx={{
                display: { xs: "block", sm: "none" },
              }}
            >
              <IconButton color="inherit" onClick={handleMobile}>
                <MenuIcon />
              </IconButton>
            </Box>

            <Box
              sx={{
                flexGrow: 1,
              }}
            />

            <Box>
              <IconBtn
                title="Search"
                icon={<SearchIcon />}
                onClick={openSearch}
              />
              <IconBtn
                title="New Group"
                icon={<AddIcon />}
                onClick={opemNewGroup}
              />
              <IconBtn
                title="Manage groups"
                icon={<GroupIcon />}
                onClick={navigateToGroups}
              />
              <IconBtn
                title="Open Notifications"
                icon={<NotificationsIcon />}
                onClick={openNotification}
              />
              <IconBtn
                title="Log Out"
                icon={<LogoutIcon />}
                onClick={LogoutHandler}
              />
            </Box>
          </Toolbar>
        </AppBar>
      </Box>


      {isSearch && (
        <Suspense fallback={<Backdrop open/>}>
          <SearchDialog/>
        </Suspense>
      )}
      {isNotification && (
        <Suspense fallback={<Backdrop open/>}>
          <NotificationDialog/>
        </Suspense>
      )}
      {isNewGroup && (
        <Suspense fallback={<Backdrop open/>}>
          <NewGroupDialog/>
        </Suspense>
      )}




    </>
  );
};

export const IconBtn = ({ title, icon, onClick }) => {
  return (
    <Tooltip title={title}>
      <IconButton color="inherit" size="large" onClick={onClick}>
        {icon}
      </IconButton>
    </Tooltip>
  );
};

export default Header;
