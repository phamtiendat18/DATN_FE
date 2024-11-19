import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { Menu } from "antd";
import React from "react";

export default function AvatarDrop() {
  return (
    <Menu>
      <Menu.Item key="profile">
        <UserOutlined />
        Thông tin tài khoản
      </Menu.Item>
      <Menu.Item key="logout">
        <LogoutOutlined />
        Đăng xuất
      </Menu.Item>
    </Menu>
  );
}
