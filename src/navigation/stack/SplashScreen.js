import React from "react"
import styled from "styled-components"
import {Container, Logo, Text} from "../../components"
import Storage from "../../helpers/Storage"
import Navigation from "../../helpers/Navigation"
import {CommonActions} from "@react-navigation/native"


export default class SplashScreen extends React.Component {

  constructor(props) {
    super(props)

    this._goTo = this._goTo.bind(this)
  }

  componentDidMount() {
    Storage.get("user")
      .then(user => {
        if (user)
          return this._goTo("Tabs")

        Storage.get("firebaseUser")
          .then(firebaseUser => {
            if (firebaseUser)
              return this._goTo("Register")

            this._goTo("Login")
          })
      })
  }

  _goTo(routeName) {
    Navigation.goTo(this.props.navigation, routeName)
  }

  render() {
    return (
      <Container>
        <Logo/>
        <Baseline>Voyager devient un plaisir.</Baseline>
      </Container>
    )
  }
}

const Baseline = styled(Text)`
  margin-top: -50px;
`
