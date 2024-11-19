import { io } from "socket.io-client";

// Khởi tạo kết nối Socket.IO
const socket = io("https://datn-u1l6.onrender.com", {
  withCredentials: true,
});

// Lắng nghe sự kiện khi kết nối
socket.on("connection", () => {
  console.log("Connected to server:", socket.id);
});

socket.on("disconnection", () => {
  console.log("Connected to server:", socket.id);
});

// Lắng nghe lỗi kết nối
socket.on("connect_error", (err) => {
  console.error("Socket connection error:", err.message);
});

export default socket;
