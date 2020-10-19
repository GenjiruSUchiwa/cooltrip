import {Dimensions, StatusBar, Platform} from "react-native"

const width = Dimensions.get("window").width
const height = Dimensions.get("window").height


export default {
  window: {
    width,
    height,
  },
  appBarHeight: 30 + ((Platform.OS === "ios") ? 20 : StatusBar.currentHeight),

  padding: width/40,
  paddingSm: width/80,
  paddingMd: width/40,
  paddingLg: width/20,
  paddingXl: width/15,

  borderRadius: 5,

  textInputHeight: 50, // unused :(
  passengerInputHeight: 40,
  listItemHeight: height/5
}
