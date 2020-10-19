import React from "react"
import FAIcon from "react-native-vector-icons/FontAwesome"
import styled from "styled-components"
import {TabContainer, BR, Text, TitledContainer} from "../../../../components"
import _TripListItem from "../../../../components/lists/TripListItem"
import _PassengerForm from "../../../../components/inputs/PassengerForm"
import SquareButton from "../../../../components/buttons/SquareButton"
import {Colors, Layout} from "../../../../constants"
import {formatAmount, getErrorMessage} from "../../../../helpers"
import Storage from "../../../../helpers/Storage"
import Modal from "../../../../helpers/Modal"
import Regex from "../../../../constants/Regex"
import Api, {Routes, StatusCodes} from "../../../../helpers/Api"
import Navigation from "../../../../helpers/Navigation"


export default class BookScreen extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      trip: props.route.params ? props.route.params.trip || {} : {},
      booking: props.route.params ? props.route.params.booking || {} : {},
      passengers: Array.from(
        {length: props.route.params ? props.route.params.search.seats || 1 : 1},
        (v, k) => ({
          gender: null,
          firstName: "",
          lastName: "",
          identification: {
            type: "CNI",
            number: ""
          },
          phoneNumber: {
            code: "+237",
            number: ""
          }
        })
      )
    }

    this._onAddPassenger = this._onAddPassenger.bind(this)
    this._onRemovePassenger = this._onRemovePassenger.bind(this)
    this._onPassengerChange = this._onPassengerChange.bind(this)
    this._onSubmit = this._onSubmit.bind(this)
  }

  componentDidMount() {
    Storage.getMultiple(["identification", "phoneNumber", "user"], [{type: "CNI", number: ""}])
      .then(data => this._onPassengerChange(0, {
        gender: data.user.gender,
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        identification: data.identification,
        phoneNumber: data.phoneNumber
      }))
  }

  _onAddPassenger() {
    const passengers = this.state.passengers
    passengers.push({})
    this.setState({passengers})
  }

  _onRemovePassenger(index) {
    const passengers = this.state.passengers
    passengers.splice(index, 1)
    this.setState({passengers})
  }

  _onPassengerChange(index, newValue) {
    const passengers = this.state.passengers
    passengers[index] = newValue
    this.setState({passengers})
  }

  _onSubmit() {
    const passengers = this.state.passengers
    for (let i = 0; i < passengers.length; i++) {
      const passenger = passengers[i]
      const index = passengers.length <= 1 ? "" : " No " + (i + 1)

      if (!passenger.gender)
        return Modal.feedback.show({
          type: "error",
          title: "Entrée invalide",
          message: "Veuillez sélectionner la civilité du passager" + index,
        })

      if (!(passenger.firstName && passenger.firstName.length))
        return Modal.feedback.show({
          type: "error",
          title: "Entrée invalide",
          message: "Veuillez saisir le prénom du passager" + index,
        })

      if (!(passenger.lastName && passenger.lastName.length))
        return Modal.feedback.show({
          type: "error",
          title: "Entrée invalide",
          message: "Veuillez saisir le nom du passager" + index,
        })

      if (!(passenger.identification && ((passenger.identification.type === "MIN") || (passenger.identification.number && passenger.identification.number.length))))
        return Modal.feedback.show({
          type: "error",
          title: "Entrée invalide",
          message: "Veuillez entrer le numéro d'identité du passager" + index,
        })

      if (!(passenger.phoneNumber && passenger.phoneNumber.number && Regex.isValidPhoneNumber(passenger.phoneNumber.number)))
        return Modal.feedback.show({
          type: "error",
          title: "Entrée invalide",
          message: "Veuillez entrer un numéro de téléphone valide pour le passager" + index,
        })
    }

    Api.put(Routes.booking.CREATE, {
      passengers: passengers.map(p => ({
        "firstname": p.firstName,
        "lastname": p.lastName,
        "phoneNumber": p.phoneNumber.code + p.phoneNumber.number,
        "referenceId": p.identification.number,
        "gender": p.gender
      }))
    }, {
      bookingUuid: this.state.booking.uuid,
    })
      .then(response => this.props.navigation.navigate("BookSummary", {
        trip: this.state.trip,
        search: this.state.search,
        booking: this.state.booking,
        passengers
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
    const {trip, passengers} = this.state

    return (
      <Container>
        <ScrollView>
          <TripListItem data={trip} infoStyle buttonLabel="Prix du ticket"/>
          {
            passengers.map((item, index) => (
              <PassengerForm
                key={index + ''} index={index}
                unique={passengers.length === 1}
                onRemove={this._onRemovePassenger}
                noRemoveButton={passengers.length < 2}
                value={item}
                onValueChange={newValue => this._onPassengerChange(index, newValue)}
              />
            ))
          }
          <AddButton onPress={this._onAddPassenger}>
            <FAIcon name="plus" size={16} color={Colors.secondary}/>
            <AddButtonText>Ajouter un passager</AddButtonText>
          </AddButton>
        </ScrollView>
        <Summary title="Détails de votre facture">
          <SummaryRow>
            <SummaryPassengersCount>{passengers.length}x</SummaryPassengersCount>
            <SummaryLabels>
              <SummaryText>Prix du ticket :</SummaryText>
              <SummaryText>Frais CoolTrip :</SummaryText>
              <SummaryText>Sous-Total :</SummaryText>
            </SummaryLabels>
            <SummaryAmounts>
              <SummaryText>{formatAmount(trip.amount)} F</SummaryText>
              <SummaryText>{formatAmount(trip.fees)} F</SummaryText>
              <SummaryText>{formatAmount(trip.amount + trip.fees)} F</SummaryText>
            </SummaryAmounts>
            <SquareButton
              width={Layout.listItemHeight - Layout.paddingLg} icon="arrow-right" label="Vérifier et Payer"
              onPress={this._onSubmit}
            />
          </SummaryRow>
        </Summary>
      </Container>
    )
  }
}

const Container = styled(TabContainer)`
  padding: ${Layout.padding}px 0;
`

const TripListItem = styled(_TripListItem)`
  margin-bottom: ${Layout.padding}px;
`

const PassengerForm = styled(_PassengerForm)`
  margin-bottom: ${Layout.padding}px;
`

const summaryHeight = 56 + 4 * Layout.padding

const ScrollView = styled.ScrollView.attrs(props => ({keyboardShouldPersistTaps: "always"}))`
  margin-bottom: ${summaryHeight}px;
  padding: 0 ${Layout.padding}px;
  flex: 1;
`

const AddButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  height: 30px;
  margin-bottom: ${Layout.padding}px;
`

const AddButtonText = styled(Text)`
  font-size: 16px;
  margin-left: ${Layout.paddingSm}px;
  color: ${Colors.secondary};
`

const Summary = styled(TitledContainer)`
  position: absolute;
  bottom: 0;
  width: 100%;
  height: ${summaryHeight}px;
  border-top-width: 1px;
  border-top-color: ${Colors.placeholder};
`

const SummaryRow = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
`

const SummaryPassengersCount = styled(Text)`
  font-size: 20px;
`

const SummaryLabels = styled.View`
  margin-left: ${Layout.paddingSm}px;
  padding-left: ${Layout.paddingSm}px;
  border-left-width: 1px;
  border-left-color: ${Colors.placeholder};
`

const SummaryText = styled(Text)`
  font-size: 14px;
`

const SummaryAmounts = styled(SummaryLabels)`
  border-left-width: 0;
  align-items: flex-end;
`
