import React, { useEffect, useContext } from 'react';
import {
  StyleSheet,
  View
} from 'react-native';
import Constants from 'expo-constants'
import { Provider as PaperProvider } from 'react-native-paper';
import TopBar from './TopBar'
import BigButton from './BigButton'
import PlaylistsDialog from './PlaylistsDialog'
import DeviceUserProvider from './device-user-context'
import AudioPlayerProvider from './audio-player-context'
import DialogProvider from './dialog-context'

export default function App() {

  return (
    <DeviceUserProvider>
      <PaperProvider>
        <View style={styles.container}>
          <TopBar />
          <AudioPlayerProvider>
            <DialogProvider>
              <BigButton />
              <PlaylistsDialog />
            </DialogProvider>
          </AudioPlayerProvider>
        </View>
      </PaperProvider>
    </DeviceUserProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111111',
    padding: 16,
    justifyContent: 'space-between',
    top: Constants.statusBarHeight,
  }
});
