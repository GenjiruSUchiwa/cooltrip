import React from "react"
import styled from "styled-components"
import {Colors, Layout, Font} from "../../constants"
import {Text} from "../"
import {formatAmount} from "../../helpers"


export default class BookButton extends React.Component {
  render() {
    const {amount, infoStyle, available, altText} = this.props
    const label = this.props.label || "Réservation"

    return !available
      ? (
        <Container {...this.props}>
          <ButtonTextInfo>{formatAmount(amount)} F</ButtonTextInfo>
          <ButtonAmountInfo>{altText}</ButtonAmountInfo>
        </Container>
      ) : infoStyle
        ? (
          <Container {...this.props}>
            <ButtonTextInfo>{label}</ButtonTextInfo>
            <ButtonAmountInfo>{formatAmount(amount)} F</ButtonAmountInfo>
          </Container>
        ) : (
          <ButtonTouchable {...this.props}>
            <ButtonText>Réserver à</ButtonText>
            <ButtonAmount>{formatAmount(amount)} F</ButtonAmount>
          </ButtonTouchable>
        )
  }
}

const ButtonTouchable = styled.TouchableOpacity`
  background-color: ${Colors.primary};
  width: 100%;
  height: 50px;
  border-radius: ${Layout.borderRadius}px;
  justify-content: center;
  align-items: center;
`

const ButtonText = styled(Text)`
  color: white;
  font-size: 10px;
`

const ButtonAmount = styled(ButtonText)`
  font-family: ${Font.bold};
  font-size: 16px;
`

const Container = styled.View`
  width: 100%;
  height: 50px;
  justify-content: center;
  align-items: center;
  border: 1px ${Colors.primary};
  border-style: dashed;
  border-radius: 0.1px;
`

const ButtonTextInfo = styled(Text)`
  color: ${Colors.primary};
  font-size: 9px;
`

const ButtonAmountInfo = styled(ButtonTextInfo)`
  font-family: ${Font.bold};
  font-size: 16px;
`
