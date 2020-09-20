import * as Network from 'expo-network';
import * as Device from 'expo-device';

const getDeviceId = async (hardCodedMacAddress) => {
    // If real device, set deviceId to its MAC Address otherwise, (emulator) use hardcoded value
    return Device.isDevice ? await Network.getMacAddressAsync() : hardCodedMacAddress
}

export const getDeviceDetails = async () => {
    return {
        deviceName: Device.deviceName,
        isRealDevice: Device.isDevice,
        deviceId: await getDeviceId('DE:6C:5D:45:11:DD')
    }
}

export const getNetworkState = async () => {
    return await Network.getNetworkStateAsync()
}

