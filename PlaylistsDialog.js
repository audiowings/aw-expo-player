import React, { useContext } from 'react'
import {
  View
} from 'react-native'
import { Provider as Button, Dialog, Paragraph } from 'react-native-paper';
import { Portal } from 'react-native-paper';
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
    hideDialog
    // requestPlaylist()
  }

  const onDialogNo = () => {
    const notLastItem = audioPlayer.selectedPlaylist + 1 < audioPlayer.playlists.length
    const nextItem = notLastItem ? audioPlayer.selectedPlaylist + 1 : 0
    const setNextPlaylist = () => setAudioPlayer({ ...audioPlayer, selectedPlaylist: nextItem })
    setNextPlaylist()
  }
  console.log('dialogState', dialogState)


  if (dialogState.playlistsDialogVisible) {
    return (
      // <View>
      //   <Portal>
      //     <Dialog visible={dialogState.playlistsDialogVisible} onDismiss={hideDialog}>
      //       <Dialog.Title>Alert</Dialog.Title>
      //       <Dialog.Content>
      //         <Paragraph>This is simple dialog</Paragraph>
      //       </Dialog.Content>
      //       <Dialog.Actions>
      //         <Button onPress={onDialogYes}>Yes</Button>
      //         <Button onPress={onDialogNo}>No</Button>
      //       </Dialog.Actions>
      //     </Dialog>
      //   </Portal>
      // </View>
      <View>
      <Button onPress={showDialog}>Show Dialog</Button>
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>Alert</Dialog.Title>
          <Dialog.Content>
            <Paragraph>This is simple dialog</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Done</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
    )
  } else return null
}