import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { StringeeClient, StringeeCall2 } from "stringee";

// Tạo Context
export const StringeeContext = createContext();

export const StringeeProvider = ({ children }) => {
  const [stringeeClient, setStringeeClient] = useState(null);
  const [incomingCall, setIncomingCall] = useState(null);
  const [hasIncomingCall, setHasIncomingCall] = useState(false);
  const [streamLocal, setStreamLocal] = useState();
  const [streamRemote, setStreamRemote] = useState();
  const [isCalling, setIsCalling] = useState();
  const [isVideoCall, setIsVideoCall] = useState(false);
  const accessToken = localStorage.getItem("access_token");

  const settingCallEvent = (call1) => {
    call1.on("addremotestream", (stream) => {
      setStreamRemote(stream);
    });

    call1.on("addlocalstream", (stream) => {
      setStreamLocal(stream);
    });

    call1.on("signalingstate", (state) => {
      console.log("signalingstate", state);

      if (state.code === 3) {
        setIsCalling(true);
      } else if ([4, 5, 6].includes(state.code)) {
        setIsCalling(false);
        setHasIncomingCall(true);
      }
    });
    call1.on("mediastate", function (state) {
      console.log("mediastate ", state);
    });

    call1.on("info", function (info) {
      console.log("on info:" + JSON.stringify(info));
    });
  };
  const onCall = async (username, friendUsername, videoCall = false) => {
    if (isCalling || !friendUsername) return;

    if (username === friendUsername) {
      alert("Không thể gọi cho chính mình");
      return;
    }
    setIsVideoCall(videoCall);

    call = new StringeeCall2(
      stringeeClient,
      username,
      friendUsername,
      videoCall
    );
    settingCallEvent(call);

    call.makeCall((res) => {
      console.log("make call callback:", res);
    });
  };

  const acceptCall = () => {
    incomingCall.answer((res) => {
      console.log("answer call callback:", res);
      setHasIncomingCall(false);
      setIsCalling(true);
    });
  };

  const rejectCall = () => {
    incomingCall.reject((res) => {
      console.log("reject call callback:", res);
      setHasIncomingCall(false);
    });
  };

  const hangupCall = () => {
    incomingCall.hangup((res) => {
      console.log("hangup call callback:", res);
      setIsCalling(false);
    });
  };

  const upgradeToVideoCall = () => {
    incomingCall.upgradeToVideoCall();
    setIsVideoCall(true);
  };

  useEffect(() => {
    // Khởi tạo StringeeClient
    const client = new StringeeClient();

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

    // Lắng nghe cuộc gọi đến
    client.on("incomingcall", (call) => {
      console.log("Incoming call:", call);
      setIncomingCall(call); // Lưu cuộc gọi đến vào state
      settingCallEvent(call);
      setIsVideoCall(call?.isVideoCall);
    });

    setStringeeClient(client);

    return () => {
      client.disconnect(); // Hủy kết nối khi component bị unmount
    };
  }, []);

  return (
    <StringeeContext.Provider
      value={{
        stringeeClient,
        incomingCall,
        setIncomingCall,
        isCalling,
        setIsCalling,
        hasIncomingCall,
        onCall,
        acceptCall,
        rejectCall,
        hangupCall,
        upgradeToVideoCall,
      }}
    >
      {children}
    </StringeeContext.Provider>
  );
};
