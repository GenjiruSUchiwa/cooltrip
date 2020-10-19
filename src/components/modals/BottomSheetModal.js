import React from "react"
import {Modal, TouchableWithoutFeedback} from "react-native"
import styled from "styled-components"
import {Colors, Layout} from "../../constants"
import {TextBold} from "../index"


export default class BottomSheetModal extends React.Component {
  render() {
    const {visible, onClose, title} = this.props

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
      >
        <TouchableWithoutFeedback onPress={onClose}>
          <BottomSheetBackground>
            <ModalContent>
              {title ? <ModalTitle>{title}</ModalTitle> : null}
              {this.props.children}
            </ModalContent>
          </BottomSheetBackground>
        </TouchableWithoutFeedback>
      </Modal>
    )
  }
}

const BottomSheetBackground = styled.View`
  flex: 1;
  background-color: ${Colors.modalBackdrop};
`

const ModalContent = styled.View`
  margin-top: auto;
  max-height: ${Layout.window.height/2}px;
  background-color: white;
  padding: ${Layout.padding}px;
`

const ModalTitle = styled(TextBold)`
  font-size: 14px;
  margin-bottom: ${Layout.paddingLg}px;
`
