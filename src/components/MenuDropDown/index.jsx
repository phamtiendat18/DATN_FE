import { UserOutlined } from "@ant-design/icons";
import { Avatar, Dropdown, Menu, notification } from "antd";
import { useCallback, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import request from "../../configs/axiosConfig";

const MenuDropDown = () => {
  const navigate = useNavigate();
  const handleLogout = useCallback(async () => {
    const response = await request.post("/auth/logout");
    if (response.status === 200) {
      notification.success({
        message: response.data?.message,
      });
      localStorage.clear();
      sessionStorage.clear();
      navigate("/login");
    } else {
      notification.error({
        message: "Đăng xuất thất bại, vui lòng kiểm tra lại~",
      });
    }
  }, []);
  const menuItems = useMemo(
    () => [
      {
        key: "1",
        label: <Link to={"/my-profile"}>Thông tin cá nhân</Link>,
      },
      {
        key: "2",
        label: <Link onClick={handleLogout}>Đăng xuất</Link>,
      },
    ],
    []
  );
  return (
    <Dropdown menu={{ items: menuItems }}>
      <Avatar style={{ cursor: "pointer" }} icon={<UserOutlined />} />
    </Dropdown>
  );
};
export default MenuDropDown;
