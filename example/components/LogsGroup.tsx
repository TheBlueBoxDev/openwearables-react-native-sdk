import { useEvent } from "expo";
import OpenWearables from "open-wearables";
import { useCallback, useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Button, Colors } from "./Button";
import { Group } from "./Group";

const MAX_LOGS = 50;

type LogEntry = {
  id: string;
  timestamp: Date;
  message: string;
  type: "log" | "error";
};

export function LogsGroup() {
  const onLogPayload = useEvent(OpenWearables, "onLog");
  const onAuthErrorPayload = useEvent(OpenWearables, "onAuthError");
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const addLog = useCallback((message: string, type: LogEntry["type"]) => {
    setLogs((prev) => [
      {
        id: `${Date.now()}-${Math.random()}`,
        timestamp: new Date(),
        message,
        type,
      },
      ...prev.slice(0, MAX_LOGS - 1),
    ]);
  }, []);

  useEffect(() => {
    if (!onLogPayload) return;
    console.log(`[OpenWearables] - ${onLogPayload?.message}`);
    addLog(onLogPayload.message, "log");
  }, [onLogPayload]);

  useEffect(() => {
    if (!onAuthErrorPayload) return;
    console.error(
      `[OpenWearables] - ${onAuthErrorPayload.statusCode}: ${onAuthErrorPayload?.message}`
    );
    addLog(
      `${onAuthErrorPayload.statusCode}: ${onAuthErrorPayload.message}`,
      "error"
    );
  }, [onAuthErrorPayload]);

  const clearLogs = () => setLogs([]);

  return (
    <Group name="Logs">
      <View style={styles.header}>
        <Text style={styles.count}>{logs.length} entries</Text>
        <Button title="Clear" color={Colors.muted} onPress={clearLogs} />
      </View>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.list}>
        {logs.length === 0 ? (
          <Text style={styles.empty}>No logs yet.</Text>
        ) : (
          logs.map((entry) => (
            <View
              key={entry.id}
              style={[
                styles.entry,
                entry.type === "error" && styles.entryError,
              ]}
            >
              <Text style={styles.timestamp}>
                {entry.timestamp.toLocaleTimeString()}
              </Text>
              <Text
                style={[
                  styles.message,
                  entry.type === "error" && styles.messageError,
                ]}
              >
                {entry.message}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </Group>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  count: {
    fontSize: 13,
    color: "#888",
  },
  scroll: {
    maxHeight: 220,
  },
  list: {
    gap: 6,
  },
  empty: {
    color: "#aaa",
    fontStyle: "italic",
    textAlign: "center",
    paddingVertical: 12,
  },
  entry: {
    backgroundColor: "#f5f5f5",
    borderRadius: 6,
    padding: 8,
    gap: 2,
  },
  entryError: {
    backgroundColor: "#fff0f0",
    borderLeftWidth: 3,
    borderLeftColor: "#e53935",
  },
  timestamp: {
    fontSize: 11,
    color: "#999",
  },
  message: {
    fontSize: 13,
    color: "#333",
  },
  messageError: {
    color: "#c62828",
  },
});
