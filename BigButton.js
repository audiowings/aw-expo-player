import React, { useContext, useEffect } from 'react'
import {
    StyleSheet,
    View,
    TouchableOpacity
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Audio } from 'expo-av'
import { DeviceUserContext } from './_contexts/device-user-context'
import { AudioPlayerContext } from './_contexts/audio-player-context'
import { DialogContext } from './_contexts/dialog-context'
import { getPlaylists, getProxyUrl } from './AwClient'

let playbackInstance = null
let currentTrackIndex = 0

export default function BigButton() {
    const [deviceUser] = useContext(DeviceUserContext)
    const [audioPlayer, setAudioPlayer] = useContext(AudioPlayerContext)
    const [, setDialogState] = useContext(DialogContext)

    useEffect(() => {
        setAudioMode()
    }, [])

    useEffect(() => {
        audioPlayer.tracks && loadNewPlaybackInstance(audioPlayer.currentTrackIndex, true)
    }, [audioPlayer.tracks])

    const resetPlaylistIndex = () => setAudioPlayer(audioPlayer => ({ ...audioPlayer, selectedPlaylistIndex: 0 }))

    const showPlaylistsDialog = async () => {
        resetPlaylistIndex()
        const _playlists = await getPlaylists(getProxyUrl(), deviceUser.isOnline, deviceUser.deviceId)
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

    const _onPlaybackStatusUpdate = status => {
        setAudioPlayer(audioPlayer => ({ ...audioPlayer, status: status }))
        if (status.isLoaded) {
            if (status.didJustFinish && !status.isLooping) {
                // set isPlaying depending on whether were on the last track in the list...
                loadNewPlaybackInstance(getNextTrackIndex(), ((currentTrackIndex + 1) < audioPlayer.tracks.length))
            }
        } else {
            if (status.error) {
                console.log(`FATAL PLAYER ERROR: ${status.error}`);
            }
        }
    }

    const getNextTrackIndex = () => {
        return (currentTrackIndex + 1) % audioPlayer.tracks.length
    }

    const loadNewPlaybackInstance = async (trackIndex, playing) => {
        if (playbackInstance != null) {
            await playbackInstance.unloadAsync()
            playbackInstance = null
        }

        try {
            const currentTrack = audioPlayer.tracks[trackIndex].track
            const { sound, status } = await Audio.Sound.createAsync(
                { uri: currentTrack.preview_url },
                { shouldPlay: playing },
                _onPlaybackStatusUpdate
            )
            playbackInstance = sound
            setAudioPlayer(audioPlayer => ({ ...audioPlayer, status: status, currentTrackIndex: trackIndex }))
            currentTrackIndex = trackIndex
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
    }

    const _onPressButton = () => {
        audioPlayer.status && handlePlayPause()
    }

    const getIconName = () => {
        return audioPlayer.status.uri ? (audioPlayer.status.isPlaying ? 'md-pause' : 'md-play') : null
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