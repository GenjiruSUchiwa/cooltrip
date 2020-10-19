import React from "react"
import styled from "styled-components"
import {Colors} from "../../constants"
import {TextBold} from "../../components"
import FAIcon from "react-native-vector-icons/FontAwesome"


export default class NotificationsButton extends React.Component {
  render() {
    return (
      <ButtonTouchable {...this.props}>
        <FAIcon name="bell" size={18} color="white"/>
        <NotificationCountContainer>
          <NotificationCount>25</NotificationCount>
        </NotificationCountContainer>
      </ButtonTouchable>
    )
  }
}

const ButtonTouchable = styled.TouchableOpacity`
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  position: relative;
`

const NotificationCountContainer = styled.View`
  border: 1px solid ${Colors.secondary};
  min-width: 16px;
  min-height: 16px;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
  background-color: white;
  padding: 0 2px 2px 2px;
  position: absolute;
  top: 15%;
  right: 15%;
`

const NotificationCount = styled(TextBold)`
  font-size: 10px;
  color: ${Colors.secondary};
  text-align: center;
`
