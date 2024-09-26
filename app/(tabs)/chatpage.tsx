import { socketic } from "@/components/Socket";
import {
  selectMetzages
} from "@/store/reducer/userReducer";
import { RootState } from "@/store/store";
import { useState } from "react";
import { FlatList, Pressable, Text, TextInput, View } from "react-native";
import { useSelector } from "react-redux";

const PrivateCzat = () => {
  const to = useSelector(
    (state: RootState) => state.socketReducer.currentUserID
  );
  const [inputMetzage, setInputMetzage] = useState<string>("");

  const sendMetzage = (metzage: any) => {
    socketic.emit("private metzage", { content: metzage, to });
    // update existing metzage list
  };
  const metzages = useSelector(selectMetzages);
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 5, backgroundColor: "#a0f" }}>
        {/* Chat List  */}
        <FlatList
          // data={messages}
          data={metzages}
          renderItem={({ item }) => {
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
                <Text style={{ fontSize: 10, textAlign: "right" }}>
                  {item.timeStamp}
                </Text>
              </View>
            );
          }}
        />
      </View>
      <View style={{ flex: 1, justifyContent: "center", padding: "1%" }}>
        <TextInput
          style={{ borderWidth: 1, borderColor: "#000", padding: "1%" }}
          onChangeText={(text) => {
            setInputMetzage(text);
          }}
          value={inputMetzage}
        />
      </View>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-evenly",
          alignItems: "center",
        }}
      >
        <Pressable style={{ padding: "2%", backgroundColor: "#00f" }}>
          <Text>Join Czat</Text>
        </Pressable>
        <Pressable
          style={{ padding: "2%", backgroundColor: "#0f0" }}
          onPress={() => {
            sendMetzage(inputMetzage);
            setInputMetzage("");
          }}
        >
          <Text>Send Metzage</Text>
        </Pressable>
        <Pressable style={{ padding: "2%", backgroundColor: "#f00" }}>
          <Text>Leave Czat</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default PrivateCzat;
