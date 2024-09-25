import { io } from "socket.io-client";

export const socket = (ip: any = "192.168.1.5") => {
  console.log("Socket IP", ip);
  return io(`http://${ip}:3000`);
};

export const socketic: any = io("http://192.168.1.4:3000", {
  autoConnect: false,
});
