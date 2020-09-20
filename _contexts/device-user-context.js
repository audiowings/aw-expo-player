import React, { useState, createContext, useEffect } from 'react'
import * as Network from 'expo-network';
import * as Device from 'expo-device';


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
    const _deviceId = Device.isDevice ? await Network.getMacAddressAsync() : 'DE:6C:5D:45:11:DD'
    console.log(Device.deviceName, (Device.isDevice ? 'Physical' : 'Emulator'), 'DeviceId', _deviceId)
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

