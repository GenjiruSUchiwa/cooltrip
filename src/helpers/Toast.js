import {ToastAndroid} from "react-native"

export default {
    show(message) {
        ToastAndroid.show(
            message,
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM
        )
    }
}
