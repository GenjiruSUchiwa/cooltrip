import React from "react"
import FAIcon from "react-native-vector-icons/FontAwesome"
import SLIcon from "react-native-vector-icons/SimpleLineIcons"
import styled from "styled-components"
import _Picker from "../inputs/Picker"
import SquareButton from "../buttons/SquareButton"
import LocationInputModal from "../modals/LocationInputModal"
import {Colors, Layout, Font} from "../../constants"
import {BR, DoubleCircleIcon, HR, RoundedShadowContainer as _RoundedShadowContainer} from "../"
import DateHelper from "../../helpers/Date"
import Api, {Routes} from "../../helpers/Api"
import Modal from "../../helpers/Modal"
import {requestErrorHandler} from "../../helpers"


export default class SearchForm extends React.Component {

  datePickerOptions = [
    {text: "Aujourd'hui", value: DateHelper.today().iso},
  ]

  seatsOptions = Array.from({length: 5}, (v, k) => k + 1)
    .map(item => ({text: item + " place(s)", value: item}))

  constructor(props) {
    super(props)

    if (props.datePickerOptions)
      this.datePickerOptions = props.datePickerOptions

    this.state = {
      locationInputVisible: false,
      focusedInput: null, // "start" or "end"
      startCity: "",
      endCity: "",
      date: DateHelper.today().iso,
      seats: 1,
      fetching: false
    }

    if (props.initialValues)
      this.state = {
        ...this.state,
        ...props.initialValues
      }

    this._onExpand = this._onExpand.bind(this)
    this._onStartCityInputFocus = this._onStartCityInputFocus.bind(this)
    this._onEndCityInputFocus = this._onEndCityInputFocus.bind(this)
    this._onDateChange = this._onDateChange.bind(this)
    this._onSeatsChange = this._onSeatsChange.bind(this)
    this._onStartCityChange = this._onStartCityChange.bind(this)
    this._onEndCityChange = this._onEndCityChange.bind(this)
    this._onSearchStart = this._onSearchStart.bind(this)
    this._onSearchEnd = this._onSearchEnd.bind(this)
    this._onSearchSuccess = this._onSearchSuccess.bind(this)
    this._onSubmit = this._onSubmit.bind(this)
  }

  _onExpand() {
    if (this.props.onExpand)
      this.props.onExpand()
  }

  _onStartCityInputFocus() {
    this.setState({
      focusedInput: "start",
      locationInputVisible: true
    })
    this._onExpand()
  }

  _onStartCityChange(newValue) {
    this.setState({
      startCity: newValue
    })
  }

  _onEndCityInputFocus() {
    this.setState({
      focusedInput: "end",
      locationInputVisible: true
    })
    this._onExpand()
  }

  _onEndCityChange(newValue) {
    this.setState({
      endCity: newValue
    })
  }

  _onDateChange(newValue) {
    if (newValue === "OTHER") {
      DateHelper.promptDate(new Date(this.state.date), new Date())
        .then(date => {
          if (date) {
            if (!this.datePickerOptions.find(item => item.value === date.iso))
              this.datePickerOptions.push({text: date.fr, value: date.iso})
            this.setState({date: date.iso})
          }
        })
        .catch(error => {
          alert(error.message)
        })
    }
    else
      this.setState({
        date: newValue
      })
  }

  _onSeatsChange(newValue) {
    this.setState({
      seats: newValue
    })
  }

  _onSearchStart() {
    if (this.props.onSearchStart)
      this.props.onSearchStart()

    Modal.fetching.show({
      text: "Recherche des voyages..."
    })
  }

  _onSearchEnd() {
    if (this.props.onSearchEnd)
      this.props.onSearchEnd()

    Modal.fetching.hide()
  }

  _onSearchSuccess(datePickerOptions, search, response) {
    if (this.props.onSearchSuccess)
      this.props.onSearchSuccess(datePickerOptions, search, response)
  }

  _onSubmit() {
    const {startCity, endCity, date, seats} = this.state

    this._onSearchStart()
    this.setState({fetching: true})
    Api.get(Routes.booking.SEARCH, {startCity, endCity, date, seats}, false)
      .then(response => this._onSearchSuccess(
        this.datePickerOptions,
        {startCity, endCity, date, seats},
        response
      ))
      .catch(requestErrorHandler)
      .then(() => {
        this.setState({fetching: false})
        this._onSearchEnd()
      })
  }

