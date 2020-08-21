import React, { useContext } from 'react'
import {
    StyleSheet,
    View,
    Switch,
    Text
} from 'react-native';
import { DeviceUserContext } from './device-user-context'
import { connectDms } from './AwClient'

export default function TopBar() {
    const [isSwitchOn, setIsSwitchOn] = React.useState(false)
    const [deviceUser, setDeviceUser] = useContext(DeviceUserContext)

    const onToggleSwitch = () => {
        if (!isSwitchOn) {
            setIsSwitchOn(true)
            connectDms(deviceUser.deviceId)
                .then(_userInfo => {
                    if (_userInfo.deviceId && _userInfo.deviceId === deviceUser.deviceId) {
                        setDeviceUser(deviceUser => ({
                            ...deviceUser,
                            isOnline: true,
                            displayName: _userInfo.displayName
                        }))
                    } else {
                        setIsSwitchOn(false)
                    }
                })
        } else {
            setIsSwitchOn(false)
            setDeviceUser(deviceUser => ({
                ...deviceUser,
                isOnline: false,
                displayName: ''
            }))
        }
    }

    return (
        <View style={styles.topBar}>
            <Switch value={isSwitchOn} onValueChange={onToggleSwitch} />
            <Text style={styles.text}>{isSwitchOn && deviceUser.displayName ? `${deviceUser.displayName}: Online` : `${deviceUser.deviceId}: Offline`}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    topBar: {
        flexDirection: 'row',
        height: 56
    },
    text: {
        paddingStart: 16,
        textAlignVertical: "center",
        color: '#FFFFFF'
    }
});