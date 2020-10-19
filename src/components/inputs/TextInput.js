import React from "react"
import styled from "styled-components"
import {Layout, Font} from "../../constants/index"
import {InputContainer} from "../index"
import {Colors} from "../../constants"


export default class TextInput extends React.Component {
  render() {
    const {style, placeholder, autoFocus, keyboardType, value} = this.props
    const onValueChange = this.props.onValueChange || (() => {})

    return (
      <InputContainer style={style}>
        <Input
          autoFocus={autoFocus}
          placeholder={placeholder}
          keyboardType={keyboardType}
          value={value}
          onChangeText={newText => onValueChange(newText)}
        />
      </InputContainer>
    )
  }
}

const Input = styled.TextInput.attrs(props => ({placeholderTextColor: Colors.placeholder}))`
  flex: 1;
  margin-left: ${Layout.padding}px;
  font-family: ${Font.regular};
  font-size: 16px;
  color: ${Colors.text};
  padding: 0;
`
