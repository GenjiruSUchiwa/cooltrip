import {CommonActions} from "@react-navigation/native"

export default {
  goTo(navigation, routeName) {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {name: routeName},
        ]
      })
    )
  },
  goToTrough(navigation, middleRouteName, targetRouteName, params = {}) {
    Promise.all([
      navigation.dispatch(
        CommonActions.reset({index: 0, routes: [{name: middleRouteName}]})
      )
    ])
      .then(() => navigation.navigate(targetRouteName, params))
  },
}
