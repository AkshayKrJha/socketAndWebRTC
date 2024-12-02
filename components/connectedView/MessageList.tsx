import { FlatList, StyleSheet, View } from "react-native";
import Metzage from "../Metzage";

export default function MessageList({ metzages }: { metzages: any }) {
  return (
    <View style={styles.root}>
      {/* List of Messasges */}
      <FlatList
        data={metzages}
        renderItem={({ item }) => {
          return <Metzage item={item} />;
        }}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  root: { flex: 6, backgroundColor: "#ff0" },
});
