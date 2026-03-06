import { useEvent } from "expo";
import OpenWearables from "open-wearables";
import { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
} from "react-native";
import { HostGroup } from "./components/HostGroup";
import { LogsGroup } from "./components/LogsGroup";
import { SessionGroup } from "./components/SessionGroup";
import { SyncGroup } from "./components/SyncGroup";
import { INITIAL_HOST } from "./utils/constants";

export default function App() {
  const onAuthErrorPayload = useEvent(OpenWearables, "onAuthError");
  const [credentials, setCredentials] = useState<Record<string, any>>([]);

  useEffect(() => {
    OpenWearables.configure(INITIAL_HOST);
    refreshStoredCredentials();
    requestAuthorization();
  }, []);

  const requestAuthorization = async () => {
    await OpenWearables.requestAuthorization([
      "steps",
      "heartRate",
      "bloodGlucose",
      "bmi",
    ]);
  };

  const refreshStoredCredentials = () => {
    const credentials = OpenWearables.getStoredCredentials();
    console.log("[OpenWearables] - Credentials: ", credentials);
    setCredentials(credentials);
  };

  useEffect(() => {
    if (!onAuthErrorPayload) return;
    Alert.alert(onAuthErrorPayload.message);
  }, [onAuthErrorPayload]);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          style={styles.container}
        >
          <Text style={styles.header}>Open Wearables</Text>
          <HostGroup />
          <SessionGroup
            credentials={credentials}
            onRefresh={refreshStoredCredentials}
          />
          <SyncGroup
            syncActive={credentials["isSyncActive"] === true}
            onRefresh={refreshStoredCredentials}
          />
          <LogsGroup />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 30,
  },
  contentContainer: {
    gap: 16,
    padding: 20,
  },
  container: {
    flex: 1,
    backgroundColor: "#eee",
  },
});
