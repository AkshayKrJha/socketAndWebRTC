import { socket as socketWithIP } from "@/components/Socket";
import { socketic as socket } from "@/components/Socket";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Button, Text, TextInput, View } from "react-native";
import { io } from "socket.io-client";

export default function Home() {
  const { /*ip*/ socketUsers }: any = useLocalSearchParams();
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
  const [typeTimeout, setTypeTimeout] = useState<any>(null);
  const [typingUsers, setTypingUsers] = useState<any>(new Set());
  const [activeUsers, setActiveUsers] = useState<any>(JSON.parse(socketUsers));

  useEffect(
    () => {
      console.log("Socket Users", JSON.parse(socketUsers));

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
        setActiveUsers([]);
      };
      const onTestEvent = (value: any) => {
        // setSocket({ connected, testEvent: [...testEvent, value] });
        setSocket(({ connected, testEvent }) => {
          return { connected, testEvent: [...testEvent, value] };
        });
      };

      const onTypeOn = (name: any) => {
        setTypingUsers((typingUsers: any) => new Set([...typingUsers, name]));
      };

      const onTypeOff = (name: any) => {
        setTypingUsers((typingUsers: any) => {
          const typers = new Set([...typingUsers]);
          typers.delete(name);
          return typers;
        });
      };

      const onUserConnects = (user: any) => {
        setActiveUsers((activeUsers: any) => {
          const users = [...activeUsers];
          users.push(user);
          console.log("New User", users);
          return users;
        });
      };

      const onUserDisconnects = (user: any) => {
        // delete from active users
        setActiveUsers((activeUsers: any) => {
          const usersList = [...activeUsers];
          return usersList.filter((v) => v?.userID !== user?.userID);
        });
        console.log(user, "disconnects");
      };

      const onUsers = (users: any) => {
        console.log("Users event triggered");
        setActiveUsers((activeUsers: any) => {
          const currentUsers = [...activeUsers];
          users?.forEach((v: any) => {
            currentUsers?.push(v);
          });
          console.log("Users", currentUsers);
          return currentUsers;
        });
      };

      socket.on("connect", onConnect);
      socket.on("users", onUsers);
      socket.on("disconnect", onDisconnect);
      socket.on("test", onTestEvent);
      socket.on("taaip on", onTypeOn);
      socket.on("taaip off", onTypeOff);
      socket.on("user connected", onUserConnects);
      socket.on("user disconnected", onUserDisconnects);

      return () => {
        socket.off("connect", onConnect);
        socket.off("users", onUsers);
        socket.off("disconnect", onDisconnect);
        socket.off("test", onTestEvent);
        socket.off("taaip on", onTypeOn);
        socket.off("taaip off", onTypeOff);
        socket.off("user connected", onUserConnects);
        socket.off("user disconnected", onUserDisconnects);
      };
    },
    [
      /*testEvent, connected*/
    ]
  );

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
          {connected ? `✅ ${socket.auth?.name} connects` : `❌ ${socket.auth?.name} disconnected`}
        </Text>
        {testEvent &&
          testEvent.map((event: any, index: any) => {
            return <Text key={index}>{event}</Text>;
          })}
        <View style={{ padding: "5%", backgroundColor: "#0aa" }}>
          {typingUsers &&
            Array.from(typingUsers).map((user: any, index: any) => {
              return (
                <Text key={index}>
                  {user} is taaiping... {"\n"}
                </Text>
              );
            })}
        </View>
        <View style={{ padding: "5%", backgroundColor: "#aa0" }}>
          {activeUsers &&
            activeUsers.map(({ userID, userName }: any) => {
              return (
                <Text key={userID}>
                  {userName} {"\n"}
                </Text>
              );
            })}
        </View>
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
            clearTimeout(typeTimeout);
            setTypeTimeout(null);
            setSocketText(v);
            socket.emit("typing on");
            const t = setTimeout(() => {
              socket.emit("typing off");
            }, 2000);
            setTypeTimeout(t);
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
              setSocketText("");
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
        {!connected && (
          <Button
            title="Connect"
            onPress={() => {
              socket.connect();
            }}
          />
        )}
        {connected && (
          <Button
            title="Disconnect"
            onPress={() => {
              socket.disconnect();
            }}
          />
        )}
      </View>
    </View>
  );
}
