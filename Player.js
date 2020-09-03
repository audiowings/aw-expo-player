import React, { useContext, useEffect } from 'react'
import { View } from 'react-native';
import { Audio } from "expo-av";
import { AudioPlayerContext } from './audio-player-context'
let playbackInstance = null

export default function Player() {
    const [audioPlayer, setAudioPlayer] = useContext(AudioPlayerContext)

    useEffect(() => {
        console.log('Track:', audioPlayer.currentTrack.name)
        _loadNewPlaybackInstance(true)
    }, [audioPlayer.currentTrack]);

    const _loadNewPlaybackInstance = async (playing) => {
        if (playbackInstance != null) {
            await playbackInstance.unloadAsync();
            playbackInstance = null;
        }
        const source = { uri: audioPlayer.currentTrack.preview_url };
        const initialStatus = {
            shouldPlay: playing,
        };

        const { sound, status } = await Audio.Sound.createAsync(
            source,
            initialStatus,
        );
        playbackInstance = sound

    }
    return (
        <View />
    )
}
