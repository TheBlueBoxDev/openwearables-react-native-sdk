import ExpoModulesCore
import OpenWearablesHealthSDK

// See https://docs.expo.dev/modules/module-api for more details about available components.
public class OpenWearablesModule: Module {
    public func definition() -> ModuleDefinition {
        Name("OpenWearables")
        
        // MARK: - Callbacks (Events)        
        Events("onLog", "onAuthError")
        
        // MARK: - Lifecycle        
        OnCreate {
            OpenWearablesHealthSDK.shared.onLog = { message in
                self.sendEvent("onLog", [
                    "message": message
                ])
            }
            
            OpenWearablesHealthSDK.shared.onAuthError = { statusCode, message in
                self.sendEvent("onAuthError", [
                    "statusCode": statusCode,
                    "message": message
                ])
            }
        }
        
        // MARK: - Configure        
        Function("configure") { (host: String) in
            OpenWearablesHealthSDK.shared.configure(host: host)
        }
        
        // MARK: - Auth        
        Function("signIn") { (
            userId: String,
            accessToken: String?,
            refreshToken: String?,
            apiKey: String?
        ) in
            OpenWearablesHealthSDK.shared.signIn(
                userId: userId,
                accessToken: accessToken,
                refreshToken: refreshToken,
                apiKey: apiKey
            )
        }
        
        Function("signOut") {
            OpenWearablesHealthSDK.shared.signOut()
        }
        
        Function("updateTokens") { (accessToken: String, refreshToken: String) in
            OpenWearablesHealthSDK.shared.updateTokens(
                accessToken: accessToken,
                refreshToken: refreshToken
            )
        }
        
        Function("restoreSession") {
            return OpenWearablesHealthSDK.shared.restoreSession()
        }
        
        Function("isSessionValid") {
            return OpenWearablesHealthSDK.shared.isSessionValid
        }
        
        // MARK: - HealthKit Authorization        
        AsyncFunction("requestAuthorization") { (types: [String], promise: Promise) in
            let healthTypes = types.compactMap { HealthDataType(rawValue: $0) }
            OpenWearablesHealthSDK.shared.requestAuthorization(types: healthTypes) { success in
                promise.resolve(success)
            }
        }
        
        // MARK: - Sync        
        AsyncFunction("startBackgroundSync") { (promise: Promise) in
            OpenWearablesHealthSDK.shared.startBackgroundSync { started in
                promise.resolve(started)
            }
        }
        
        Function("stopBackgroundSync") {
            OpenWearablesHealthSDK.shared.stopBackgroundSync()
        }
        
        AsyncFunction("syncNow") { (promise: Promise) in
            OpenWearablesHealthSDK.shared.syncNow {
                promise.resolve()
            }
        }
        
        Function("resumeSync") { (promise: Promise) in
            OpenWearablesHealthSDK.shared.resumeSync { resumed in
                promise.resolve(resumed)
            }
        }
        
        Function("isSyncActive") {
            return OpenWearablesHealthSDK.shared.isSyncActive
        }
        
        Function("getSyncStatus") {
            return OpenWearablesHealthSDK.shared.getSyncStatus()
        }
        
        Function("resetAnchors") {
            OpenWearablesHealthSDK.shared.resetAnchors()
        }
        
        Function("getStoredCredentials") {
            return OpenWearablesHealthSDK.shared.getStoredCredentials()
        }
    }
}

import UIKit

public class OpenWearablesAppDelegateSubscriber: ExpoAppDelegateSubscriber {
    public func application(
        _ application: UIApplication,
        didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
    ) -> Bool {
        
        // Trigger background task registration
        let _ = OpenWearablesHealthSDK.shared
        
        return true
    }

    public func application(
        _ application: UIApplication,
        handleEventsForBackgroundURLSession identifier: String,
        completionHandler: @escaping () -> Void
    ) {
        OpenWearablesHealthSDK.setBackgroundCompletionHandler(completionHandler)
    }
}
