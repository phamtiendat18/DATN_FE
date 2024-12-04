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
import moment from "moment";
import { formatTimeUTC } from "../../../../../utils/time";
import formattedTime from "../../../../../commons/time";
import MedicalRecordForm from "../../../../../components/MedicalRecordForm";
import "./styles.css";

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

    const response = await request.put(
      `/medical-record/${record?.id}`,
      newRecord
    );
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
      `/medical-record/staff/${userInfo?.id || staff_id}`
    );
    if (data.status === 200) {
      const dataArr = data?.data?.data;
      console.log(dataArr);

      const newArr = dataArr
        ? dataArr.map((i) => {
            const itemObj = {
              ...i,
              patient_name: i?.patient?.name,
              user_id: i?.patient?.user_id,
              appointment_type: i?.type_appointment?.name,
              type_id: i?.type_appointment?.id,
            };
            return itemObj;
          })
        : [];

      setDataSource(newArr);
    }
    setLoading(false);
  }, [userInfo]);
  const columns = [
    {
      title: "Mã hồ sơ",
      dataIndex: "id",
      key: "id",
      sorter: true,
      search: false,
    },
    {
      title: "Bệnh nhân",
      dataIndex: "patient_name",
      key: "patient_name",
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
      render: (_, record) => (
        <Space size="middle">
          {
            <>
              <ModalForm
                trigger={<Button type="primary">Xem</Button>}
                form={form}
                autoFocusFirstInput
                submitter={false}
              >
                <MedicalRecordForm
                  create={false}
                  isEdit={true}
                  record_id={record?.id}
                />
              </ModalForm>
              <Popconfirm
                title={`Bạn có chắc muốn xóa hồ sơ này không?`}
                onConfirm={() => handleUpdate(record, false)}
                okText="Yes"
                cancelText="No"
              >
                <Button danger>Xóa</Button>
              </Popconfirm>
            </>
          }
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
        headerTitle="Quản lý hồ sơ"
        style={{ marginTop: "100px !important" }}
        toolBarRender={() => [
          <>
            <ModalForm
              trigger={<Button type="primary">Thêm hồ sơ</Button>}
              autoFocusFirstInput
              modalProps={{
                destroyOnClose: true,
              }}
              submitter={false}
              className="custom-modal"
            >
              <MedicalRecordForm create={true} />
            </ModalForm>
          </>,
        ]}
      />
    </>
  );
}
