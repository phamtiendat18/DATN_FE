import React, {
  useCallback,
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

export default function AppointmentManagement() {
  const [dataSource, setDataSource] = useState([]);
  const [staff, setStaff] = useState("");
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const userInfo = useRecoilValue(userAtom);
  const user_id = localStorage.getItem("user_id");
  const [hasIncomingCall, setHasIncomingCall] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [friendName, setFriendName] = useState("");
  const [isVideoCall, setIsVideoCall] = useState(false);
  const [open, setOpen] = useState();
  const accessToken = localStorage.getItem("access_token");

  const localVideo = useRef(null);
  const remoteVideo = useRef(null);
  let call = null;

  const stringeeClient = new StringeeClient();

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

  const settingCallEvent = (call1) => {
    call1.on("addremotestream", (stream) => {
      console.log("addremotestream");
      if (remoteVideo.current) {
        remoteVideo.current.srcObject = null;
        remoteVideo.current.srcObject = stream;
      }
    });

    call1.on("addlocalstream", (stream) => {
      console.log("addlocalstream");
      localVideo.current.srcObject = null;
      localVideo.current.srcObject = stream;
    });

    call1.on("signalingstate", (state) => {
      console.log("signalingstate", state);

      if (state.code === 3) {
        setIsCalling(true);
        setLoading(false);
      } else if ([4, 5, 6].includes(state.code)) {
        setIsCalling(false);
        setLoading(false);
        setHasIncomingCall(false);
      }
    });
    call1.on("mediastate", function (state) {
      console.log("mediastate ", state);
    });

    call1.on("info", function (info) {
      console.log("on info:" + JSON.stringify(info));
    });
  };
  const onCall = async (record) => {
    const receiver_id = `${record?.user_id}`;
    if (user_id === receiver_id) {
      alert("Không thể gọi cho chính mình");
      return;
    }

    setLoading(true);
    setIsVideoCall(false);

    call = new StringeeCall(stringeeClient, user_id, receiver_id, false);
    settingCallEvent(call);
    console.log(call);

    call.makeCall((res) => {
      console.log("make call callback:", res);
      setFriendName(res.toNumber);
    });
  };

  const acceptCall = () => {
    call.answer((res) => {
      console.log("answer call callback:", res);
      setHasIncomingCall(false);
      setIsCalling(true);
      setLoading(false);
    });
  };

  const rejectCall = () => {
    call.reject((res) => {
      console.log("reject call callback:", res);
      setHasIncomingCall(false);
      setLoading(false);
    });
  };

  const hangupCall = () => {
    call.hangup((res) => {
      console.log("hangup call callback:", res);
      setIsCalling(false);
      setLoading(false);
    });
  };

  const upgradeToVideoCall = () => {
    call.upgradeToVideoCall();
    setIsVideoCall(true);
  };

  useEffect(() => {
    stringeeClient.connect(accessToken);
    stringeeClient.on("connect", () => console.log("kết nối thành công"));

    stringeeClient.on("authen", (res) => {
      if (res.message === "SUCCESS") {
        console.log(res);
      }
    });

    stringeeClient.on("incomingcall", (incomingcall) => {
      console.log("incomingcall", incomingcall);
      call = incomingcall;
      settingCallEvent(incomingcall);
      setHasIncomingCall(true);
      setIsVideoCall(incomingcall.isVideoCall);
      setLoading(true);
    });
  }, []);

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
            trigger={<Button onClick={() => onCall(record)}>Gọi</Button>}
            form={form}
            autoFocusFirstInput
            submitter={false}
          >
            {isCalling && (
              <div className="mt-3">
                <p>
                  Đang gọi cho: <strong>{friendName}</strong>
                </p>
                <button className="btn btn-danger" onClick={upgradeToVideoCall}>
                  Video Call
                </button>
                <button className="btn btn-danger" onClick={hangupCall}>
                  Kết thúc
                </button>
              </div>
            )}

            {isCalling && isVideoCall && (
              <div className="mt-3">
                <video
                  ref={localVideo}
                  autoPlay
                  muted
                  style={{ width: "300px" }}
                ></video>
                <video
                  ref={remoteVideo}
                  autoPlay
                  style={{ width: "300px" }}
                  className="ms-3"
                ></video>
              </div>
            )}
          </ModalForm>
        </>
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
