import {
  addCzat,
  addMetzage,
  adduser,
  addUsers,
  delUsers,
  redUserbyID,
  setIsUserConnected,
  setTestEvent,
} from "@/store/reducer/userReducer";
import { socketic as socket } from "@/components/Socket";
import { store } from "@/store/store";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { Provider } from "react-redux";

export default function RootLayout() {
  useEffect(() => {
    const onConnect = () => {
      console.log("Connected event triggered");
      store.dispatch(setIsUserConnected(true));
    };
    const onDisconnect = () => {
      console.log("Disconnect Event triggered");
      store.dispatch(setIsUserConnected(false));
      // setActiveUsers([]);
      store.dispatch(delUsers());
    };
    const onTestEvent = (value: any) => {
      store.dispatch(setTestEvent(value));
    };
    const onUserConnects = (user: any) => {
      store.dispatch(adduser(user));
    };

    const onUserDisconnects = (user: any) => {
      // delete from active users
      store.dispatch(redUserbyID(user));
      console.log(user, "disconnects");
    };

    const onUsers = (users: any) => {
      store.dispatch(addUsers(users));
    };

    const onMetzage = ({ content, from, received }: any) => {
      console.log("Message Received", { content, from });
      const mestzage = {
        received,
        content,
        from,
      };
      // store.dispatch(addCzat(mestzage));
      store.dispatch(addMetzage(mestzage));
    };
    const onError = (err: any) => {
      console.log(err.message);
      if (err.message === "invalid username") {
        // setIsUserConnected(false);
        store.dispatch(setIsUserConnected(false));
      }
    };
    socket.on("connect", onConnect);
    socket.on("users", onUsers);
    socket.on("connect_error", onError);
    socket.on("disconnect", onDisconnect);
    socket.on("test", onTestEvent);
    // socket.on("user connected", onUserConnects);
    // socket.on("user disconnected", onUserDisconnects);
    socket.on("private metzage", onMetzage);

    return () => {
      socket.off("connect", onConnect);
      socket.off("users", onUsers);
      socket.off("connect_error", onError);
      socket.off("disconnect", onDisconnect);
      socket.off("test", onTestEvent);
      // socket.off("user connected", onUserConnects);
      // socket.off("user disconnected", onUserDisconnects);
      socket.off("private metzage", onMetzage);
      // socket.disconnect(); // to be checked
    };
  }, []);
  return (
    <Provider store={store}>
      <Stack>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        {/* <Stack.Screen name="home" />
        <Stack.Screen name="chatpage" /> */}
      </Stack>
    </Provider>
  );
}
