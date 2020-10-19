import React from "react"
import {Modal, TouchableWithoutFeedback} from "react-native"
import Icon from "react-native-vector-icons/FontAwesome"
import TextInput from "../inputs/TextInput"
import styled from "styled-components"
import {Layout, Colors} from "../../constants"
import {Text, TextBold} from "../"


export default class LocationInputModal extends React.Component {

  cities = [
    {name: 'Bafoussam', region: 'Ouest', shortName: 'Baf'},
    {name: 'Bamenda', region: 'North West', shortName: 'Bam'},
    {name: 'Bertoua', region: 'Est', shortName: 'Ber'},
    {name: 'Buea', region: 'South West', shortName: 'Bue'},
    {name: 'Douala', region: 'Littoral', shortName: 'Dla'},
    {name: 'Ebolowa', region: 'Sud', shortName: 'Ebo'},
    {name: 'Garoua', region: 'Nord', shortName: 'Gar'},
    {name: 'Maroua', region: 'Extrême Nord', shortName: 'Mar'},
    {name: 'Ngaoundere', region: 'Adamaoua', shortName: 'Nga'},
    {name: 'Ngaoundéré', region: 'Adamaoua', shortName: 'Nga', return: 'Ngaoundere'},
    {name: 'Yaounde', region: 'Centre', shortName: 'Yde'},
    {name: 'Yaoundé', region: 'Centre', shortName: 'Yde', return: 'Yaounde'},
  ]

  constructor(props) {
    super(props)

    this.state = {
      text: ""
    }

    this._onClose = this._onClose.bind(this)
    this._onTextChange = this._onTextChange.bind(this)
    this._onLocationSelect = this._onLocationSelect.bind(this)
  }

  _onClose() {
    this._onTextChange("")

    if (this.props.onClose)
      this.props.onClose()
  }

  _onTextChange(newText) {
    this.setState({
      text: newText
    })
  }

  _onLocationSelect(location) {
    if (this.props.onValueChange)
      this.props.onValueChange(location.return || location.name)

    this._onClose()
  }

  render() {
    const {visible, label} = this.props
    const {text} = this.state
    const suggestions = this.cities.filter(
      item => item.name.match(new RegExp(text, "i"))
        || item.shortName.match(new RegExp(text, "i"))
        || item.region.match(new RegExp(text, "i"))
    )

    return (
      <Modal
        transparent={true}
        visible={visible}
        onRequestClose={this._onClose}
      >
        <TouchableWithoutFeedback onPress={() => null}>
          <ModalBackground>
            <Container>
              <Title>{label}</Title>
              <LocationInput
                value={text}
                onValueChange={this._onTextChange}
                placeholder="Rechercher une ville..."
                autoFocus={true}
              />
              <LocationList
                data={suggestions}
                extraData={null}
                keyExtractor={(item, index) => index + ''}
                renderItem={({item, index}) => (
                  <LocationItem onPress={() => this._onLocationSelect(item)}>
                    <Icon name="map-marker" size={16} color={Colors.secondary}/>
                    <Location>{item.name}, {item.region} ({item.shortName})</Location>
                  </LocationItem>
                )}
              />
            </Container>
          </ModalBackground>
        </TouchableWithoutFeedback>
      </Modal>
    )
  }
}

const ModalBackground = styled.View`
  flex: 1;
  background-color: ${Colors.modalBackdrop};
  justify-content: center;
  padding: ${Layout.paddingXl}px;
`

const Container = styled.View`
  background-color: white;
  border-radius: ${Layout.borderRadius}px;
  height: 100%;
  padding: ${Layout.padding}px;
`

const Title = styled(TextBold)`
  font-size: 12px;
`

const LocationInput = styled(TextInput)`
  margin-top: ${Layout.paddingSm}px;
`

const LocationList = styled.FlatList.attrs(props => ({keyboardShouldPersistTaps: "always"}))`
  margin-top: ${Layout.paddingSm}px;
  flex: 1;
`
const LocationItem = styled.TouchableOpacity`
  border-bottom-width: 1px;
  border-bottom-color: ${Colors.placeholder};
  margin: ${Layout.paddingSm}px 0;
  padding: ${Layout.padding}px 0;
  flex-direction: row;
  align-items: center;
`

const Location = styled(Text)`
  font-size: 16px;
  margin-left: ${Layout.paddingSm}px;
`
