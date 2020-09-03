import React from 'react';
import {
  StyleSheet,
  View,
  StatusBar
} from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import TopBar from './TopBar'
import BigButton from './BigButton'
import Player from './Player'
import PlaylistsDialog from './PlaylistsDialog'
import LoginLinkDialog from './LoginLinkDialog'
import DeviceUserProvider from './device-user-context'
import AudioPlayerProvider from './audio-player-context'
import DialogProvider from './dialog-context'

export default function App() {

  return (
    <PaperProvider>
      <DeviceUserProvider>
        <View style={styles.container}>
          <StatusBar backgroundColor="blue" barStyle='default' />
          <DialogProvider>
            <AudioPlayerProvider>
              <TopBar />
              <BigButton />
              <Player />
              <PlaylistsDialog />
              <LoginLinkDialog />
            </AudioPlayerProvider>
          </DialogProvider>
        </View>
      </DeviceUserProvider>
    </PaperProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111111',
    justifyContent: 'space-between',
  }
});
