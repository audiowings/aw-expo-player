import React, { useContext } from 'react'
import { Portal, Button, Dialog, Paragraph } from 'react-native-paper'
import { DialogContext } from './dialog-context'
import { DeviceUserContext } from './device-user-context'
import { AudioPlayerContext } from './audio-player-context'
import { getPlaylist } from './AwClient'

export default function PlaylistsDialog() {
  const [deviceUser] = useContext(DeviceUserContext)
  const [dialogState, setDialogState] = useContext(DialogContext)
  const [audioPlayer, setAudioPlayer] = useContext(AudioPlayerContext)
  
  const hideDialog = () => setDialogState(dialogState => ({ ...dialogState, playlistsDialogVisible: false }))

  const onDialogYes = async () => {
    hideDialog()
    const playlistUrl = audioPlayer.playlists[audioPlayer.selectedPlaylistIndex].tracks.href
    const tracks = await getPlaylist(deviceUser.isOnline, deviceUser.deviceId, playlistUrl)
    setAudioPlayer(audioPlayer => ({ ...audioPlayer, tracks: tracks, currentTrackIndex: 0 }))
  }

  // User taps no
  const onDialogNo = () => {
    const notLastItem = audioPlayer.selectedPlaylistIndex + 1 < audioPlayer.playlists.length
    const nextItem = notLastItem ? audioPlayer.selectedPlaylistIndex + 1 : 0
    setAudioPlayer({ ...audioPlayer, selectedPlaylistIndex: nextItem })
  }

  return (
    <React.Fragment>{audioPlayer.playlists.length > 0 &&
      <Portal>
        <Dialog visible={dialogState.playlistsDialogVisible} onDismiss={hideDialog}>
          <Dialog.Title>Select Playlist</Dialog.Title>
          <Dialog.Content>
            <Paragraph>{`Would you like playlist: ${audioPlayer.playlists[audioPlayer.selectedPlaylistIndex].name}`}</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={onDialogYes}>Yes</Button>
            <Button onPress={onDialogNo}>No</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    }</React.Fragment>
  )
}
