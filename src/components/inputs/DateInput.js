import React from "react"
import styled from "styled-components"
import FAIcon from "react-native-vector-icons/FontAwesome"
import {Colors, Layout, Font} from "../../constants"
import {InputContainer} from "../"
import DateHelper from "../../helpers/Date"


export default class DateInput extends React.Component {

  constructor(props) {
    super(props)

    this._onValueChange = this._onValueChange.bind(this)
    this._onPressCalendar = this._onPressCalendar.bind(this)
  }

  _onValueChange(newValue) {
    if (this.props.onValueChange)
      this.props.onValueChange(newValue)
  }

  _onPressCalendar() {
    const value = this.props.value && this.props.value.iso ? this.props.value : DateHelper.today()
    const birthDate = value && value.iso ? new Date(value.iso) : null
    DateHelper.promptDate(birthDate)
      .then(date => {
        if (date)
          this._onValueChange(date)
      })
      .catch(error => {
        alert(error.message)
      })
  }

  render() {
    const {style, placeholder, autoFocus, balanced} = this.props
    const value = this.props.value || {}

    return (
      <InputContainer style={style}>
        <ButtonContainer balanced={balanced}>
          <TouchableContainer onPress={this._onPressCalendar}>
            <FAIcon name="calendar" size={18} color={Colors.secondary}/>
          </TouchableContainer>
        </ButtonContainer>
        <TextInputContainer>
          <TextInput
            autoFocus={autoFocus}
            placeholder={placeholder}
            value={value.fr}
            onChangeText={this._onValueChange}
            editable={false}
          />
        </TextInputContainer>
      </InputContainer>
    )
  }
}

const ButtonContainer = styled.View`
  flex: ${props => props.balanced ? 2 : 1};
  margin-left: ${Layout.padding}px;
  height: 100%;
  justify-content: center;
  border-right-width: 1px;
  border-right-color: ${Colors.border};
`

const TouchableContainer = styled.TouchableOpacity`
  margin-right: ${Layout.padding}px;
  justify-content: center;
  align-items: center;
  flex: 1;
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
