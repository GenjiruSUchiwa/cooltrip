import React from "react"
import styled from "styled-components"
import {Colors, Layout} from "../../constants"
import {Text} from "../"


export default class Button extends React.Component {
  render() {
    const {outline, textMd} = this.props

    return (
      <ButtonTouchable {...this.props}>
        <ButtonText md={textMd} primary={outline}>
          {this.props.children}
        </ButtonText>
      </ButtonTouchable>
    )
  }
}

const ButtonTouchable = styled.TouchableOpacity`
  background-color: ${props => props.outline ? 'white' : Colors.primary};
  border: 1px ${Colors.primary};
  width: 100%;
  height: 50px;
  border-radius: ${Layout.borderRadius}px;
  border-top-left-radius: ${props => props.modal ? 0 : Layout.borderRadius}px;
  border-top-right-radius: ${props => props.modal ? 0 : Layout.borderRadius}px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`

const ButtonText = styled(Text)`
  font-size: ${props => props.md ? 16 : 24}px;
  color: ${props => props.primary ? Colors.primary : 'white'};
`
