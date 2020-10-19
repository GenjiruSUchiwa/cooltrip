import React from "react"
import FAIcon from "react-native-vector-icons/FontAwesome"
import styled from "styled-components"
import {
  TabContainer, BR, Text, TextBold,
  RoundedShadowContainer as _RoundedShadowContainer
} from "../../../../components"
import TripListItem from "../../../../components/lists/TripListItem"
import TextInput from "../../../../components/inputs/TextInput"
import Button from "../../../../components/buttons/Button"
import CheckBox from "../../../../components/inputs/CheckBox"
import {Colors, Layout} from "../../../../constants"
import {formatAmount, formatGender, getErrorMessage, Modal} from "../../../../helpers"
import Api, {Routes, StatusCodes} from "../../../../helpers/Api"
import Storage from "../../../../helpers/Storage"
import Navigation from "../../../../helpers/Navigation"


export default class BookSummaryScreen extends React.Component {

  credit = 0

  constructor(props) {
    super(props)

    this.state = {
      trip: props.route.params ? props.route.params.trip || {} : {},
      booking: props.route.params ? props.route.params.booking || {} : {},
      passengers: props.route.params ? props.route.params.passengers || {} : {},
      payer: {},
      discount: 0,
      useCredit: false
    }

    this._toggleUseCredit = this._toggleUseCredit.bind(this)
    this._onEditPress = this._onEditPress.bind(this)
    this._onSubmit = this._onSubmit.bind(this)
  }

  componentDidMount() {
    Storage.getMultiple(["phoneNumber", "user"])
      .then(data => this.setState({
        payer: {
          "firstname": data.user.firstName,
          "lastname": data.user.lastName,
          "phone": data.phoneNumber.code + data.phoneNumber.number,
          "gender": data.user.gender
        }
      }))
  }

  _toggleUseCredit() {
    this.setState({
      useCredit: !this.state.useCredit
    })
  }

  _onEditPress() {
    this.props.navigation.goBack()
  }

  _onSubmit() {
    Storage.get("identification")
      .then(identification => {
        if (!identification || !identification.number)
          Storage.set("identification", this.state.passengers[0].identification)
      })
    Api.post(Routes.booking.PROCEED_PAYMENT, {
      bookingUuid: this.state.booking.uuid,
      payer: this.state.payer
    })
      .then(response => this.props.navigation.navigate("Payment", {
        trip: this.state.trip,
        booking: this.state.booking,
        passengers: this.state.passengers,
        payment: {
          url: response.data.payment_url,
          uuid: response.data.paymentId,
        }
      }))
      .catch(error => Modal.feedback.show({
        type: "error",
        title: "OUPS !",
        message: getErrorMessage(error),
        callback: () => {
          if (error.statusCode === StatusCodes.advert.EXPIRED)
            this.props.navigation.navigate("Home")
          else if (error.statusCode === StatusCodes.advert.SUCCEEDED)
            Navigation.goToTrough(this.props.navigation, "Home", "Bookings", {refresh: true})
        }
      }))
  }

