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
import { formatTimeUTC } from "../../../../../utils/time";
import formattedTime from "../../../../../commons/time";
import ChatBox from "../../../../../components/ChatBox";
import ConsultForm from "../../../../../components/ConsultForm";

export default function AppointmentManagement() {
  const [dataSource, setDataSource] = useState([]);
  const [staff, setStaff] = useState("");
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const userInfo = useRecoilValue(userAtom);
  const user_id = localStorage.getItem("user_id");
  const getStaffInfo = async (id) => {
    const data = await request.get(`/staff/${id}`);
    setStaff(`Dr ${id}`);
  };
  const handleUpdate = useCallback(async (record, status) => {
    const newRecord = { ...record, status: status };

    const response = await request.put(`/appointment/${record?.id}`, newRecord);
    if (response.status === 200) {
      notification.success({
        message: response.data.message,
      });
    }
  }, []);
  const getDataSource = useCallback(async () => {
    setLoading(true);
    const staff_id = localStorage.getItem("id");

    const data = await request.get(
      `/appointment/staff/${userInfo?.id || staff_id}`
    );
    if (data.status === 200) {
      setLoading(false);
      const dataArr = data?.data?.data;
      const newArr = dataArr.map((i) => {
        const itemObj = {
          ...i,
          patient_name: i?.patient?.name,
          user_id: i?.patient?.user_id,
          appointment_type: i?.type_appointment?.name,
          type_id: i?.type_appointment?.id,
        };
        return itemObj;
      });

      setDataSource(newArr);
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
      render: (time) => <p>{formattedTime(time)}</p>,
    },
    {
      title: "Bệnh nhân",
      dataIndex: "patient_name",
      key: "patient_name",
    },
    {
      title: "Loại lịch",
      dataIndex: "appointment_type",
      key: "appointment_type",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
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
          {record.status === null && (
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
          )}
          <ModalForm
            title="Hộp thoại"
            trigger={<Button type="primary">Nhắn tin</Button>}
            form={form}
            autoFocusFirstInput
            submitter={false}
          >
            <ChatBox
              senderId={+user_id}
              receiverId={record?.user_id}
              appointmentId={record?.id}
            />
          </ModalForm>
          <ModalForm
            title="Đặt lịch hẹn"
            trigger={<Button type="primary">Thêm phiếu tư vấn</Button>}
            form={form}
            autoFocusFirstInput
            modalProps={{
              destroyOnClose: true,
              okText: "OK",
              cancelText: "Hủy",
            }}
            onFinish={async (values) => {
              try {
                const bodyData = {
                  ...values,
                  meeting_info: JSON.stringify(values),
                  appointment_id: record?.id,
                  type_id: 1,
                };

                const data = await request.post(`/consult-form`, bodyData);
                if (data.status === 201) {
                  notification.success({
                    message: data?.data?.message,
                  });
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
            <ConsultForm form={form} record={record} />
          </ModalForm>
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
                  const realTime = formatTimeUTC(values?.scheduled_time);

                  const bodyData = {
                    ...values,
                    ...userInfo,
                    staff_id,
                    status: true,
                    scheduled_time: realTime,
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
