import { StyleSheet, TextInput, TextInputProps } from "react-native";

export function Input(props: TextInputProps) {
  return <TextInput style={styles.input} {...props} />;
}

const styles = StyleSheet.create({
  input: {
    padding: 8,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 8,
  },
});
