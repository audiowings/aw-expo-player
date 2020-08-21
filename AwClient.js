import Constants from 'expo-constants'
const CLOUD_PROXY_URL = 'https://aw-dms-demo.nw.r.appspot.com'
const PROXY_SERVER = Constants.manifest.extra.proxyUrl || CLOUD_PROXY_URL
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

export function getProviderPlaylists(deviceId) {
  const playlistsRequest = new Request(`${PROXY_SERVER}/playlists/`);
  const headers = playlistsRequest.headers;
  headers.append('X-Audiowings-DeviceId', deviceId);
  return fetch(playlistsRequest)
    .then(response => response.json())
    .catch(error => console.log(':( Request failed', error));
}

export async function getLocalPlaylists() {
  try {
    return LOCAL_PLAYLISTS
  }
  catch (error) {
    return console.log('Playlists File not found', error);
  }
}
