import React, { useState, createContext } from 'react'

export const DialogContext = createContext([{}, () => { }])

const contentChannels = ['Music', 'Workout', 'Audiobook']

export const ContextsEnum = Object.freeze({
    "notSet": { index: 0 },
    "connectionModeSelect": { index: 1, subject: 'Choose Connection Mode' },
    "audioTypeSelect": { index: 2, subject: 'Choose Content Channel', options: contentChannels },
    "playlistSelect": { index: 3, subject: 'Choose Playlist' },
    "trackSelect": { index: 4 },
    'loginInstructions': { index: 5, subject: 'Login via browser' }
})

const DialogContextProvider = (props) => {
    const [dialogState, setDialogState] = useState({
        loginLinkDialogVisible: false,
        playlistsDialogVisible: false,
        currentContext: ContextsEnum.notSet
    });

    return (
        <DialogContext.Provider value={[dialogState, setDialogState]}>
            {/* eslint-disable-next-line react/prop-types*/}
            {props.children}
        </DialogContext.Provider>
    )
}

export default DialogContextProvider
