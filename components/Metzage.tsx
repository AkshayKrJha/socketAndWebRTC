import { Text, View } from "react-native";

export default function Metzage({ item }: { item: any }) {
  return (
    <View
      style={{
        alignSelf: item.received ? "flex-start" : "flex-end",
        borderWidth: 2,
        maxHeight: 80,
        padding: "1%",
        marginHorizontal: "10%",
        marginVertical: "1%",
        flexDirection: "row",
        backgroundColor: item.received ? "#0ff" : "#f0f",
        minWidth: "25%",
        justifyContent: "space-between",
      }}
    >
      <Text>{item.message}</Text>
      <Text style={{ fontSize: 10, textAlign: "right" }}>{item.timeStamp}</Text>
    </View>
  );
}
