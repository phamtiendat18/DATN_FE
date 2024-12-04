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
import MedicalRecordForm from "../../../../../components/MedicalRecordForm";
import "./styles.css";

export default function MedicalRecordManagement() {
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
      `/medical-record/patient/${userInfo?.patient_id || patient_id}`
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
      title: "Mã hồ sơ",
      dataIndex: "id",
      key: "id",
      sorter: true,
      search: false,
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
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        return status === true ? (
          <p className="bg-green-500 text-white p-[10px] border border-0 rounded w-[200px] text-center">
            Đã xuất viện
          </p>
        ) : (
          <p className="bg-orange-500 text-white p-[10px] border border-0 rounded w-[200px] text-center">
            Chưa xuất viện
          </p>
        );
      },
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
              <MedicalRecordForm create={false} record_id={record?.id} />
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
        style={{ marginTop: "100px !important" }}
        options={{
          reload: true,
          density: true,
        }}
        headerTitle="Quản lý hồ sơ bệnh án"
      />
    </>
  );
}
