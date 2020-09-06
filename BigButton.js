import React, { useContext, useEffect } from 'react'
import {
    StyleSheet,
    View,
    TouchableOpacity
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Audio } from 'expo-av'
import { DeviceUserContext } from './device-user-context'
import { AudioPlayerContext } from './audio-player-context'
import { DialogContext } from './dialog-context'
import { getPlaylists } from './AwClient'

let playbackInstance = null


export default BigButton = () => {
    const [deviceUser] = useContext(DeviceUserContext)
    const [audioPlayer, setAudioPlayer] = useContext(AudioPlayerContext)
    const [dialogState, setDialogState] = useContext(DialogContext)

    useEffect(() => {
        setAudioMode()
        audioPlayer.currentTrack && loadNewPlaybackInstance(true)
    }, [audioPlayer.currentTrack])

    const resetPlaylistIndex = () => setAudioPlayer(audioPlayer => ({ ...audioPlayer, selectedPlaylistIndex: 0 }))

    const showPlaylistsDialog = async () => {
        resetPlaylistIndex()
        const _playlists = await getPlaylists(deviceUser.isOnline, deviceUser.deviceId)
        setAudioPlayer(audioPlayer => ({ ...audioPlayer, playlists: _playlists }))
        setDialogState(dialogState => ({ ...dialogState, playlistsDialogVisible: true }))
    }

    const setAudioMode = async () => {
        try {
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: false,
                interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
                playsInSilentModeIOS: true,
                interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
                shouldDuckAndroid: true,
                staysActiveInBackground: true,
                playThroughEarpieceAndroid: true
            })

        } catch (e) {
            console.log(e)
        }
    }

    _onPlaybackStatusUpdate = status => {

        if (status.isLoaded) {
            setAudioPlayer(audioPlayer => ({ ...audioPlayer, status: status }))
            if (status.didJustFinish && !status.isLooping) {
                advanceTrack();
                // _updatePlaybackInstanceForIndex(true);
            }
        } else {
            if (status.error) {
                console.log(`FATAL PLAYER ERROR: ${status.error}`);
            }
        }
    }

    const advanceTrack = () => {
        console.log('status', status)

        const notLastItem = audioPlayer.currentTrackIndex + 1 < audioPlayer.loadedPlaylist.length
        const nextItem = notLastItem ? audioPlayer.currentTrackIndex + 1 : 0
        setAudioPlayer({ ...audioPlayer, currentTrackIndex: nextItem })
    }

    const loadNewPlaybackInstance = async (playing) => {
        if (playbackInstance != null) {
            await playbackInstance.unloadAsync();
            playbackInstance = null;
        }

        try {
            const { sound, status } = await Audio.Sound.createAsync(
                { uri: audioPlayer.currentTrack.preview_url },
                { shouldPlay: playing },
                _onPlaybackStatusUpdate
            )
            playbackInstance = sound
            setAudioPlayer(audioPlayer => ({ ...audioPlayer, status: status }))

        } catch (error) {
            console.log('Error:', error)
        }
    }

    const _onLongPressButton = () => {
        showPlaylistsDialog()
    }

    const handlePlayPause = async () => {
        const isPlaying = audioPlayer.status.isPlaying
        isPlaying ? await playbackInstance.pauseAsync() : await playbackInstance.playAsync()
        setAudioPlayer(audioPlayer => ({ ...audioPlayer, status: { isPlaying: !isPlaying } }))
    }



    const _onPressButton = () => {
        audioPlayer.status && handlePlayPause()
    }

    const getIconName = () => {
        return audioPlayer.status ? (audioPlayer.status.isPlaying ? 'md-pause' : 'md-play') : null
    }

    return (
        <View style={{ flex: 1 }}>
            <TouchableOpacity onLongPress={_onLongPressButton} onPress={_onPressButton} style={{ flex: 1 }}>
                <View style={styles.big_button} ><Ionicons name={getIconName()} size={72} /></View>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    big_button: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: '#222222'
    }
});