import ConnectedView from "@/components/ConnectedView";
import DisConnectedView from "@/components/DisconnectedView";
import { socketic } from "@/components/Socket";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

export default function Room() {
  // check whether room is joined or not
  const [roomID, setRoomID] = useState<any>("");
  const [isRoomJoined, setIsRoomJoined] = useState<any>(false);
  const [metzages, setMetzages] = useState<any>([]);

  useEffect(() => {
    function onMetzage({ message, for: from, senderName, timeStamp }: any) {
      // update metzageList
      setMetzages((m: any) => {
        const oldMetzages = [...m];
        return [
          ...oldMetzages,
          {
            message,
            for: from,
            received: from === socketic.id ? false : true,
            timeStamp,
            senderName,
          },
        ];
      });
    }
    socketic.on("room metzage", onMetzage);
    // also set for disconnect
    return () => {
      socketic.off("room metzage", onMetzage);
    };
  }, []);

  function joinRoom() {
    socketic.emit("join room", roomID, (messages: any) => {
      const MESSAGES = [...messages]?.map((v) => {
        return { ...v, received: v.for === socketic.id ? false : true };
      });
      setMetzages((metzages: any) => [...metzages, ...MESSAGES]);
      setIsRoomJoined(true);
    });
  }
  function leaveRoom() {
    socketic.emit("leave room", roomID, () => {
      setIsRoomJoined(false);
    });
  }
  return (
    <View style={styles.root}>
      {/* connected and disconnected states, default disconnected */}
      {!isRoomJoined && (
        <DisConnectedView
          setRoomID={setRoomID}
          joinRoom={joinRoom}
          roomID={roomID}
        />
      )}
      {isRoomJoined && (
        <ConnectedView
          roomID={roomID}
          leaveRoom={leaveRoom}
          metzages={metzages}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    justifyContent: "center",
    flex: 1,
    backgroundColor: "#ff0",
    padding: "3%",
  },
});
