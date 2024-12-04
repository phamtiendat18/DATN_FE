import { LockOutlined, UserOutlined } from "@ant-design/icons";
import {
  LoginFormPage,
  ProConfigProvider,
  ProFormCheckbox,
  ProFormSelect,
  ProFormText,
} from "@ant-design/pro-components";
import { Form, notification, Tabs, theme } from "antd";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useSetRecoilState } from "recoil";
import bg from "../../assets/images/bg-teleheal.png";
import logo from "../../assets/images/logo-teleheal.png";
import userAtom from "../../atoms/user";
import request from "../../configs/axiosConfig";
import "../Login/style.css";
export default () => {
  const { token } = theme.useToken();
  const [tab, setTab] = useState("login");
  const [, setUserinfo] = useRecoilState(userAtom);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const handleSubmit = useCallback(
    async (values) => {
      const { autoLogin, rePassword, ...bodyData } = values;

      const response =
        tab === "login"
          ? await request.post("/auth/login", bodyData)
          : await request.post("/auth/register", bodyData);
      if (response.data?.status === 400 || response.data?.status === 401) {
        return notification.error({
          message: response.data?.message,
        });
      } else {
        notification.success({ message: response.data?.message });
      }
      autoLogin
        ? localStorage.setItem("token", response?.data?.token)
        : sessionStorage.setItem("token", response?.data?.token);
      localStorage.setItem("role", response?.data?.data?.role?.name);
      localStorage.setItem(
        "id",
        response.data?.data?.patient?.id || response.data?.data?.staff?.id
      );
      localStorage.setItem("username", response.data?.data?.username);
      localStorage.setItem(
        "name",
        response.data?.data?.patient?.name || response.data?.data?.staff?.name
      );
      localStorage.setItem("user_id", response.data?.data?.id);
      localStorage.setItem("access_token", response.data?.accessToken);

      setUserinfo(response?.data?.data);
      if (tab === "login") {
        navigate("/home");
      } else {
        setTab("login");
      }
    },
    [tab]
  );

  return (
    <ProConfigProvider hashed={false}>
      <div style={{ backgroundColor: token.colorBgContainer }}>
        <LoginFormPage
          logo={logo}
          subTitle="Phầm mềm tư vấn sức khỏe của bệnh viện Hưng Hà"
          backgroundImageUrl={bg}
          submitter={{
            searchConfig: {
              submitText: tab === "login" ? "Đăng nhập" : "Đăng ký",
            },
          }}
          form={form}
          onFinish={handleSubmit}
        >
          <Tabs
            centered
            activeKey={tab}
            onChange={(activeKey) => {
              setTab(activeKey);
            }}
          >
            <Tabs.TabPane key={"login"} tab={"Đăng nhập"} />
            <Tabs.TabPane key={"signup"} tab={"Đăng ký"} />
          </Tabs>
          {tab === "login" && (
            <>
              <ProFormText
                name="username"
                fieldProps={{
                  size: "large",
                  prefix: <UserOutlined className={"prefixIcon"} />,
                }}
                placeholder={"Tên tài khoản"}
                rules={[
                  {
                    required: true,
                    message: "Bạn chưa nhập tên tài khoản",
                  },
                ]}
              />
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: "large",
                  prefix: <LockOutlined className={"prefixIcon"} />,
                }}
                placeholder={"Mật khẩu"}
                rules={[
                  {
                    required: true,
                    message: "Bạn chưa nhập mật khẩu!",
                  },
                ]}
              />
              <div
                style={{
                  marginBlockEnd: 24,
                }}
              >
                <ProFormCheckbox noStyle name="autoLogin">
                  Nhớ mật khẩu
                </ProFormCheckbox>
                <a
                  style={{
                    float: "right",
                  }}
                >
                  Quên mật khẩu
                </a>
              </div>
            </>
          )}
          {tab === "signup" && (
            <>
              <ProFormText
                name="username"
                fieldProps={{
                  size: "large",
                  prefix: <UserOutlined className={"prefixIcon"} />,
                }}
                placeholder={"Tên tài khoản"}
                rules={[
                  {
                    required: true,
                    message: "Bạn chưa nhập tên tài khoản",
                  },
                ]}
              />
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: "large",
                  prefix: <LockOutlined className={"prefixIcon"} />,
                  strengthText:
                    "Mật khẩu nên có ít nhất chữ viết hoa, một chữ số, một ký tự đặc biệt và độ dài mật khẩu tối thiểu 8 ký tự ",
                  statusRender: (value) => {
                    const getStatus = () => {
                      if (value && value.length > 12) {
                        return "ok";
                      }
                      if (value && value.length > 6) {
                        return "pass";
                      }
                      return "poor";
                    };
                    const status = getStatus();
                    if (status === "pass") {
                      return (
                        <div style={{ color: token.colorWarning }}>
                          Mực độ: Trung bình
                        </div>
                      );
                    }
                    if (status === "ok") {
                      return (
                        <div style={{ color: token.colorSuccess }}>
                          Mực độ: Mạnh
                        </div>
                      );
                    }
                    return (
                      <div style={{ color: token.colorError }}>Mực độ: Yếu</div>
                    );
                  },
                }}
                placeholder={"Mật khẩu"}
                rules={[
                  {
                    required: true,
                    message: "Bạn chưa nhập mật khẩu！",
                  },
                ]}
              />
              <ProFormText.Password
                name="rePassword"
                fieldProps={{
                  size: "large",
                  prefix: <LockOutlined className={"prefixIcon"} />,
                  strengthText:
                    "Mật khẩu nên có ít nhất chữ viết hoa, một chữ số, một ký tự đặc biệt và độ dài mật khẩu tối thiểu 8 ký tự ",
                  statusRender: (value) => {
                    const getStatus = () => {
                      if (value && value.length > 12) {
                        return "ok";
                      }
                      if (value && value.length > 6) {
                        return "pass";
                      }
                      return "poor";
                    };
                    const status = getStatus();
                    if (status === "pass") {
                      return (
                        <div style={{ color: token.colorWarning }}>
                          Mực độ: Trung bình
                        </div>
                      );
                    }
                    if (status === "ok") {
                      return (
                        <div style={{ color: token.colorSuccess }}>
                          Mực độ: Mạnh
                        </div>
                      );
                    }
                    return (
                      <div style={{ color: token.colorError }}>Mực độ: Yếu</div>
                    );
                  },
                }}
                placeholder={"Mật khẩu"}
                rules={[
                  {
                    required: true,
                    message: "Bạn chưa nhập lại mật khẩu！",
                  },
                  {
                    validator: (_, value) => {
                      if (value !== form.getFieldValue("password")) {
                        return Promise.reject(
                          "Nhập lại mật khẩu chưa chính xác"
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              />
              <ProFormSelect
                name="role_id"
                rules={[{ required: true, message: "Vui lòng chọn vai trò!" }]}
                request={async () => {
                  const data = await request.get("/role");
                  const result = data?.data?.data.map((i) => ({
                    value: i?.id,
                    label: i?.name,
                  }));
                  return result;
                }}
                placeholder="Vai trò"
              />
            </>
          )}
        </LoginFormPage>
      </div>
    </ProConfigProvider>
  );
};
