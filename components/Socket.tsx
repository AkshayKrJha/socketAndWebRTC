import { io } from "socket.io-client";

export const socket = (ip: any = "192.168.1.5") => {
  console.log("Socket IP", ip);
  return io(`http://${ip}:3000`);
};

export const socketic = io("http://192.168.1.2:3000")