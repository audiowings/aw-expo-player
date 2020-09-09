import React, { useContext } from 'react'
import { Portal, Button, Dialog, Paragraph } from 'react-native-paper'
import { DialogContext } from './_contexts/dialog-context'

export default function LoginLinkDialog() {
  const [dialogState, setDialogState] = useContext(DialogContext)

  const hideDialog = () => setDialogState(dialogState => ({ ...dialogState, loginLinkDialogVisible: false }))

  const onDialogOk = () => {
    hideDialog()
  }

  return (
    <Portal>
      <Dialog visible={dialogState.loginLinkDialogVisible} onDismiss={hideDialog}>
        <Dialog.Title>{dialogState.loginLinkDialogTitle}</Dialog.Title>
        <Dialog.Content>
          <Paragraph selectable={true}>{dialogState.loginLinkDialogBody}</Paragraph>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDialogOk}>Ok</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  )
}
