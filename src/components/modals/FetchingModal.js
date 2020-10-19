import React from "react"
import {Modal, ActivityIndicator} from "react-native"
import styled from "styled-components"
import {Layout, Colors} from "../../constants"
import {Text} from "../"


export default class FetchingModal extends React.Component {
  render() {
    const {visible, text} = this.props

    return (
      <Modal
        transparent={true}
        visible={visible}
      >
        <ModalBackground>
          <Container>
            <ActivityIndicator size="large" color={Colors.secondary}/>
            <Info>
              {text || "Traitement en cours..."}
            </Info>
          </Container>
        </ModalBackground>
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
  padding: ${Layout.paddingXl}px;
  flex-direction: row;
  align-items: center;
`

const Info = styled(Text)`
  font-size: 16px;
  margin-left: ${Layout.padding}px;
`
