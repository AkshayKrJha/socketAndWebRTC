import { socketic } from "@/components/Socket";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Button, TextInput, View } from "react-native";

export default function Index() {
  // const [ip,setIP] = useState("")
  const [name, setName] = useState("");
  const [activeUsers, setActiveUsers] = useState<any>([]);
  const [isUserConnected, setIsUserConnected] = useState(false);
  useEffect(() => {
    const onConnect = () => {
      setIsUserConnected(true);
      console.log("Active Users", activeUsers);
    };
    const onUsers = (users: any) => {
      // switch from array to hashmap
      setActiveUsers(users);
      console.log("Users", users);
    };
    const onError = (err: any) => {
      console.log(err.message);
      if (err.message === "invalid username") {
        setIsUserConnected(false);
      }
    };
    socketic.on("connect", onConnect);
    socketic.on("connect_error", onError);
    socketic.on("users", onUsers);
    return () => {
      socketic.off("connect", onConnect);
      socketic.off("connect_error", onError);
      socketic.off("users", onUsers);
    };
  }, []);
  useEffect(() => {
    if (isUserConnected && activeUsers?.length) {
      router.navigate({
        pathname: "/home",
        // params: { /*ip */ socketUsers: JSON.stringify(activeUsers) },
        params: { /*ip */ socketUsers: JSON.stringify(activeUsers.filter((v:any)=>v.userID!==socketic.id)) },
      });
    }
  }, [isUserConnected, activeUsers, router]);

  return (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
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
