import { Pressable, StyleSheet, Text, View } from "react-native";

export default function Controls({ leaveRoom }: { leaveRoom: any }) {
  return (
    <View style={styles.root}>
      <View style={styles.row}>
        <Pressable style={styles.button} onPress={leaveRoom}>
          <Text style={styles.text}>Leave</Text>
        </Pressable>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: "center" },
  row: { flexDirection: "row", justifyContent: "space-around" },
  button: { padding: "2%", backgroundColor: "#000", borderRadius: 10 },
  text: { color: "#fff", textAlign: "center" },
});
