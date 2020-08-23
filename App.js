import React from 'react';
import {
  StyleSheet,
  View,
  StatusBar
} from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import TopBar from './TopBar'
import BigButton from './BigButton'
import PlaylistsDialog from './PlaylistsDialog'
import DeviceUserProvider from './device-user-context'
import AudioPlayerProvider from './audio-player-context'
import DialogProvider from './dialog-context'

export default function App() {

  return (
    <PaperProvider>
      <DeviceUserProvider>
        <View style={styles.container}>
          <StatusBar backgroundColor="blue" barStyle='default' />
          <TopBar />
          <AudioPlayerProvider>
            <DialogProvider>
              <BigButton />
                <PlaylistsDialog />
            </DialogProvider>
          </AudioPlayerProvider>
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
