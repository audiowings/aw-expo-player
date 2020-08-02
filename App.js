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
import Constants from "expo-constants";

const PROXY_SERVER = '192.168.1.8' + ':3000';
const DEVICE_ID = "FF-01-25-79-C7-EC";
const PLAYLISTS = ['Gym', 'Driving', 'Relax']

function connectDms() {
  console.log('Sending DMS Connect...')
  const connectRequest = new Request(`http://${PROXY_SERVER}/connect/`);
  const headers = connectRequest.headers;
  headers.append('X-Audiowings-DeviceId', DEVICE_ID );
  return fetch(connectRequest)
    .then(response => response.json())
    .then(userInfo => userInfo )
    .catch(error => console.log('User not found', error));
}

export default function App() {

  const [deviceUser, setDeviceUser] = React.useState('undefined');

  const [isSwitchOn, setIsSwitchOn] = React.useState(false);
  const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);
  

  useEffect(() => {
    console.log('IN EFFECT [A] !!!!!')
    !isSwitchOn && setDeviceConnected(false)
    isSwitchOn && !deviceConnected && connectDms()
      .then(userInfo => {
        console.log(`User info: ${userInfo}`)
        if(userInfo.deviceId === DEVICE_ID){
          setDeviceConnected(true)
          setDeviceUser(userInfo)
        } else setIsSwitchOn(false)
      })
  });
  useEffect(() => {
    console.log('IN EFFECT [B] !!!!!')
    console.log(`Device is ${deviceConnected ? '' : 'not '}connected`)
  });

  const [deviceConnected, setDeviceConnected] = React.useState(false);



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
  const setNextPlaylist = () => setSelectedPlaylist(selectedPlaylist + 1 < PLAYLISTS.length ? selectedPlaylist + 1 : 0)
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
              <Paragraph>{`Would you like playlist: ${PLAYLISTS[selectedPlaylist]}`}</Paragraph>
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
    top: Constants.statusBarHeight,
  },
  topBar: {
    flexDirection: 'row',
    height: 56
  },
  text: {
    paddingStart: 16,
    textAlignVertical: "center",
    color: '#FFFFFF'
  },
  big_button: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#222222'
  }

});
