import React, { useState, useEffect } from "react";
import { StringeeClient } from "stringee";

const CallWindow = () => {
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const accessToken = localStorage.getItem("access_token");

  useEffect(() => {
    if (StringeeClient) {
      const STRINGEE_SERVER_ADDRS = [
        "wss://v1.stringee.com:6899/",
        "wss://v2.stringee.com:6899/",
      ];
      // Tạo đối tượng StringeeClient từ Stringee SDK đã thêm vào
      const client = new StringeeClient(STRINGEE_SERVER_ADDRS);
      client.connect(
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImN0eSI6InN0cmluZ2VlLWFwaTt2PTEifQ.eyJqdGkiOiJTSy4wLnVDQmdDVUpBbDBsMFQxMFZIS051VTdMUmlIRHBweHR3LTE3MzE5MjE4MDEiLCJpc3MiOiJTSy4wLnVDQmdDVUpBbDBsMFQxMFZIS051VTdMUmlIRHBweHR3IiwiZXhwIjoxNzMyMDA4MjAxLCJ1c2VySWQiOiIxNCJ9.v_6e4DTK2aXbuidug0WopJNXCZzJVEFyNjOAm3WusTw"
      );

      // Lắng nghe các sự kiện của StringeeClient
      client.on("connect", function () {
        console.log("connected");
      });
      client.on("authen", function (res) {
        console.log("authen", res);
      });
      client.on("disconnect", function () {
        console.log("disconnected");
      });

      client.on("error", (error) => {
        console.error("Error:", error);
      });

      // Kết nối với Stringee server sử dụng access token
      // setClient(stringeeClient);

      return () => {
        client.disconnect();
      };
    }
  }, []);

  // Bắt đầu cuộc gọi video
  const startCall = () => {
    if (client && isLoggedIn) {
      const videoCall = client.call("14", {
        isVideoCall: true,
        localVideoElement: document.getElementById("local-video"),
        remoteVideoElement: document.getElementById("remote-video"),
      });

      setCall(videoCall);
      console.log(videoCall);
    }
  };

  // Kết thúc cuộc gọi
  const endCall = () => {
    if (call) {
      call.hangup();
    }
  };

  return (
    <div>
      <div
        id="local-video"
        style={{
          width: "50%",
          height: "200px",
          background: "black",
          marginBottom: "50px",
        }}
      ></div>
      <div
        id="remote-video"
        style={{ width: "50%", height: "200px", background: "black" }}
      ></div>
      <button onClick={startCall}>Start Call</button>
      <button onClick={endCall}>End Call</button>
    </div>
  );
};

export default CallWindow;