  render() {
    const {trip, passengers, discount, useCredit} = this.state
    const credit = useCredit ? this.credit : 0
    const total = passengers.length * (trip.amount + trip.fees) - discount - credit

    return (
      <Container>
        <ScrollView>
          <TripListItem data={trip} noPrice noSeats/>
          <PassengersContainer title={passengers.length > 1 ? "Coordonnées des passagers" : "Coordonnées du passager"}>
            <EditButton onPress={this._onEditPress}>
              <FAIcon name="edit" size={12} color={Colors.secondary}/>
              <EditText>Modifier</EditText>
            </EditButton>
            {
              passengers.map((p, i) => (
                <Passenger key={i}>
                  <SummaryText>{formatGender(p.gender)} {p.firstName} {p.lastName}</SummaryText>
                  <SummaryText>{p.identification.type} : {p.identification.number}</SummaryText>
                  <SummaryText>Tél. : {p.phoneNumber.code + p.phoneNumber.number}</SummaryText>
                </Passenger>
              ))
            }
          </PassengersContainer>
          <Summary title="Résumé de votre facture">
            <SummaryRow>
              <SummaryLabels>
                <SummaryText>Tickets ({passengers.length})</SummaryText>
                <SummaryText>Frais CoolTrip</SummaryText>
                <SummaryText>Réduction</SummaryText>
                <BR/>
                <SummaryText>
                  <SummaryTotal>Total</SummaryTotal> (taxes comprises)
                </SummaryText>
              </SummaryLabels>
              <SummaryAmounts>
                <SummaryText>{formatAmount(passengers.length * trip.amount)} F</SummaryText>
                <SummaryText>{formatAmount(passengers.length * trip.fees)} F</SummaryText>
                <SummaryText>{formatAmount(discount + credit)} F</SummaryText>
                <BR/>
                <SummaryTotal>{formatAmount(total)} F</SummaryTotal>
              </SummaryAmounts>
            </SummaryRow>
          </Summary>
          <DiscountContainer title="Appliquer une réduction (optionnel)">
            <DiscountInputGroup>
              <DiscountInput placeholder="Code de réduction"/>
              <BR/>
              <DiscountButton outline textMd>Appliquer</DiscountButton>
            </DiscountInputGroup>
            <DiscountInputGroup>
              <CheckBox checked={useCredit} onStateChange={this._toggleUseCredit}>
                Utiliser mes crédits ({formatAmount(this.credit)} F)
              </CheckBox>
            </DiscountInputGroup>
          </DiscountContainer>
        </ScrollView>
        <SubmitButton onPress={this._onSubmit} textMd>Procéder au paiement</SubmitButton>
      </Container>
    )
  }
}

const Container = styled(TabContainer)`
  padding: ${Layout.padding}px 0 0 0;
`

const ScrollView = styled.ScrollView.attrs(props => ({keyboardShouldPersistTaps: "always"}))`
  flex: 1;
  padding: 0 ${Layout.padding}px;
`

const RoundedShadowContainer = styled(_RoundedShadowContainer)`
  border: 1px ${Colors.placeholder};
  margin-top: ${Layout.padding}px;
  height: auto;
`

const PassengersContainer = styled(RoundedShadowContainer)`
  padding-bottom: 0;
`

const Passenger = styled.View`
  border-left-width: 2px;
  border-left-color: ${Colors.placeholder};
  padding-left: ${Layout.paddingSm}px;
  margin-bottom: ${Layout.padding}px;
`

const EditButton = styled.TouchableOpacity`
  flex-direction: row;
  position: absolute;
  top: ${Layout.padding}px;
  right: ${Layout.padding}px;
  align-items: center;
`

const EditText = styled(Text)`
  font-size: 12px;
  margin-left: ${Layout.paddingSm}px;
  color: ${Colors.danger};
`

const DiscountContainer = styled(RoundedShadowContainer)`
  padding-bottom: 0;
`

const DiscountInputGroup = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  margin-bottom: ${Layout.padding}px;
`

const CheckBoxContainer = styled.View`
  margin-left: -12px;
  margin-right: ${Layout.paddingLg}px;
`

const DiscountInput = styled(TextInput)`
  flex: 2;
`

const DiscountButton = styled(Button)`
  flex: 1;
`

const SubmitButton = styled(Button)`
  margin: ${Layout.padding}px;
  width: auto;
`

const Summary = styled(RoundedShadowContainer)``

const SummaryRow = styled.View`
  flex-direction: row;
  align-items: center;
`

const SummaryLabels = styled.View`
  flex: 2;
`

const SummaryText = styled(Text)`
  font-size: 14px;
`

const SummaryTotal = styled(TextBold)`
  font-size: 20px;
`

const SummaryAmounts = styled(SummaryLabels)`
  align-items: flex-end;
  flex: 1;
`
