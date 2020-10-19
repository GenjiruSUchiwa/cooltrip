import React from "react"
import {Linking, Clipboard, Share} from "react-native"
import SLIcon from "react-native-vector-icons/SimpleLineIcons"
import styled from "styled-components"
import {
  TabContainer, BR, Text, Logo,
  RoundedShadowContainer as _RoundedShadowContainer
} from "../../../../components"
import {Colors, Layout, Font} from "../../../../constants"
import ButtonIcon from "../../../../components/buttons/ButtonIcon"
import CheckBox from "../../../../components/inputs/CheckBox"
import {env} from "../../../../helpers"
import {Routes} from "../../../../helpers/Api"
import {formatPhoneNumber} from "../../../../helpers"
import Toast from "../../../../helpers/Toast"
import Modal from "../../../../helpers/Modal"


export default class PaymentScreen extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      notify1h: false,
      notify2h: true,
      notifyEmail: false,
    }

    this._onNotify1hChange = this._onNotify1hChange.bind(this)
    this._onNotify2hChange = this._onNotify2hChange.bind(this)
    this._onNotifyEmailChange = this._onNotifyEmailChange.bind(this)
    this._onCallSupport = this._onCallSupport.bind(this)
    this._onMailtoSupport = this._onMailtoSupport.bind(this)
  }

  _onNotify1hChange() {
    this.setState({
      notify1h: !this.state.notify1h
    })
  }

  _onNotify2hChange() {
    this.setState({
      notify2h: !this.state.notify2h
    })
  }

  _onNotifyEmailChange() {
    this.setState({
      notifyEmail: !this.state.notifyEmail
    })
  }

  onLinkClick(link) {
    Linking.openURL(link)
  }

  _onCallSupport() {
    this.onLinkClick("tel:+237" + Routes.support.PHONE)
  }

  _onMailtoSupport() {
    this.onLinkClick("mailto:" + Routes.support.EMAIL + "?subject=Besoin d'assistance")
  }

  onShareMyLink() {
    Share.share({
      title: Routes.sponsorship.TITLE,
      message: Routes.sponsorship.MESSAGE,
      dialogTitle: Routes.sponsorship.title
    })
      .then(result => {
        // alert("OK")
      })
      .catch(error => Modal.feedback.show({
        type: "error",
        title: "OUPS !",
        message: error.message,
      }))
  }

  onCopyMyLink() {
    Clipboard.setString(Routes.sponsorship.MESSAGE)
    Toast.show("Lien de parrainage copié")
  }

  render() {
    const {notify1h, notify2h, notifyEmail} = this.state

    return (
      <Container>
        <ScrollView>
          <RoundedShadowContainer title="Paramètres des notifications">
            <LeftBorderContainer>
              <CheckBox checked={notify2h} onStateChange={this._onNotify2hChange} inverse>
                Me notifier 2h avant chaque départ
              </CheckBox>
              <BR/>
              <CheckBox checked={notify1h} onStateChange={this._onNotify1hChange} inverse>
                Me notifier 1h avant chaque départ
              </CheckBox>
              <BR/>
              <CheckBox checked={notifyEmail} onStateChange={this._onNotifyEmailChange} inverse>
                Me notifier par e-mail
              </CheckBox>
            </LeftBorderContainer>
          </RoundedShadowContainer>
          <RoundedShadowContainer title="Service client">
            <LeftBorderContainer>
              <RowFirst>
                <SettingText>(+237) {formatPhoneNumber(Routes.support.PHONE)}</SettingText>
                <SocialMediaButton icon="phone" onPress={this._onCallSupport}>
                  Appeler
                </SocialMediaButton>
              </RowFirst>
              <Row>
                <SettingText>{Routes.support.EMAIL}</SettingText>
                <SocialMediaButton icon="envelope" onPress={this._onMailtoSupport}>
                  Ecrire
                </SocialMediaButton>
              </Row>
              <Row>
                <SettingText>www.thecooltrip.com</SettingText>
                <SocialMediaButton icon="globe" onPress={() => this.onLinkClick(Routes.links.WEBSITE)}>
                  Aller à
                </SocialMediaButton>
              </Row>
            </LeftBorderContainer>
          </RoundedShadowContainer>
          <RoundedShadowContainer title="Rejoindre la communauté">
            <RowFirst>
              <SocialMediaButton
                icon="facebook" color={Colors.Facebook}
                onPress={() => this.onLinkClick(Routes.community.FACEBOOK)}>
                Facebook
              </SocialMediaButton>
              <BR/>
              <SocialMediaButton
                icon="twitter" color={Colors.Twitter}
                onPress={() => this.onLinkClick(Routes.community.TWITTER)}>
                Twitter
              </SocialMediaButton>
            </RowFirst>
            <Row>
              <SocialMediaButton
                icon="instagram" color={Colors.Instagram}
                onPress={() => this.onLinkClick(Routes.community.INSTAGRAM)}>
                Instagram
              </SocialMediaButton>
              <BR/>
              <SocialMediaButton
                icon="whatsapp" color={Colors.WhatsApp}
                onPress={() => this.onLinkClick(Routes.community.WHATSAPP)}>
                WhatsApp
              </SocialMediaButton>
            </Row>
          </RoundedShadowContainer>
          <RoundedShadowContainer title="Parrainage">
            <RowFirst>
              <SocialMediaButton icon="share-alt" onPress={this.onShareMyLink}>
                Partager mon lien
              </SocialMediaButton>
              <BR/>
              <SocialMediaButton icon="copy" onPress={this.onCopyMyLink}>
                Copier mon lien
              </SocialMediaButton>
            </RowFirst>
            <Row>
              <SLIcon name="people" size={12} color={Colors.text}/>
              <BR/>
              <InfoText>
                Vous parrainez <EM>0</EM> personne(s) et vous avez <EM>0 F</EM> de crédit.
              </InfoText>
            </Row>
          </RoundedShadowContainer>
          <Footer>
            <TermsLink>
              <TermsText onPress={() => this.onLinkClick(Routes.links.POLICY)}>
                Conditions générales d'utilisation
              </TermsText>
            </TermsLink>
            <Logo size={Layout.listItemHeight}/>
            <AppVersion>version {env("APP_VERSION")}</AppVersion>
          </Footer>
        </ScrollView>
      </Container>
    )
  }
}

