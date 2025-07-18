import { Avatar, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import AvatarCard from "../../components/shared/AvatarCard";
import Table from "../../components/shared/Table";
import { dashboardData } from "../../constants/sampleData";
import { tranformImage } from "../../libs/features";

const columns = [
  {
    field: "id",
    headerName: "ID",
    headerClassName: "table-header",
    width: 200,
  },
  {
    field: "avatar",
    headerName: "Avatar",
    headerClassName: "table-header",
    width: 150,
    renderCell: (params) => <AvatarCard avatar={params.row.avatar} />,
  },
  {
    field: "name",
    headerName: "Name",
    headerClassName: "table-header",
    width: 200,
  },
  {
    field: "totalMembers",
    headerName: "Total Members",
    headerClassName: "table-header",
    width: 120,
  },
  {
    field: "members",
    headerName: "Members",
    headerClassName: "table-header",
    width: 400,
    renderCell: (params) => (
      <AvatarCard max={100} avatar={params.row.members} />
    ),
  },
  {
    field: "totalMessages",
    headerName: "Total Messages",
    headerClassName: "table-header",
    width: 120,
  },
  {
    field: "creator",
    headerName: "Created By",
    headerClassName: "table-header",
    width: 250,
    renderCell: (params) => (
      <Stack direction={"row"} alignItems={"center"} spacing={1}>
        <Avatar
          alt={params.row.creator.name}
          src={tranformImage(params.row.creator.avatar, 50)}
        />
        <span>{params.row.creator.name}</span>
      </Stack>
    ),
  },
  {
    field: "createdAt",
    headerName: "Created At",
    headerClassName: "table-header",
    width: 250,
  },
];

const ChatManagment = () => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    setRows(
      dashboardData.chats.map((user) => ({
        ...user,
        id: user._id,
        avatar: user.avatar.map((i) => tranformImage(i, 50)),
        members: user.members.map((i) => tranformImage(i.avatar, 50)),
        creator: {
          name: user.creator.name,
          avatar: tranformImage(user.creator.avatar, 50),
        },
      }))
    );
  }, []);

  return (
    <AdminLayout>
      <Table heading={"All Chats"} columns={columns} rows={rows} />
    </AdminLayout>
  );
};

export default ChatManagment;
