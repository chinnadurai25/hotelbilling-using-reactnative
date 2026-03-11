# Android Build Implementation Plan

## Goal
Build the React Native application as an APK for Android using **EAS Cloud Build**.

## User Review Required
> [!IMPORTANT]
> Local build is not possible because **Java** and **ADB** are missing from the system path.
> We will use **EAS Build** (Cloud) instead. This requires an internet connection and will upload the code to Expo's servers to build.
>
> **Target:** Android APK (installable file).

## Proposed Changes
### Configuration
#### [NEW] [eas.json](file:///d:/fly/shop/eas.json)
- Create build configuration to output an APK (instead of AAB) for the `preview` profile.

#### [MODIFY] [app.json](file:///d:/fly/shop/app.json)
- Added `android.package` identifier (`com.foodshop.app`). (Already Done)

## Verification Plan
### Automated Tests
- Run `eas build -p android --profile preview`.
- Wait for the cloud build to finish.
- The command will output a URL to download the APK.

### Manual Verification
- User downloads the APK from the link/email.
- User installs it on their phone.
