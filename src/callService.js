// callService.js

import { StringeeCall, StringeeClient } from "stringee";

class CallService {
  constructor() {
    this.client = new StringeeClient();
    this.call = null;
  }

  connect(accessToken) {
    this.client.connect(accessToken);

    this.client.on("connect", () => {
      console.log("Stringee connected!");
    });

    this.client.on("authen", (res) => {
      console.log("Authen result:", res);
    });

    this.client.on("disconnect", () => {
      console.log("Stringee disconnected.");
    });

    // Lắng nghe sự kiện có cuộc gọi đến
    this.client.on("incomingcall", (call) => {
      console.log("Incoming call:", call);
      this.call = new StringeeCall(this.client, call.callId);
      if (this.onIncomingCall) {
        this.onIncomingCall(call);
      }
    });
  }

  acceptCall() {
    if (this.call) {
      this.call.answer((status, code, message) => {
        console.log("Call accepted:", { status, code, message });
      });
    }
  }

  rejectCall() {
    if (this.call) {
      this.call.reject((status, code, message) => {
        console.log("Call rejected:", { status, code, message });
      });
    }
  }
}

export const callService = new CallService();
