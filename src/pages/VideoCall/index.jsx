import React, { useState, useRef, useEffect } from "react";
import { StringeeClient, StringeeCall2 } from "stringee";

const VideoCall = ({ caller_id, receiver_id }) => {
  const [loading, setLoading] = useState(false);
  const [hasIncomingCall, setHasIncomingCall] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [friendName, setFriendName] = useState("");
  const [isVideoCall, setIsVideoCall] = useState(false);
  const accessToken = localStorage.getItem("access_token");

  const localVideo = useRef(null);
  const remoteVideo = useRef(null);

  const stringeeClient = new StringeeClient();
  let call = null;

  const settingCallEvent = (call1) => {
    call1.on("addremotestream", (stream) => {
      console.log("addremotestream");
      if (remoteVideo.current) {
        remoteVideo.current.srcObject = null;
        remoteVideo.current.srcObject = stream;
      }
    });

    call1.on("addlocalstream", (stream) => {
      console.log("addlocalstream");
      localVideo.current.srcObject = null;
      localVideo.current.srcObject = stream;
    });

    call1.on("signalingstate", (state) => {
      console.log("signalingstate", state);

      if (state.code === 3) {
        setIsCalling(true);
        setLoading(false);
      } else if ([4, 5, 6].includes(state.code)) {
        setIsCalling(false);
        setLoading(false);
        setHasIncomingCall(false);
      }
    });
  };

  useEffect(() => {
    stringeeClient.connect(accessToken);
    stringeeClient.on("connect", () =>
      console.log("Connected to StringeeServer")
    );

    stringeeClient.on("authen", (res) => {
      if (res.message === "SUCCESS") {
        console.log(res);
      }
    });

    stringeeClient.on("incomingcall", (incomingcall) => {
      console.log("incomingcall", incomingcall);
      call = incomingcall;
      settingCallEvent(incomingcall);
      setHasIncomingCall(true);
      setIsVideoCall(incomingcall.isVideoCall);
      setFriendName(incomingcall.fromNumber);
      setLoading(true);
    });
  }, []);

  const onCall = async (videoCall = false) => {
    if (isCalling || !receiver_id) return;

    if (username === receiver_id) {
      alert("Không thể gọi cho chính mình");
      return;
    }

    setLoading(true);
    setIsVideoCall(videoCall);

    call = new StringeeCall2(stringeeClient, username, receiver_id, videoCall);
    settingCallEvent(call);

    call.makeCall((res) => {
      console.log("make call callback:", res);
      setFriendName(res.toNumber);
    });
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
    call.upgradeToVideoCall();
    setIsVideoCall(true);
  };

  return (
    <div className="row">
      <div className="col">
        <h1>Demo: Voice Call & Video Call</h1>

        {hasIncomingCall && (
          <div className="mt-3">
            <p>
              Bạn nhận được cuộc gọi từ: <strong>{friendName}</strong>
            </p>
            <button className="btn btn-primary me-3" onClick={acceptCall}>
              Trả lời
            </button>
            <button className="btn btn-danger" onClick={rejectCall}>
              Từ chối
            </button>
          </div>
        )}

        {isCalling && (
          <div className="mt-3">
            <p>
              Đang gọi cho: <strong>{friendName}</strong>
            </p>
            <button className="btn btn-danger" onClick={hangupCall}>
              Kết thúc
            </button>
          </div>
        )}

        {isCalling && isVideoCall && (
          <div className="mt-3">
            <video
              ref={localVideo}
              autoPlay
              muted
              style={{ width: "300px" }}
            ></video>
            <video
              ref={remoteVideo}
              autoPlay
              style={{ width: "300px" }}
              className="ms-3"
            ></video>
          </div>
        )}
      </div>
    </div>
  );
};
export default VideoCall;
