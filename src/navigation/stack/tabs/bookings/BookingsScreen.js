import React from "react"
import styled from "styled-components"
import {TabContainer} from "../../../../components"
import {Layout} from "../../../../constants"
import _BookingList from "../../../../components/lists/BookingList"
import Api, {mapBooking, Routes} from "../../../../helpers/Api"
import Storage from "../../../../helpers/Storage";
import {requestErrorHandler} from "../../../../helpers"


export default class BookingsScreen extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      bookings: [],
      fetching: false
    }

    this._onRefresh = this._onRefresh.bind(this)
  }

  componentDidMount() {
    this.removeFocusListener = this.props.navigation.addListener('focus', () => {
      if (this.props.route.params && this.props.route.params.refresh)
        this._onRefresh()
    })

    Storage.get("bookings")
      .then(bookings => {
        if (bookings)
          this.setState({bookings})

        this._onRefresh()
      })
  }

  componentWillUnmount() {
    this.removeFocusListener()
  }

  _onRefresh() {
    this.setState({fetching: true})
    Api.get(Routes.booking.USER_BOOKINGS, {}, false)
      .then(response => {
        if (response && response.data && response.data.constructor === [].constructor) {
          const bookings = response.data.map(mapBooking)
          Storage.set("bookings", bookings)
          this.setState({bookings})
        }
      })
      .catch(requestErrorHandler)
      .then(() => this.setState({fetching: false}))
  }

  render() {
    const {fetching, bookings} = this.state

    return (
      <Container noHeaderBg={!bookings.length}>
        <BookingList data={bookings} fetching={fetching} onRefresh={this._onRefresh} {...this.props}/>
      </Container>
    )
  }
}

const Container = styled(TabContainer)`
  padding: ${Layout.padding}px 0;
`

const BookingList = styled(_BookingList)`
  padding: 0 ${Layout.padding}px;
`
