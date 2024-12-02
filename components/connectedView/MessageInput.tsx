import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { socketic } from "../Socket";

export default function MessageInput({ roomID }: { roomID: any }) {
  const [inputMetzage, setInputMetzage] = useState<any>("");
  function send() {
    // send the input message to socket
    socketic.emit("room metzage", {
      content: inputMetzage,
      to: roomID,
    });
    setInputMetzage("");
  }
  return (
    <View style={styles.root}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          multiline
          placeholder="Enter your message"
          value={inputMetzage}
          onChangeText={(text) => {
            setInputMetzage(text);
          }}
        />
        <Pressable style={styles.button} onPress={send}>
          <Text style={styles.buttonText}>Send</Text>
        </Pressable>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: "center" },
  inputContainer: { flexDirection: "row", borderWidth: 2 },
  input: { flex: 5 },
  button: { flex: 1, padding: "2%", backgroundColor: "#0ff" },
  buttonText: { textAlign: "center" },
});
