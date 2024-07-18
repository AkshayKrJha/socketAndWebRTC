import { router } from "expo-router";
import { useState } from "react";
import { Button, TextInput, View } from "react-native";

export default function Index() {
  // const [ip,setIP] = useState("")
  return (
    <View
      style={{
        flex: 1,
        flexDirection:"row",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* <Text>Text for Socket</Text> */}
      {/* <TextInput
      style={{ borderWidth: 1 }}
      placeholder="IP Address"
      value={ip}
      onChangeText={(v: any) => {
        setIP(v);
      }}/> */}
      <Button title="Home page" onPress={() => {
        // navigate to home
        router.navigate({pathname:"/home"/*, params: {ip}*/})
      }}/>
    </View>
  );
}
