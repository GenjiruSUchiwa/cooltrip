import React from "react"
import styled from "styled-components"
import {Container, BR} from "../../../../components"
import _TextInput from "../../../../components/inputs/TextInput"
import _DateInput from "../../../../components/inputs/DateInput"
import _IDInput from "../../../../components/inputs/IDInput"
import Button from "../../../../components/buttons/Button"
import MultiSwitch from "../../../../components/inputs/MultiSwitch"
import {Layout} from "../../../../constants"
import Api, {mapUser, Routes} from "../../../../helpers/Api"
import Modal from "../../../../helpers/Modal"
import Storage from "../../../../helpers/Storage"
import Regex from "../../../../constants/Regex"
import Colors from "../../../../constants/Colors"
import Date from "../../../../helpers/Date"


export default class EditProfileScreen extends React.Component {

  genders = [
    {value: 'M', text: 'Homme', icon: 'male'},
    {value: 'F', text: 'Femme', icon: 'female'},
  ]

  userId = null

  constructor(props) {
    super(props)

    this.state = {
      gender: null,
      firstName: '',
      lastName: '',
      birthDate: {},
      identification: {
        type: 'CNI',
        number: ''
      },
      email: '',
    }

    this._onGenderChange = this._onGenderChange.bind(this)
    this._onFirstNameChange = this._onFirstNameChange.bind(this)
    this._onLastNameChange = this._onLastNameChange.bind(this)
    this._onBirthDateChange = this._onBirthDateChange.bind(this)
    this._onIdentificationChange = this._onIdentificationChange.bind(this)
    this._onEmailChange = this._onEmailChange.bind(this)
    this._onSubmit = this._onSubmit.bind(this)
  }

  componentDidMount() {
    Storage.getMultiple(["identification", "user"], [{type: 'CNI', number: ''}])
      .then(data => {
        this.userId = data.user.id
        this.setState({
          gender: data.user.gender,
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          birthDate: Date.fromIso(data.user.birthDate),
          identification: data.identification,
          email: data.user.email || "",
        })
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

  _onBirthDateChange(newValue) {
    this.setState({
      birthDate: newValue
    })
  }

  _onIdentificationChange(newValue) {
    this.setState({
      identification: newValue
    })
  }

  _onEmailChange(newValue) {
    this.setState({
      email: newValue.replace(/ /g, '')
    })
  }

  _onSubmit() {
    const {gender, firstName, lastName, birthDate, identification, email} = this.state

    if (!gender)
      return Modal.feedback.show({
        type: "error",
        title: "Champ requis",
        message: "Veuillez sélectionner un sexe.",
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

    if (!(birthDate && birthDate.fr))
      return Modal.feedback.show({
        type: "error",
        title: "Entrée invalide",
        message: "Veuillez cliquer sur le calendrier pour sélectionner votre date de naissance",
      })

    if (!(identification && ((identification.type === "MIN") || (identification.number && identification.number.length))))
      return Modal.feedback.show({
        type: "error",
        title: "Entrée invalide",
        message: "Veuillez entrer le numéro de votre pièce d'identité",
      })

    if (email.length && !Regex.isValidEmail(email))
      return Modal.feedback.show({
        type: "error",
        title: "Entrée invalide",
        message: "Veuillez saisir une adresse email valide.",
      })

    Api.put(Routes.user.UPDATE, {
      uiid: this.userId,
      gender,
      surname: firstName,
      name: lastName,
      bornDate: birthDate.iso,
      email
    })
      .then(user => {
        Storage.set("user", mapUser(user))
        Storage.set("identification", identification)
        this.props.navigation.navigate("Account", {refresh: true})
      })
      .catch(error => Modal.feedback.show({
        type: "error",
        title: "OUPS !",
        message: error.message,
      }))
  }

  render() {
    const {gender, firstName, lastName, birthDate, identification, email} = this.state

    return (
      <LoginContainer>
        <ScrollView>
          <MultiSwitch
            color={Colors.text} label="Je suis"
            items={this.genders}
            value={gender}
            onValueChange={this._onGenderChange}
          />
          <TextInput
            placeholder="Votre prénom"
            value={firstName}
            onValueChange={this._onFirstNameChange}
          />
          <TextInput
            placeholder="Votre nom"
            value={lastName}
            onValueChange={this._onLastNameChange}
          />
          <DateInput
            placeholder="Date de naissance"
            value={birthDate}
            onValueChange={this._onBirthDateChange}
          />
          <IDInput
            placeholder="Numéro de la pièce"
            value={identification}
            onValueChange={this._onIdentificationChange}
          />
          <TextInput
            placeholder="Votre adresse e-mail (recommandée)"
            value={email}
            onValueChange={this._onEmailChange}
          />
          <BR xl/>
          <Button onPress={this._onSubmit}>Enregistrer</Button>
        </ScrollView>
      </LoginContainer>
    )
  }
}

const LoginContainer = styled(Container)`
  padding: ${Layout.paddingXl}px;
`

const ScrollView = styled.ScrollView.attrs(props => ({keyboardShouldPersistTaps: "always"}))`
  flex: 1;
  width: 100%;
`

const TextInput = styled(_TextInput)`
  margin-top: ${Layout.padding}px;
`

const DateInput = styled(_DateInput)`
  margin-top: ${Layout.padding}px;
`

const IDInput = styled(_IDInput)`
  margin-top: ${Layout.padding}px;
`
