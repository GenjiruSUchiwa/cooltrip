import React from "react"
import {WebView as _WebView} from "react-native-webview"
import styled from "styled-components"
import {TabContainer, RoundedShadowContainer as _RoundedShadowContainer} from "../../../../components"
import {Colors, Layout} from "../../../../constants"
import {Routes} from "../../../../helpers/Api"
import Modal from "../../../../helpers/Modal"
import Navigation from "../../../../helpers/Navigation"
import {CommonActions} from "@react-navigation/native"


export default class PaymentScreen extends React.Component {

  paymentEnded = false

  constructor(props) {
    super(props)

    this.state = {
      trip: props.route.params ? props.route.params.trip || {} : {},
      booking: props.route.params ? props.route.params.booking || {} : {},
      passengers: props.route.params ? props.route.params.passengers || {} : {},
      payment: props.route.params ? props.route.params.payment || {} : {},
      fetching: false
    }

    this._onLoadStart = this._onLoadStart.bind(this)
    this._onLoadEnd = this._onLoadEnd.bind(this)
    this._onError = this._onError.bind(this)
    this._onNavigationStateChange = this._onNavigationStateChange.bind(this)
  }

  _onLoadStart() {
    if (!this.paymentEnded)
      Modal.fetching.show({
        text: "Chargement..."
      })
  }

  _onLoadEnd() {
    Modal.fetching.hide()
  }

  _onError() {
    this.paymentEnded = true
    Modal.feedback.show({
      type: "error",
      title: "OUPS !",
      message: "Une erreur est survenue lors du paiement, veuillez réessayer SVP.",
      callback: () => {
        this._onLoadEnd()
        this.props.navigation.goBack()
      }
    })
  }

  _onNavigationStateChange(webViewState) {
    if (this.paymentEnded)
      return

    if (webViewState.url === Routes.payment.SUCCESS) {
      this.paymentEnded = true
      Modal.feedback.show({
        type: "success",
        title: "Opération réussie !",
        message: "Votre réservation a été effectuée avec succès.\nVous recevrez un message de confirmation par SMS.",
        callback: () => {
          this._onLoadEnd()
          Navigation.goToTrough(this.props.navigation, "Home", "Bookings", {refresh: true})
        }
      })
    }
    else if (webViewState.url === Routes.payment.ERROR || webViewState.url === Routes.payment.CANCEL)
      this._onError()
  }

  render() {
    const {payment} = this.state

    return (
      <Container>
        <RoundedShadowContainer>
          <WebView
            source={{uri: payment.url}}
            onLoadStart={this._onLoadStart}
            onLoadEnd={this._onLoadEnd}
            onError={this._onError}
            onNavigationStateChange={this._onNavigationStateChange}
          />
        </RoundedShadowContainer>
      </Container>
    )
  }
}

const Container = styled(TabContainer)`
  padding: ${Layout.padding}px;
`

const RoundedShadowContainer = styled(_RoundedShadowContainer)`
  border: 1px ${Colors.placeholder};
  flex: 1;
`

const WebView = styled(_WebView)`
  flex: 1;
`
