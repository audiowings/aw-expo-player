import React, { useEffect } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Switch,
  Text
} from 'react-native';
import { Portal } from 'react-native-paper';
import { Provider as PaperProvider, Button, Dialog, Paragraph } from 'react-native-paper';

const PROXY_SERVER = '192.168.1.8' + ':3000';
const MAC_ADDRESS = "FF-01-25-79-C7-EC";

const playlists = ['Gym', 'Driving', 'Relax']

function connectDms() {
  const connectRequest = new Request(`http://${PROXY_SERVER}/connect/`);
  const headers = connectRequest.headers;
  headers.append('X-Audiowings-DeviceId', MAC_ADDRESS);
  return fetch(connectRequest)
    .then(response => response.json())
    .then(userInfo => { return userInfo })
    .catch(error => console.log('User not found', error));
}



export default function App() {
 
  const [isSwitchOn, setIsSwitchOn] = React.useState(false);
  const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);
  useEffect(() => {
    isSwitchOn && connectDms()
      .then(userInfo => {
        console.log(`User info: ${JSON.stringify(userInfo)}`)
        setConnection((userInfo === undefined) ? false : true)
        setDeviceUser(userInfo)
        setIsSwitchOn(deviceConnected)
      })
  });

  const [deviceConnected, setConnection] = React.useState(false);
  useEffect(() => {
    console.log(`Device is ${deviceConnected ? '' : 'not '}connected`)
  });

  const [deviceUser, setDeviceUser] =  React.useState('');

  const [playlistsDialogVisible, setPlaylistsDialogVisible] = React.useState(false);
  const showDialog = () => {
    resetPlaylistIndex()
    setPlaylistsDialogVisible(true)
  }
  const hideDialog = () => setPlaylistsDialogVisible(false)
  const onDialogYes = () => {
    setPlaylistsDialogVisible(false);
  }

  const onDialogNo = () => {
    setNextPlaylist()
  }

  const _onLongPressButton = () => {
    console.log('You long-pressed the button!')
    showDialog()

  }

  const [selectedPlaylist, setSelectedPlaylist] = React.useState(0);
  const setNextPlaylist = () => setSelectedPlaylist(selectedPlaylist + 1 < playlists.length ? selectedPlaylist + 1 : 0)
  const resetPlaylistIndex = () => setSelectedPlaylist(0);

  return (
    <PaperProvider>
      <View style={styles.container}>

        <View style={styles.topBar}>
          <Switch value={isSwitchOn} onValueChange={onToggleSwitch} /*onClick={playmode && showDialog}*/ />
          <Text style={styles.text}>{`${!deviceConnected ? 'dis' : JSON.stringify(deviceUser.displayname) + ' '}connected`}</Text>
        </View>

        <View style={{ flex: 1 }}>
          <TouchableOpacity onLongPress={_onLongPressButton} style={{ flex: 1 }}>
            <View style={styles.big_button} />
          </TouchableOpacity>
        </View>

        <Portal>
          <Dialog visible={playlistsDialogVisible} onDismiss={hideDialog}>
            <Dialog.Title>Select Playlist</Dialog.Title>
            <Dialog.Content>
              <Paragraph>{`Would you like playlist: ${playlists[selectedPlaylist]}`}</Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={onDialogYes}>Yes</Button>
              <Button onPress={onDialogNo}>No</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>

      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111111',
    padding: 16,
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    height: 32
  },
  text: {
    paddingStart: 16,
    color: '#FFFFFF'
  },
  big_button: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#333333'
  }

});
