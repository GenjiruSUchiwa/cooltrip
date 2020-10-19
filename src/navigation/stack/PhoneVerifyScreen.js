import React from "react"
import styled from "styled-components"
import {Container, Logo, BR, Text} from "../../components/index"
import TextInput from "../../components/inputs/TextInput"
import Button from "../../components/buttons/Button"
import {Layout, Font} from "../../constants"
import Modal from "../../helpers/Modal"
import Firebase from "../../helpers/Firebase"
import Storage from "../../helpers/Storage"
import {requestErrorHandler} from "../../helpers"


export default class PhoneVerifyScreen extends React.Component {

  constructor(props) {
    super(props)

    this.phoneNumber = props.route.params ? props.route.params.phoneNumber : ''

    this.state = {
      code: ''
    }

    this._onCodeChange = this._onCodeChange.bind(this)
    this._onSubmit = this._onSubmit.bind(this)
  }

  componentDidMount() {
    Firebase.onAuthStateChanged(firebaseUser => {
      if (firebaseUser) {
        Storage.set('firebaseUser', firebaseUser.toJSON())

        this.props.navigation.navigate("Register")
      }
    })
  }

  _onCodeChange(newValue) {
    this.setState({
      code: newValue
    })
  }

  _onSubmit() {
    if (!this.state.code)
      return Modal.feedback.show({
        type: "error",
        title: "Champ requis",
        message: "Veuillez entrer le code de validation reçu par SMS.",
      })

    Firebase.confirm(this.state.code)
      .then(user => Firebase.triggerAuthStateChanged(user))
      .catch(requestErrorHandler)
  }

  render() {
    return (
      <LoginContainer>
        <Logo/>
        <InfoText>
          Un code de vérification a été envoyé par SMS au numéro <B>{this.phoneNumber}</B>, veuillez le saisir.
        </InfoText>
        <BR/>
        <TextInput
          placeholder="Code de vérification" keyboardType="numeric"
          value={this.state.code}
          onValueChange={this._onCodeChange}
        />
        <BR xl/>
        <Button onPress={this._onSubmit}>Vérifier</Button>
      </LoginContainer>
    )
  }
}

const LoginContainer = styled(Container)`
  padding: ${Layout.paddingXl}px;
`

const InfoText = styled(Text)`
  font-size: 16px;
`

const B = styled(InfoText)`
  font-family: ${Font.bold};
`
