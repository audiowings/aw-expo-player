import Constants from 'expo-constants'
import LOCAL_PLAYLISTS_JSON from './assets/playlists/basic-playlists.json'

const PROXY_SERVER = Constants.manifest.extra.proxyUrl
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
        const userInfo = await response.json()
        response.headers.map['x-spotify-auth-msg'] && (userInfo.authMessage = response.headers.map['x-spotify-auth-msg'])
        return userInfo
      }
      catch (error) {
        return console.log('User not found', error);
      }
    }
    catch (error) {
      return console.log('Error', error);
    }
  }
  catch (error) { console.log('Error', error) }
}

async function getProviderPlaylists(deviceId) {
  const playlistsRequest = new Request(`${PROXY_SERVER}/playlists/`);
  const headers = playlistsRequest.headers;
  headers.append('X-Audiowings-DeviceId', deviceId);
  try {
    const response = await fetch(playlistsRequest)
    try {
      const playlists = await response.json()
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

async function getLocalPlaylists() {
  try {
    return LOCAL_PLAYLISTS
  }
  catch (error) {
    return console.log('Playlists File not found', error);
  }
}

exports.getPlaylists = async (isOnline, deviceId) => {
  return isOnline ? await getProviderPlaylists(deviceId) : await getLocalPlaylists()
}

export async function getProviderPlaylist(deviceId, url) {
  const playlistRequest = new Request(`${PROXY_SERVER}/playlist/`);
  const headers = playlistRequest.headers;
  headers.append('X-Audiowings-DeviceId', deviceId);
  headers.append('x-audiowings-playlist_url', url);
  try {
    const response = await fetch(playlistRequest)
    try {
      const playlist = await response.json()
      return playlist.items
    }
    catch {
      return console.log('Error getting playlist', error);
    }
  }
  catch (error) {
    return console.log(':( Request failed', error)
  }
}

exports.getPlaylist = async (isOnline, deviceId, url) => {
  return isOnline ? await getProviderPlaylist(deviceId, url) : await getLocalPlaylist()
}
