import {
  ConfigPlugin,
  withEntitlementsPlist,
  withInfoPlist,
} from "expo/config-plugins";

export interface OpenWearablesPluginProps {
  healthShareUsage?: string;
  healthUpdateUsage?: string;
}

const withOpenWearables: ConfigPlugin<OpenWearablesPluginProps> = (
  config,
  options = {}
) => {
  const {
    healthShareUsage = "Allow access to your health data.",
    healthUpdateUsage = "Allow updates to your health data.",
  } = options;

  // Add HealthKit entitlements
  config = withEntitlementsPlist(config, (config) => {
    config.modResults["com.apple.developer.healthkit"] = true;
    config.modResults["com.apple.developer.healthkit.background-delivery"] =
      true;
    return config;
  });

  // Add Info.plist usage descriptions & BGTask identifiers
  config = withInfoPlist(config, (config) => {
    config.modResults["NSHealthShareUsageDescription"] = healthShareUsage;
    config.modResults["NSHealthUpdateUsageDescription"] = healthUpdateUsage;

    config.modResults["UIBackgroundModes"] = ["fetch", "processing"];

    config.modResults["BGTaskSchedulerPermittedIdentifiers"] = [
      "com.openwearables.healthsdk.task.refresh",
      "com.openwearables.healthsdk.task.process",
    ];

    return config;
  });

  return config;
};

export default withOpenWearables;
