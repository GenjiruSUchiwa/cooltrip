import React from "react"
import {StyleSheet} from "react-native"
import Dropdown from "react-native-modal-dropdown"
import styled from "styled-components"
import FAIcon from "react-native-vector-icons/FontAwesome"
import BottomSheetModal from "../modals/BottomSheetModal"
import {Colors, Layout, Shadows} from "../../constants"
import {Text, BR} from "../"


export default class Picker extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      listVisible: false
    }

    this._onSelectionChange = this._onSelectionChange.bind(this)
    this._showList = this._showList.bind(this)
    this._hideList = this._hideList.bind(this)
    this._renderSelectedItem = this._renderSelectedItem.bind(this)
    this._renderItem = this._renderItem.bind(this)
    this._adjustDropdownFrame = this._adjustDropdownFrame.bind(this)
  }

  _onSelectionChange(newValue) {
    this.props.onSelectedChange(newValue)
    this._hideList()
  }

  _showList() {
    this.setState({
      listVisible: true
    })
  }

  _hideList() {
    this.setState({
      listVisible: false
    })
  }

  renderSeparator() {
    return <BR/>
  }

  _renderSelectedItem() {
    const {items, value, renderSelected, textExtractor, valueExtractor, placeholder, style, left} = this.props
    const extractText = renderSelected || (item => item.text)
    const extractOptionText = textExtractor || (item => item.text)
    const extractOptionValue = valueExtractor || (item => item.value)
    const selected = items.find(item => extractOptionValue(item) === value)
    const selectedIndex = items.indexOf(selected)
    const mode = this.props.mode || "dropdown"

    return mode === "dropdown"
      ? (
        <Container style={style}>
          {left && left}
          <SelectedItem left={left}>{extractText(selected)}</SelectedItem>
          <Icon name="caret-down" size={18} color={Colors.secondary}/>
        </Container>
      ) : (
        <TouchableContainer onPress={this._showList} style={style}>
          {left && left}
          <SelectedItem left={left}>{extractText(selected)}</SelectedItem>
          <Icon name="caret-down" size={18} color={Colors.secondary}/>
        </TouchableContainer>
      )
  }

  _renderItem(item, index, active) {
    const {items, value, renderSelected, textExtractor, valueExtractor, placeholder, style} = this.props
    const extractText = renderSelected || (item => item.text)
    const extractOptionText = textExtractor || (item => item.text)
    const extractOptionValue = valueExtractor || (item => item.value)
    const selected = items.find(item => extractOptionValue(item) === value)
    const selectedIndex = items.indexOf(selected)
    const mode = this.props.mode || "dropdown"

    return mode === "dropdown"
      ? (
        <Item>
          <ItemText selected={active}>
            {extractOptionText(item)}
          </ItemText>
        </Item>
      ) : (
        <TouchableItem
          onPress={() => index ? this._onSelectionChange(extractOptionValue(item)) : this._hideList()}
        >
          <ItemText selected={extractOptionValue(item) === value}>
            {extractOptionText(item)}
          </ItemText>
          {index === 0 ? <Icon name="caret-down" size={18} color={Colors.secondary}/> : null}
        </TouchableItem>
      )
  }

  _adjustDropdownFrame(frame) {
    return {
      ...frame,
      height: Math.min(
        this.props.items.length * (16 + Layout.paddingLg) + Layout.paddingLg,
        Layout.window.height - Layout.textInputHeight - frame.top
      )
    }
  }

  render() {
    const {items, value, renderSelected, textExtractor, valueExtractor, placeholder, style} = this.props
    const extractText = renderSelected || (item => item.text)
    const extractOptionText = textExtractor || (item => item.text)
    const extractOptionValue = valueExtractor || (item => item.value)
    const selected = items.find(item => extractOptionValue(item) === value)
    const selectedIndex = items.indexOf(selected)
    const mode = this.props.mode || "dropdown"

    return mode === "dropdown"
      ? (
        <Dropdown
          options={items}
          defaultIndex={selectedIndex}
          onSelect={(index, item) => this._onSelectionChange(extractOptionValue(item))}
          renderRow={this._renderItem}
          renderSeparator={this.renderSeparator}
          dropdownStyle={styles.dropdown}
          adjustFrame={this._adjustDropdownFrame}
          keyboardShouldPersistTaps="always"
        >
          {this._renderSelectedItem()}
        </Dropdown>
      ) : (
        <>
          {this._renderSelectedItem()}
          <BottomSheetModal title={placeholder} visible={this.state.listVisible} onClose={this._hideList}>
            <FlatList
              data={[selected, ...items.filter(item => item !== selected)]}
              extraData={selected}
              keyExtractor={(item, index) => index + ''}
              renderItem={({item, index}) => this._renderItem(item, index)}
              removeClippedSubviews={true}
              ListFooterComponent={<BR height={20}/>}
            />
          </BottomSheetModal>
        </>
      )
  }
}

const styles = StyleSheet.create({
  dropdown: {
    padding: Layout.padding,
    minWidth: Layout.window.width / 3,
    borderWidth: 1,
    borderColor: Colors.placeholder,
    ...Shadows.default
  }
})

const Container = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 100%;
`

const TouchableContainer = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 100%;
`

const SelectedItem = styled(Text)`
  font-size: 18px;
  color: ${Colors.secondary};
  margin-left: ${props => props.left ? 5 : 0}px;
`

const Icon = styled(FAIcon)`
  margin-left: ${Layout.paddingSm}px;
`

const FlatList = styled.FlatList.attrs(props => ({keyboardShouldPersistTaps: "always"}))`
  width: 100%;
  height: 100%;
`

const Item = styled.View`
  flex-direction: row;
`

const TouchableItem = styled.TouchableOpacity`
  flex-direction: row;
  margin-bottom: ${Layout.padding}px;
`

const ItemText = styled(Text)`
  font-size: 18px;
  color: ${props => props.selected ? Colors.secondary : Colors.text};
`
