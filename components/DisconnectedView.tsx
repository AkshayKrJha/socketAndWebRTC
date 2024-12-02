import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export default function DisConnectedView({
  setRoomID,
  joinRoom,
  roomID,
}: {
  setRoomID: any;
  joinRoom: any;
  roomID: any;
}) {
  return (
    <View style={styles.root}>
      <TextInput
        style={styles.input}
        value={roomID}
        placeholder="Room ID for joining"
        onChangeText={(text: string) => {
          setRoomID(text);
        }}
      />
      <Pressable
        disabled={!roomID}
        style={styles.button}
        onPress={joinRoom}
      >
        <Text style={styles.text}>JOIN</Text>
      </Pressable>
    </View>
  );
}
const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "space-evenly",
    backgroundColor: "#0ff",
    padding: "3%",
  },
  input: { borderWidth: 2, padding: "2%" },
  button: { padding: "3%", backgroundColor: "#00f", borderRadius: 50 },
  text: { color: "#fff", textAlign: "center", fontWeight: "bold" },
});
