import React, { useContext, useEffect } from 'react'
import {
    StyleSheet,
    View,
    Text
} from 'react-native'
import {
    LongPressGestureHandler,
    TapGestureHandler,
    FlingGestureHandler,
    Directions,
    State,
} from 'react-native-gesture-handler'
import { Ionicons } from '@expo/vector-icons'
import { Audio } from 'expo-av'
import { DeviceUserContext } from './_contexts/device-user-context'
import { AudioPlayerContext } from './_contexts/audio-player-context'
import { DialogContext, ContextsEnum } from './_contexts/dialog-context'
import { connectDms, getPlaylists, getPlaylist, getProxyUrl } from './AwClient'

let playbackInstance = null
let currentTrackIndex = 0
let beginEvent, endEvent

export default function BigButton() {
    const [deviceUser, setDeviceUser] = useContext(DeviceUserContext)
    const [audioPlayer, setAudioPlayer] = useContext(AudioPlayerContext)
    const [dialogState, setDialogState] = useContext(DialogContext)

    useEffect(() => {
        setAudioMode()
    }, [])

    useEffect(() => {
        audioPlayer.tracks && loadNewPlaybackInstance(audioPlayer.currentTrackIndex, true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [audioPlayer.tracks])

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
                loadNextTrack((currentTrackIndex + 1) < audioPlayer.tracks.length)
            }
        } else {
            if (status.error) {
                console.log(`FATAL PLAYER ERROR: ${status.error}`)
            }
        }
    }

    const loadNextTrack = (shouldAdvance = true) => {
        loadNewPlaybackInstance(getNextIndex(currentTrackIndex, audioPlayer.tracks), shouldAdvance)
    }

    // Increment index, cycling through to zero when end of list is reached
    const getNextIndex = (currentIndex, list, shouldIncrement = true) => {
        return shouldIncrement
            ? (currentIndex + 1) % list.length
            : (currentIndex === 0 ? (list.length - 1) : (currentIndex - 1))
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


    const showPlaylistSelector = async () => {
        setAudioPlayer(audioPlayer => ({ ...audioPlayer, selectedPlaylistIndex: 0 }))
        const _playlists = await getPlaylists(getProxyUrl(), deviceUser.isOnline, deviceUser.deviceId)
        setAudioPlayer(audioPlayer => ({ ...audioPlayer, playlists: _playlists }))
        setDialogState(dialogState => ({ ...dialogState, currentContext: ContextsEnum.playlistSelect }))
    }

    const connectToProxy = () => {
        connectDms(getProxyUrl(), deviceUser.deviceId).then(_userInfo => {
            if (_userInfo.deviceId && _userInfo.deviceId === deviceUser.deviceId) {
                setDeviceUser(deviceUser => ({ ...deviceUser, isOnline: true, displayName: _userInfo.displayName }))
                if (_userInfo.authMessage) {
                    ContextsEnum.loginInstructions.body = _userInfo.authMessage
                    setDialogState(dialogState => ({ ...dialogState, currentContext: ContextsEnum.loginInstructions }))
                }
            }
        })
    }

    // presents the next context level up
    const _onLongPressButton = event => {
        if (event.nativeEvent.state === State.ACTIVE) {
            switch (dialogState.currentContext) {
                case ContextsEnum.audioTypeSelect: {
                    setDialogState(dialogState => ({ ...dialogState, currentContext: ContextsEnum.connectionModeSelect }))
                } break
                case ContextsEnum.playlistSelect: {
                    setDialogState(dialogState => ({ ...dialogState, currentContext: ContextsEnum.audioTypeSelect }))
                } break
                case ContextsEnum.trackSelect: {
                    setDialogState(dialogState => ({ ...dialogState, currentContext: ContextsEnum.playlistSelect }))
                    showPlaylistSelector()
                } break
            }

        }
    }

    // moves to the next / previous item in the list
    const _onFling = ({ nativeEvent }) => {
        if (nativeEvent.state === State.BEGAN) {
            beginEvent = nativeEvent
        }
        if (nativeEvent.state === State.END) {
            endEvent = nativeEvent
            // User has swiped right the index should increment, otherwise it will decerement
            const shouldIncrement = beginEvent.x < endEvent.x
            // Depends on currentContext
            switch (dialogState.currentContext) {
                case ContextsEnum.connectionModeSelect: {setDeviceUser(deviceUser => ({ ...deviceUser, connectionModeOptionOnline: !deviceUser.connectionModeOptionOnline }))
                } break
                case ContextsEnum.audioTypeSelect: {
                    setAudioPlayer(audioPlayer => ({...audioPlayer, audioTypeIndex: getNextIndex(audioPlayer.audioTypeIndex, ContextsEnum.audioTypeSelect.options, shouldIncrement)}))
                } break
                case ContextsEnum.playlistSelect: {
                    setAudioPlayer(audioPlayer => ({...audioPlayer, selectedPlaylistIndex: getNextIndex(audioPlayer.selectedPlaylistIndex, audioPlayer.playlists, shouldIncrement)}))
                } break
                case ContextsEnum.trackSelect: {
                    loadNextTrack(shouldIncrement)
                } break
            }
        }
    }

    // selects the current option
    const _onSingleTap = async event => {
        if (event.nativeEvent.state === State.ACTIVE) {
            switch (dialogState.currentContext) {
                case ContextsEnum.connectionModeSelect: {
                    deviceUser.connectionModeOptionOnline && connectToProxy()
                    setDialogState(dialogState => ({ ...dialogState, currentContext: ContextsEnum.audioTypeSelect }))
                } break
                case ContextsEnum.audioTypeSelect: {
                    showPlaylistSelector()
                } break
                case ContextsEnum.playlistSelect: {
                    const playlistUrl = audioPlayer.playlists[audioPlayer.selectedPlaylistIndex].tracks.href
                    const tracks = await getPlaylist(getProxyUrl(), deviceUser.isOnline, deviceUser.deviceId, playlistUrl)
                    ContextsEnum.trackSelect.subject = audioPlayer.playlists[audioPlayer.selectedPlaylistIndex].name

                    setAudioPlayer(audioPlayer => ({ ...audioPlayer, tracks: tracks, currentTrackIndex: 0 }))
                    setDialogState(dialogState => ({ ...dialogState, currentContext: ContextsEnum.trackSelect }))
                } break
                case ContextsEnum.trackSelect: {
                    audioPlayer.status && handlePlayPause()
                } break
                case ContextsEnum.loginInstructions: {
                    setDialogState(dialogState => ({ ...dialogState, currentContext: ContextsEnum.connectionModeSelect }))
                }
            }
        }
    }



    const handlePlayPause = async () => {
        const isPlaying = audioPlayer.status.isPlaying
        isPlaying ? await playbackInstance.pauseAsync() : await playbackInstance.playAsync()
    }

    const getIconName = () => {
        return audioPlayer.status.uri ? (audioPlayer.status.isPlaying ? 'md-pause' : 'md-play') : 'md-list'
    }

    // presents current option to user
    const getOptionText = () => {
        switch (dialogState.currentContext) {
            case ContextsEnum.connectionModeSelect: {
                return deviceUser.connectionModeOptionOnline ? 'Online' : 'Offline'
            }
            case ContextsEnum.loginInstructions: {
                console.log('dialogState.currentContext.loginInstructions', dialogState.currentContext)
                return dialogState.currentContext.subject
            }
            case ContextsEnum.audioTypeSelect: {
                return `${ContextsEnum.audioTypeSelect.options[audioPlayer.audioTypeIndex]}`
            }
            case ContextsEnum.playlistSelect: {
                return audioPlayer.playlists[audioPlayer.selectedPlaylistIndex].name
            }
            case ContextsEnum.trackSelect: {
                return audioPlayer.tracks[audioPlayer.currentTrackIndex].track.name
            }
        }
    }

    return (
        <LongPressGestureHandler onHandlerStateChange={_onLongPressButton} minDurationMs={800}>
            <TapGestureHandler onHandlerStateChange={_onSingleTap}>
                <FlingGestureHandler
                    direction={Directions.RIGHT | Directions.LEFT}
                    onHandlerStateChange={_onFling}>
                    <View style={styles.big_button} >
                        <Ionicons name={getIconName()} size={72} />
                        <View style={styles.prompt}>
                            <Text style={styles.promptContent}>{dialogState.currentContext.subject}</Text>
                            <Text style={styles.promptContent}>{getOptionText()}</Text>
                        </View>
                    </View>
                </FlingGestureHandler>
            </TapGestureHandler>
        </LongPressGestureHandler>
    )
}

const styles = StyleSheet.create({
    big_button: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: '#222222'
    },
    prompt: {
        position: 'absolute',
        top: 0,
        alignSelf: 'flex-start',
        padding: 16
    },
    promptContent: {
        color: '#CCCCCC',
        alignSelf: 'flex-start',
        height: 56,
        fontSize: 24
    }
})
