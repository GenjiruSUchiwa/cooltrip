import React from "react"
import {Keyboard} from "react-native"
import {createMaterialTopTabNavigator} from "@react-navigation/material-top-tabs"
import styled from "styled-components"
import FAIcon from "react-native-vector-icons/FontAwesome"
import {Colors, Font, Layout} from "../../constants"
import {Text} from "../../components"
import {createStackNavigator} from "./tabs"

// Search tab
import BookSummaryScreen from "./tabs/search/BookSummaryScreen"
import BookScreen from "./tabs/search/BookScreen"
import HomeScreen from "./tabs/search/HomeScreen"
import SearchScreen from "./tabs/search/SearchScreen"
import PaymentScreen from "./tabs/search/PaymentScreen"

// Bookings tab
import BookingsScreen from "./tabs/bookings/BookingsScreen"

// Account tab
import AccountScreen from "./tabs/account/AccountScreen"
import EditProfileScreen from "./tabs/account/EditProfileScreen"

// More tab
import MoreScreen from "./tabs/more/MoreScreen"


const tabs = [
  {
    name: "SearchTab",
    icon: "search",
    label: "Rechercher",
    stack: createStackNavigator([
      {name: "Home", screen: HomeScreen, title: '', options: {noHeaderShadow: true}},
      {name: "Search", screen: SearchScreen, title: "Résultats de votre recherche...", options: {noBackButton: true}},
      {name: "Book", screen: BookScreen, title: "Enregistrement des passagers"},
      {name: "BookSummary", screen: BookSummaryScreen, title: "Résumé de votre réservation"},
      {name: "Payment", screen: PaymentScreen, title: "Paiement"},
    ])
  },
  {
    name: "BookingsTab",
    icon: "tasks",
    label: "Mes réservations",
    stack: createStackNavigator([
      {name: "Bookings", screen: BookingsScreen, title: "Mes réservations"},
    ])
  },
  {
    name: "AccountTab",
    icon: "user",
    label: "Mon compte",
    stack: createStackNavigator([
      {name: "Account", screen: AccountScreen, title: "Mon compte"},
      {name: "EditProfile", screen: EditProfileScreen, title: "Modifier mon profil"},
    ])
  },
  {
    name: "MoreTab",
    icon: "ellipsis-h",
    label: "Plus",
    stack: createStackNavigator([
      {name: "More", screen: MoreScreen, title: "Plus d'options"},
    ])
  },
]

const settings = keyboardVisible => ({
  tabBarPosition: 'bottom',
  tabBarOptions: {
    style: {
      display: keyboardVisible ? "none" : "flex"
    },
    tabStyle: {
      textAlign: 'center',
      justifyContent: 'center',
    },
    activeTintColor: Colors.primary,
    inactiveTintColor: Colors.placeholder,
    indicatorStyle: {
      backgroundColor: 'white'
    },
    showIcon: true,
    iconStyle: {},
    showLabel: true
  },
  backBehavior: "initialRoute"
})

const Tab = createMaterialTopTabNavigator()
const TabNavigator = () => {

  const [keyboardVisible, setKeyboardVisible] = React.useState(false)
  const keyboardDidShowListener = React.useRef(null)
  const keyboardDidHideListener = React.useRef(null)

  React.useEffect(() => {
    keyboardDidShowListener.current = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true))
    keyboardDidHideListener.current = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false))

    return () => {
      keyboardDidShowListener.current.remove()
      keyboardDidHideListener.current.remove()
    }
  }, [])

  return (
    <Tab.Navigator {...settings(keyboardVisible)}>
      {
        tabs.map((tab, i) => (
          <Tab.Screen
            key={i} name={tab.name}
            component={tab.stack}
            options={{
              tabBarIcon: ({focused, color}) => (
                <IconContainer>
                  <FAIcon name={tab.icon} color={color} size={20}/>
                </IconContainer>
              ),
              tabBarLabel: ({focused, color}) => focused
                ? (
                  <LabelContainer>
                    <TabLabel>{tab.label}</TabLabel>
                  </LabelContainer>
                )
                : null,
            }}
          />
        ))
      }
    </Tab.Navigator>
  )
}

const IconContainer = styled.View`
  align-items: center;
`

const LabelContainer = styled.View`
  width: ${Layout.window.width / 4}px;
  height: 8px;
  margin-left: ${-Layout.window.width / 8}px;
  align-items: center;
  justify-content: center;
  position: absolute;
  border: 0 solid black;
`

const TabLabel = styled(Text)`
  font-size: 8px;
  width: 100%;
  color: ${Colors.primary};
  text-align: center;
  font-family: ${Font.bold};
`

export default TabNavigator
