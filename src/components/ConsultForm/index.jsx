import React, { useEffect, useState } from "react";
import {
  ProForm,
  ProFormText,
  ProFormCheckbox,
  ProFormDatePicker,
  ProFormSelect,
  ProFormTextArea,
  ProFormRadio,
  ProFormFieldSet,
  ProFormTimePicker,
  ProFormDateTimePicker,
} from "@ant-design/pro-components";
import { Row, Col, Skeleton } from "antd";
import request from "../../configs/axiosConfig";

const ConsultForm = ({ form, record }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    console.log("Submitted values:", values);
  };

  useEffect(() => {
    setLoading(true);
    const selectedUser = users.find((user) => user.id === record?.patient_id);
    if (selectedUser) {
      const transformedObject = Object.keys(selectedUser).reduce((acc, key) => {
        const newKey = `patient_${key}`;
        acc[newKey] = selectedUser[key];
        return acc;
      }, {});

      form.setFieldsValue({ ...transformedObject, ...record });
      setLoading(false);
    }
  }, [form, users]);

  return (
    <div
      style={{
        maxWidth: 1000,
        margin: "0 auto",
        padding: "20px",
        background: "#fff",
        borderRadius: 8,
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
      }}
    >
      {loading ? (
        <Skeleton />
      ) : (
        <>
          <Row gutter={16}>
            <Col span={6}>
              <ProFormText
                name="code"
                label="Mã cơ sở y tế"
                placeholder="Mã cơ sở y tế"
                rules={[
                  { required: true, message: "Vui lòng nhập mã cơ sở y tế" },
                ]}
                fieldProps={{
                  defaultValue: "HH_8386",
                }}
              />
            </Col>
          </Row>

          <h2
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              marginBottom: "16px",
            }}
          >
            Thông tin hành chính
          </h2>

          <Row gutter={16}>
            <Col span={12}>
              <ProFormSelect
                name="patient_id"
                label="Họ tên người bệnh"
                placeholder="Nhập họ tên"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập họ tên người bệnh",
                  },
                ]}
                request={async () => {
                  const { data } = await request.get("/patient");
                  setUsers(data?.data);
                  const result = data?.data.map((i) => {
                    return {
                      value: i?.id,
                      label: i?.name,
                    };
                  });

                  return result;
                }}
                onChange={(value) => console.log(value)}
              />
            </Col>
            <Col span={12}>
              <ProFormText
                name="patient_insurance_number"
                label="Số thẻ BHYT/Mã định danh y tế"
                placeholder="Nhập số thẻ BHYT"
              />
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <ProFormText
                name="initialRegistration"
                label="Nơi đăng ký KCB ban đầu"
                placeholder="Nhập nơi đăng ký"
              />
            </Col>
            <Col span={12}>
              <ProFormCheckbox.Group
                name="purpose"
                label="Mục đích hẹn"
                options={[
                  { label: "Khám tại nhà", value: "home" },
                  { label: "Khám tại TYT", value: "tyt" },
                  { label: "Đăng ký hộ", value: "proxy" },
                ]}
              />
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <ProFormText
                name="bookerName"
                label="Người đặt hẹn hộ"
                placeholder="Nhập tên người đặt hẹn hộ"
              />
            </Col>
            <Col span={12}>
              <ProFormText
                name="bookerId"
                label="Mã định danh người đặt hẹn"
                placeholder="Nhập mã định danh"
              />
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <ProFormText
                name="patient_email"
                label="Email"
                placeholder="Nhập email"
              />
            </Col>
            <Col span={12}>
              <ProFormText
                name="patient_phone_number"
                label="Số điện thoại"
                placeholder="Nhập số điện thoại"
              />
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={6}>
              <ProFormSelect
                name="patient_gender"
                label="Giới tính"
                placeholder="Giới tính"
                options={[
                  { label: "Nam", value: true },
                  { label: "Nữ", value: false },
                  { label: "Khác", value: null },
                ]}
              />
            </Col>
            <Col span={6}>
              <ProFormDatePicker
                name="birthDate"
                label="Ngày sinh"
                placeholder="Chọn ngày sinh"
                fieldProps={{
                  format: "DD/MM/YYYY",
                }}
              />
            </Col>
            <Col span={6}>
              <ProFormText
                name="ethnicity"
                label="Dân tộc"
                placeholder="Nhập dân tộc"
              />
            </Col>
            <Col span={6}>
              <ProFormText
                name="occupation"
                label="Nghề nghiệp"
                placeholder="Nhập nghề nghiệp"
              />
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <ProFormText
                name="currentProvince"
                label="Tỉnh"
                placeholder="Nhập tỉnh"
              />
            </Col>
            <Col span={8}>
              <ProFormText
                name="currentDistrict"
                label="Huyện"
                placeholder="Nhập huyện"
              />
            </Col>
            <Col span={8}>
              <ProFormText
                name="currentCommune"
                label="Xã"
                placeholder="Nhập xã"
              />
            </Col>
          </Row>

          <ProFormTextArea
            name="patient_address"
            label="Địa chỉ (số nhà, đường phố, v.v...)"
            placeholder="Nhập địa chỉ cụ thể"
          />

          {/* Phản hồi bệnh */}
          <h2
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              marginTop: "24px",
              marginBottom: "16px",
            }}
          >
            Phản hồi bệnh/thông tin người bệnh tự khai
          </h2>

          <Row gutter={16}>
            <Col span={12}>
              <ProFormText
                name="mainDisease"
                label="Mã bệnh chính"
                placeholder="Nhập mã bệnh chính"
              />
            </Col>
            <Col span={12}>
              <ProFormText
                name="additionalDisease"
                label="Mã bệnh kèm theo"
                placeholder="Nhập mã bệnh kèm theo"
              />
            </Col>
          </Row>

          <ProFormCheckbox.Group
            name="healthStatus"
            label="Tình trạng sức khỏe"
            options={[
              { label: "Không có dấu hiệu bất thường", value: "normal" },
              { label: "Sốt cao trên 38 độ", value: "fever" },
              { label: "Đau ngực khó thở", value: "chestPain" },
              { label: "Ho khan", value: "dryCough" },
            ]}
          />
          <label className="font-medium">Chỉ số sức khỏe</label>
          <Row gutter={16}>
            <Col span={12}>
              <ProFormText
                name="height"
                fieldProps={{ placeholder: "Chiều cao (cm)" }}
              />
              <ProFormText
                name="weight"
                fieldProps={{ placeholder: "Cân nặng (kg)" }}
              />
            </Col>
            <Col span={12}>
              <ProFormText
                name="heartRate"
                fieldProps={{ placeholder: "Mạch (lần/phút)" }}
              />
              <ProFormText
                name="bloodPressure"
                fieldProps={{ placeholder: "Huyết áp (mmHg)" }}
              />
            </Col>
          </Row>
          <ProFormCheckbox.Group
            name="consent"
            label="Tuyên bố đồng ý tham gia tư vấn khám chữa bệnh từ xa"
            placeholder="Tuyên bố đồng ý tham gia tư vấn khám chữa bệnh từ xa"
            options={[
              {
                label: "Tôi đã đọc, hiểu rõ, và đồng ý với những quy định...",
                value: "agree1",
              },
              {
                label: "Tôi đồng ý tham gia tư vấn khám chữa bệnh từ xa.",
                value: "agree2",
              },
            ]}
          />

          {/* Thông tin về cuộc hẹn */}
          <h2
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              marginTop: "24px",
              marginBottom: "16px",
            }}
          >
            Thông tin về cuộc hẹn
          </h2>
          <Row gutter={16}>
            <Col span={12}>
              <ProFormDatePicker
                name="appointmentDate"
                label="Ngày hẹn"
                placeholder="Ngày hẹn"
              />

              <ProFormDatePicker
                name="revisitDate"
                label="Ngày hẹn tái khám"
                placeholder="Ngày hẹn tái khám"
              />
            </Col>
            <Col span={12}>
              <ProFormTimePicker
                name="appointmentTime"
                label="Giờ hẹn"
                placeholder="Giờ hẹn"
              />
              <ProFormTimePicker
                name="revisitTime"
                label="Giờ hẹn tái khám"
                placeholder="Giờ hẹn tái khám"
              />
            </Col>
          </Row>

          {/* Phần ghi chép/ xử lý của TYT */}
          <h2
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              marginTop: "24px",
              marginBottom: "16px",
            }}
          >
            Phần ghi chép/ Xử lý của TYT
          </h2>
          <ProFormSelect
            name="staff_id"
            label="Họ tên bác sĩ tiếp nhận và xử lý"
            placeholder="Họ tên bác sĩ tiếp nhận và xử lý"
            rules={[{ required: true, message: "Vui lòng nhập họ tên bác sĩ" }]}
            request={async () => {
              const { data } = await request.get("/staff");
              const result = data?.data.map((i) => ({
                value: i?.id,
                label: i?.name,
              }));
              return result;
            }}
          />
          <ProFormCheckbox.Group
            name="handling"
            label="Xử lý"
            placeholder="Xử lý"
            options={[
              { label: "Hẹn mới", value: "newAppointment" },
              { label: "Chờ khám", value: "waiting" },
              { label: "Hủy", value: "cancel" },
              {
                label: "Đã xác minh/cập nhật thông tin hành chính",
                value: "verified",
              },
            ]}
          />

          {/* Tiền sử bệnh */}
          <h2
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              marginTop: "24px",
              marginBottom: "16px",
            }}
          >
            Tiền sử bệnh
          </h2>
          <Row gutter={16}>
            <Col span={12}>
              <ProFormText
                name="pulse"
                label="Mạch (lần/phút)"
                placeholder="Mạch (lần/phút)"
              />
              <ProFormText
                name="temperature"
                label="Nhiệt độ (°C)"
                placeholder="Nhiệt độ (°C)"
              />
            </Col>
            <Col span={12}>
              <ProFormText
                name="bloodPressure"
                label="Huyết áp (mmHg)"
                placeholder="Huyết áp (mmHg)"
              />
              <ProFormText
                name="breathingRate"
                label="Nhịp thở (lần/phút)"
                placeholder="Nhịp thở (lần/phút)"
              />
            </Col>
          </Row>

          <ProFormTextArea
            name="symptoms"
            label="Triệu chứng"
            placeholder="Triệu chứng"
          />

          {/* Chẩn đoán */}
          <h2
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              marginTop: "24px",
              marginBottom: "16px",
            }}
          >
            Chẩn đoán
          </h2>
          <ProFormText
            name="diagnosisCode"
            label="Mã chẩn đoán (ICD10)"
            placeholder="Mã chẩn đoán (ICD10)"
          />
          <Row gutter={16}>
            <Col span={12}>
              <ProFormText
                name="mainDiagnosis"
                label="Bệnh chính"
                placeholder="Bệnh chính"
              />
            </Col>
            <Col span={12}>
              <ProFormText
                name="subDiagnosis"
                label="Bệnh kèm theo"
                placeholder="Bệnh kèm theo"
              />
            </Col>
          </Row>

          <ProFormCheckbox
            name="healthProgram"
            label="Là đối tượng quản lý thuộc chương trình y tế"
          />

          {/* Phương pháp điều trị */}
          <h2
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              marginTop: "24px",
              marginBottom: "16px",
            }}
          >
            Phương pháp điều trị
          </h2>
          <ProFormCheckbox.Group
            name="treatmentPlan"
            label="Phân loại hướng xử lý"
            placeholder="Phân loại hướng xử lý"
            options={[
              { label: "Chuyển tuyến trên", value: "higherLevel" },
              { label: "Tư vấn KCB từ xa", value: "remoteConsultation" },
              { label: "Điều trị tại nhà/TYT", value: "homeTreatment" },
            ]}
          />

          {/* Tư vấn và lịch hẹn tiếp theo */}
          <h2
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              marginTop: "24px",
              marginBottom: "16px",
            }}
          >
            Nội dung tư vấn, khuyến cáo cho người bệnh
          </h2>
          <ProFormTextArea
            name="consultationContent"
            label="Tư vấn sức khỏe"
            placeholder="Tư vấn sức khỏe"
          />
          <Row gutter={16}>
            <Col span={12}>
              <ProFormDatePicker
                name="nextAppointmentDate"
                label="Ngày hẹn tiếp theo"
                placeholder="Ngày hẹn tiếp theo"
              />
            </Col>
            <Col span={12}>
              <ProFormTimePicker
                name="nextAppointmentTime"
                label="Giờ hẹn tiếp theo"
                placeholder="Giờ hẹn tiếp theo"
              />
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <ProFormDateTimePicker
                name="appointmentCompletedDateTime"
                label="Ngày giờ hoàn thành khám"
                placeholder="Ngày giờ hoàn thành khám"
              />
            </Col>
            <Col span={12}>
              <ProFormCheckbox name="completed" label="Đã hoàn thành" />
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default ConsultForm;
