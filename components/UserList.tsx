import { FlatList, Pressable, Text, View } from "react-native";
import { socketic as socket, socketic } from "./Socket";
import { useSelector } from "react-redux";
import { RootState, store } from "@/store/store";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { setUser } from "@/store/reducer/userReducer";

export default function UserList() {
  // vars
  // const activeSocketUsersList = useSelector((state: RootState) => {
  //   return state.socketReducer.users;
  // });
  // check with useref
  const oldUsers = useSelector(
    (state: RootState) => state.socketReducer.oldUsers
  );
  // const oldUsers = store.getState().socketReducer.oldUsers;
  const [activeSocketUsers, setActiveSocketUsers] = useState<any>(oldUsers);
  useEffect(() => {
    const onUsers = (users: any) => {
      setActiveSocketUsers(users);
    };
    const onUserConnects = (user: any) => {
      // store.dispatch(adduser(user));
      setActiveSocketUsers((u: any) => [...u, user]);
    };

    const onUserDisconnects = (user: any) => {
      // delete from active users
      // store.dispatch(redUserbyID(user));
      setActiveSocketUsers((u: any) =>
        [...u].filter((v: any) => v?.userID !== user?.userID)
      );
      // console.log(user, "disconnects");
    };

    const onDisconnect = () => {
      setActiveSocketUsers([]);
    };

    // socket events
    socketic.on("users", onUsers);
    socketic.on("user connected", onUserConnects);
    socketic.on("user disconnected", onUserDisconnects);
    socketic.on("disconnect", onDisconnect);
    return () => {
      socketic.off("users", onUsers);
      socketic.off("user connected", onUserConnects);
      socketic.off("user disconnected", onUserDisconnects);
      socketic.off("disconnect", onDisconnect);
      //
    };
  }, []);
  return (
    <View style={{ padding: "5%", backgroundColor: "#aa0", flex: 5 }}>
      {/* LIST OF USERS */}
      <FlatList
        data={activeSocketUsers?.filter((v: any) => v.userID !== socket?.id)}
        renderItem={({ item }) => {
          return (
            <Pressable
              style={{
                backgroundColor: "#ff0",
                height: 60,
                justifyContent: "space-evenly",
                alignItems: "center",
                flexDirection: "row",
              }}
              onPress={() => {
                store.dispatch(setUser(item.userID));
                router.navigate({
                  pathname: "/chatpage",
                  params: {
                    users: JSON.stringify({
                      from: socket.id,
                      to: item.userID,
                    }),
                  },
                });
              }}
            >
              <Text style={{ color: "#00f" }}>{item.userName}</Text>
              {/* {item.unreadMetzageCount && (
                    <Text>{item.unreadMetzageCount}</Text>
                  )} */}
            </Pressable>
          );
        }}
        keyExtractor={({ userID }) => userID}
      />
    </View>
  );
}
