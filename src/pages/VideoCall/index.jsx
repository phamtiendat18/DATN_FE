import React, { useState, useRef, useEffect, useContext } from "react";
import { StringeeClient, StringeeCall2 } from "stringee";
import { StringeeContext } from "../../stringeeContext";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  const handleEnd = () => {
    navigate("/home");
    hangupCall();
  };

  useEffect(() => {
    if (streamLocal && localVideo.current) {
      console.log("đây là stream", streamRemote);

      localVideo.current.appendChild(streamLocal);
    }
    if (streamRemote && remoteVideo.current) {
      remoteVideo.current.appendChild(streamRemote);
    }
  }, [isVideoCall, streamLocal, streamRemote]);

  return (
    <div className="w-full ">
      <div className="flex flex-col justify-between h-[100vh]">
        <h1 className="text-center">Demo: Voice Call & Video Call</h1>
        {isCalling && isVideoCall && (
          <div className="flex">
            <div
              ref={localVideo}
              style={{ width: "50%", background: "black" }}
            ></div>
            <div
              ref={remoteVideo}
              style={{ width: "50%", background: "black" }}
              className="mx-3"
            ></div>
          </div>
        )}
        {isCalling && (
          <div className="mt-3 flex items-center w-full justify-center">
            {!isVideoCall ? (
              <Button
                color="primary"
                variant="solid"
                onClick={upgradeToVideoCall}
              >
                Mở camera
              </Button>
            ) : (
              ""
            )}
            <Button color="danger" variant="solid" onClick={handleEnd}>
              Kết thúc
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
export default VideoCall;
