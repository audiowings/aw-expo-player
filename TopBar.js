import React, { useContext } from 'react'
import {
    StyleSheet,
    View,
    Switch,
    Text
} from 'react-native'
import { DeviceUserContext } from './_contexts/device-user-context'
import { DialogContext, ContextsEnum } from './_contexts/dialog-context'
import { AudioPlayerContext } from './_contexts/audio-player-context'

export default function TopBar() {
    const [isSwitchOn, setIsSwitchOn] = React.useState(false)
    const [deviceUser] = useContext(DeviceUserContext)
    const [, setDialogState] = useContext(DialogContext)
    const [audioPlayer] = useContext(AudioPlayerContext)


    const onToggleSwitch = () => {

        // TODO: change functionality to device active toggle
        if (!isSwitchOn) {
            setIsSwitchOn(true)
            setDialogState(dialogState => ({ ...dialogState, currentContext: ContextsEnum.connectionModeSelect }))
        } else {
            setIsSwitchOn(false)
            setDialogState(dialogState => ({ ...dialogState, currentContext: ContextsEnum.notSet }))
        }
    }

    return (
        <View style={styles.topBar}>
            <Switch value={isSwitchOn} onValueChange={onToggleSwitch} />
            <Text style={styles.text}>{isSwitchOn && deviceUser.displayName ? `${deviceUser.displayName}: Online` : `Offline`}</Text>
            <Text style={styles.text}>{audioPlayer.status.uri &&
                `${audioPlayer.playlists[audioPlayer.selectedPlaylistIndex].name}: ${audioPlayer.tracks[audioPlayer.currentTrackIndex].track.name}`}</Text>
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