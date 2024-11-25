import React, { useState, useEffect } from "react";
import { Form, Input, Button, DatePicker, Select, message } from "antd";
import moment from "moment"; // Để làm việc với thời gian
import {
  ProFormDatePicker,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from "@ant-design/pro-components";
import request from "../../../configs/axiosConfig";

const { Option } = Select;

const StaffProfile = ({ userId, editing }) => {
  return (
    <>
      <ProFormText
        label="Họ và tên"
        name="name"
        placeholder="Họ và tên"
        disabled={!editing}
      />
      <ProFormSelect
        // request={() => [
        //   { label: "Nam", value: true },
        //   { label: "Nữ", value: false },
        //   { label: "Khác", value: null },
        // ]}
        options={[
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
      <ProFormSelect
        request={async () => {
          const data = await request.get("/department");
          const result = Array.isArray(data.data?.data)
            ? data.data.data.map((i) => ({
                value: i?.id,
                label: i?.name,
              }))
            : [];
          return result;
        }}
        label="Khoa"
        name="department_id"
        placeholder="Khoa"
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
