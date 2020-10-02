import React, { useState, createContext, useEffect } from 'react'
import { getDeviceDetails, getNetworkState } from '../_utils/networkDevice'

export const DeviceUserContext = createContext([{}, () => { }]);

const DeviceUserProvider = (props) => {
  const [deviceUser, setDeviceUser] = useState({
    isOnline: false,
    connectionModeOptionOnline: false
  })
  useEffect(() => {
    getDeviceInfo()
  }, [])

  const getDeviceInfo =  () => {
    // If real device, set deviceId to its MAC Address otherwise, (emulator) use hardcoded value
    const deviceDetails =  getDeviceDetails()
    const networkState =  getNetworkState()

    console.log('deviceDetails', deviceDetails, 'networkState', networkState)

    setDeviceUser(deviceUser => ({ ...deviceUser, deviceDetails: getDeviceDetails(), networkState: networkState }))
  }

  return (
    <DeviceUserContext.Provider value={[deviceUser, setDeviceUser]}>
      {/* eslint-disable-next-line react/prop-types*/}
      {props.children}
    </DeviceUserContext.Provider>
  );
}

export default DeviceUserProvider

