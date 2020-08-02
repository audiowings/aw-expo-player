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
import Constants from 'expo-constants'
import LOCAL_PLAYLISTS_JSON from './assets/playlists/basic-playlists.json'


const PROXY_SERVER = '192.168.1.8' + ':3000';
const DEVICE_ID = "FF-01-25-79-C7-EC";
const LOCAL_PLAYLISTS = LOCAL_PLAYLISTS_JSON.items //['Gym', 'Driving', 'Relax']


let tracks = []
let inPlayerMode = false


async function getLocalPlaylist(playlistPath) {
  console.log('Playlist Data... ', playlistPath);
  return {}
}

function requestPlaylist(isDeviceConnected, selectedPlaylist) {
  isDeviceConnected ? getProviderPlaylist(selectedPlaylist.providerId, selectedPlaylist.playlistId) : getLocalPlaylist(selectedPlaylist.path)
    .then(playlistData => {
      console.log('Playlist Data... ', playlistData);
      tracks = playlistData.items
    });
}

function getProviderPlaylists() {
  let playlistsRequest = new Request(`http://${PROXY_SERVER}/playlists/`);
  let headers = playlistsRequest.headers;
  headers.append('X-Audiowings-DeviceId', DEVICE_ID);
  return fetch(playlistsRequest)
    .then(status)
    .then(response => response.json())
    .catch(error => console.log(':( Request failed', error));
}

async function getLocalPlaylists() {
  try{
    return LOCAL_PLAYLISTS
  }
  catch (error) {
    return console.log('Playlists File not found', error);
  }
}

async function connectDms() {
  const connectRequest = new Request(`http://${PROXY_SERVER}/connect/`);
  const headers = connectRequest.headers;
  headers.append('X-Audiowings-DeviceId', DEVICE_ID);
  try {
    const response = await fetch(connectRequest);
    const userInfo = response.json();
    return userInfo;
  }
  catch (error) {
    return console.log('User not found', error);
  }
}

export default function App() {

  const [deviceUser, setDeviceUser] = React.useState('undefined');

  const [isSwitchOn, setIsSwitchOn] = React.useState(false);
  const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);

  useEffect(() => {
    !isSwitchOn && setDeviceConnected(false)
    isSwitchOn && !isDeviceConnected && connectDms()
      .then(userInfo => {
        if (userInfo.deviceId === DEVICE_ID) {
          setDeviceConnected(true)
          setDeviceUser(userInfo)
        } else setIsSwitchOn(false)
      })
  });


  const [isDeviceConnected, setDeviceConnected] = React.useState(false);

  const [playlists, setPlaylists] = React.useState([{}])

  const [playlistsDialogVisible, setPlaylistsDialogVisible] = React.useState(false);
  const showDialog = () => {
    resetPlaylistIndex()

    isDeviceConnected ? getProviderPlaylists() : getLocalPlaylists()
      .then(_playlists => {
        setPlaylists(_playlists)
        setPlaylistsDialogVisible(true)
      })
  }

  const hideDialog = () => setPlaylistsDialogVisible(false)

  const onDialogYes = () => {
    setPlaylistsDialogVisible(false);
    requestPlaylist(isDeviceConnected, playlists[selectedPlaylist])
  }

  const onDialogNo = () => {
    setNextPlaylist()
  }

  const _onLongPressButton = () => {
    showDialog()
  }

  const [selectedPlaylist, setSelectedPlaylist] = React.useState(0);
  const setNextPlaylist = () => setSelectedPlaylist(selectedPlaylist + 1 < playlists.length ? selectedPlaylist + 1 : 0)
  const resetPlaylistIndex = () => setSelectedPlaylist(0);

  return (
    <PaperProvider>
      <View style={styles.container}>

        <View style={styles.topBar}>
          <Switch value={isSwitchOn} onValueChange={onToggleSwitch} />
          <Text style={styles.text}>{`${!isDeviceConnected ? 'Dis' : JSON.stringify(deviceUser.displayname) + ' '}connected`}</Text>
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
              <Paragraph>{`Would you like playlist: ${playlists[selectedPlaylist].name}`}</Paragraph>
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
