import OpenWearables from "open-wearables";
import { useState } from "react";
import { Text } from "react-native";
import { Button, Colors } from "./Button";
import { Group } from "./Group";
import { Input } from "./Input";

export function SessionGroup({
  credentials,
  onRefresh,
}: {
  credentials: Record<string, any>;
  onRefresh: () => void;
}) {
  const [userId, setUserId] = useState<string>(credentials["userId"] ?? "");
  const [apiKey, setApiKey] = useState<string>(credentials["apiKey"] ?? "");

  const handleSessionToggle = () => {
    if (OpenWearables.isSessionValid()) {
      OpenWearables.signOut();
    } else {
      OpenWearables.signIn(userId, null, null, apiKey);
    }
    onRefresh();
  };

  return (
    <Group name="Session">
      {credentials["userId"] ? (
        <Text>User ID: {credentials["userId"]}</Text>
      ) : (
        <Input
          onChangeText={setUserId}
          value={userId}
          placeholder="User ID"
          autoCorrect={false}
          autoCapitalize="none"
        />
      )}
      {credentials["apiKey"] ? (
        <Text>API Key: {credentials["apiKey"]}</Text>
      ) : (
        <Input
          onChangeText={setApiKey}
          value={apiKey}
          placeholder="API Key"
          autoCorrect={false}
          autoCapitalize="none"
        />
      )}
      <Button
        title={OpenWearables.isSessionValid() ? "Sign out" : "Sign in"}
        color={OpenWearables.isSessionValid() ? Colors.destructive : Colors.primary}
        disabled={
          !(
            OpenWearables.isSessionValid() ||
            (userId.length > 0 && apiKey.length > 0)
          )
        }
        onPress={handleSessionToggle}
      />
    </Group>
  );
}
