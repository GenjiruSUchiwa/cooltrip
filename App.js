import React from 'react'
import {StatusBar, Keyboard} from 'react-native'
import {NavigationContainer} from "@react-navigation/native"
import EventEmitter from 'react-native-eventemitter'
import styled from "styled-components"
import {Colors} from './src/constants'
import FetchingModal from './src/components/modals/FetchingModal'
import FeedbackModal from './src/components/modals/FeedbackModal'
import StackNavigator from './src/navigation/StackNavigator'


export default class App extends React.Component {
  state = {
    fetchingModalVisible: false,
    fetchingModalText: '',
    feedbackModalVisible: false,
    feedbackModalType: 'info',
    feedbackModalTitle: '',
    feedbackModalMessage: '',
    feedbackModalCallback: () => null,
  }

  componentDidMount() {
    EventEmitter.on('modal.fetching.show', settings => this.setState({
      fetchingModalVisible: true,
      fetchingModalText: settings ? settings.text : settings
    }))
    EventEmitter.on('modal.fetching.hide', () => this.setState({fetchingModalVisible: false}))

    EventEmitter.on('modal.feedback.show', settings => this.setState({
      feedbackModalVisible: true,
      feedbackModalType: settings.type || 'info',
      feedbackModalTitle: settings.title,
      feedbackModalMessage: settings.message,
      feedbackModalCallback: settings.callback || (() => null),
    }))
    EventEmitter.on('modal.feedback.hide', () => this.setState({feedbackModalVisible: false}))
  }

  componentWillUnmount() {
    EventEmitter.removeAllListeners()
  }

  render() {
    const {
      fetchingModalVisible, fetchingModalText,
      feedbackModalVisible, feedbackModalType, feedbackModalTitle, feedbackModalMessage, feedbackModalCallback
    } = this.state

    return (
      <NavigationContainer>
        <AppRoot>
          <StatusBar translucide={true} backgroundColor={Colors.statusBar}/>
          <FetchingModal visible={fetchingModalVisible} text={fetchingModalText}/>
          <FeedbackModal
            visible={feedbackModalVisible}
            type={feedbackModalType}
            title={feedbackModalTitle}
            message={feedbackModalMessage}
            onClose={feedbackModalCallback}
          />
          <StackNavigator/>
        </AppRoot>
      </NavigationContainer>
    )
  }
}

const AppRoot = styled.View`
  flex: 1;
  background-color: ${Colors.background};
`
