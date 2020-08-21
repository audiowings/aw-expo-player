import React, { useState, createContext } from 'react'

export const DialogContext = createContext([{ }, () => { }])

const DialogContextProvider = (props) => {
    const [dialogState, setDialogState] = useState({playlistsDialogVisible: false});

    return (
        <DialogContext.Provider value={[dialogState, setDialogState]}>
            {props.children}
        </DialogContext.Provider>
    )
}

export default DialogContextProvider