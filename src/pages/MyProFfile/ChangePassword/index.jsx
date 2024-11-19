import { LockOutlined } from "@ant-design/icons";
import { ModalForm, ProFormText } from "@ant-design/pro-components";
import { Button, Form, notification } from "antd";
import React, { useCallback, useState } from "react";
import request from "../../../configs/axiosConfig";

export default function ChangePassword() {
  const username = localStorage.getItem("username");
  const [form] = Form.useForm();
  const handleSubmit = useCallback(async (values) => {
    try {
      const { data } = await request.post("/auth/change-password", {
        ...values,
        username,
      });
      if (data?.status) {
        notification.error({ message: data?.message });
      } else {
        notification.success({ message: data?.message });
      }
    } catch (error) {
      console.log(error);
    }
  }, []);
  return (
    <ModalForm
      title="Đổi mật khẩu"
      trigger={<Button icon={<LockOutlined />}>Đổi mật khẩu</Button>}
      modalProps={{
        okText: "OK",
        cancelText: "Hủy",
      }}
      form={form}
      onFinish={async (values) => {
        await handleSubmit(values);
        return true;
      }}
    >
      <ProFormText.Password
        name="old_password"
        label="Mật khẩu"
        placeholder="Mật khẩu cũ"
        rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
      />
      <ProFormText.Password
        name="password"
        label="Mật khẩu mới"
        placeholder="Mật khẩu"
        rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
      />
      <ProFormText.Password
        name="re_password"
        label="Nhập lại mật khẩu mới"
        placeholder="Mật khẩu"
        rules={[
          { required: true, message: "Vui lòng nhập mật khẩu" },
          {
            validator: (_, value) => {
              const password = form.getFieldValue("password");
              if (password !== value) {
                return Promise.reject(
                  new Error("Nhập lại mật khẩu chưa đúng!")
                );
              }
              return Promise.resolve();
            },
          },
        ]}
      />
    </ModalForm>
  );
}
