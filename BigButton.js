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
    }, [])

    useEffect(() => {
        audioPlayer.tracks && loadNewPlaybackInstance(true)
    }, [audioPlayer.tracks ])

    const resetPlaylistIndex = () => setAudioPlayer(audioPlayer => ({ ...audioPlayer, selectedPlaylistIndex: 0 }))

    const showPlaylistsDialog = async () => {
        resetPlaylistIndex()
        const _playlists = await getPlaylists(deviceUser.isOnline, deviceUser.deviceId)
        setAudioPlayer(audioPlayer => ({ ...audioPlayer, playlists: _playlists }))
        setDialogState(dialogState => ({ ...dialogState, playlistsDialogVisible: true }))
    }

    const setAudioMode = async () => {
        console.log('setAudioMode:')
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
        console.log('_onPlaybackStatusUpdate status:', {
            justfin: status.didJustFinish, 
            playing: status.isPlaying, 
            buffering: status.isBuffering, 
            trackname: audioPlayer.tracks[audioPlayer.currentTrackIndex].track.name,
            trackIndex: audioPlayer.currentTrackIndex
        })
        setAudioPlayer(audioPlayer => ({ ...audioPlayer, status: status }))


        if (status.isLoaded) {
            if (status.didJustFinish && !status.isLooping) {
                advanceTrackIndex()
                loadNewPlaybackInstance(true)
            }
        } else {
            if (status.error) {
                console.log(`FATAL PLAYER ERROR: ${status.error}`);
            }
        }
    }

    const advanceTrackIndex = () => {
        const notLastItem = audioPlayer.currentTrackIndex + 1 < audioPlayer.tracks.length
        const nextItemIndex = notLastItem ? audioPlayer.currentTrackIndex + 1 : 0
        setAudioPlayer(audioPlayer => ({ ...audioPlayer, currentTrackIndex: nextItemIndex }))
    }

    const loadNewPlaybackInstance = async (playing) => {
        console.log('loadNewPlaybackInstance:')
        console.log('playbackInstance != null:',playbackInstance != null )

        if (playbackInstance != null) {
            console.log('Unloading playback instance...')
            await playbackInstance.unloadAsync()
            playbackInstance = null
        }

        try {
            const currentTrack = audioPlayer.tracks[audioPlayer.currentTrackIndex].track
            const { sound, status } = await Audio.Sound.createAsync(
                { uri: currentTrack.preview_url },
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