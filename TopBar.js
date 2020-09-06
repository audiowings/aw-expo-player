import React, { useContext } from 'react'
import {
    StyleSheet,
    View,
    Switch,
    Text
} from 'react-native'
import Constants from 'expo-constants'
const PROXY_SERVER = Constants.manifest.extra.proxyUrl
import { DeviceUserContext } from './device-user-context'
import { DialogContext } from './dialog-context'
import { connectDms } from './AwClient'
import { AudioPlayerContext } from './audio-player-context'

export default function TopBar() {
    const [isSwitchOn, setIsSwitchOn] = React.useState(false)
    const [deviceUser, setDeviceUser] = useContext(DeviceUserContext)
    const [dialogState, setDialogState] = useContext(DialogContext)
    const [audioPlayer] = useContext(AudioPlayerContext)

    const showDialog = (title, body) => {
        setDialogState(dialogState => ({ ...dialogState, loginLinkDialogVisible: true, loginLinkDialogTitle: title, loginLinkDialogBody: body }))
    }

    const onToggleSwitch = () => {
        if (!isSwitchOn) {
            setIsSwitchOn(true)
            connectDms(deviceUser.deviceId)
                .then(_userInfo => {
                    console.log('USER:', _userInfo)

                    if (_userInfo.deviceId && _userInfo.deviceId === deviceUser.deviceId) {
                        setDeviceUser(deviceUser => ({
                            ...deviceUser,
                            isOnline: true,
                            displayName: _userInfo.displayName
                        }))
                        if (_userInfo.authMessage) {
                            const title = 'Login via browser'
                            const body = _userInfo.authMessage
                            showDialog(title, body)
                        }
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
            <Text style={styles.text}>{isSwitchOn && deviceUser.displayName ? `${deviceUser.displayName}: Online` : `Offline`}</Text>
            <Text style={styles.text}>{audioPlayer.selectedPlaylist && audioPlayer.currentTrack && `${audioPlayer.selectedPlaylist.name}: ${audioPlayer.currentTrack.name}`}</Text>
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
})