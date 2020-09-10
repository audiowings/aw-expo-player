const axios = require('axios').default;

import Constants from 'expo-constants'

import LOCAL_PLAYLISTS_JSON from './assets/playlists/basic-playlists.json'
const LOCAL_PLAYLISTS = LOCAL_PLAYLISTS_JSON.items


export const getProxyUrl = () => { 
  return Constants.manifest.extra.proxyUrl 
}

const getDeviceIdHeader = (deviceId) => { 
  return { 'x-audiowings-deviceId': deviceId } 
}

export async function connectDms(proxyServer, deviceId) {

  try {
    if (!deviceId) {
      throw ('No device id')
    }
    const options = {
      method: 'GET',
      headers: getDeviceIdHeader(deviceId)
    }
    const response = await axios(`${proxyServer}/connect/`, options)
    const userInfo = await response.data
    response.headers['x-spotify-auth-msg'] && (userInfo.authMessage = response.headers['x-spotify-auth-msg'])
    return userInfo
  }
  catch (error) { console.log(':( connect Request failed', error) }
}

async function getProviderPlaylists(proxyServer, deviceId) {
  try {
    const options = {
      method: 'GET',
      headers: getDeviceIdHeader(deviceId)
    }
    const response = await axios(`${proxyServer}/playlists/`, options)
    const playlists = await response.data
    return playlists.items
  }
  catch (error) {
    return console.log(':( playlists Request failed', error)
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

exports.getPlaylists = async (proxyServer, isOnline, deviceId) => {
  return isOnline ? await getProviderPlaylists(proxyServer, deviceId) : await getLocalPlaylists()
}

async function getProviderPlaylist(proxyServer, deviceId, playlistUrl) {
  try {
    const options = {
      method: 'GET',
      headers: {
        ...getDeviceIdHeader(deviceId),
        'x-audiowings-playlist-url': playlistUrl
      }
    }
    const response = await axios(`${proxyServer}/playlist/`, options)
    const playlist = await response.data.items
    return playlist
  }
  catch (error) {
    return console.log(':( playlist Request failed', error)
  }
}

getLocalPlaylist = () => true

exports.getPlaylist = async (proxyServer, isOnline, deviceId, playlistUrl) => {
  return isOnline ? await getProviderPlaylist(proxyServer, deviceId, playlistUrl) : await getLocalPlaylist()
}
