import OpenWearables from "open-wearables";
import { StyleSheet, Text, View } from "react-native";
import { Button, Colors } from "./Button";
import { Group } from "./Group";

export function SyncGroup({
  syncActive,
  onRefresh,
}: {
  syncActive: boolean;
  onRefresh: () => void;
}) {
  const toggleBackgroundSync = async () => {
    if (syncActive) {
      OpenWearables.stopBackgroundSync();
    } else {
      await OpenWearables.startBackgroundSync();
    }
    onRefresh();
  };

  const handleSyncNow = async () => {
    await OpenWearables.syncNow();
    onRefresh();
  };

  return (
    <Group name="Sync">
      <View style={styles.row}>
        <Text style={styles.label}>Background Sync</Text>
        <Button
          title={syncActive ? "Stop" : "Start"}
          color={syncActive ? Colors.destructive : Colors.positive}
          onPress={toggleBackgroundSync}
        />
      </View>
      <Button
        title="Manual Sync"
        disabled={syncActive}
        onPress={handleSyncNow}
      />
    </Group>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  label: {
    fontSize: 16,
  },
});
