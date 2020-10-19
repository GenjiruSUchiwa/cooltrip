import React from "react"
import styled from "styled-components"
import {Container, Logo, BR, Text} from "../../components"
import TextInput from "../../components/inputs/TextInput"
import Button from "../../components/buttons/Button"
import MultiSwitch from "../../components/inputs/MultiSwitch"
import {Layout, Colors} from "../../constants"
import {requestErrorHandler, Modal} from "../../helpers"
import Api, {mapUser, Routes} from "../../helpers/Api"
import Storage from "../../helpers/Storage"
import Navigation from "../../helpers/Navigation"
import Regex from "../../constants/Regex"


export default class RegisterScreen extends React.Component {

  genders = [
    {value: 'M', text: 'Homme', icon: 'male'},
    {value: 'F', text: 'Femme', icon: 'female'},
  ]

  userId = null
  phoneNumber = null

  constructor(props) {
    super(props)

    this.state = {
      gender: null,
      firstName: '',
      lastName: '',
      email: '',
    }

    this._onGenderChange = this._onGenderChange.bind(this)
    this._onFirstNameChange = this._onFirstNameChange.bind(this)
    this._onLastNameChange = this._onLastNameChange.bind(this)
    this._onEmailChange = this._onEmailChange.bind(this)
    this._onRegisterSuccess = this._onRegisterSuccess.bind(this)
    this._onSubmit = this._onSubmit.bind(this)
  }

  componentDidMount() {
    Storage.get("firebaseUser")
      .then(firebaseUser => {
        this.userId = firebaseUser.uid
        this.phoneNumber = firebaseUser.phoneNumber

        Api.post(Routes.user.RETRIEVE, {phoneNumber: this.phoneNumber})
          .then(user => {
            if (user && user.constructor === {}.constructor)
              this._onRegisterSuccess(user)
          })
          .catch(requestErrorHandler)
      })
  }

  _onGenderChange(newValue) {
    this.setState({
      gender: newValue
    })
  }

  _onFirstNameChange(newValue) {
    this.setState({
      firstName: newValue
    })
  }

  _onLastNameChange(newValue) {
    this.setState({
      lastName: newValue
    })
  }

  _onEmailChange(newValue) {
    this.setState({
      email: newValue.replace(/ /g, '')
    })
  }

  _onRegisterSuccess(user) {
    Storage.set("user", mapUser(user))
    Navigation.goTo(this.props.navigation, "Tabs")
  }

  _onSubmit() {
    const {gender, firstName, lastName, email} = this.state

    if (!gender)
      return Modal.feedback.show({
        type: "error",
        title: "Champ requis",
        message: "Veuillez sélectionner un genre.",
      })

    if (!firstName.length)
      return Modal.feedback.show({
        type: "error",
        title: "Entrée invalide",
        message: "Veuillez saisir un prénom.",
      })

    if (!lastName.length)
      return Modal.feedback.show({
        type: "error",
        title: "Entrée invalide",
        message: "Veuillez saisir un nom.",
      })

    if (email.length && !Regex.isValidEmail(email))
      return Modal.feedback.show({
        type: "error",
        title: "Entrée invalide",
        message: "Veuillez saisir une adresse email valide.",
      })

    Api.post(Routes.user.REGISTER, {
      uiid: this.userId,
      phone: this.phoneNumber,
      gender,
      surname: firstName,
      name: lastName,
      email
    })
      .then(this._onRegisterSuccess)
      .catch(requestErrorHandler)
  }

  render() {
    const {gender, firstName, lastName, email} = this.state

    return (
      <LoginContainer>
        <Logo/>
        <InfoText>
          Entrez vos informations personnelles et commencez à réserver en 3 clics.
        </InfoText>
        <BR xl/>
        <MultiSwitch
          color={Colors.text} label="Je suis"
          items={this.genders}
          value={gender}
          onValueChange={this._onGenderChange}
        />
        <BR/>
        <TextInput
          placeholder="Votre prénom"
          value={firstName}
          onValueChange={this._onFirstNameChange}
        />
        <BR/>
        <TextInput
          placeholder="Votre nom"
          value={lastName}
          onValueChange={this._onLastNameChange}
        />
        <BR/>
        <TextInput
          placeholder="Votre adresse e-mail (optionnelle)"
          value={email}
          onValueChange={this._onEmailChange}
        />
        <BR xl/>
        <Button onPress={this._onSubmit}>Enregistrer</Button>
      </LoginContainer>
    )
  }
}

const LoginContainer = styled(Container)`
  padding: ${Layout.paddingXl}px;
`

const InfoText = styled(Text)`
  font-size: 16px;
  margin-top: -50px;
`
