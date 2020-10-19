import React from "react"
import styled from "styled-components"
import {Colors, Layout} from "../../constants"
import {Text} from "../"
import FAIcon from "react-native-vector-icons/FontAwesome"


export default class SquareButton extends React.Component {
  render() {
    const {icon, label, disabled} = this.props

    return (
      <ButtonTouchable {...this.props}>
        <FAIcon name={icon || "search"} size={25} color="white"/>
        <ButtonText>
          {label || "Rechercher"}
        </ButtonText>
      </ButtonTouchable>
    )
  }
}

const ButtonTouchable = styled.TouchableOpacity`
  background-color: ${Colors.primary};
  width: ${props => props.width ? props.width : Layout.listItemHeight / 2 - Layout.paddingLg}px;
  height: ${Layout.listItemHeight / 2 - Layout.paddingLg}px;
  margin-top: ${-Layout.paddingLg}px;
  border-radius: ${Layout.borderRadius}px;
  justify-content: center;
  align-items: center;
  margin-left: auto;
`

const ButtonText = styled(Text)`
  color: white;
  font-size: 8px;
`
