import React, { useState, createContext } from 'react'

export const DialogContext = createContext([{}, () => { }])

// const connectionModes = ['Offline', 'Online']
const audioTypes = ['Music', 'Workout', 'Audiobook']

export const ContextsEnum = Object.freeze({
    "notSet": { index: 0},
    "connectionModeSelect": { index: 1, subject: 'Connection Mode', online: false },
    "audioTypeSelect": { index: 2, subject: 'Audio Type', options: audioTypes },
    "playlistSelect": { index: 3, subject: 'Playlist' },
    "trackSelect": { index: 4, subject: 'Track' },
    'loginInstructions': { index: 5, subject: 'Login via browser'}
})

const DialogContextProvider = (props) => {
    
    const [dialogState, setDialogState] = useState({
        loginLinkDialogVisible: false,
        playlistsDialogVisible: false,
        currentContext: ContextsEnum.notSet
    });

    return (
        <DialogContext.Provider value={[dialogState, setDialogState]}>
            {props.children}
        </DialogContext.Provider>
    )
}

export default DialogContextProvider
