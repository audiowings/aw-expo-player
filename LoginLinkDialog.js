import React, { useContext } from 'react'
import { Portal, Button, Dialog, Paragraph } from 'react-native-paper'
import Constants from 'expo-constants'
const PROXY_SERVER = Constants.manifest.extra.proxyUrl
import { DialogContext } from './dialog-context'

export default function LoginLinkDialog() {
  const [dialogState, setDialogState] = useContext(DialogContext)

  const hideDialog = () => setDialogState(dialogState => ({ ...dialogState, loginLinkDialogVisible: false }))

  const onDialogOk = () => {
    hideDialog()
  }

  return (
    <Portal>
      <Dialog visible={dialogState.loginLinkDialogVisible} onDismiss={hideDialog}>
        <Dialog.Title>Login via browser</Dialog.Title>
        <Dialog.Content>
          <Paragraph selectable={true}>{`Visit ${PROXY_SERVER}/spotifylogin/3BtK1ripPNwYzeekNSYo to access your Spotify content via this device`}</Paragraph>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDialogOk}>Ok</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  )
}
