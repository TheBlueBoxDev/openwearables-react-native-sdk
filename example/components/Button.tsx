import { Pressable, StyleSheet, Text } from "react-native";

export const Colors = {
  primary: "#007AFF",
  destructive: "#FF3B30",
  positive: "#34C759",
  muted: "#8E8E93",
};

type Props = {
  title: string;
  onPress: () => void;
  color?: string;
  disabled?: boolean;
};

export function Button({
  title,
  onPress,
  color = Colors.primary,
  disabled = false,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: color },
        disabled && styles.disabled,
        pressed && styles.pressed,
      ]}
    >
      <Text style={styles.label}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  label: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  disabled: {
    opacity: 0.35,
  },
  pressed: {
    opacity: 0.7,
  },
});
