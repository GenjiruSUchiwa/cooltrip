import React from "react"
import styled from "styled-components"
import {Colors, Layout} from "../../constants"
import {Text} from "../"
import FAIcon from "react-native-vector-icons/FontAwesome"


export default class CheckBox extends React.Component {
  render() {
    const {checked, children, style, inverse} = this.props
    const onStateChange = this.props.onStateChange || (() => null)

    return (
      <Touchable onPress={onStateChange} style={style}>
        {
          inverse && <Label left>{children}</Label>
        }
        <FAIcon
          name={checked ? "check-square" : "square-o"} size={20}
          color={checked ? Colors.secondary : Colors.placeholder}
        />
        {
          !inverse && <Label>{children}</Label>
        }
      </Touchable>
    )
  }
}

const Touchable = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`

const Label = styled(Text)`
  font-size: 14px;
  margin-left: ${props => props.left ? 0 : Layout.padding}px;
  flex: 1;
`
