import React from "react"
import {Modal, TouchableWithoutFeedback} from "react-native"
import Icon from "react-native-vector-icons/FontAwesome"
import Button from "../buttons/Button"
import styled from "styled-components"
import {Layout, Colors} from "../../constants"
import {TextBold} from "../"
import Font from "../../constants/Font"
import {Modal as ModalHelper} from "../../helpers"


export default class FeedbackModal extends React.Component {
  icons = {
    info: 'info',
    success: 'check',
    error: 'remove',
  }

  colors = {
    info: Colors.primary,
    success: Colors.success,
    error: Colors.danger,
  }

  _onClose() {
    ModalHelper.feedback.hide()
    this.props.onClose ? this.props.onClose() : null
  }

  render() {
    const {visible, title, message} = this.props
    const type = this.props.type || 'info'

    return (
      <Modal
        transparent={true}
        visible={visible}
        onRequestClose={() => null}
      >
        <TouchableWithoutFeedback onPress={() => null}>
          <ModalBackground>
            <Container>
              <Body>
              <Circle color={this.colors[type]}>
                <Icon name={this.icons[type]} size={32} color={this.colors[type]}/>
              </Circle>
              <Title>
                {title}
              </Title>
              <Message>
                {message}
              </Message>
              </Body>
              <Button onPress={this._onClose.bind(this)} modal>
                OK
              </Button>
            </Container>
          </ModalBackground>
        </TouchableWithoutFeedback>
      </Modal>
    )
  }
}

const ModalBackground = styled.View`
  flex: 1;
  background-color: ${Colors.modalBackdrop};
  justify-content: center;
  padding: ${Layout.paddingXl}px;
`

const Container = styled.View`
  background-color: white;
  border-radius: ${Layout.borderRadius}px;
`

const Body = styled.View`
  padding: ${Layout.paddingXl}px;
  align-items: center;
`

const Circle = styled.View`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  border: 2px solid ${props => props.color};
  align-items: center;
  justify-content: center;
`

const Title = styled(TextBold)`
  font-size: 16px;
  margin-top: ${Layout.padding}px;
`

const Message = styled(Title)`
  font-family: ${Font.regular};
  margin-top: ${Layout.paddingLg}px;
`