  render() {
    const {style, bordered, collapsed} = this.props
    const {locationInputVisible, focusedInput, startCity, endCity, date, seats, fetching} = this.state

    return (
      <Container style={style}>
        <LocationInputModal
          visible={locationInputVisible}
          label={focusedInput === "start" ? "Ville de départ" : "Ville d'arrivée"}
          onValueChange={focusedInput === "start" ? this._onStartCityChange : this._onEndCityChange}
          onClose={() => this.setState({locationInputVisible: false})}
        />
        <RoundedShadowContainer title="Définissez votre trajet" collapsed={collapsed} bordered={bordered}>
          <PathRow>
            <PathIcons>
              <PathIcon>
                <DoubleCircleIcon/>
              </PathIcon>
              <VerticalLine/>
              <PathIcon>
                <FAIcon name="map-marker" size={20} color={Colors.secondary}/>
              </PathIcon>
            </PathIcons>
            <PathInputs>
              <TextInput
                placeholder="Ville de départ"
                onFocus={this._onStartCityInputFocus}
                value={startCity}
                onChangeText={this._onStartCityChange}
              />
              <HR/>
              <TextInput
                placeholder="Ville de d'arrivée"
                onFocus={this._onEndCityInputFocus}
                value={endCity}
                onChangeText={this._onEndCityChange}
              />
            </PathInputs>
          </PathRow>
          {
            collapsed && (
              <CollapseIconContainer onPress={this._onExpand}>
                <FAIcon name="angle-down" size={20} color={Colors.secondary}/>
              </CollapseIconContainer>
            )
          }
        </RoundedShadowContainer>
        {
          !collapsed && (
            <>
              <BR/>
              <RoundedShadowContainer
                title="Quand voulez-vous partir ?"
                bordered={bordered}
                height={Layout.listItemHeight / 2}
              >
                <PickersContainer>
                  <PickerFullRow>
                    <Picker
                      items={[...this.datePickerOptions, {text: "Sélectionner une autre date...", value: "OTHER"}]}
                      value={date}
                      onSelectedChange={this._onDateChange}
                      left={<FAIcon name="calendar" size={20} color={Colors.text}/>}
                    />
                  </PickerFullRow>
                  <PickerRow>
                    <Picker
                      items={this.seatsOptions}
                      value={seats}
                      renderSelected={selected => selected.value}
                      onSelectedChange={this._onSeatsChange}
                      left={<SLIcon name="people" size={20} color={Colors.text}/>}
                    />
                  </PickerRow>
                  <SquareButton onPress={this._onSubmit} disabled={fetching}/>
                </PickersContainer>
              </RoundedShadowContainer>
            </>
          )
        }
      </Container>
    )
  }
}

const Container = styled.View``

const RoundedShadowContainer = styled(_RoundedShadowContainer)`
  padding-bottom: ${props => props.collapsed ? 0 : Layout.padding}px;
  border: ${props => props.bordered ? 1 : 0}px ${Colors.placeholder};
`

const PathRow = styled.View`
  flex: 1;
  flex-direction: row;
`

const CollapseIconContainer = styled.TouchableOpacity`
  align-items: center;
  justify-content: flex-end;
`

const PathIcons = styled.View`
  width: 10%;
  align-items: center;
`

const VerticalLine = styled.View`
  border: 1px ${Colors.secondary};
  border-style: dashed;
  border-radius: 1px;
  position: absolute;
  top: 40%;
  height: 20%;
`

const PathIcon = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`

const PathInputs = styled.View`
  flex: 1;
  padding: 0 ${Layout.paddingLg}px;
`

const PickersContainer = styled.View`
  flex: 1;
  align-items: center;
  flex-direction: row;
`

const PickerRow = styled.View`
  flex-direction: row;
  margin-right: ${Layout.paddingXl}px;
  align-items: center;
`

const PickerFullRow = styled(PickerRow)`
  flex: 1;
`

const Picker = styled(_Picker)``

const TextInput = styled.TextInput.attrs(props => ({placeholderTextColor: Colors.placeholder}))`
  flex: 1;
  font-family: ${Font.regular};
  font-size: 18px;
  color: ${Colors.text};
`
