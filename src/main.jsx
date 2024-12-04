import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home/index.jsx";
import Login from "./pages/Login/index.jsx";
import SignUp from "./pages/SingUp/index.jsx";
import { RecoilRoot } from "recoil";
import RoleManagement from "./pages/Home/components/RoleManagement/index.jsx";
import AccountManagement from "./pages/Home/components/AccountManagement/index.jsx";
import BookAppointment from "./pages/Home/components/patient/BookAppointment/index.jsx";
import AppointmentManagement from "./pages/Home/components/patient/AppointmentManagement/index.jsx";
import StaffAppointmentManagement from "./pages/Home/components/staff/AppointmentManagement/index.jsx";
import StaffMedicalRecordManagement from "./pages/Home/components/staff/MedicalRecordManagement/index.jsx";
import StaffProfile from "./pages/MyProFfile/staff/index.jsx";
import ChangePassword from "./pages/MyProFfile/ChangePassword/index.jsx";
import PatientProfile from "./pages/MyProFfile/patient/index.jsx";
import MyProfile from "./pages/MyProFfile/index.jsx";
import VideoCall from "./pages/VideoCall/index.jsx";
import { StringeeProvider } from "./stringeeContext.jsx";
import { ConfigProvider } from "antd";
import viVN from "antd/es/locale/vi_VN";
import MedicalRecordForm from "./components/MedicalRecordForm/index.jsx";
import PatientMedicalRecordManagement from "./pages/Home/components/patient/MedicalRecordManagement/index.jsx";
import PatientConsultFormManagement from "./pages/Home/components/patient/ConsultFormManagement/index.jsx";
import StaffConsultFormManagement from "./pages/Home/components/staff/FormsManagement/index.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/home",
    element: <Home />,
    children: [
      {
        path: "/home/account-management",
        element: <AccountManagement />,
      },
      {
        path: "/home/role-management",
        element: <RoleManagement />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/sign-up",
    element: <SignUp />,
  },
  {
    path: "/home/p",
    element: <Home />,
    children: [
      {
        path: "/home/p/appointment",
        element: <AppointmentManagement />,
      },
      {
        path: "/home/p/medical-record",
        element: <PatientMedicalRecordManagement />,
      },
      {
        path: "/home/p/forms",
        element: <PatientConsultFormManagement />,
      },
    ],
  },
  {
    path: "/home/s",
    element: <Home />,
    children: [
      {
        path: "/home/s/appointment",
        element: <StaffAppointmentManagement />,
      },
      {
        path: "/home/s/medical-record",
        element: <StaffMedicalRecordManagement />,
      },
      {
        path: "/home/s/forms",
        element: <StaffMedicalRecordManagement />,
      },
    ],
  },
  {
    path: "/my-profile/s",
    element: <MyProfile />,
    children: [
      {
        path: "/my-profile/s/profile",
        element: <StaffProfile />,
      },
      {
        path: "/my-profile/s/change-password",
        element: <ChangePassword />,
      },
    ],
  },
  {
    path: "/my-profile",
    element: <MyProfile />,
  },
  {
    path: "/home/p/video-call",
    element: <VideoCall />,
  },
  {
    path: "/video-call",
    element: <VideoCall />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RecoilRoot>
      <StringeeProvider>
        <RouterProvider router={router}>
          <ConfigProvider locale={viVN}>
            <App />
          </ConfigProvider>
        </RouterProvider>
      </StringeeProvider>
    </RecoilRoot>
  </StrictMode>
);
