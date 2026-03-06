import { StyleSheet, Text, View } from "react-native";

export function Group(props: { name: string; children: React.ReactNode }) {
  return (
    <View style={styles.group}>
      <Text style={styles.groupHeader}>{props.name}</Text>
      {props.children}
    </View>
  );
}

const styles = StyleSheet.create({
  groupHeader: {
    fontSize: 20,
    marginBottom: 8,
  },
  group: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    gap: 8,
  },
});
