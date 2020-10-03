import React, { useContext } from 'react'
import {
    StyleSheet,
    View,
    Switch,
    Text
} from 'react-native'
import { DeviceUserContext } from './_contexts/device-user-context'
import { DialogContext, ContextsEnum } from './_contexts/dialog-context'
import { getDeviceDetails, getNetworkState } from './_utils/networkDevice'
import { connectDms, getProxyUrl } from './_utils/proxyClient'



export default function TopBar() {

    const [isSwitchOn, setIsSwitchOn] = React.useState(false)
    const [deviceUser, setDeviceUser] = useContext(DeviceUserContext)
    const [, setDialogState] = useContext(DialogContext)

        // If WIFI available change current context to connectionModeSelect, otherwise set to audioTypeSelect
        const setConnectionModeSelectIfWifi = async () => {
            const deviceDetails =  await getDeviceDetails()
            const networkState = await getNetworkState()
            if (networkState.type === 'WIFI') {
                deviceUser.connectionModeOptionOnline = true
                const userInfo = await connectDms(getProxyUrl(), deviceDetails.deviceId)
                setDeviceUser(deviceUser => ({ ...deviceUser, isOnline: true, userInfo: userInfo }))
            }
            setDialogState(dialogState => ({ ...dialogState, currentContext: ContextsEnum.audioTypeSelect }))
    
        }
    const onToggleSwitch = async () => {
        if (!isSwitchOn) {
            setIsSwitchOn(true)
            setConnectionModeSelectIfWifi()
        } else {
            setIsSwitchOn(false)
            setDialogState(dialogState => ({ ...dialogState, currentContext: ContextsEnum.notSet }))
            setDeviceUser(deviceUser => ({ ...deviceUser, isOnline: false, userInfo: {} }))
        }
    }

    return (
        <View style={styles.topBar}>
            <Switch value={isSwitchOn} onValueChange={onToggleSwitch} />
            <Text style={styles.text}>{deviceUser.userInfo && deviceUser.isOnline ? `${deviceUser.userInfo.displayName} Online` : 'Offline'}</Text>
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