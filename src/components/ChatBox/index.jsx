import React, { useState, useEffect } from "react";
import { ref, onValue, push, set, serverTimestamp } from "firebase/database";
import { database } from "../../configs/firebaseConfig";
import { Button, Input } from "antd";

const ChatBox = ({ senderId, receiverId, appointmentId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // Lấy lịch sử tin nhắn khi component được mount
  useEffect(() => {
    const conversationId = `MSG_${appointmentId}`;
    console.log(conversationId);

    const messagesRef = ref(database, "messages/" + conversationId);

    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const messagesData = snapshot.val();
      console.log(messagesData);

      if (messagesData) {
        const messageList = Object.values(messagesData).map((msg) => ({
          sender: msg.sender,
          receiver: msg.receiver,
          content: msg.content,
          timestamp: msg.timestamp,
        }));

        setMessages(messageList); // Cập nhật trạng thái tin nhắn
      }
    });

    // Cleanup listener khi component unmount
    return () => unsubscribe();
  }, [senderId, receiverId, appointmentId]);

  // Hàm gửi tin nhắn mới
  const sendMessage = () => {
    if (newMessage.trim() === "") return; // Kiểm tra nếu tin nhắn trống
    const conversationId = `MSG_${appointmentId}`;
    const messagesRef = ref(database, "messages/" + conversationId);
    const newMessageRef = push(messagesRef);

    set(newMessageRef, {
      sender: senderId,
      receiver: receiverId,
      content: newMessage,
      timestamp: serverTimestamp(),
    })
      .then(() => {
        console.log("Message sent successfully");
        setNewMessage(""); // Reset ô nhập sau khi gửi tin nhắn
      })
      .catch((error) => {
        console.error("Error sending message: ", error);
      });
  };

  return (
    <div>
      <div className="chat-box py-[20px]">
        {/* Hiển thị danh sách tin nhắn */}
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.sender === senderId && "text-right"}`}
          >
            <span>{msg.sender === senderId ? "Bạn" : "Người nhận"}:</span>
            <div
              className={`flex ${msg.sender === senderId ? "justify-end" : ""}`}
            >
              <p
                className={`max-w-[50%] border rounded-[99px] p-[10px] ${
                  msg.sender === senderId ? "bg-sky-400" : "bg-slate-300"
                }  w-fit`}
              >
                {msg.content}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="send-message flex">
        {/* Ô nhập tin nhắn */}
        <Input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Gửi tin nhắn..."
        />
        <Button color="primary" variant="solid" onClick={sendMessage}>
          Gửi
        </Button>
      </div>
    </div>
  );
};

export default ChatBox;
