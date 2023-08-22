import React from "react";
import Link from "next/link";
import { useTheme } from "../../../../../context/useTheme";
import { Dropdown, Button, Avatar, Typography } from "antd";
import { MdOutlineExpandMore, MdLogout } from "react-icons/md";
import { useSession } from "../../../../../context/useSession";
import { getAvatarName } from "../../../../../utils";
import { getMediaURL } from "../../../../../utils";
const { Text } = Typography;

const items = [
  {
    key: "profile",
    label: <Link href="/profile">Profile</Link>,
  },

  {
    key: "setting",
    label: <Link href="/setting">Setting</Link>,
  },
  {
    key: "task",
    label: <Link href="/profile">My Tasks</Link>,
  },
  {
    type: "divider",
  },
  {
    key: "logout",
    label: (
      <Text type="danger" className="d-inline-flex align-center">
        <MdLogout className="mr-2 text-md" />
        Logout
      </Text>
    ),
  },
];

const Profile = () => {
  const { screen } = useTheme();

  const { logout, user } = useSession();

  const onClick = (e) => {
    if (e.key === "logout") logout({});
  };
  return (
    <Dropdown
      destroyPopupOnHide
      menu={{
        items,
        onClick,
      }}
    >
      <Button type="text" size="large" className="py-0 px-2">
        <Avatar className="uppercase" src={getMediaURL(user?.image?.url)}>
          {getAvatarName(user?.name || user?.username)}
        </Avatar>

        {screen.lg && (
          <Text className="uppercase text-xs font-medium ml-2 d-inline-flex">
            {user?.name || user?.username}
            <MdOutlineExpandMore className="text-lg ml-1" />
          </Text>
        )}
      </Button>
    </Dropdown>
  );
};

export default Profile;
