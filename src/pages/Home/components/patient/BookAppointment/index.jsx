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
  const [staffs, setStaffs] = useState([]);

  // Cấu hình locale Tiếng Việt cho moment
  moment.locale("vi"); // Cập nhật lại locale cho moment

  const onFinish = (values) => {
    setLoading(true);

    // Xử lý dữ liệu, chuyển đổi thời gian hẹn sang timestamp (PostgreSQL)
    const appointmentTime = moment(values.appointment).format(
      "YYYY-MM-DD HH:mm:ss"
    );

    // Giả sử gửi dữ liệu lên server (api)
    setTimeout(() => {
      setLoading(false);
      message.success(`Đặt lịch hẹn thành công với bác sĩ ${values.doctor}!`);
      form.resetFields();
    }, 1000);
  };

  return (
    <ConfigProvider locale={viVN}>
      <>
        <Form.Item
          label="Thời gian hẹn"
          name="scheduled_time"
          rules={[{ required: true, message: "Vui lòng chọn thời gian!" }]}
        >
          <DatePicker
            showTime
            format="HH:mm DD/MM/YYYY"
            placeholder="Chọn ngày và giờ"
            style={{ width: "100%" }}
            disabledDate={(current) =>
              current && current < moment().startOf("day")
            }
          />
        </Form.Item>

        <Form.Item
          label="Chọn khoa"
          name="department_id"
          rules={[
            { required: true, message: "Vui lòng chọn khoa bạn muốn khám!" },
          ]}
        >
          <ProFormSelect
            request={async () => {
              const data = await request.get("/department");
              const result = Array.isArray(data.data?.data)
                ? data.data.data.map((i) => ({
                    value: i?.id,
                    label: i?.name,
                  }))
                : [];
              return result;
            }}
            name="department_id"
            placeholder="Khoa"
            onChange={async (value) => {
              const staffArr = await request.get(`/staff/department/${value}`);
              const newStaffArr = Array.isArray(staffArr.data)
                ? staffArr.data.map((item) => ({
                    value: item?.id,
                    label: item?.name,
                  }))
                : [];
              setStaffs(newStaffArr);
            }}
          />
        </Form.Item>
        <Form.Item
          label="Bác sĩ"
          name="staff_id"
          rules={[{ required: true, message: "Vui lòng chọn bác sĩ!" }]}
        >
          <ProFormSelect
            placeholder="Chọn bác sĩ"
            options={staffs}
            loading={true}
          />
        </Form.Item>
      </>
    </ConfigProvider>
  );
};

export default BookAppointment;
