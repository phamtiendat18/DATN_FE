import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  StringeeClient,
  StringeeCall2,
  StringeeCall,
  StringeeChat,
  StringeeChat2,
} from "stringee";

// Tạo Context
export const StringeeContext = createContext();

export const StringeeProvider = ({ children }) => {
  const [hasIncomingCall, setHasIncomingCall] = useState(false);
  const [streamLocal, setStreamLocal] = useState();
  const [streamRemote, setStreamRemote] = useState();
  const [isCalling, setIsCalling] = useState();
  const [isVideoCall, setIsVideoCall] = useState(false);
  const [call, setCall] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isEnd, setIsEnd] = useState(false);

  const client = new StringeeClient();
  const chat = new StringeeChat(client);

  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState("");
  const userId = localStorage.getItem("user_id");

  const createConversation = async (user_1, user_2) => {
    if (!chat) return;

    const participants = [
      { userId: call?.fromNumber },
      { userId: call?.toNumber },
    ];
    console.log(participants);

    chat.createConversation(
      { name: call?.callId, participants, isDistinct: true },
      (status, code, message, conversation) => {
        console.log(status);

        if (status === 0) {
          console.log("Conversation created:", conversation);
          setCurrentConversationId(conversation.id);
        } else {
          console.error("Failed to create conversation:", message);
        }
      }
    );
  };

  const sendMessage = (newMessage) => {
    if (!newMessage || !currentConversationId || !chat) return;

    const chatMessage = {
      conversationId: currentConversationId,
      message: {
        type: 1, // 1 = text
        content: newMessage,
      },
    };

    chat.sendMessage(chatMessage, (status, code, messageId) => {
      if (status === 0) {
        setMessages((prev) => [
          ...prev,
          { id: messageId, text: newMessage, sender: userId },
        ]);
        setInput("");
      } else {
        console.error("Failed to send message:", code);
      }
    });
  };

  const settingCallEvent = (call1) => {
    call1.on("addremotestream", (stream) => {
      setStreamRemote(stream);
      console.log("remote stream:", stream);
    });

    call1.on("addlocalstream", (stream) => {
      setStreamLocal(stream);
      console.log("local stream:", stream);
    });
    call1.on("addlocaltrack", (localtrack1) => {
      console.log("addlocaltrack", localtrack1);

      const element = localtrack1.attach();
      setStreamLocal(element);
    });
    call1.on("addremotetrack", (track) => {
      console.log("remote track", track);

      const element = track.attach();
      setStreamRemote(element);
    });
    call1.on("removeremotetrack", (track) => {
      track.detachAndRemove();
    });
    call1.on("removelocaltrack", (track) => {
      track.detachAndRemove();
    });
    call1.on("trackmediachange", (track) => {
      console.log(track);
    });

    call1.on("signalingstate", (state) => {
      console.log("signalingstate", state);
      if (state?.reason === "Ended") {
        setIsEnd(true);
      } else {
        setIsEnd(false);
      }
      if (state.code === 3) {
        setIsCalling(true);
        setLoading(false);
      } else if ([4, 5, 6].includes(state.code)) {
        setIsCalling(false);
        setHasIncomingCall(false);
        setLoading(false);
      }
    });
    call1.on("mediastate", (state) => {
      console.log("mediastate ", state);
    });

    call1.on("info", function (info) {
      console.log("on info:" + JSON.stringify(info));
    });
  };
  const onCall = async (friendUsername, videoCall = false) => {
    const user_id = localStorage.getItem("user_id");
    console.log(user_id, friendUsername);

    if (isCalling || !friendUsername) return;

    if (user_id === friendUsername) {
      alert("Không thể gọi cho chính mình");
      return;
    }
    setLoading(true);
    setIsVideoCall(videoCall);

    const calling = new StringeeCall2(
      client,
      user_id,
      friendUsername,
      videoCall
    );
    console.log(calling);

    await settingCallEvent(calling);

    calling.makeCall((res) => {
      console.log("make call callback:", res);
    });
    setCall(calling);
  };

  const acceptCall = () => {
    call.answer((res) => {
      console.log("answer call callback:", res);
      setHasIncomingCall(false);
      setIsCalling(true);
      setLoading(false);
    });
  };

  const rejectCall = () => {
    call.reject((res) => {
      console.log("reject call callback:", res);
      setHasIncomingCall(false);
      setLoading(false);
    });
  };

  const hangupCall = () => {
    call.hangup((res) => {
      console.log("hangup call callback:", res);
      setIsCalling(false);
      setLoading(false);
    });
  };

  const upgradeToVideoCall = () => {
    console.log(call);
    call.upgradeToVideoCall();
    setIsVideoCall(true);
    setLoading(true);
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    client.connect(accessToken);

    client.on("connect", () => {
      console.log("StringeeClient connected");
    });

    client.on("authen", (res) => {
      console.log("Authentication result:", res);
    });

    client.on("disconnect", () => {
      console.log("StringeeClient disconnected");
    });
    client.on("otherdeviceauthen", (data) => {
      console.log("Một thiết bị khác đã đăng nhập:", data);
    });

    // Lắng nghe cuộc gọi đến
    client.on("incomingcall2", (incomeCall) => {
      console.log("Incoming call:", incomeCall);
      setCall(incomeCall);
      settingCallEvent(incomeCall);
      setHasIncomingCall(true);
      setIsVideoCall(incomeCall?.isVideoCall);
      setLoading(true);
    });
    chat.on("newmessage", (msg) => {
      setMessages((prev) => [
        ...prev,
        { id: msg.seq, text: msg.content, sender: msg.from },
      ]);
    });
  }, []);

  return (
    <StringeeContext.Provider
      value={{
        isCalling,
        isVideoCall,
        setIsCalling,
        hasIncomingCall,
        onCall,
        acceptCall,
        rejectCall,
        hangupCall,
        upgradeToVideoCall,
        streamLocal,
        streamRemote,
        isEnd,
        sendMessage,
        createConversation,
        messages,
      }}
    >
      {children}
    </StringeeContext.Provider>
  );
};
