import React, { useState, useRef, useEffect, useContext } from "react";
import { StringeeClient, StringeeCall2 } from "stringee";
import { StringeeContext } from "../../stringeeContext";
import { Button } from "antd";

const VideoCall = ({ friendName }) => {
  const {
    isCalling,
    isVideoCall,
    hangupCall,
    streamLocal,
    streamRemote,
    upgradeToVideoCall,
  } = useContext(StringeeContext);
  const localVideo = useRef(null);
  const remoteVideo = useRef(null);

  useEffect(() => {
    if (isVideoCall) {
      console.log(localVideo.current);

      localVideo.current.srcObject = null;
      localVideo.current.appendChild(streamLocal);
      remoteVideo.current.srcObject = null;
      remoteVideo.current.appendChild(streamRemote);
    }
  }, [isVideoCall]);

  return (
    <div className="row">
      <div className="col">
        <h1>Demo: Voice Call & Video Call</h1>

        {isCalling && (
          <div className="mt-3">
            <p>
              Đang gọi cho: <strong>{friendName}</strong>
            </p>
            <Button
              color="primary"
              variant="solid"
              onClick={upgradeToVideoCall}
            >
              Mở camera
            </Button>
            <Button color="danger" variant="solid" onClick={hangupCall}>
              Kết thúc
            </Button>
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
