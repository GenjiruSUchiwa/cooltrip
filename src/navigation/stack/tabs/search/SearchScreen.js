import React from "react"
import styled from "styled-components"
import {TabContainer} from "../../../../components"
import _SearchForm from "../../../../components/inputs/SearchForm"
import _TripList from "../../../../components/lists/TripList"
import {Layout} from "../../../../constants"
import Api, {mapTrip, Routes, StatusCodes} from "../../../../helpers/Api"
import {getErrorMessage, Modal} from "../../../../helpers"
import Navigation from "../../../../helpers/Navigation"


export default class SearchScreen extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      searchFormCollapsed: true,
      fetching: true,
      datePickerOptions: props.route.params ? props.route.params.datePickerOptions : null,
      search: props.route.params ? props.route.params.search || {} : {},
      trips: props.route.params ? props.route.params.trips || [] : [],
    }

    this._onExpandSearchForm = this._onExpandSearchForm.bind(this)
    this._onCollapseSearchForm = this._onCollapseSearchForm.bind(this)
    this._onTripSelect = this._onTripSelect.bind(this)
    this._onSearchStart = this._onSearchStart.bind(this)
    this._onSearchEnd = this._onSearchEnd.bind(this)
    this._onSearchSuccess = this._onSearchSuccess.bind(this)
  }

  componentDidMount() {
    // alert(JSON.stringify(this.props.route.params ? this.props.route.params.trips || [] : [], null, 4))
  }

  _onExpandSearchForm() {
    if (this.state.searchFormCollapsed)
      this.setState({
        searchFormCollapsed: false
      })
  }

  _onCollapseSearchForm() {
    if (!this.state.searchFormCollapsed)
      this.setState({
        searchFormCollapsed: true
      })
  }

  _onTripSelect(trip) {
    Api.post(Routes.booking.INIT, {
      tripId: trip.id,
      tripUuid: trip.uuid,
      persons: this.state.search.seats
    })
      .then(response => this.props.navigation.navigate("Book", {
        trip,
        search: this.state.search,
        booking: {
          uuid: response.data.id_booking
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

  _onSearchStart() {
    this.setState({
      fetching: true
    })
  }

  _onSearchEnd() {
    this.setState({
      fetching: false
    })
  }

  _onSearchSuccess(datePickerOptions, search, response) {
    this._onCollapseSearchForm()
    this.setState({
      datePickerOptions,
      search,
      trips: response.data.map(mapTrip)
    })
  }

  render() {
    const {searchFormCollapsed, fetching, datePickerOptions, search, trips} = this.state

    return (
      <Container>
        <SearchForm
          datePickerOptions={datePickerOptions}
          initialValues={search}
          onSearchStart={this._onSearchStart}
          onSearchEnd={this._onSearchEnd}
          onSearchSuccess={this._onSearchSuccess}
          collapsed={searchFormCollapsed && !!trips.length}
          onExpand={this._onExpandSearchForm}
          bordered
        />
        <TripList data={trips} onTripSelect={this._onTripSelect} onScroll={this._onCollapseSearchForm}/>
      </Container>
    )
  }
}

const Container = styled(TabContainer)`
  padding: ${Layout.padding}px 0;
`

const SearchForm = styled(_SearchForm)`
  padding: 0 ${Layout.padding}px;
`

const TripList = styled(_TripList)`
  margin-top: ${Layout.padding}px;
  padding: 0 ${Layout.padding}px;
`
