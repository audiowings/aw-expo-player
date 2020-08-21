import React, { useState, useEffect} from 'react'

export const DialogContext = React.createContext([{}, () => {}])

const DialogContextProvider = (props) => {
    const [dialogState, setDialogState] = useState({});
    useEffect(() => {
        setDialogState(dialogState => ({ ...dialogState, playlistsDialogVisible: false }))
    }, [] )
    return (
        <DialogContext.Provider value={[dialogState, setDialogState]}>
            {props.children}
        </DialogContext.Provider>
    )
}

export default DialogContextProvider