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
import formattedTime from "../../../../../commons/time";
import VideoCall from "../../../../VideoCall";
import { StringeeCall, StringeeCall2, StringeeClient } from "stringee";
import { StringeeContext } from "../../../../../stringeeContext";
import { useNavigate } from "react-router-dom";
import moment from "moment-timezone";
import { formatTimeUTC } from "../../../../../utils/time";
import ChatBox from "../../../../../components/ChatBox";

export default function AppointmentManagement() {
  const { onCall } = useContext(StringeeContext);
  const [dataSource, setDataSource] = useState([]);
  const [staff, setStaff] = useState("");
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const userInfo = useRecoilValue(userAtom);
  const user_id = localStorage.getItem("user_id");
  const navigate = useNavigate();

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

      setDataSource(newArr);
    }
  }, [userInfo]);
  const handleClick = (friendName) => {
    onCall(friendName);
    navigate("/video-call");
  };

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
      render: (_, record) => {
        const specificTime = new Date(record?.scheduled_time); // Thời gian cần kiểm tra
        const now = new Date(); // Thời gian hiện tại

        // Kiểm tra nếu cùng ngày
        const isSameDay =
          specificTime.getUTCFullYear() === now.getUTCFullYear() &&
          specificTime.getUTCMonth() === now.getUTCMonth() &&
          specificTime.getUTCDate() === now.getUTCDate();

        // Kiểm tra nếu lớn hơn 1 tiếng
        const haftHourLater = specificTime.getTime() + 30 * 60 * 1000; // Thêm nửa tiếng (mili-giây)
        console.log("Thời gian ...", now.getTime(), record?.id);

        const isGreaterThanHaftHour = now.getTime() < haftHourLater;
        if (record?.status && isSameDay && isGreaterThanHaftHour) {
          return (
            <Button
              color="primary"
              variant="solid"
              onClick={() => handleClick(String(record?.user_id))}
            >
              Gọi
            </Button>
          );
        }
        return (
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
        );
      },
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
                  const realTime = formatTimeUTC(values?.scheduled_time);

                  const bodyData = {
                    ...values,
                    ...userInfo,
                    type_id: 1,
                    patient_id: patient_id,
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
                    const newData = { ...data };
                    console.log(newData);

                    // setDataSource((prev) => [...prev, ])
                  } else {
                    {
                      notification.warning({
                        message: data.data?.message,
                      });
                    }
                  }
                  return true;
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
