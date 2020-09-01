import React, { useContext } from 'react'
import { Portal, Button, Dialog, Paragraph } from 'react-native-paper'
import { DialogContext } from './dialog-context'
import { AudioPlayerContext } from './audio-player-context'

export default function PlaylistsDialog() {
  const [dialogState, setDialogState] = useContext(DialogContext)
  const [audioPlayer, setAudioPlayer] = useContext(AudioPlayerContext)

  function requestPlaylist() {
    // TODO: Add code
  }
  const hideDialog = () => setDialogState(dialogState => ({ ...dialogState, playlistsDialogVisible: false }))

  const onDialogYes = () => {
    hideDialog()
    // requestPlaylist()
  }

  // User taps no
  const onDialogNo = () => {
    const notLastItem = audioPlayer.selectedPlaylist + 1 < audioPlayer.playlists.length
    const nextItem = notLastItem ? audioPlayer.selectedPlaylist + 1 : 0
    const setNextPlaylist = () => setAudioPlayer({ ...audioPlayer, selectedPlaylist: nextItem })
    setNextPlaylist()
  }

  return (
    <React.Fragment>{audioPlayer.playlists.length > 0 &&
      <Portal>
        <Dialog visible={dialogState.playlistsDialogVisible} onDismiss={hideDialog}>
          <Dialog.Title>Select Playlist</Dialog.Title>
          <Dialog.Content>
            <Paragraph>{`Would you like playlist: ${audioPlayer.playlists[audioPlayer.selectedPlaylist].name}`}</Paragraph>
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
