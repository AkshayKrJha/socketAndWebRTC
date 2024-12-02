import { StyleSheet, View } from "react-native";
import MessageList from "./connectedView/MessageList";
import MessageInput from "./connectedView/MessageInput";
import Controls from "./connectedView/Controls";

export default function ConnectedView({
  roomID,
  leaveRoom,
  metzages,
}: {
  roomID: any;
  leaveRoom: any;
  metzages: any;
}) {
  return (
    <View style={styles.root}>
      <MessageList metzages={metzages} />
      <MessageInput roomID={roomID} />
      <Controls leaveRoom={leaveRoom}/>
      {/* Bottom controls  */}
    </View>
  );
}
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#f0f8", padding: "2%" },
});
