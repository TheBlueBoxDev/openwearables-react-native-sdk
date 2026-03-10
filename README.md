# Open Wearables React Native SDK

The official React Native SDK for the [Open Wearables](https://github.com/the-momentum/open-wearables) project.

The SDK is built with the [Expo Module API](https://docs.expo.dev/modules/module-api/) enabling install the app in Expo Project as well as in React Native CLI projects. 
It is a wrapper for the native iOS and Android SDKs to allow React Native apps to collect and sync health data.

## Platform support

| Platform | Status                                                                  |
| -------- | ----------------------------------------------------------------------- |
| iOS      | Implemented (via `OpenWearablesHealthSDK` CocoaPod, requires iOS 15.1+) |
| Android  | In progress — coming soon                                                |

## Installation

Currently, the SDK is only available locally. You can install it using the following command from the project root folder:

```sh
npm install open-wearables
```

Then, depending if you are using Expo or React Native CLI, follow the instructions below:

### Expo

Expo projects using the Expo Modules API automatically link native dependencies.

After installing the package, simply run your project.

```sh
npx expo run:ios
```

If your project does not yet contain native directories (ios/ and android/), Expo will automatically generate them.

You can also generate them manually using:

```sh
npx expo prebuild
```


### React Native CLI

For bare React Native projects, you must ensure that you have **[installed and configured the expo package](https://docs.expo.dev/bare/installing-expo-modules/)** before continuing.

After installing the package, install the iOS CocoaPods dependencies:

```sh
npx pod-install
```

or manually:

```sh
cd ios && pod install
```

## Config Plugin (optional)

You can customize the permission messages displayed to users by configuring the plugin in your app.json or app.config.js.

```json
{
  "expo": {
    "plugins": [
      [
        "open-wearables",
        {
          "healthShareUsage": "Allow $(PRODUCT_NAME) to read your health data.",
          "healthUpdateUsage": "Allow $(PRODUCT_NAME) to write health data."
        }
      ]
    ]
  }
}
```

| **Option**        | **Description**                                              |
| ----------------- | ------------------------------------------------------------ |
| healthShareUsage  | Sets the NSHealthShareUsageDescription value in Info.plist.  |
| healthUpdateUsage | Sets the NSHealthUpdateUsageDescription value in Info.plist. |


## Example app

A minimal Expo application demonstrating how to integrate the SDK.

See the example project:  
👉 **[example/README.md](./example/README.md)**

## Usage

```ts
import OpenWearables from "open-wearables";

// Configure the SDK with your backend host
OpenWearables.configure("https://your-api-host.com");

// Sign in (token-based)
OpenWearables.signIn(userId, accessToken, refreshToken, null);

// Or sign in (API key)
OpenWearables.signIn(userId, null, null, apiKey);

// Request HealthKit authorization
await OpenWearables.requestAuthorization(["steps", "heartRate", "sleep"]);

// Start background sync
await OpenWearables.startBackgroundSync();

// Sync immediately
await OpenWearables.syncNow();
```

## API

### Configuration

#### `configure(host: string): void`

Sets the backend host URL for the SDK.

---

### Auth

#### `signIn(userId, accessToken, refreshToken, apiKey): void`

Signs in a user. `accessToken`, `refreshToken`, and `apiKey` are optional.

#### `signOut(): void`

Signs out the current user.

#### `updateTokens(accessToken: string, refreshToken: string): void`

Updates the stored auth tokens.

#### `restoreSession(): Promise<boolean>`

Attempts to restore a previously saved session. Returns `true` if successful.

#### `isSessionValid(): boolean`

Returns whether the current session is valid.

---

### HealthKit Authorization

#### `requestAuthorization(types: HealthDataType[]): Promise<boolean>`

Requests HealthKit read permissions for the given data types. Returns `true` if the authorization was granted.

See `[HealthDataType](#healthdatatype)` for the full list of supported types.

---

### Sync

#### `startBackgroundSync(): Promise<boolean>`

Starts background health data sync. Returns `true` if started successfully.

#### `stopBackgroundSync(): void`

Stops background sync.

#### `syncNow(): Promise<void>`

Triggers an immediate sync.

#### `resumeSync(): Promise<boolean>`

Resumes a previously paused sync.

#### `isSyncActive(): boolean`

Returns whether background sync is currently active.

#### `getSyncStatus(): Record<string, any>`

Returns the current sync status.

#### `resetAnchors(): void`

Resets the HealthKit query anchors, forcing a full re-sync on the next run.

#### `getStoredCredentials(): Record<string, any>`

Returns the credentials currently stored by the SDK.

---

### Events

Subscribe to native SDK events using the standard Expo module event emitter:

```ts
const subscription = OpenWearables.addListener("onLog", ({ message }) => {
  console.log("SDK log:", message);
});

const authSub = OpenWearables.addListener(
  "onAuthError",
  ({ statusCode, message }) => {
    console.error(`Auth error ${statusCode}:`, message);
  }
);

// Clean up
subscription.remove();
authSub.remove();
```

| Event         | Payload                                   | Description                            |
| ------------- | ----------------------------------------- | -------------------------------------- |
| `onLog`       | `{ message: string }`                     | Log messages emitted by the native SDK |
| `onAuthError` | `{ statusCode: number, message: string }` | Authentication errors                  |

---

### HealthDataType

The following health data type identifiers can be passed to `requestAuthorization`:

**Activity & Mobility**
`steps`, `distanceWalkingRunning`, `distanceCycling`, `flightsClimbed`, `walkingSpeed`, `walkingStepLength`, `walkingAsymmetryPercentage`, `walkingDoubleSupportPercentage`, `sixMinuteWalkTestDistance`, `activeEnergy`, `basalEnergy`

**Heart & Cardiovascular**
`heartRate`, `restingHeartRate`, `heartRateVariabilitySDNN`, `vo2Max`, `oxygenSaturation`, `respiratoryRate`

**Body Measurements**
`bodyMass`, `height`, `bmi`, `bodyFatPercentage`, `leanBodyMass`, `waistCircumference`, `bodyTemperature`

**Blood & Metabolic**
`bloodGlucose`, `insulinDelivery`, `bloodPressureSystolic`, `bloodPressureDiastolic`, `bloodPressure`

**Sleep & Mindfulness**
`sleep`, `mindfulSession`

**Reproductive Health**
`menstrualFlow`, `cervicalMucusQuality`, `ovulationTestResult`, `sexualActivity`

**Nutrition**
`dietaryEnergyConsumed`, `dietaryCarbohydrates`, `dietaryProtein`, `dietaryFatTotal`, `dietaryWater`

**Workout**
`workout`

**Aliases**
`restingEnergy`, `bloodOxygen`