const Container = styled(TabContainer)`
  padding: ${Layout.padding}px 0;
`

const ScrollView = styled.ScrollView.attrs(props => ({keyboardShouldPersistTaps: "always"}))`
  flex: 1;
  padding: 0 ${Layout.padding}px;
`

const RoundedShadowContainer = styled(_RoundedShadowContainer)`
  border: 1px ${Colors.placeholder};
  margin-bottom: ${Layout.padding}px;
  height: auto;
`

const RowFirst = styled.View`
  flex-direction: row;
  align-items: center;
`

const Row = styled(RowFirst)`
  margin-top: ${Layout.padding}px;
`

const LeftBorderContainer = styled.View`
  border-left-width: 2px;
  border-left-color: ${Colors.placeholder};
  padding-left: ${Layout.padding}px;
`

const SettingText = styled(Text)`
  font-size: 14px;
  flex: 4;
`

const SocialMediaButton = styled(ButtonIcon)`
  flex: 1;
`

const InfoText = styled(Text)`
  font-size: 12px;
  flex: 1;
`

const EM = styled(InfoText)`
  font-family: ${Font.bold};
  color: ${Colors.secondary};
`

const Footer = styled.View`
  align-items: center;
`

const TermsLink = styled.TouchableOpacity``

const TermsText = styled(Text)`
  font-size: 16px;
  text-decoration: underline;
  color: ${Colors.primary};
`

const AppVersion = styled(Text)`
  font-size: 14px;
  color: ${Colors.placeholder};
  margin-top: ${-Layout.listItemHeight / 5}px;
`
