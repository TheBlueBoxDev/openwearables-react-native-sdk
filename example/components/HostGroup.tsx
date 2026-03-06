import OpenWearables from "open-wearables";
import { useState } from "react";
import { Text } from "react-native";
import { Button } from "./Button";
import { Group } from "./Group";
import { Input } from "./Input";
import { INITIAL_HOST } from "../utils/constants";

export function HostGroup() {
  const [hostInput, setHostInput] = useState(INITIAL_HOST);

  const saveHost = () => OpenWearables.configure(hostInput);

  return (
    <Group name="Host">
      <Input
        onChangeText={setHostInput}
        value={hostInput}
        placeholder="Configure host"
        autoCorrect={false}
        autoCapitalize="none"
      />
      <Text>Update host and click "Save"</Text>
      <Button title="Save" onPress={saveHost} />
    </Group>
  );
}
