import {
  database,
  ref,
  push,
  serverTimestamp,
  set,
} from "../configs/firebaseConfig";

const sendMessages = (senderId, receiverId, appointment_id, messageContent) => {
  if (!senderId || !receiverId || !messageContent) {
    console.error(
      "Missing required fields: sender, receiver, or message content."
    );
    return;
  }

  const conversationId = `${senderId}_${receiverId}_${appointment_id}`;
  const messagesRef = ref(database, "messages/" + conversationId);
  const newMessageRef = push(messagesRef);

  set(newMessageRef, {
    sender: senderId,
    receiver: receiverId,
    content: messageContent,
    timestamp: serverTimestamp(),
  })
    .then(() => {
      console.log("Message sent successfully");
    })
    .catch((error) => {
      console.error("Error sending message: ", error);
    });
};

export { sendMessages };
