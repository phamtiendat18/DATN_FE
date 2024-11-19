import React, { useState, useEffect } from "react";
import { Form, Input, Button, DatePicker, Select, message } from "antd";
import axios from "axios"; // Dùng axios để gọi API
import moment from "moment"; // Để làm việc với thời gian
import {
  ProFormDatePicker,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from "@ant-design/pro-components";

const { Option } = Select;

const StaffProfile = ({ userId, editing }) => {
  const [staffData, setStaffData] = useState(null);

  useEffect(() => {
    // Lấy dữ liệu nhân viên từ API
    const fetchStaffData = async () => {
      try {
        const response = await axios.get(`/api/staffs/${userId}`);
        setStaffData(response.data);
      } catch (error) {
        message.error("Không thể tải dữ liệu nhân viên");
      }
    };

    fetchStaffData();
  }, []);

  const onFinish = async (values) => {
    // Cập nhật thông tin nhân viên qua API
    try {
      const response = await axios.put(`/api/staffs/${userId}`, values);
      message.success("Cập nhật thông tin thành công!");
      setStaffData(response.data);
    } catch (error) {
      message.error("Cập nhật thông tin thất bại");
    }
  };

  if (!staffData) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <ProFormText
        label="Họ và tên"
        name="name"
        placeholder="Họ và tên"
        disabled={!editing}
      />
      <ProFormSelect
        request={() => [
          { label: "Nam", value: true },
          { label: "Nữ", value: false },
          { label: "Khác", value: null },
        ]}
        label="Giới tính"
        name="gender"
        placeholder="Giới tính"
        disabled={!editing}
      />
      <ProFormDatePicker
        label="Ngày sinh"
        name="birthday"
        placeholder="Ngày sinh"
        disabled={!editing}
      />
      <ProFormText
        label="Địa chỉ"
        name="address"
        placeholder="Địa chỉ"
        disabled={!editing}
      />
      <ProFormText
        label="Chức vụ"
        name="position"
        placeholder="Chức vụ"
        disabled={!editing}
      />
      <ProFormText
        label="Bộ phận"
        name="department"
        placeholder="Bộ phận"
        disabled={!editing}
      />
      <ProFormText
        label="Số điện thoại"
        name="phone_number"
        placeholder="Số điện thoại"
        disabled={!editing}
      />
      <ProFormTextArea
        label="Công trình nghiên cứu"
        name="research_work"
        placeholder="Công trình nghiên cứu"
        disabled={!editing}
      />
      <ProFormText
        label="Nơi làm việc"
        name="work_place"
        placeholder="Nơi làm việc"
        disabled={!editing}
      />
      <ProFormTextArea
        label="Kinh nghiệm"
        name="experience"
        placeholder="Kinh nghiệm"
        disabled={!editing}
      />
      <ProFormTextArea
        label="Giới thiệu bản thân"
        name="about_me"
        placeholder="Giới thiệu bản thân"
        disabled={!editing}
      />
    </>
  );
};

export default StaffProfile;
