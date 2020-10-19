import React from "react"
import {Alert, RefreshControl} from "react-native"
import FAIcon from "react-native-vector-icons/FontAwesome"
import styled from "styled-components"
import {TabContainer, BR, HR as _HR, Text, TextBold} from "../../../../components"
import {Colors, Layout} from "../../../../constants"
import ButtonIcon from "../../../../components/buttons/ButtonIcon"
import {formatGenderFull, formatPhoneNumber, requestErrorHandler, truncate} from "../../../../helpers"
import Storage from "../../../../helpers/Storage"
import Firebase from "../../../../helpers/Firebase"
import Modal from "../../../../helpers/Modal"
import Date from "../../../../helpers/Date"
import Api, {mapUser, Routes} from "../../../../helpers/Api"


export default class AccountScreen extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      fetching: false,
      user: {},
      phoneNumber: {},
      identification: {}
    }

    this._onRefresh = this._onRefresh.bind(this)
    this._onEditPress = this._onEditPress.bind(this)
    this._onVerifyPress = this._onVerifyPress.bind(this)
    this._onHistoryPress = this._onHistoryPress.bind(this)
    this._onLogoutPress = this._onLogoutPress.bind(this)
    this._logout = this._logout.bind(this)
  }

  componentDidMount() {
    this.removeFocusListener = this.props.navigation.addListener('focus', () => {
      if (this.props.route.params && this.props.route.params.refresh)
        this._onRefresh()
    })

    Storage.getMultiple(["user", "phoneNumber", "identification"], [{}, {}, {}])
      .then(data => {
        this.setState(data)
        this._onRefresh()
      })
  }

  componentWillUnmount() {
    this.removeFocusListener()
  }

  _onRefresh() {
    this.setState({fetching: true})

    Storage.get("identification", {})
      .then(identification => this.setState(identification))

    Api.post(
      Routes.user.RETRIEVE,
      {phoneNumber: this.state.phoneNumber.code + this.state.phoneNumber.number},
      {}, false
    )
      .then(user => {
        if (user && user.constructor === {}.constructor) {
          user = mapUser(user)
          Storage.set("user", user)
          this.setState({user})
        }
      })
      .catch(requestErrorHandler)
      .then(() => this.setState({fetching: false}))
  }

  onError(error) {
    Modal.feedback.show({
      type: "error",
      title: "OUPS !",
      message: error.message,
    })
  }

  _logout() {
    Firebase.logout()
      .then(
        () => Storage.clear()
          .then(() => null)
          .catch(this.onError)
          .then(() => this.props.navigation.navigate("Login"))
      )
      .catch(this.onError)
  }

  _onEditPress() {
    this.props.navigation.navigate("EditProfile")
  }

  _onVerifyPress() {
    Modal.feedback.show({
      type: "info",
      title: "Prochainement...",
      message: "Vous aurez la possibilité de faire vérifier vos informations dans une mise à jour future.",
    })
  }

  _onHistoryPress() {
    Modal.feedback.show({
      type: "info",
      title: "Prochainement...",
      message: "Vous aurez la possibilité de consulter l'historique de vos crédits dans une mise à jour future.",
    })
  }

  _onLogoutPress() {
    Alert.alert(
      'Demande de confirmation',
      'Etant déconnecté vous ne pourrez plus éffectuer de réservation sur CoolTrip.\nVoulez-vous continuer ?',
      [
        {
          text: 'Me déconnecter', onPress: () => this._logout()
        },
        {
          text: 'Annuler', onPress: () => null
        },
      ],
    )
  }

  render() {
    const {fetching, user, phoneNumber, identification} = this.state

    return (
      <Container>
        <ScrollView
          contentContainerStyle={{alignItems: 'center'}}
          refreshControl={
            <RefreshControl
              refreshing={fetching}
              onRefresh={this._onRefresh}
              colors={[Colors.primary]}
            />
          }
        >
          <Avatar source={require("../../../../assets/images/avatar.jpg")}/>
          <Header>
            <Username>{user.firstName} {user.lastName}</Username>
            <UsernameEditButton onPress={this._onEditPress} icon="edit" sm>
              Modifier
            </UsernameEditButton>
          </Header>
          <HR/>
          <InfoBlock>
            <HeaderRow>
              <Label>Numéro de téléphone</Label>
              <Badge/>
            </HeaderRow>
            <Row>
              <Info>{phoneNumber.code} {formatPhoneNumber(phoneNumber.number)}</Info>
              {/*<Button icon="edit" sm>*/}
              {/*Modifier*/}
              {/*</Button>*/}
            </Row>
          </InfoBlock>
          <HR/>
          <InfoBlock>
            <HeaderRow>
              <Label>Adresse e-mail</Label>
              <Badge danger/>
            </HeaderRow>
            <Row>
              <Info>{truncate(user.email, 20)}</Info>
              <Button onPress={this._onVerifyPress} icon="check" color={Colors.primary} sm>
                Vérifier
              </Button>
              <BR sm/>
              <Button onPress={this._onEditPress} icon="edit" sm>
                Modifier
              </Button>
            </Row>
          </InfoBlock>
          <HR/>
          <InfoBlock>
            <HeaderRow>
              <Label>Pièce d'identité</Label>
              <Badge danger/>
            </HeaderRow>
            <Row>
              <Info>{identification.type} - {identification.number}</Info>
              <Button onPress={this._onVerifyPress} icon="check" color={Colors.primary} sm>
                Vérifier
              </Button>
              <BR sm/>
              <Button onPress={this._onEditPress} icon="edit" sm>
                Modifier
              </Button>
            </Row>
          </InfoBlock>
          <HR/>
          <InfoBlock>
            <HeaderRow>
              <Label>Sexe et Date de naissance</Label>
              <Badge danger/>
            </HeaderRow>
            <Row>
              <Info>{formatGenderFull(user.gender, "???")} - {Date.isoToFr(user.birthDate)}</Info>
              <Button onPress={this._onVerifyPress} icon="check" color={Colors.primary} sm>
                Vérifier
              </Button>
              <BR sm/>
              <Button onPress={this._onEditPress} icon="edit" sm>
                Modifier
              </Button>
            </Row>
          </InfoBlock>
          <HR/>
          <InfoBlock>
            <HeaderRow>
              <Label>Crédit de parrainage</Label>
            </HeaderRow>
            <Row>
              <Info>0 XAF</Info>
              <Button onPress={this._onHistoryPress} icon="list" sm>
                Historique
              </Button>
            </Row>
          </InfoBlock>
          <HR/>
          <Button onPress={this._onLogoutPress} icon="sign-out" color={Colors.danger} inverse>
            Me déconnecter
          </Button>
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

const Avatar = styled.Image`
  width: ${Layout.listItemHeight}px;
  height: ${Layout.listItemHeight}px;
  border-radius: ${Layout.listItemHeight}px;
  border-width: 1px;
  border-color: ${Colors.placeholder};
`

const Header = styled.View`
  margin-top: ${Layout.padding}px;
  width: 100%;
`

const Username = styled(Text)`
  text-align: center;
  font-size: 20px;
  margin: 0 50px;
`

const Button = styled(ButtonIcon)``

const UsernameEditButton = styled(Button)`
  position: absolute;
  right: 0;
  bottom: 2px;
`

const HR = styled(_HR)`
  margin: ${Layout.paddingLg}px 0;
`

const Row = styled.View`
  flex-direction: row;
  align-items: center;
`

const HeaderRow = styled(Row)`
  margin-bottom: ${Layout.paddingSm}px;
`

const InfoBlock = styled.View`
  width: 100%;
`

const Label = styled(TextBold)`
  font-size: 10px;
`

const BadgeText = styled(Text)`
  font-size: 12px;
  color: ${props => props.danger ? Colors.danger : Colors.success};
  margin-left: 2px;
`

const _Badge = styled.View`
  flex-direction: row;
  align-items: center;
  margin-left: ${Layout.padding}px;
`

const Badge = props => props.danger
  ? (
    <_Badge>
      <FAIcon name="exclamation-circle" size={10} color={Colors.danger}/>
      <BadgeText danger>non vérifié</BadgeText>
    </_Badge>
  ) : (
    <_Badge>
      <FAIcon name="check-circle" size={10} color={Colors.success}/>
      <BadgeText>vérifié</BadgeText>
    </_Badge>
  )

const Info = styled(Text)`
  font-size: 16px;
  flex: 1;
  margin-right: ${Layout.padding}px;
`
