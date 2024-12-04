// HomePage.tsx
import React, { useCallback, useContext, useEffect } from "react";
import { ProLayout } from "@ant-design/pro-layout";
import { Avatar, Button, Dropdown, Menu, Modal, notification } from "antd";
import { SmileOutlined, AppstoreAddOutlined } from "@ant-design/icons";
import {
  Link,
  Outlet,
  redirect,
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom"; // Sử dụng Routes thay vì Switch
import AccountManagement from "./components/AccountManagement";
import RoleManagement from "./components/RoleManagement";
import Footer from "./components/Footer";
import AvatarDrop from "./components/AvatarDrop"; // Đảm bảo AvatarDrop có Menu cho dropdown
import logo from "../../assets/images/logo_icon.png";
import bgHome from "../../assets/images/bgHome.png";
import request from "../../configs/axiosConfig";
import AvatarDropdown from "../../components/MenuDropDown";
import MenuDropDown from "../../components/MenuDropDown";
import { StringeeContext, StringeeProvider } from "../../stringeeContext";
import VideoCall from "../VideoCall";

const Home = () => {
  const role = localStorage.getItem("role")?.toLocaleLowerCase().trim() || "";
  const {
    hasIncomingCall,
    inComingCall,
    rejectCall,
    acceptCall,
    isCalling,
    isVideoCall,
  } = useContext(StringeeContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = useCallback(async () => {
    const response = await request.post("/auth/logout");
    if (response.status === 200) {
      notification.success({
        message: response.data?.message,
      });
      localStorage.clear();
      navigate("/login");
    } else {
      notification.error({
        message: "Đăng xuất thất bại, vui lòng kiểm tra lại~",
      });
    }
  }, []);
  const menuData =
    role === "admin"
      ? [
          {
            path: "/home/account-management",
            name: "AccountManagement",
            icon: <SmileOutlined />,
          },
          {
            path: "/home/role-management",
            name: "RoleManagement",
            icon: <AppstoreAddOutlined />,
          },
        ]
      : role === "staffs"
      ? [
          {
            path: "/home/s/appointment",
            name: "Quản lý lịch hẹn",
            icon: <SmileOutlined />,
          },
          {
            path: "/home/s/medical-record",
            name: "Quản lý Hồ sơ bệnh án",
            icon: <SmileOutlined />,
          },
          {
            path: "/home/p/forms",
            name: "Quản lý phiếu, biên bản",
            icon: <SmileOutlined />,
          },
        ]
      : [
          {
            path: "/home/p/appointment",
            name: "Quản lý lịch hẹn",
            icon: <SmileOutlined />,
          },
          {
            path: "/home/p/medical-record",
            name: "Quản lý hồ sơ bệnh án",
            icon: <SmileOutlined />,
          },
        ];

  // Render menu items với các liên kết (Link)
  const renderMenu = (menuData) => {
    return menuData.map((item) => {
      if (item.children) {
        return {
          ...item,
          children: renderMenu(item.children),
        };
      }

      return item;
    });
  };

  const handleAccept = () => {
    navigate("/video-call");
    acceptCall();
  };

  useEffect(() => {
    if (hasIncomingCall) {
      // Xử lý logic khi có cuộc gọi đến
      console.log("Thông báo cuộc gọi đến:", inComingCall);
    }
  }, [hasIncomingCall]);

  return (
    <ProLayout
      title={role === "admin" ? "Admin Dashboard" : ""}
      logo={logo} // Optional logo
      disableMobile={false}
      menuDataRender={() => renderMenu(menuData)} // Dữ liệu menu
      menuItemRender={(item, dom) => <Link to={item.path}>{dom}</Link>}
      onMenuHeaderClick={() => console.log("Logo clicked")} // Sự kiện click vào logo
    >
      <div className="flex justify-between">
        <div className="text-[20px] uppercase mb-[50px]">
          Hệ thống tư vấn sức khỏe của bệnh viện Hưng Hà
        </div>
        <MenuDropDown />
      </div>
      <div>
        {location?.pathname === "/home" && (
          <div>
            <img src={bgHome} className="w-full" alt="" />
          </div>
        )}
      </div>
      <Outlet />
      <Modal visible={!!hasIncomingCall} onCancel={rejectCall} footer={[]}>
        {isCalling ? (
          <VideoCall />
        ) : (
          <>
            <h3>Cuộc gọi từ {inComingCall?.fromAlias}</h3>
            <Button color="danger" variant="solid" onClick={rejectCall}>
              Từ chối
            </Button>
            ,
            <Button color="primary" variant="solid" onClick={handleAccept}>
              Trả lời
            </Button>
          </>
        )}
      </Modal>
    </ProLayout>
  );
};

export default Home;
