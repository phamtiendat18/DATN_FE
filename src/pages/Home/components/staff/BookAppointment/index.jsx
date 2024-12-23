import React, { useState } from "react";
import { Button, Form, Input, message, Select, ConfigProvider } from "antd";
import { ProFormSelect } from "@ant-design/pro-components";
import { DatePicker } from "antd";
import moment from "moment";
import "moment/locale/vi"; // Import locale Tiếng Việt cho moment
import viVN from "antd/es/locale/vi_VN"; // Import locale Tiếng Việt của Ant Design
import request from "../../../../../configs/axiosConfig";

// Giả lập danh sách bác sĩ
const doctors = [
  { id: 1, name: "Dr. John Doe" },
  { id: 2, name: "Dr. Jane Smith" },
  { id: 3, name: "Dr. Emily Davis" },
];

const BookAppointment = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Cấu hình locale Tiếng Việt cho moment
  moment.locale("vi"); // Cập nhật lại locale cho moment

  return (
    <ConfigProvider locale={viVN}>
      {" "}
      <>
        <Form.Item
          label="Thời gian hẹn"
          name="scheduled_time"
          rules={[{ required: true, message: "Vui lòng chọn thời gian!" }]}
        >
          <DatePicker
            showTime
            format="YYYY-MM-DD HH:mm"
            placeholder="Chọn ngày và giờ"
            style={{ width: "100%" }}
            disabledDate={(current) =>
              current && current < moment().startOf("day")
            }
          />
        </Form.Item>

        <Form.Item
          label="Bệnh nhân"
          name="patient_id"
          rules={[{ required: true, message: "Vui lòng chọn bệnh nhân!" }]}
        >
          <ProFormSelect
            placeholder="Chọn bệnh nhân"
            request={async () => {
              const data = await request.get("/patient");
              const result = data?.data?.data.map((i) => ({
                value: i?.id,
                label: i?.name,
              }));
              return result;
            }}
          />
        </Form.Item>
        <Form.Item
          label="Loại lịch"
          name="type_id"
          rules={[{ required: true, message: "Vui lòng chọn bệnh nhân!" }]}
        >
          <ProFormSelect
            placeholder="Chọn loại lịch"
            request={async () => {
              const data = await request.get("/type-appointment");
              const result = data?.data?.data.map((i) => ({
                value: i?.id,
                label: i?.name,
              }));
              return result;
            }}
          />
        </Form.Item>
      </>
    </ConfigProvider>
  );
};

export default BookAppointment;
