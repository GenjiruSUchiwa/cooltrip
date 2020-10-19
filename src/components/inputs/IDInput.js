import React from "react"
import styled from "styled-components"
import {Colors, Layout, Font} from "../../constants"
import {InputContainer} from "../"
import Picker from "./Picker"


export default class IDInput extends React.Component {

  types = [
    {text: 'CNI', value: 'CNI'},
    {text: 'Passeport', value: 'PASS'},
    {text: 'Passager mineur', value: 'MIN'},
  ]

  constructor(props) {
    super(props)

    this._onTypeChange = this._onTypeChange.bind(this)
    this._onNumberChange = this._onNumberChange.bind(this)
  }

  componentDidMount() {
    if (!(this.props.value && this.props.value.type))
      this._onTypeChange('CNI')
  }

  _onTypeChange(newType) {
    if (!this.props.onValueChange)
      return

    const value = this.props.value
    this.props.onValueChange({
      ...value,
      type: newType
    })
  }

  _onNumberChange(newNumber) {
    if (!this.props.onValueChange)
      return

    const value = this.props.value
    this.props.onValueChange({
      ...value,
      number: newNumber
    })
  }

  render() {
    const {style, placeholder, autoFocus, value, balanced} = this.props
    const type = value && value.type ? value.type : 'CNI'
    const numberDisabled = type === 'MIN'
    const number = numberDisabled ? '-- Mineur --' : value ? value.number : ''

    return (
      <InputContainer style={style}>
        <PickerContainer balanced={balanced}>
          <Picker
            items={this.types}
            value={type}
            onSelectedChange={this._onTypeChange}
            renderSelected={selected => selected.value}
          />
        </PickerContainer>
        <TextInputContainer>
          <TextInput
            autoFocus={autoFocus}
            placeholder={placeholder}
            keyboardType="numeric"
            value={number}
            onChangeText={this._onNumberChange}
            editable={!numberDisabled}
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
