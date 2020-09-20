import React, { useState, createContext, useEffect } from 'react'
import {getDeviceDetails, getNetworkState} from '../_utils/networkDevice'

export const DeviceUserContext = createContext([{}, () => { }]);

const DeviceUserProvider = async (props) => {
  const [deviceUser, setDeviceUser] = useState({
    isOnline: false,
    connectionModeOptionOnline: false
  })
  useEffect(() => {
    getDeviceInfo()
  }, [])

  const getDeviceInfo = async () => {
    // If real device, set deviceId to its MAC Address otherwise, (emulator) use hardcoded value
    const deviceDetails = await getDeviceDetails()
    const networkState = await getNetworkState()

    console.log('deviceDetails', deviceDetails, 'networkState', networkState)

    setDeviceUser(deviceUser => ({ ...deviceUser, deviceDetails: deviceDetails, networkState: networkState }))
  }

  return (
    <DeviceUserContext.Provider value={[deviceUser, setDeviceUser]}>
      {/* eslint-disable-next-line react/prop-types*/}
      {props.children}
    </DeviceUserContext.Provider>
  );
}

export default DeviceUserProvider

