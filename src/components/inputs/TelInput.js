import React from "react"
import styled from "styled-components"
import {Colors, Layout, Font} from "../../constants"
import {truncate} from "../../helpers"
import {InputContainer} from "../"
import Picker from "./Picker"


export default class TelInput extends React.Component {

  countries = require('../../constants/countries')

  constructor(props) {
    super(props)

    this._onTypeChange = this._onCountryChange.bind(this)
    this._onCountryChange = this._onCountryChange.bind(this)
    this._onNumberChange = this._onNumberChange.bind(this)
  }

  componentDidMount() {
    if (!(this.props.value && this.props.value.code))
      this._onCountryChange('+237')
  }

  _onCountryChange(newCountry) {
    if (!this.props.onValueChange)
      return

    const value = this.props.value
    this.props.onValueChange({
      ...value,
      code: newCountry
    })
  }

  _onNumberChange(newPhoneNumber) {
    if (!this.props.onValueChange)
      return

    const value = this.props.value
    this.props.onValueChange({
      ...value,
      number: newPhoneNumber
    })
  }

  render() {
    const {style, placeholder, autoFocus, value, balanced} = this.props
    const country = value && value.code ? value.code : '+237'
    const number = value ? value.number : null

    return (
      <InputContainer style={style}>
        <PickerContainer balanced={balanced}>
          <Picker
            mode="modal"
            placeholder="Sélectionnez votre pays"
            items={this.countries}
            value={country}
            onSelectedChange={this._onCountryChange}
            renderSelected={selected => selected.flag + ' ' + selected.dial_code}
            textExtractor={item => `${item.flag} ${truncate(item.name, 25)} (${item.dial_code})`}
            valueExtractor={item => item.dial_code}
          />
        </PickerContainer>
        <TextInputContainer>
          <TextInput
            autoFocus={autoFocus}
            placeholder={placeholder}
            keyboardType="numeric"
            value={number}
            onChangeText={this._onNumberChange}
          />
        </TextInputContainer>
      </InputContainer>
    )
  }
}

const PickerContainer = styled.View`
  flex: ${props => props.balanced ? 2 : 1};
  margin-left: ${Layout.padding}px;
  height: 100%;
  justify-content: center;
  border-right-width: 1px;
  border-right-color: ${Colors.border};
`

const TextInputContainer = styled.View`
  flex: 2;
`

const TextInput = styled.TextInput.attrs(props => ({placeholderTextColor: Colors.placeholder}))`
  flex: 1;
  margin-left: ${Layout.padding}px;
  font-family: ${Font.regular};
  font-size: 16px;
  color: ${Colors.text};
  padding: 0;
`
