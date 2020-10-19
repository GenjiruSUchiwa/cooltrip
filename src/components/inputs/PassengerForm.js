import React from "react"
import FAIcon from "react-native-vector-icons/FontAwesome"
import styled from "styled-components"
import TextInput from "../inputs/TextInput"
import _TelInput from "../inputs/TelInput"
import _IDInput from "../inputs/IDInput"
import _MultiSwitch from "../inputs/MultiSwitch"
import {Layout, Colors} from "../../constants"
import {BR, Text, RoundedShadowContainer as _RoundedShadowContainer} from "../"
import {promptDate} from "../../helpers"


export default class PassengerForm extends React.Component {

  genders = [
    {value: "M", text: "M."},
    {value: "F", text: "Mme"},
  ]

  constructor(props) {
    super(props)

    this.state = {
      firstName: "",
      lastName: "",
      identification: {},
      phoneNumber: {}
    }

    this._onGenderChange = this._onGenderChange.bind(this)
    this._onFirstNameChange = this._onFirstNameChange.bind(this)
    this._onLastNameChange = this._onLastNameChange.bind(this)
    this._onIdentificationChange = this._onIdentificationChange.bind(this)
    this._onPhoneNumberChange = this._onPhoneNumberChange.bind(this)
  }

  _onGenderChange(newValue) {
    if (!this.props.onValueChange)
      return

    const value = this.props.value
    this.props.onValueChange({
      ...value,
      gender: newValue
    })
  }

  _onFirstNameChange(newValue) {
    if (!this.props.onValueChange)
      return

    const value = this.props.value
    this.props.onValueChange({
      ...value,
      firstName: newValue
    })
  }

  _onLastNameChange(newValue) {
    if (!this.props.onValueChange)
      return

    const value = this.props.value
    this.props.onValueChange({
      ...value,
      lastName: newValue
    })
  }

  _onIdentificationChange(newValue) {
    if (!this.props.onValueChange)
      return

    const value = this.props.value
    this.props.onValueChange({
      ...value,
      identification: newValue
    })
  }

  _onPhoneNumberChange(newValue) {
    if (!this.props.onValueChange)
      return

    const value = this.props.value
    this.props.onValueChange({
      ...value,
      phoneNumber: newValue
    })
  }

  render() {
    const {style, noRemoveButton, index, unique, value} = this.props
    const onRemove = this.props.onRemove || (() => null)
    const titleAppend = unique ? "" : (" No " + (index + 1))

    const gender = value ? value.gender : null
    const firstName = value ? value.firstName : ""
    const lastName = value ? value.lastName : ""
    const identification = value ? value.identification : {}
    const phoneNumber = value ? value.phoneNumber : {}

    return (
      <RoundedShadowContainer title={"Informations du passager" + titleAppend} style={style}>
        {
          !noRemoveButton && (
            <DeleteButton onPress={() => onRemove(index)}>
              <FAIcon name="times-circle" size={12} color={Colors.danger}/>
              <DeleteText>Retirer</DeleteText>
            </DeleteButton>
          )
        }
        <MultiSwitch items={this.genders} value={gender} onValueChange={this._onGenderChange}/>
        <NameInputGroup>
          <NameInput
            autoFocus={false}
            placeholder="Prénom"
            value={firstName}
            onValueChange={this._onFirstNameChange}
          />
          <BR sm/>
          <NameInput
            placeholder="Nom"
            value={lastName}
            onValueChange={this._onLastNameChange}
          />
        </NameInputGroup>
        <IDInput
          placeholder="Numéro de la pièce"
          value={identification}
          onValueChange={this._onIdentificationChange}
        />
        <TelInput
          placeholder="Numéro de téléphone"
          value={phoneNumber}
          onValueChange={this._onPhoneNumberChange}
        />
      </RoundedShadowContainer>
    )
  }
}

const RoundedShadowContainer = styled(_RoundedShadowContainer)`
  border: ${Colors.placeholder};
  height: auto;
`

const MultiSwitch = styled(_MultiSwitch).attrs(props => ({color: Colors.text}))`
  height: 30px;
  margin-bottom: ${Layout.paddingSm}px;
`

const NameInputGroup = styled.View`
  flex-direction: row;
  margin-bottom: ${Layout.paddingSm}px;
`

const NameInput = styled(TextInput)`
  flex: 1;
  height: ${Layout.passengerInputHeight}px;
`

const IDInput = styled(_IDInput)`
  height: ${Layout.passengerInputHeight}px;
  margin-bottom: ${Layout.paddingSm}px;
`

const TelInput = styled(_TelInput)`
  height: ${Layout.passengerInputHeight}px;
`

const DeleteButton = styled.TouchableOpacity`
  flex-direction: row;
  position: absolute;
  top: ${Layout.padding}px;
  right: ${Layout.padding}px;
  align-items: center;
`

const DeleteText = styled(Text)`
  font-size: 12px;
  margin-left: ${Layout.paddingSm}px;
  color: ${Colors.danger};
`
