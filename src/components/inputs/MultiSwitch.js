import React from "react"
import FAIcon from "react-native-vector-icons/FontAwesome"
import styled from "styled-components"
import {Colors, Layout} from "../../constants"
import {Text} from "../"


export default class MultiSwitch extends React.Component {
  constructor(props) {
    super(props)

    this._onValueChange = this._onValueChange.bind(this)
  }

  _onValueChange(newValue) {
    if (!this.props.onValueChange || newValue === this.props.value)
      return

    this.props.onValueChange(newValue)
  }

  render() {
    const {label, items, value, style} = this.props
    const lastIndex = items.length - 1
    const color = this.props.color || Colors.primary

    return (
      <Root>
        {label && <Label color={color}>{label}</Label>}
        <Container style={style}>
          {
            items.map((item, index) => (
              <SwitchTouchable
                key={index}
                color={color}
                onPress={() => this._onValueChange(item.value)}
                first={index === 0}
                active={item.value === value}
                last={index === lastIndex}
              >
                <Icon name={item.icon} active={item.value === value} color={color}/>
                <SwitchText active={item.value === value} color={color}>
                  {item.text}
                </SwitchText>
              </SwitchTouchable>
            ))
          }
        </Container>
      </Root>
    )
  }
}

const Root = styled.View`
  align-items: center;
`

const Label = styled(Text)`
  font-size: 16px;
  color: ${props => props.color};
`

const Container = styled.View`
  flex-direction: row;
  height: 50px;
`

const SwitchTouchable = styled.TouchableOpacity`
  background-color: ${props => props.active ? props.color : 'white'};
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border: 1px solid ${props => props.color};
  border-top-left-radius: ${props => props.first ? Layout.borderRadius : 0}px;
  border-bottom-left-radius: ${props => props.first ? Layout.borderRadius : 0}px;
  border-top-right-radius: ${props => props.last ? Layout.borderRadius : 0}px;
  border-bottom-right-radius: ${props => props.last ? Layout.borderRadius : 0}px;
  border-right-width: ${props => props.last ? 1 : 0}px;
  flex: 1;
`

const Icon = props => <FAIcon name={props.name} size={16} color={props.active ? 'white' : props.color}/>

const SwitchText = styled(Text)`
  color: ${props => props.active ? 'white' : props.color};
  font-size: 16px;
  margin-left: ${Layout.padding}px;
`
