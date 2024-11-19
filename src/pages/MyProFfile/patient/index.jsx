import React, { useState, useEffect } from "react";
import { Form, Input, DatePicker, Button, Select, message } from "antd";
import {
  UserOutlined,
  PhoneOutlined,
  IdcardOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import moment from "moment"; // Để định dạng ngày tháng
import {
  ProFormDatePicker,
  ProFormSelect,
  ProFormText,
} from "@ant-design/pro-components";

const PatientProfile = ({ data, onUpdate, editing }) => {
  // Khởi tạo dữ liệu bệnh nhân từ props (có thể lấy từ API)
  const [form] = Form.useForm();

  // useEffect(() => {
  //   if (data) {
  //     form.setFieldsValue({
  //       name: data.name,
  //       gender: data.gender,
  //       id_number: data.id_number,
  //       birthday: moment(data.birthday),
  //       address: data.address,
  //       phone_number: data.phone_number,
  //       insurance_number: data.insurance_number,
  //     });
  //   }
  // }, [form]);

  // Hàm xử lý submit
  const onFinish = (values) => {
    // Giả lập việc gửi dữ liệu chỉnh sửa lên API
    console.log("Thông tin bệnh nhân đã chỉnh sửa:", values);
    onUpdate(values); // Gọi hàm từ component cha để cập nhật
    message.success("Cập nhật thông tin bệnh nhân thành công!");
  };

  return (
    <>
      <ProFormText
        placeholder="Họ và tên"
        label="Họ và tên"
        name="name"
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
      <ProFormText
        placeholder="Số CMND/CCCD"
        label="Số CMND/CCCD"
        name="id_number"
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
        disabled={!editing}
        placeholder="Địa chỉ"
      />
      <ProFormText
        label="Số điện thoại"
        name="phone_number"
        placeholder="Số điện thoại"
        disabled={!editing}
      />
      <ProFormText
        label="Số thẻ bảo hiểm"
        name="insurance_number"
        placeholder="Số thẻ bảo hiểm"
        disabled={!editing}
      />
    </>
  );
};

export default PatientProfile;
