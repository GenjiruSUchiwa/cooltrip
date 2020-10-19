import React from "react"
import styled from "styled-components"
import {Colors, Layout} from "../../constants"
import {Text, TextBold} from "../"
import _TripListItem from "./TripListItem"
import _Picker from "../inputs/Picker"
import Storage from "../../helpers/Storage"
import {getDeepValue} from "../../helpers"


export default class TripList extends React.Component {
  filters = [
    {text: "Catégorie", value: "category"},
    {text: "Compagnie", value: "company.name"},
    {text: "Heure de départ", value: "startDate"},
    {text: "Nombre de places", value: "seats"},
    {text: "Prix du ticket", value: "amount"},
  ]

  constructor(props) {
    super(props)

    this.state = {
      user: {},
      filter: "startDate"
    }

    this._onFilterChange = this._onFilterChange.bind(this)
    this._getItems = this._getItems.bind(this)
  }

  componentDidMount() {
    Storage.get("user")
      .then(user => this.setState({user}))
  }

  _onFilterChange(newValue) {
    this.setState({
      filter: newValue
    })
  }

  _getItems() {
    const {filter} = this.state
    const trips = (this.props.data || [])
      .sort((t1, t2) => { // sort using filter
        let v1 = getDeepValue(t1, filter)
        let v2 = getDeepValue(t2, filter)

        if (typeof v1 === "number" && typeof v2 === "number")
          return v1 - v2 // Asc sort

        if (typeof v1 === "string" && typeof v2 === "string") {
          v1 = v1.toLowerCase()
          v2 = v2.toLowerCase()

          return v1 < v2 ? -1 : v1 === v2 ? 0 : 1 // Asc sort
        }

        return 0
      })
      .sort((t1, t2) => { // non expired before expired
        const exp = t => !t.available && t.seats // check if trip has expired

        if (!exp(t1) && exp(t2))
          return -1

        if (exp(t1) && !exp(t2))
          return 1

        return 0
      })
    return trips.length ? ['header', ...trips] : []
  }

  renderEmptyList() {
    const {user} = this.state

    return (
      <EmptyListContainer>
        <EmptyListImage source={require("../../assets/images/lost_man.jpg")}/>
        <EmptyListTitle>Aucun voyage trouvé</EmptyListTitle>
        <EmptyListText>
          Désolé {user.firstName}, nous ne trouvons pas de voyage correspondant à votre recherche...
        </EmptyListText>
      </EmptyListContainer>
    )
  }

  render() {
    const {style} = this.props
    const {filter} = this.state
    const onTripSelect = this.props.onTripSelect || (() => null)
    const onScroll = this.props.onScroll || (() => null)

    return (
      <FlatList
        style={style}
        contentContainerStyle={{flexGrow: 1}}
        ListEmptyComponent={this.renderEmptyList()}
        data={this._getItems()}
        extraData={null}
        keyExtractor={(item, index) => index + ''}
        renderItem={({item, index}) => !index
          ? (
            <FiltersContainer>
              <PickerLabel>Trier par :</PickerLabel>
              <Picker
                items={this.filters}
                value={filter}
                onSelectedChange={this._onFilterChange}
              />
            </FiltersContainer>
          ) : (
            <TripListItem data={item} onSelect={() => onTripSelect(item)}/>
          )
        }
        removeClippedSubviews={true}
        onScroll={onScroll}
      />
    )
  }
}

const FlatList = styled.FlatList.attrs(props => ({keyboardShouldPersistTaps: "always"}))``

const TripListItem = styled(_TripListItem)`
  margin-bottom: ${Layout.padding}px;
`

const FiltersContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: ${Layout.padding}px;
  max-height: 20px;
`

const Picker = styled(_Picker)`
  margin-left: 5px;
`

const PickerLabel = styled(Text)`
  margin-left: 5px;
  font-size: 14px;
`

const EmptyListContainer = styled.View`
  align-items: center;
  justify-content: center;
  flex: 1;
`

const EmptyListImage = styled.Image`
  width: 100%;
  border-radius: ${Layout.borderRadius}px;
`

const EmptyListTitle = styled(TextBold)`
  color: ${Colors.primary};
  font-size: 18px;
  text-align: center;
`

const EmptyListText = styled(Text)`
  color: ${Colors.primary};
  font-size: 14px;
  text-align: center;
`
