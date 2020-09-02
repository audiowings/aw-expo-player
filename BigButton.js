import React, { useContext } from 'react'
import {
    StyleSheet,
    View,
    TouchableOpacity
} from 'react-native'
import { DeviceUserContext } from './device-user-context'
import { AudioPlayerContext } from './audio-player-context'
import { DialogContext } from './dialog-context'
import { getPlaylists } from './AwClient'

export default BigButton = () => {
    const [deviceUser] = useContext(DeviceUserContext)
    const [audioPlayer, setAudioPlayer] = useContext(AudioPlayerContext)
    const [dialogState, setDialogState] = useContext(DialogContext)
    const resetPlaylistIndex = () => setAudioPlayer(audioPlayer => ({ ...audioPlayer, selectedPlaylist: 0 }))

    const showDialog = async () => {
        resetPlaylistIndex()
        const _playlists = await getPlaylists(deviceUser.isOnline, deviceUser.deviceId )
        // console.log('>-> Playlists data:', _playlists)
        setAudioPlayer(audioPlayer => ({ ...audioPlayer, playlists: _playlists, selectedPlaylist: 0 }))
        setDialogState(dialogState => ({ ...dialogState, playlistsDialogVisible: true }))
    }
    const _onLongPressButton = () => {
        showDialog()
    }
    return (
        <View style={{ flex: 1 }}>
            <TouchableOpacity onLongPress={_onLongPressButton} style={{ flex: 1 }}>
                <View style={styles.big_button} />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    big_button: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#222222'
    }
});