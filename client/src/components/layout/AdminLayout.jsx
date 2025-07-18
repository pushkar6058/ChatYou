// AdminLayout.jsx
import {
  Chat as ChatIcon,
  Close as CloseIcon,
  Logout as LogoutIcon,
  ManageAccounts as ManageAccountsIcon,
  Menu as MenuIcon,
  Message as MessageIcon,
  Dashboard as DashboardIcon,
} from "@mui/icons-material";

import {
  Drawer,
  IconButton,
  Stack,
  Typography,
  styled,
} from "@mui/material";
import { useState } from "react";
import { Link as LinkComponent, Navigate, useLocation } from "react-router-dom";

// Styled Link
const Link = styled(LinkComponent)`
  text-decoration: none;
  border-radius: 2rem;
  padding: 1rem 2rem;
  color: black;
  display: block;

  &:hover {
    color: rgba(0, 0, 0, 0.54);
  }
`;

// Sidebar Tabs
const adminTabs = [
  { name: "Dashboard", path: "/admin/dashboard", icon: <DashboardIcon /> },
  { name: "Users", path: "/admin/users", icon: <ManageAccountsIcon /> },
  { name: "Chats", path: "/admin/chats", icon: <ChatIcon /> },
  { name: "Messages", path: "/admin/messages", icon: <MessageIcon /> },
];

// Sidebar Component
const Sidebar = ({ w = "100%", onClose }) => {
  const location = useLocation();

  const logoutHandler = () => {
    console.log("logout");
    onClose?.(); // Close Drawer if provided
  };

  return (
    <Stack width={w} direction="column" p="3rem" spacing="3rem">
      <Typography variant="h5" fontWeight="bold">
        ChatYou
      </Typography>

      <Stack spacing="1rem">
        {adminTabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          return (
            <Link
              key={tab.path}
              to={tab.path}
              style={{
                backgroundColor: isActive ? "rgba(0,0,0,0.1)" : "transparent",
                color: isActive ? "#000" : "inherit",
              }}
              onClick={onClose} // Close Drawer on nav
            >
              <Stack direction="row" alignItems="center" spacing="1rem">
                {tab.icon}
                <Typography>{tab.name}</Typography>
              </Stack>
            </Link>
          );
        })}

        <Link onClick={logoutHandler}>
          <Stack direction="row" alignItems="center" spacing="1rem">
            <LogoutIcon />
            <Typography>Logout</Typography>
          </Stack>
        </Link>
      </Stack>
    </Stack>
  );
};

// Main Layout Component
const Admin = true;

const AdminLayout = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);

  if (!Admin) return <Navigate to="/admin" />;

  const handleMobileToggle = () => setIsMobile((prev) => !prev);
  const handleClose = () => setIsMobile(false);

  return (
    <div className="min-h-screen flex flex-row">
      {/* Mobile Menu Icon */}
      <div className="block md:hidden fixed right-4 top-4 z-50">
        <IconButton onClick={handleMobileToggle}>
          {isMobile ? <CloseIcon /> : <MenuIcon />}
        </IconButton>
      </div>

      {/* Sidebar for md+ screens */}
      <div className="hidden md:block md:w-1/3 lg:w-1/4 bg-white border-r">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="w-full md:w-2/3 lg:w-3/4 bg-gray-100 p-4">{children}</div>

      {/* Drawer for mobile */}
      <Drawer anchor="left" open={isMobile} onClose={handleClose}>
        <Sidebar w="70vw" onClose={handleClose} />
      </Drawer>
    </div>
  );
};

export default AdminLayout;
