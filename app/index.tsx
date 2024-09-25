import { socketic } from "@/components/Socket";
import { addUsers, setIsUserConnected } from "@/store/reducer/userReducer";
import { RootState, store } from "@/store/store";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Button, Pressable, Text, TextInput, View } from "react-native";
import { useSelector } from "react-redux";

export default function Index() {
  const [name, setName] = useState("");
  const isUserConnected = useSelector(
    (state: RootState) => state.socketReducer.isUserConnected
  );
  const activeSocketUsers = useSelector(
    (state: RootState) => state.socketReducer.users
  );
  useEffect(() => {
    if (isUserConnected && activeSocketUsers?.length) {
      router.replace({
        pathname: "/home",
      });
    }
  }, [isUserConnected, activeSocketUsers, router]);

  return (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <TextInput
        style={{ borderWidth: 1 }}
        placeholder="User Name"
        value={name}
        onChangeText={(v: any) => {
          setName(v);
        }}
      />
      <Button
        title="Home page"
        onPress={() => {
          // connect to socket
          socketic.auth = { name };
          socketic.connect();
          // navigate to home
          // router.navigate({ pathname: "/home" /*, params: {ip}*/ });
        }}
      />
    </View>
  );
}
