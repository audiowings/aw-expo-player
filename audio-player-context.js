import React, { useState } from 'react'

export const AudioPlayerContext = React.createContext([{}, () => { }])

const AudioPlayerProvider = (props) => {
    const [audioPlayer, setAudioPlayer] = useState({
        playlists: {
            items: [{}]
        },
        selectedPlaylistIndex: 0,
        currentTrackIndex: 0,
        status: {}
    })
    return (
        <AudioPlayerContext.Provider value={[audioPlayer, setAudioPlayer]}>
            {props.children}
        </AudioPlayerContext.Provider>
    )
}

export default AudioPlayerProvider
