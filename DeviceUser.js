import * as Network from 'expo-network';

console.log('DEVICE USER')
const deviceId = async () => {
    try {
      deviceId = await Network.getMacAddressAsync()
    }
    catch (error) {
      console.log('Error getting MAC Address...', error)
    }
  }

const deviceUser = {
    deviceId: deviceId
}
export default deviceUser