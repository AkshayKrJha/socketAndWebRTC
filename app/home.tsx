import { socket as socketWithIP } from "@/components/Socket";
import { socketic as socket } from "@/components/Socket";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Button, Text, TextInput, View } from "react-native";
import { io } from "socket.io-client";

export default function Home() {
  const { ip } = useLocalSearchParams();
  // const socket = socketWithIP(ip);
  const [{ connected, testEvent }, setSocket] = useState<{
    connected: any;
    testEvent: any;
  }>({
    connected: socket.connected,
    testEvent: [],
  });
  const [socketText, setSocketText] = useState("Hello");
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    console.log("IP", ip);

    const onConnect = () => {
      console.log("Connected event triggered");
      // setSocket({ connected: true, testEvent });
      setSocket(({ connected, testEvent }) => {
        return { connected: true, testEvent };
      });
    };
    const onDisconnect = () => {
      console.log("Disconnect Event triggered");
      // setSocket({ connected: false, testEvent });
      setSocket(({ connected, testEvent }) => {
        return { connected: false, testEvent };
      });
    };
    const onTestEvent = (value: any) => {
      // setSocket({ connected, testEvent: [...testEvent, value] });
      setSocket(({ connected, testEvent }) => {
        return { connected, testEvent: [...testEvent, value] };
      });
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("test", onTestEvent);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("test", onTestEvent);
    };
  }, [/*testEvent, connected*/]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* <Text>Text for Socket</Text> */}
      <View
        style={{ flex: 6, backgroundColor: "#0ff", paddingHorizontal: "3%" }}
      >
        <Text>
          {connected ? "✅ Socket connects" : "❌ Socket disconnected"}
        </Text>
        {testEvent &&
          testEvent.map((event: any, index: any) => {
            return <Text key={index}>{event}</Text>;
          })}
      </View>
      <View
        style={{
          flex: 1,
          backgroundColor: "#ff0",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: "5%",
        }}
      >
        <TextInput
          style={{ borderWidth: 1 }}
          placeholder="Text for socket server"
          value={socketText}
          onChangeText={(v: any) => {
            setSocketText(v);
          }}
        />
        <Button
          title="Send Text"
          disabled={isLoading}
          onPress={() => {
            // alert(socketText);
            // Send text to socket server
            setIsLoading(true);
            socket.timeout(5000).emit("some-event", socketText, () => {
              setIsLoading(false);
              setSocketText("")
            });
          }}
        />
      </View>
      <View
        style={{
          flex: 1,
          backgroundColor: "#f0f",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-evenly",
        }}
      >
        <Button
          title="Connect"
          onPress={() => {
            socket.connect();
          }}
        />
        <Button
          title="Disconnect"
          onPress={() => {
            socket.disconnect();
          }}
        />
      </View>
    </View>
  );
}
