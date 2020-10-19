import React from "react"
import styled from "styled-components"
import {Text, TextBold} from "../../../../components"
import {Colors, Layout} from "../../../../constants"
import SearchForm from "../../../../components/inputs/SearchForm"
import Storage from "../../../../helpers/Storage"
import {mapTrip} from "../../../../helpers/Api"


export default class HomeScreen extends React.Component {

  constructor(props){
    super(props)

    this.state = {
      user: {}
    }

    this._onSearchSuccess = this._onSearchSuccess.bind(this)
  }

  componentDidMount() {
    Storage.get("user")
      .then(user => this.setState({user}))
  }

  _onSearchSuccess(datePickerOptions, search, response) {
    this.props.navigation.navigate("Search", {
      datePickerOptions,
      search,
      trips: response.data.map(mapTrip)
    })
  }

  render() {
    const {user} = this.state

    return (
      <Container>
        <Cool>Cool !</Cool>
        <Name>{user.firstName},</Name>
        <Question>où désirez-vous aller ?</Question>
        <SearchForm onSearchSuccess={this._onSearchSuccess}/>
      </Container>
    )
  }
}

const Container = styled.ScrollView.attrs(props => ({keyboardShouldPersistTaps: "always"}))`
  background-color: ${Colors.primary};
  padding: ${Layout.padding}px;
`

const Cool = styled(TextBold)`
  color: white;
  font-size: 50px;
  margin-top: ${Layout.window.height / 50}px;
`

const Name = styled(TextBold)`
  color: white;
  font-size: 24px;
`

const Question = styled(Text)`
  color: white;
  font-size: 20px;
  margin-bottom: ${Layout.window.height / 20}px;
`
