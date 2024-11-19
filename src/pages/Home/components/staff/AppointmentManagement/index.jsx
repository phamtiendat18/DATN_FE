import React, { useCallback, useEffect, useMemo, useState } from "react";
import Table from "../../Table";
import request from "../../../../../configs/axiosConfig";
import { Button, Form, notification, Popconfirm, Space, Tag } from "antd";
import {
  ModalForm,
  ProForm,
  ProFormDateRangePicker,
  ProFormSelect,
  ProFormText,
  ProTable,
} from "@ant-design/pro-components";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../../../../../atoms/user";
import BookAppointment from "../BookAppointment";
import { render } from "less";
import "./style.css";
import moment from "moment";
import formatedTime from "../../../../../commons/time";

export default function AppointmentManagement() {
  const [dataSource, setDataSource] = useState([]);
  const [staff, setStaff] = useState("");
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const userInfo = useRecoilValue(userAtom);
  const getStaffInfo = async (id) => {
    const data = await request.get(`/staff/${id}`);
    setStaff(`Dr ${id}`);
  };
  const handleUpdate = useCallback(async (record, status) => {
    const newRecord = { ...record, status: status };
    const response = await request.put(`/appointment/${record?.id}`, newRecord);
    console.log(response);
  }, []);
  const getDataSource = useCallback(async () => {
    setLoading(true);
    const staff_id = localStorage.getItem("id");
    console.log(staff_id);

    const data = await request.get(
      `/appointment/staff/${userInfo?.id || staff_id}`
    );
    if (data.status === 200) {
      setLoading(false);

      setDataSource(data?.data?.data);
    }
  }, [userInfo]);
  const columns = [
    {
      title: "Mã lịch hẹn",
      dataIndex: "id",
      key: "id",
      sorter: true,
      search: false,
    },
    {
      title: "Thời gian đã hẹn",
      dataIndex: "scheduled_time",
      key: "scheduled_time",
      render: (time) => <p>{formatedTime(time)}</p>,
    },
    {
      title: "Bệnh nhân",
      dataIndex: "patient_id",
      key: "patient_id",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        console.log(status);
        return status === true ? (
          <p className="bg-green-500 text-white p-[10px] border border-0 rounded w-[200px] text-center">
            Đã xác nhận
          </p>
        ) : status === false ? (
          <p className="bg-red-500 text-white p-[10px] border border-0 rounded w-[200px] text-center">
            Đã từ chối
          </p>
        ) : (
          <p className="bg-orange-500 text-white p-[10px] border border-0 rounded w-[200px] text-center">
            Chưa xác nhận
          </p>
        );
      },
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          {record.status === null ? (
            <>
              <Popconfirm
                title="Bạn có chắc muốn chấp nhận lịch hẹn này không?"
                onConfirm={() => handleUpdate(record, true)}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  type="primary"
                  style={{ background: "green" }}
                  className="border-0"
                >
                  Chấp nhận
                </Button>
              </Popconfirm>
              <Popconfirm
                title={`Bạn có chắc muốn từ chối lịch hẹn này không?`}
                onConfirm={() => handleUpdate(record, false)}
                okText="Yes"
                cancelText="No"
              >
                <Button danger>Từ chối</Button>
              </Popconfirm>
            </>
          ) : (
            ""
          )}
        </Space>
      ),
    },
  ];
  useEffect(() => {
    console.log(dataSource);
    getDataSource();
    return;
  }, []);
  return (
    <>
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
        headerTitle="Quản lý lịch hẹn"
        toolBarRender={() => [
          <>
            <ModalForm
              title="Đặt lịch hẹn"
              trigger={<Button type="primary">Thêm lịch</Button>}
              form={form}
              autoFocusFirstInput
              modalProps={{
                destroyOnClose: true,
                okText: "OK",
                cancelText: "Hủy",
              }}
              onFinish={async (values) => {
                try {
                  const staff_id = localStorage.getItem("id");
                  const bodyData = {
                    ...values,
                    ...userInfo,
                    type_id: 1,
                    staff_id: +staff_id,
                    status: true,
                  };
                  const data = await request.post(
                    `/appointment/create`,
                    bodyData
                  );
                  if (data.status === 201) {
                    notification.success({
                      message: data?.data?.message,
                    });
                    setDataSource((prev) => [...prev, data.data?.data]);
                  } else {
                    {
                      notification.warning({
                        message: data?.message,
                      });
                    }
                  }
                } catch (error) {
                  console.log(error);
                }
                return true;
              }}
            >
              <BookAppointment />
            </ModalForm>
          </>,
        ]}
      />
    </>
  );
}
