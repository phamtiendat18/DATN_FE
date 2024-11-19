import axios from "axios";

// Tạo một instance của axios
const request = axios.create({
  baseURL: "https://datn-u1l6.onrender.com", // Thay bằng URL API của bạn
  headers: {
    "Content-Type": "application/json",
  },
});

// Thêm interceptor cho request để tự động thêm token
request.interceptors.request.use(
  (config) => {
    // Lấy token từ localStorage
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Tự động thêm token vào header
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Thêm interceptor cho response để xử lý lỗi chung
request.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Log dữ liệu lỗi chi tiết
      console.error("Error Response:", error.response.data);
      console.error("Status:", error.response.status);

      if (error.response.status === 401) {
        console.log("Unauthorized - redirect to login page or refresh token");
      }
    } else {
      console.error("Network Error", error.message);
    }
    return Promise.reject(error);
  }
);

export default request;
