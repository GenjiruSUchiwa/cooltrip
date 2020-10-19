import React from "react"
import FAIcon from "react-native-vector-icons/FontAwesome"
import styled from "styled-components"
import {Colors, Layout} from "../../constants"
import {Text} from "../"


export default class ButtonIcon extends React.Component {
  render() {
    const {icon, sm, inverse, children} = this.props
    const color = this.props.color || Colors.secondary

    return (
      <ButtonTouchable {...this.props} color={color}>
        {
          inverse && <ButtonText color={color} sm={sm} left>{children}</ButtonText>
        }
        <FAIcon name={icon} size={sm ? 10 : 14} color={color}/>
        {
          !inverse && <ButtonText color={color} sm={sm}>{children}</ButtonText>
        }
      </ButtonTouchable>
    )
  }
}

const ButtonTouchable = styled.TouchableOpacity`
  border: 1px ${props => props.color};
  height: ${props => props.sm ? 20 : 30}px;
  padding: 0 ${props => props.sm ? Layout.paddingSm : Layout.padding}px;
  border-radius: ${Layout.borderRadius}px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`

const ButtonText = styled(Text)`
  font-size: ${props => props.sm ? 10 : 14}px;
  color: ${props => props.color};
  margin-left: ${props => props.left ? 0 : Layout.paddingSm}px;
  margin-right: ${props => props.left ? Layout.paddingSm : 0}px;
`
