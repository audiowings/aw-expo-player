# aw-expo-player

The AW player is audio player installed on Android devices that is designed to interact with audio content providers such as Spotify via the Audiowings proxy server.

## Development
The app is developed using Expo - a framework for managing React Native application developments

## Prereqs
- Install Node JS. `https://nodejs.org/en/download/`
- Install Yarn. `npm install -g yarn`
- Install Expo. `npm install -g expo-cli`
- Clone the aw-expo-player repo your PC. `https://github.com/audiowings/aw-expo-player.git`
- Clone the proxy server repo to your PC `https://github.com/audiowings/dms-nodejs-server-demo`
- Go into each local project folder and run `yarn` to install the required dependencies.

## Running
The app may be run within Expo while in development:
1. Install Expo on an Android device
1. Run Expo on the PC either by:
   1. Entering `expo:start` to connect to the cloud hosted DMS or 
   1. Entering `local:proxy:expo` to start the DMS proxy locally and run the app against the local proxy
1. Launch Expo app on the device
1. Scan the QR code to lauch the player app

## Building the stand alone app
Enter `expo build:android -t apk` to build a new Android apk package

## Installing the stand alone native app
For more stable installation APK files are available on request to allow you to run the player against the cloud DMS 
