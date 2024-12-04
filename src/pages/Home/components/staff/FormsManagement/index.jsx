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
import formattedTime from "../../../../../commons/time";
import VideoCall from "../../../../VideoCall";
import { StringeeCall, StringeeCall2, StringeeClient } from "stringee";
import { StringeeContext } from "../../../../../stringeeContext";
import { useNavigate } from "react-router-dom";
import moment from "moment-timezone";
import { formatTimeUTC } from "../../../../../utils/time";
import ChatBox from "../../../../../components/ChatBox";
import ConsultForm from "../../../../../components/ConsultForm";

export default function ConsultFormManagement() {
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
      `/consult-form/patient/${userInfo?.patient_id || patient_id}`
    );
    if (data.status === 200) {
      setLoading(false);
      const dataArr = data?.data?.data;
      const newArr = dataArr.map((i) => {
        const parseData = JSON.parse(i?.meeting_info);
        const itemObj = {
          ...i,
          staff_name: i?.staff?.name,
          user_id: i?.staff?.user_id,
          type_name: i?.type_form?.name,
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
      title: "STT",
      dataIndex: "index",
      key: "index",
      sorter: true,
      search: false,
      render: (index) => {
        <p>{index}</p>;
      },
    },
    {
      title: "Loại phiếu",
      dataIndex: "type_name",
      key: "type_name",
    },
    {
      title: "Bác sĩ",
      dataIndex: "staff_name",
      key: "staff_name",
    },
    {
      title: "Thời gian tạo",
      dataIndex: "created_at",
      key: "created_at",
      render: (time) => <p>{formattedTime(time)}</p>,
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => {
        return (
          <>
            <ModalForm
              trigger={<Button type="primary">Xem</Button>}
              form={form}
              autoFocusFirstInput
              submitter={false}
            >
              <ConsultForm />
            </ModalForm>
          </>
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
