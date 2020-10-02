import React, { useContext } from 'react'
import {
    StyleSheet,
    View,
    Switch,
    Text
} from 'react-native'
import { DeviceUserContext } from './_contexts/device-user-context'
import { DialogContext, ContextsEnum } from './_contexts/dialog-context'

export default function TopBar() {
    const [isSwitchOn, setIsSwitchOn] = React.useState(false)
    const [deviceUser, setDeviceUser] = useContext(DeviceUserContext)
    const [, setDialogState] = useContext(DialogContext)

    const onToggleSwitch = () => {
        if (!isSwitchOn) {
            setIsSwitchOn(true)
            // TODO: Check network state
            
            setDialogState(dialogState => ({ ...dialogState, currentContext: ContextsEnum.connectionModeSelect }))
        } else {
            setIsSwitchOn(false)
            setDialogState(dialogState => ({ ...dialogState, currentContext: ContextsEnum.notSet }))
            setDeviceUser(deviceUser => ({ ...deviceUser, isOnline: false, userInfo: {} }))
        }
    }

    return (
        <View style={styles.topBar}>
            <Switch value={isSwitchOn} onValueChange={onToggleSwitch} />
            <Text style={styles.text}>{isSwitchOn && deviceUser.userInfo ? `${deviceUser.userInfo.displayName}` : ``}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    topBar: {
        flexDirection: 'row',
        paddingStart: 16,
        height: 56
    },
    text: {
        paddingStart: 16,
        textAlignVertical: "center",
        color: '#FFFFFF'
    }
})