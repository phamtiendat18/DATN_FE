import React, { useCallback, useEffect, useMemo, useState } from "react";
import Table from "../Table";
import request from "../../../../configs/axiosConfig";
import { Button, Form, notification, Popconfirm, Space, Tag } from "antd";
import {
  ModalForm,
  ProForm,
  ProFormDateRangePicker,
  ProFormSelect,
  ProFormText,
} from "@ant-design/pro-components";

export default function AccountManagement() {
  const [dataSource, setDataSource] = useState([]);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const handleDelete = async (id) => {
    const { status, data } = await request.delete(`/user/${id}`);
    if (status === 200) {
      notification.success({
        message: data?.message,
      });
    } else {
      notification.warning({
        message: data?.message,
      });
    }
  };
  const handleAssign = async (record) => {
    const { status, data } = await request.post(`/user/assign/${record?.id}`, {
      disable: record?.disable,
    });
    if (status === 200) {
      notification.success({
        message: data?.message,
      });
    } else {
      notification.warning({
        message: data?.message,
      });
    }
  };
  const getDataSource = useCallback(async () => {
    setLoading(true);
    const data = await request.get("/user");
    if (data.status === 200) {
      setLoading(false);
      setDataSource(data?.data);
    }
  }, []);
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: true,
      search: false,
    },
    {
      title: "Tên tài khoản",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Mật khẩu",
      dataIndex: "password",
      key: "password",
    },
    {
      title: "ID Vai trò",
      dataIndex: "role_id",
      key: "role_id",
      render: (role) => (
        <Tag color={role === "admin" ? "red" : "blue"}>{role}</Tag>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "disable",
      key: "disable",
      render: (status) => (status ? <p>Khóa</p> : <p>Mở</p>),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <>
            <ModalForm
              title="Chi tiết tài khoản"
              trigger={<Button type="primary">Sửa</Button>}
              form={form}
              autoFocusFirstInput
              modalProps={{
                destroyOnClose: true,
                onCancel: () => console.log(record),
                afterOpenChange: () => form.setFieldsValue(record),
                okText: "OK",
                cancelText: "Hủy",
              }}
              onFinish={async (values) => {
                try {
                  const data = await request.put(`/user/${record?.id}`, values);
                  if (data.status === 200) {
                    notification.success({
                      message: data?.data?.message,
                    });
                  } else {
                    {
                      notification.warning({
                        message: data.data?.message,
                      });
                    }
                  }
                } catch (error) {
                  console.log(error);
                }
              }}
            >
              <ProForm.Group>
                <ProFormText
                  width="xl"
                  name="username"
                  key="username"
                  label="Tên tài khoản"
                  placeholder="Tên tài khoản của bạn"
                  rules={[
                    { required: true, message: "Vui lòng nhập tên tài khoản" },
                  ]}
                />

                <ProFormText.Password
                  width="xl"
                  name="password"
                  key="password"
                  label="Mật khẩu"
                  placeholder="Mật khẩu"
                  rules={[
                    { required: true, message: "Vui lòng nhập mật khẩu" },
                  ]}
                />
                <ProFormSelect
                  width="xl"
                  name="role_id"
                  key="role_id"
                  label="Vai trò"
                  rules={[
                    { required: true, message: "Vui lòng chọn vai trò!" },
                  ]}
                  request={async () => {
                    const data = await request.get("/role");
                    const result = data?.data?.data.map((i) => ({
                      value: i?.id,
                      label: i?.name,
                    }));
                    return result;
                  }}
                />
              </ProForm.Group>
            </ModalForm>
          </>
          <Popconfirm
            title="Bạn có chắc muốn xoá tài khoản này không?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>Xoá</Button>
          </Popconfirm>
          <Popconfirm
            title={`Bạn có chắc muốn ${
              record?.disable ? "mở" : "khóa"
            } tài khoản này không?`}
            onConfirm={() => handleAssign(record)}
            okText="Yes"
            cancelText="No"
          >
            <Button color="primary">{record?.disable ? "Mở" : "Khóa"}</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  useEffect(() => {
    getDataSource();
    return;
  }, []);
  return (
    <>
      <Table dataSource={dataSource} columns={columns} loading={loading} />
    </>
  );
}
