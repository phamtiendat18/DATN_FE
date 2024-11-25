import { ref, set, push, onValue } from "firebase/database";
import { database } from "../configs/firebaseConfig";

// Hàm gửi tin nhắn
export function sendMessage(senderId, receiverId, message) {
  const messagesRef = ref(database, "messages");
  const newMessageRef = push(messagesRef);

  set(newMessageRef, {
    senderId: senderId,
    receiverId: receiverId,
    message: message,
    timestamp: new Date().toISOString(),
  })
    .then(() => {
      console.log("Message sent!");
    })
    .catch((error) => {
      console.error("Error sending message: ", error);
    });
}

// Hàm lắng nghe tin nhắn mới
export function listenForMessages(userId, receiverId, callback) {
  const messagesRef = ref(database, "messages");

  const unsubscribe = onValue(messagesRef, (snapshot) => {
    const data = snapshot.val();
    const newMessages = [];
    if (data) {
      Object.keys(data).forEach((messageId) => {
        const message = data[messageId];
        if (
          (message.senderId === userId && message.receiverId === receiverId) ||
          (message.senderId === receiverId && message.receiverId === userId)
        ) {
          newMessages.push(message);
        }
      });
    }
    callback(newMessages);
  });

  return unsubscribe; // Trả về hàm dọn dẹp
}
