import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Table from "../../Table";
import request from "../../../../../configs/axiosConfig";
import {
  Button,
  Form,
  Modal,
  notification,
  Popconfirm,
  Space,
  Tag,
} from "antd";
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
import formatedTime from "../../../../../commons/time";
import VideoCall from "../../../../VideoCall";
import { StringeeCall, StringeeCall2, StringeeClient } from "stringee";
import { StringeeContext } from "../../../../../stringeeContext";

export default function AppointmentManagement() {
  const { onCall } = useContext(StringeeContext);
  const [dataSource, setDataSource] = useState([]);
  const [staff, setStaff] = useState("");
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const userInfo = useRecoilValue(userAtom);
  const user_id = localStorage.getItem("user_id");

  const [hasIncomingCall, setHasIncomingCall] = useState(false);
  const [friendName, setFriendName] = useState("");
  const [open, setOpen] = useState();
  const accessToken = localStorage.getItem("access_token");

  const getDataSource = useCallback(async () => {
    setLoading(true);
    const patient_id = localStorage.getItem("id");
    const data = await request.get(
      `/appointment/patient/${userInfo?.patient_id || patient_id}`
    );
    if (data.status === 200) {
      setLoading(false);
      const dataArr = data?.data?.data;
      const newArr = dataArr.map((i) => {
        const itemObj = {
          ...i,
          staff_name: i?.staff?.name,
          user_id: i?.staff?.user_id,
        };
        return itemObj;
      });
      console.log(newArr);

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
      render: (time) => <p>{formatedTime(time)}</p>,
    },
    {
      title: "Bác sĩ",
      dataIndex: "staff_name",
      key: "staff_name",
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
            Bị từ chối
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
        <>
          <ModalForm
            title="Cuộc gọi"
            trigger={
              <Button onClick={() => onCall(String(record?.user_id))}>
                Gọi
              </Button>
            }
            form={form}
            autoFocusFirstInput
            submitter={false}
          >
            <VideoCall friendName={record?.staff_name} />
          </ModalForm>
        </>
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
              trigger={<Button type="primary">Đặt lịch</Button>}
              form={form}
              autoFocusFirstInput
              modalProps={{
                destroyOnClose: true,
                okText: "OK",
                cancelText: "Hủy",
              }}
              onFinish={async (values) => {
                try {
                  const patient_id = localStorage.getItem("id");
                  const bodyData = {
                    ...values,
                    ...userInfo,
                    type_id: 1,
                    patient_id: patient_id,
                  };
                  const data = await request.post(
                    `/appointment/create`,
                    bodyData
                  );
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
              <BookAppointment />
            </ModalForm>
          </>,
        ]}
      />
    </>
  );
}
