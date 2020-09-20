import { Audio } from 'expo-av'


export const setAudioMode = async () => {
    try {
        await Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
            interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
            playsInSilentModeIOS: true,
            interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
            shouldDuckAndroid: true,
            staysActiveInBackground: true,
            playThroughEarpieceAndroid: true
        })
    } catch (e) {
        console.log(e)
    }
}

// Increment index, cycling through to zero when end of list is reached
export const getNextIndex = (currentIndex, list, shouldIncrement = true) => {
    return shouldIncrement ?
        (currentIndex + 1) % list.length :
        (currentIndex === 0 ? (list.length - 1) : (currentIndex - 1))
}