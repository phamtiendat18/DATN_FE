import {
  ArrowLeftOutlined,
  EditOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { ProCard, ProForm } from "@ant-design/pro-components";
import { Avatar, Button, Form, notification } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Sử dụng Routes thay vì Switch
import { useRecoilValue } from "recoil";
import userAtom from "../../atoms/user";
import request from "../../configs/axiosConfig";
import ChangePassword from "./ChangePassword";
import PatientProfile from "./patient";
import StaffProfile from "./staff";
import "./styles.css";
import moment from "moment";

const MyProfile = () => {
  const role = localStorage.getItem("role")?.toLocaleLowerCase().trim() || "";
  const id = localStorage.getItem("id")?.toLocaleLowerCase().trim() || "";
  const [editing, setEditing] = useState(false);
  const [form] = Form.useForm();
  const userInfo = useRecoilValue(userAtom);

  const handleEdit = () => {
    setEditing(!editing);
  };
  const handleSubmit = async () => {
    setEditing(false);
    const bodyData = form.getFieldsValue();
    const birthday = moment(bodyData?.birthday).format("YYYY-MM-DD HH:mm:ss");

    const data = await request.put(
      `/${role === "staffs" ? "staff" : "patient"}/${id}`,
      { ...bodyData, birthday }
    );
    form.setFieldsValue(bodyData);
    if (data.data?.status) {
      return notification.error({ message: data.data?.message });
    }
    return notification.success({ message: data.data?.message });
  };

  const handlePasswordChange = async (data) => {
    console.log(data);

    // const { status } = await request.post("/auth/change-password", data);
  };
  const getData = useCallback(async () => {
    if (Object.keys(userInfo).length === 0) {
      const data = await request.get(
        `/${role === "staffs" ? "staff" : "patient"}/${id}`
      );
      form.setFieldsValue(data.data);
      return;
    }

    form.setFieldsValue(userInfo?.patient || userInfo?.staff);
  }, []);
  useEffect(() => {
    getData();
  }, []);
  return (
    <>
      <div style={{ padding: "20px" }}>
        <div>
          <Link to={"/home"} className="hover:text-blue-700">
            <ArrowLeftOutlined style={{ fontSize: "13px" }} /> Về trang chủ
          </Link>
        </div>
        <h2 className="font-bold text-[40px] text-center">Thông tin cá nhân</h2>
        <ProCard
          style={{ width: "60%", margin: "0 auto" }}
          extra={[
            <Button
              key="edit"
              type="primary"
              icon={<EditOutlined />}
              onClick={handleEdit}
            >
              {editing ? "Hủy" : "Chỉnh sửa"}
            </Button>,
            editing && (
              <Button key="save" type="primary" onClick={handleSubmit}>
                Lưu thay đổi
              </Button>
            ),
          ]}
          bordered
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "20px",
            }}
          >
            <Avatar size={128} icon={<UserOutlined />} />
          </div>

          <ProForm form={form} submitter={false} layout="vertical">
            {role === "staffs" ? (
              <StaffProfile editing={editing} />
            ) : (
              <PatientProfile editing={editing} />
            )}
          </ProForm>

          <div style={{ marginTop: "20px" }}>
            <ChangePassword />
          </div>
        </ProCard>
      </div>
    </>
  );
};

export default MyProfile;
