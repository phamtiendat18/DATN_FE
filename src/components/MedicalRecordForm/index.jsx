import React, { useCallback, useEffect, useState } from "react";
import {
  ProCard,
  ProForm,
  ProFormText,
  ProFormSelect,
  ProFormDatePicker,
  ProFormTextArea,
} from "@ant-design/pro-components";
import { Row, Col, Space, Button, Typography, Form, notification } from "antd";
import { EditOutlined, SaveOutlined } from "@ant-design/icons";
import request from "../../configs/axiosConfig";
import "./styles.css";

const { Title } = Typography;

const MedicalRecordForm = ({ create, isEdit, record_id }) => {
  const [users, setUsers] = useState([]);
  const [isEditing, setIsEditing] = useState(create); // Trạng thái chỉnh sửa
  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    const result = form.getFieldsValue();
    const status = result?.dischargeDate ? true : false;
    const disease_history = JSON.stringify(result);
    const realData = { ...result, disease_history, status };
    const { data } = await request.put(
      `/medical-record/${record_id}`,
      realData
    );
    if (data?.status === 200) {
      notification.success({ message: data?.message });
    } else {
      notification.success({
        message: data?.message || "Cập nhật hồ sơ không thành công!",
      });
    }
  };
  const getData = async () => {
    setLoading(true);
    const { data } = await request.get(`/medical-record/${record_id}`);
    const fieldData = JSON.parse(data?.data?.disease_history);
    form.setFieldsValue(fieldData);
    setLoading(false);
  };

  const handleChange = useCallback(
    (id) => {
      const selectedUser = users.find((user) => user.id === id);
      const transformedObject = Object.keys(selectedUser).reduce((acc, key) => {
        const newKey = `patient_${key}`;
        acc[newKey] = selectedUser[key];
        return acc;
      }, {});
      form.setFieldsValue(transformedObject);
    },
    [users]
  );
  const handleSubmit = async () => {
    const result = form.getFieldsValue();
    const status = result?.dischargeDate ? true : false;
    const disease_history = JSON.stringify(result);
    const realData = { ...result, disease_history, status };
    const { data } = await request.post("/medical-record/create", realData);
    if (data?.status === 201) {
      notification.success({ message: data?.message });
    } else {
      notification.error({ message: "Tạo hồ sơ không thành công!" });
    }
  };
  useEffect(() => {
    if (record_id) {
      getData();
    }
  }, [record_id]);

  return (
    <ProCard className="custom-card" loading={loading}>
      <Title level={3} className="text-center">
        HỒ SƠ BỆNH ÁN
      </Title>
      <ProForm
        layout="vertical"
        submitter={{
          render: () => null, // Ẩn nút submit mặc định
        }}
        form={form}
      >
        {/* 1. Thông tin bệnh nhân */}
        <Title level={4}>1. Thông tin bệnh nhân</Title>
        <Row gutter={16}>
          <Col span={12}>
            <ProFormSelect
              placeholder={"Mã số bệnh nhân"}
              name="patient_id"
              label="Mã số bệnh nhân:"
              request={async () => {
                const { data } = await request.get("/patient");
                setUsers(data?.data);
                const result = data?.data.map((i) => ({
                  value: i?.id,
                  label: `BN_${i?.id}`,
                }));
                return result;
              }}
              onChange={(value) => handleChange(value)}
              readonly={!isEditing}
            />
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={10}>
            <ProFormText
              placeholder={"Họ tên"}
              name="patient_name"
              label="Họ tên:"
              readonly={!isEditing}
            />
          </Col>
          <Col span={6}>
            <ProFormSelect
              placeholder={"Giới tính"}
              name="patient_gender"
              label="Giới tính:"
              options={[
                { label: "Nam", value: true },
                { label: "Nữ", value: false },
                { label: "Khác", value: "" },
              ]}
              readonly={!isEditing}
            />
          </Col>
          <Col span={8}>
            <ProFormDatePicker
              placeholder={"patient_birthday"}
              name="patient_birthday"
              label="Ngày sinh:"
              readonly={!isEditing}
              fieldProps={{
                format: "DD/MM/YYYY",
              }}
            />
          </Col>
          <Col span={12}>
            <ProFormText
              placeholder={"Mã số bảo hiểm y tế"}
              name="patient_insurance_number"
              label="Mã số bảo hiểm y tế:"
              readonly={!isEditing}
            />
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <ProFormText
              placeholder={"Địa chỉ"}
              name="patient_address"
              label="Địa chỉ:"
              readonly={!isEditing}
            />
          </Col>
        </Row>

        {/* 2. Thông tin bệnh án */}
        <Title level={4}>2. Thông tin bệnh án</Title>
        <Row gutter={16}>
          <Col span={24}>
            <ProFormText
              placeholder={"Bệnh chẩn đoán"}
              name="diagnosedDisease"
              label="Bệnh chẩn đoán:"
              readonly={!isEditing}
            />
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <ProFormTextArea
              placeholder={"Triệu chứng"}
              name="symptoms"
              label="Triệu chứng:"
              readonly={!isEditing}
            />
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <ProFormText
              placeholder={"Tiền sử bệnh"}
              name="medicalHistory"
              label="Tiền sử bệnh:"
              readonly={!isEditing}
            />
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <ProFormTextArea
              placeholder={"Kết quả điều trị"}
              name="treatmentResult"
              label="Kết quả điều trị:"
              readonly={!isEditing}
            />
          </Col>
        </Row>

        {/* 3. Lịch sử khám chữa bệnh */}
        <Title level={4}>3. Lịch sử khám chữa bệnh</Title>
        <Row gutter={16}>
          <Col span={8}>
            <ProFormDatePicker
              placeholder={"Ngày nhập viện"}
              name="admissionDate"
              label="Ngày nhập viện:"
              readonly={!isEditing}
            />
          </Col>
          <Col span={8}>
            <ProFormDatePicker
              placeholder={"Ngày xuất viện"}
              name="dischargeDate"
              label="Ngày xuất viện:"
              readonly={!isEditing}
            />
          </Col>
          <Col span={8}>
            <ProFormSelect
              placeholder={"Bác sĩ phụ trách"}
              name="staff_id"
              label="Bác sĩ phụ trách:"
              request={async () => {
                const { data } = await request.get("/staff");
                const result = data?.data.map((i) => ({
                  value: i?.id,
                  label: i?.name,
                }));
                return result;
              }}
              readonly={!isEditing}
            />
          </Col>
        </Row>

        {/* Nút hành động */}
        {isEdit && (
          <Space style={{ marginTop: "20px" }}>
            {!isEditing ? (
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={handleEditToggle}
              >
                Chỉnh sửa
              </Button>
            ) : (
              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={handleSave}
              >
                Lưu thay đổi
              </Button>
            )}
            {isEditing && <Button onClick={handleEditToggle}>Hủy</Button>}
          </Space>
        )}
        <div className="text-center mt-10">
          {create && (
            <Button type="primary" onClick={handleSubmit}>
              Tạo hồ sơ
            </Button>
          )}
        </div>
      </ProForm>
    </ProCard>
  );
};

export default MedicalRecordForm;
