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
import * as Network from 'expo-network';
import LOCAL_PLAYLISTS_JSON from './assets/playlists/basic-playlists.json'

const PROXY_ADDR = 'https://aw-dms-demo.nw.r.appspot.com'
const PROXY_PORT = ''
console.log('EXPO_LOCAL_DMS set to', Constants.manifest.env.EXPO_LOCAL_DMS)
const PROXY_SERVER = Constants.manifest.env.EXPO_LOCAL_DMS || PROXY_ADDR + PROXY_PORT
console.log('Requests routed to', PROXY_SERVER)
const DEVICE_ID = 'FF-FF-FF-FF-FF-FF'
const LOCAL_PLAYLISTS = LOCAL_PLAYLISTS_JSON.items //['Gym', 'Driving', 'Relax']

let deviceId = DEVICE_ID
async function setDeviceId() {
  try {
    const devId = await Network.getMacAddressAsync()
    devId && (deviceId = devId)
  }
  catch (error) {
    console.log('Error getting MAC Address...', error)
  }
}
setDeviceId()

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
  let playlistsRequest = new Request(`${PROXY_SERVER}/playlists/`);
  let headers = playlistsRequest.headers;
  headers.append('X-Audiowings-DeviceId', DEVICE_ID);
  return fetch(playlistsRequest)
    .then(status)
    .then(response => response.json())
    .catch(error => console.log(':( Request failed', error));
}

async function getLocalPlaylists() {
  try {
    return LOCAL_PLAYLISTS
  }
  catch (error) {
    return console.log('Playlists File not found', error);
  }
}

async function connectDms(deviceId) {

  const connectRequest = new Request(`${PROXY_SERVER}/connect/`);
  const headers = connectRequest.headers;
  headers.append('X-Audiowings-DeviceId', deviceId);
  try {
    const response = await fetch(connectRequest);
    try {
      return await response.json()
    }
    catch {
      return console.log('User not found', error);
    }
  }
  catch (error) {
    return console.log('User not found', error);
  }
}


export default function App() {
  
  const [isSwitchOn, setIsSwitchOn] = React.useState(false);
  const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);

  const [deviceUser, setDeviceUser] = React.useState({deviceId: '', displayName: ''});

  useEffect(() => {
    !isSwitchOn && setDeviceConnected(false)
    isSwitchOn && !isDeviceConnected && connectDms(deviceId)
      .then(userInfo => {

        if (userInfo && userInfo.deviceId === deviceId) {
          setDeviceConnected(true)
          setDeviceUser(userInfo)
          console.log('USER INFO:', JSON.stringify(deviceUser))

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
          <Text style={styles.text}>{`${!isDeviceConnected ? 'Dis' : deviceUser.displayName + ' '}connected`}</Text>
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
