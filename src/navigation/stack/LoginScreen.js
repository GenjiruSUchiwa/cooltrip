import React from "react"
import {Linking} from "react-native"
import CheckBox from "@react-native-community/checkbox"
import styled from "styled-components"
import {Container, Logo, BR, Block, Text} from "../../components"
import TelInput from "../../components/inputs/TelInput"
import Button from "../../components/buttons/Button"
import {Layout, Colors} from "../../constants"
import Modal from "../../helpers/Modal"
import Regex from "../../constants/Regex"
import Firebase from "../../helpers/Firebase"
import Storage from "../../helpers/Storage"
import {Routes} from "../../helpers/Api"
import {requestErrorHandler} from "../../helpers"


export default class LoginScreen extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      phoneNumber: {},
      policyAccepted: false
    }

    this._onPhoneNumberChange = this._onPhoneNumberChange.bind(this)
    this._onAcceptPolicyChange = this._onAcceptPolicyChange.bind(this)
    this._onSubmit = this._onSubmit.bind(this)
  }

  _onPhoneNumberChange(newValue) {
    this.setState({
      phoneNumber: newValue
    })
  }

  _onAcceptPolicyChange(newValue) {
    if (newValue === undefined)
      newValue = !this.state.policyAccepted

    this.setState({
      policyAccepted: newValue
    })
  }

  onPolicyLinkClick() {
    Linking.openURL(Routes.links.POLICY)
  }

  _onSubmit() {
    const phoneNumber = this.state.phoneNumber.code + this.state.phoneNumber.number
    if (!Regex.isValidPhoneNumber(phoneNumber))
      return Modal.feedback.show({
        type: "error",
        title: "Entrée non valide",
        message: "Veuillez entrer un numéro de téléphone valide.",
      })

    if (!this.state.policyAccepted)
      return Modal.feedback.show({
        type: "error",
        title: "Action requise",
        message: "Veuillez accepter les conditions d'utilisation de CoolTrip pour continuer.",
      })

    Storage.set("phoneNumber", this.state.phoneNumber)

    Firebase.auth(phoneNumber)
      .then(() => this.props.navigation.navigate("Verify", {phoneNumber}))
      .catch(requestErrorHandler)
  }

  render() {
    return (
      <LoginContainer>
        <Logo/>
        <TelInput
          placeholder="Votre n° de téléphone"
          value={this.state.phoneNumber}
          onValueChange={this._onPhoneNumberChange}
        />
        <BR/>
        <CheckboxContainer>
          <CheckBox
            color={Colors.secondary}
            value={this.state.policyAccepted}
            onValueChange={this._onAcceptPolicyChange}
            tintColors={{
              true: Colors.secondary
            }}
          />
          <CheckboxText>
            J'ai lu et j'accepte les &nbsp;
            <PolicyLink onPress={this.onPolicyLinkClick}>
              conditions générales d'utilisation
            </PolicyLink>
            &nbsp; de CoolTrip.
          </CheckboxText>
        </CheckboxContainer>
        <BR xl/>
        <Button onPress={this._onSubmit}>Continuer</Button>
      </LoginContainer>
    )
  }
}

const LoginContainer = styled(Container)`
  padding: ${Layout.paddingXl}px;
`

const CheckboxContainer = styled(Block)`
  flex-direction: row;
`

const CheckboxText = styled(Text)`
  font-size: 16px;
  flex: 1;
`

const PolicyLink = styled(CheckboxText)`
  color: ${Colors.primary};
  text-decoration: underline;
  margin-left: ${Layout.paddingSm}px;
`
