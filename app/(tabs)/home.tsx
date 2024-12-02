import { socketic as socket } from "@/components/Socket";
import UserList from "@/components/UserList";
import { RootState } from "@/store/store";
import { useEffect, useState } from "react";
import {
  Button,
  FlatList,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSelector } from "react-redux";
import { router } from "expo-router";

export default function Home() {
  const testEvent = useSelector(
    (state: RootState) => state.socketReducer.testEvent
  );
  const isUserConnected = useSelector(
    (state: RootState) => state.socketReducer.isUserConnected
  );
  const [socketText, setSocketText] = useState("Hello");
  const [isLoading, setIsLoading] = useState(false);
  const [typeTimeout, setTypeTimeout] = useState<any>(null);
  const [typingUsers, setTypingUsers] = useState<any>(new Set());
  const activeSocketUsers = useSelector((state: RootState) => {
    return state.socketReducer.users;
  });

  useEffect(() => {
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

    socket.on("taaip on", onTypeOn);
    socket.on("taaip off", onTypeOff);

    return () => {
      socket.off("taaip on", onTypeOn);
      socket.off("taaip off", onTypeOff);
    };
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
      }}
    >
      <View
        style={{ flex: 6, backgroundColor: "#0ff", paddingHorizontal: "3%" }}
      >
        <Text style={{ flex: 1, textAlign: "center" }}>
          {isUserConnected
            ? `✅ ${socket.auth?.name} connects`
            : `❌ ${socket.auth?.name} disconnected`}
        </Text>
        <View style={{ maxHeight: 60 }}>
          {/* testEvent containing appended message echoed back from server */}
          <FlatList
            data={testEvent.map((event: any, index: any) => {
              return { event, index };
            })}
            renderItem={({ item }) => {
              return <Text>{item.event}</Text>;
            }}
            keyExtractor={(item) => item.index}
          />
        </View>
        <View style={{ backgroundColor: "#0aa", maxHeight: 60 }}>
          {/* List of typing users */}
          <FlatList
            data={Array.from(typingUsers).map((user: any, index: any) => {
              return { index, user };
            })}
            renderItem={({ item }) => {
              return <Text>{item.user} is taaiping...</Text>;
            }}
            keyExtractor={(item) => item.index}
          />
        </View>
        <UserList />
      </View>
      <View
        style={{
          flex: 1,
          backgroundColor: "#ff0",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-evenly",
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
        {!isUserConnected && (
          <Button
            title="Connect"
            onPress={() => {
              socket.connect();
            }}
          />
        )}
        {isUserConnected && (
          <Button
            title="Disconnect"
            onPress={() => {
              socket.disconnect();
            }}
          />
        )}
      </View>
      <Pressable
        style={{
          position: "absolute",
          right: "10%",
          bottom: "30%",
          padding: "2%",
          backgroundColor: "#00f",
          elevation: 20,
          borderRadius: 40,
        }}
        onPress={() => {
          // enter into room page
          router.navigate("/room")
        }}
      >
        <Ionicons name="add" size={48} color="#fff" />
      </Pressable>
    </View>
  );
}
