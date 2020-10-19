import React from "react"
import {RefreshControl} from "react-native"
import styled from "styled-components"
import {Colors, Layout} from "../../constants"
import _BookingListItem from "./BookingListItem"
import ButtonIcon from "../../components/buttons/ButtonIcon"
import {Text, TextBold} from "../"


export default class BookingList extends React.Component {

  renderEmptyList() {
    return (
      <EmptyListContainer>
        <EmptyListImage source={require("../../assets/images/lost_man.jpg")}/>
        <EmptyListTitle>Il semble que vous n'avez pas encore fait de réservation.</EmptyListTitle>
        <EmptyListText>
          Tirez vers le bas ↓ pour actualiser ou appuyez sur le bouton pour voir les voyages disponibles.
        </EmptyListText>
        <Button onPress={() => this.props.navigation.navigate("Home")} icon="search" color={Colors.primary}>
          Rechercher
        </Button>
      </EmptyListContainer>
    )
  }

  render() {
    const {style, fetching} = this.props
    const bookings = this.props.data || []
    const onRefresh = this.props.onRefresh || (() => null)

    return (
      <FlatList
        style={style}
        data={bookings}
        extraData={null}
        keyExtractor={(item, index) => index + ''}
        renderItem={({item, index}) => <BookingListItem data={item}/>}
        removeClippedSubviews={true}
        onScroll={() => null}
        ListEmptyComponent={this.renderEmptyList.bind(this)}
        refreshControl={
          <RefreshControl
            refreshing={fetching}
            onRefresh={onRefresh}
            colors={[Colors.primary]}
          />
        }
      />
    )
  }
}

const FlatList = styled.FlatList.attrs(props => ({keyboardShouldPersistTaps: "always"}))``

const BookingListItem = styled(_BookingListItem)`
  margin-bottom: ${Layout.paddingSm}px;
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
  color: ${Colors.text};
  font-size: 14px;
  text-align: center;
`

const Button = styled(ButtonIcon)`
  margin-top: ${Layout.paddingLg}px;
`
