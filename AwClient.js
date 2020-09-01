import Constants from 'expo-constants'
const PROXY_SERVER = Constants.manifest.extra.proxyUrl
import LOCAL_PLAYLISTS_JSON from './assets/playlists/basic-playlists.json'
const LOCAL_PLAYLISTS = LOCAL_PLAYLISTS_JSON.items

export async function connectDms(deviceId) {
  try {
    if (!deviceId) {
      throw ('No device id')
    }
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
      return console.log('Error', error);
    }
  }
  catch (error) { console.log('Error', error) }
}

export async function getProviderPlaylists(deviceId) {
  const playlistsRequest = new Request(`${PROXY_SERVER}/playlists/`);
  const headers = playlistsRequest.headers;
  headers.append('X-Audiowings-DeviceId', deviceId);
  try {
    const response = await fetch(playlistsRequest)
    try {
      const playlists = await response.json()
      // console.log('Playlists:', playlists)
      return playlists.items
    }
    catch {
      return console.log('Error getting playlists', error);
    }
  }
  catch (error) {
    return console.log(':( Request failed', error)
  }
}

export async function getLocalPlaylists() {
  try {
    return LOCAL_PLAYLISTS
  }
  catch (error) {
    return console.log('Playlists File not found', error);
  }
}
