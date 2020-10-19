import React from "react"
import {createStackNavigator as _createStackNavigator} from "@react-navigation/stack"
import {Font, Colors} from "../../../constants"
import Layout from "../../../constants/Layout"

const settings = {
  headerMode: "screen",
  screenOptions: {
    animationEnabled: false,
    headerTintColor: 'white',
    headerStyle: {
      backgroundColor: Colors.primary,
    },
    headerTitleAllowFontScaling: true,
    headerTitleStyle: {
      fontFamily: Font.regular,
      fontSize: 18
    },
    headerTitleContainerStyle: {
      left: 50
    },
    headerLeftContainerStyle: {
      width: 50,
      left: 0,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerRightContainerStyle: {
      minWidth: 50,
      alignItems: 'center',
    },
    // headerRight: ({}) => <NotificationsButton/>
  }
}

const Stack = _createStackNavigator()
export const createStackNavigator = nodes => () => (
  <Stack.Navigator {...settings}>
    {
      nodes.map((tab, i) => {
        const options = {}
        if (!i || (tab.options && tab.options.noBackButton)) {
          options.headerLeft = null
          options.headerTitleContainerStyle = {left: Layout.padding}
        }
        if (tab.options && tab.options.noHeaderShadow) {
          options.headerStyle = {
            ...settings.screenOptions.headerStyle,
            elevation: 0
          }
        }

        return (
          <Stack.Screen
            key={i} name={tab.name}
            component={tab.screen}
            options={{
              headerTitle: tab.title,
              ...options
            }}
          />
        )
      })
    }
  </Stack.Navigator>
)
