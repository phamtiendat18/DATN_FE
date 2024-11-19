import React from "react";
import {
  ModalForm,
  ProForm,
  ProFormSelect,
  ProFormText,
  ProTable,
} from "@ant-design/pro-components";
import { Button, Tag, Space, Popconfirm, message, Form } from "antd";
import request from "../../../configs/axiosConfig";

const Table = ({ dataSource, columns, loading }) => {
  const [form] = Form.useForm();
  const handleDelete = (id) => {
    // Thực hiện xoá tài khoản với `id`
    message.success(`Xoá tài khoản có ID: ${id}`);
  };

  return (
    <ProTable
      columns={columns}
      dataSource={dataSource}
      rowKey="id"
      loading={loading}
      pagination={{
        pageSize: 5,
      }}
      search={false}
      options={{
        reload: true,
        density: true,
      }}
      headerTitle="Quản lý tài khoản"
      toolBarRender={() => [
        <>
          <ModalForm
            title="Chi tiết tài khoản"
            trigger={<Button type="primary">Thêm tài khoản</Button>}
            form={form}
            autoFocusFirstInput
            modalProps={{
              destroyOnClose: true,
              onCancel: () => console.log(record),
              okText: "OK",
              cancelText: "Hủy",
            }}
            onFinish={async (values) => {
              try {
                const data = await request.post(`/user/create`, values);
                if (data.status === 201) {
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
                rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
              />
              <ProFormSelect
                width="xl"
                name="role_id"
                key="role_id"
                label="Vai trò"
                placeholder="Vai trò"
                rules={[{ required: true, message: "Vui lòng chọn vai trò!" }]}
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
        </>,
      ]}
    />
  );
};

export default Table;
