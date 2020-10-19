import React from "react"
import {createStackNavigator} from "@react-navigation/stack"
import SplashScreen from './stack/SplashScreen'
import LoginScreen from './stack/LoginScreen'
import PhoneVerifyScreen from './stack/PhoneVerifyScreen'
import RegisterScreen from './stack/RegisterScreen'
import TabNavigator from './stack/TabNavigator'

const settings = {
  initialRouteName: "Splash",
  headerMode: "none",
  screenOptions: {
    animationEnabled: false
  }
}

const nodes = [
  {name: "Splash", screen: SplashScreen},
  {name: "Login", screen: LoginScreen},
  {name: "Verify", screen: PhoneVerifyScreen},
  {name: "Register", screen: RegisterScreen},
  {name: "Tabs", screen: TabNavigator},
]

const Stack = createStackNavigator()
const StackNavigator = () => (
  <Stack.Navigator {...settings}>
    {
      nodes.map((tab, i) => (
        <Stack.Screen key={i} name={tab.name} component={tab.screen}/>
      ))
    }
  </Stack.Navigator>
)

export default StackNavigator
