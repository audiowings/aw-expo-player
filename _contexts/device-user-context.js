import React, { useState, createContext, useEffect } from 'react'
import * as Network from 'expo-network';

export const DeviceUserContext = createContext([{}, () => { }]);

const DeviceUserProvider = (props) => {
  const [deviceUser, setDeviceUser] = useState({
    online: false,
    connectionModeOptionOnline: false
  })
  useEffect(() => {
    getDeviceId()
  }, [])

  const getDeviceId = async () => {
    let _deviceId = await Network.getMacAddressAsync()

    // TODO: remove these lines post development      
    const devDeviceId = 'DE:6C:5D:45:11:DD'
    console.log('Actual _deviceId', _deviceId, 'switched to', devDeviceId)
    _deviceId = devDeviceId

    setDeviceUser(deviceUser => ({ ...deviceUser, deviceId: _deviceId, isOnline: false }))
  }

  return (
    <DeviceUserContext.Provider value={[deviceUser, setDeviceUser]}>
      {/* eslint-disable-next-line react/prop-types*/}
      {props.children}
    </DeviceUserContext.Provider>
  );
}

export default DeviceUserProvider

