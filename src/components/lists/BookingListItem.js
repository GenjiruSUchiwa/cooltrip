import React from "react"
import FAIcon from "react-native-vector-icons/FontAwesome"
import styled from "styled-components"
import {Colors, Layout} from "../../constants"
import {
  Text, TextBold, DoubleCircleIcon, HR as _HR, BR,
  RoundedShadowContainer as _RoundedShadowContainer
} from "../"
import {truncate, formatAmount, logo} from "../../helpers"
import Font from "../../constants/Font"
import DateHelper from "../../helpers/Date"


export default class BookingListItem extends React.Component {
  categoriesIcons = {
    CLASSIC: 'bus',
    CLASSIQUE: 'bus',
    VIP: 'briefcase',
  }

  constructor(props) {
    super(props)

    this.state = {
      collapsed: true
    }

    this._toggleCollapse = this._toggleCollapse.bind(this)
  }

  _toggleCollapse() {
    this.setState({
      collapsed: !this.state.collapsed
    })
  }

  render() {
    const {data, style} = this.props
    const trip = data.trip || {}
    const path = trip.path || {}
    const date = data.date.split(' ')
    const startDate = trip.startDate.split(' ')
    const endDate = trip.endDate.split(' ')

    const {collapsed} = this.state

    return (
      <Touchable onPress={this._toggleCollapse} style={style}>
        <RoundedShadowContainer>
          <ContainerRow>
            <Left>
              <LeftHeader>
                <Title>{path.begin.city.name + ' -> ' + path.end.city.name}</Title>
                <BR/>
                {collapsed && <StatusIcon status={data.status} sm/>}
              </LeftHeader>
              <Date>{DateHelper.isoToFr(date[0])} à {date[1]}</Date>
              {
                collapsed ? (
                  <>
                    <BR/>
                    <ContainerRow>
                      <DetailLabel>Référence : </DetailLabel>
                      <DetailTextBold>{data.ref}</DetailTextBold>
                    </ContainerRow>
                  </>
                ) : (
                  <>
                    <HR/>
                    <LeftBody>
                      <PathLeft>
                        <PathText>{DateHelper.isoToFr(startDate[0])}</PathText>
                        <PathText>{startDate[1]}</PathText>
                      </PathLeft>
                      <PathLeftIcon>
                        <DoubleCircleIcon sm/>
                      </PathLeftIcon>
                      <PathLine/>
                      <Path>
                        <DurationLabel>Durée</DurationLabel>
                        <Badge>
                          <Duration>{trip.duration}</Duration>
                        </Badge>
                        <SeatsText/>
                      </Path>
                      <PathLine/>
                      <PathRightIcon>
                        <FAIcon name="map-marker" size={10} color={Colors.secondary}/>
                      </PathRightIcon>
                      <PathRight>
                        <PathText>{DateHelper.isoToFr(endDate[0])}</PathText>
                        <PathText>{endDate[1]}</PathText>
                      </PathRight>
                    </LeftBody>
                    <HR/>
                    <ContainerRow>
                      <Col flex={5}>
                        <DetailLabel>Compagnie :</DetailLabel>
                        <DetailLabel>Ag. de départ :</DetailLabel>
                        <DetailLabel>Ag. d'arrivée :</DetailLabel>
                        <DetailLabel>Nb de places :</DetailLabel>
                        <DetailLabel>Référence :</DetailLabel>
                      </Col>
                      <Col flex={7}>
                        <DetailText>{truncate(trip.company.name, 20)}</DetailText>
                        <DetailText>{path.begin.street}</DetailText>
                        <DetailText>{path.end.street}</DetailText>
                        <DetailText>{data.seats}</DetailText>
                        <DetailTextBold>{data.ref}</DetailTextBold>
                      </Col>
                    </ContainerRow>
                  </>
                )
              }
            </Left>
            <Right>
              <Amount>{formatAmount(data.amount)} F</Amount>
              {!collapsed && <Status status={data.status}/>}
              <ContainerRow>
                <CategoryContainer>
                  <FAIcon name={this.categoriesIcons[trip.category]} size={12} color={Colors.secondary}/>
                  <Category>{trip.category}</Category>
                </CategoryContainer>
                <CompanyLogo source={logo(trip.company.logo)}/>
              </ContainerRow>
            </Right>
          </ContainerRow>
          <CollapseIconContainer>
            <FAIcon name={collapsed ? "angle-down" : "angle-up"} size={20} color={Colors.secondary}/>
          </CollapseIconContainer>
        </RoundedShadowContainer>
      </Touchable>
    )
  }
}

const Touchable = styled.TouchableHighlight`
  border-radius: ${Layout.borderRadius}px;
`

const RoundedShadowContainer = styled(_RoundedShadowContainer)`
  border: 1px ${Colors.placeholder};
  padding-bottom: 0;
  height: auto;
`

const ContainerRow = styled.View`
  flex-direction: row;
`

const HR = styled(_HR)`
  margin: ${Layout.padding}px 0;
`

const Col = styled.View`
  flex: ${props => props.flex || 1};
`

const ColCenter = styled(Col)`
  align-items: center;
  justify-content: center;
`

const StatusIcon = props => {
  const iconSize = props.sm ? 16 : 50

  return props.status === 'CANCELED'
    ? <FAIcon name="exclamation-circle" size={iconSize} color={Colors.danger}/>
    : props.status === 'SUCCESS' || props.status === 'VALIDATED'
      ? <FAIcon name="check-circle" size={iconSize} color={Colors.success}/>
      : <FAIcon name="question-circle" size={iconSize} color={Colors.text}/>
}

const Status = props => (
  <ColCenter>
    <StatusIcon {...props}/>
    {
      props.status === 'CANCELED'
        ? <DangerText>Annulée</DangerText>
        : props.status === 'SUCCESS' || props.status === 'VALIDATED'
        ? <SuccessText>Confirmée</SuccessText>
        : <StatusText>En attente</StatusText>
    }
  </ColCenter>
)

const Left = styled.View`
  flex: 3;
  padding-right: ${Layout.padding}px;
`

const LeftHeader = styled.View`
  flex-direction: row;
  align-items: center;
`

const Title = styled(TextBold)`
  font-size: 14px;
`

const Date = styled(Title)`
  font-family: ${Font.regular};
`

const CompanyLogo = styled.Image`
  width: 24px;
  height: 24px;
  border-radius: ${Layout.borderRadius}px;
  margin-left: ${Layout.padding}px;
`

const LeftBody = styled.View`
  flex-direction: row;
  padding: ${Layout.padding}px;
  align-items: center;
`

const PathLeft = styled.View`
  align-items: flex-end;
  justify-content: center;
`

const PathLeftIcon = styled(PathLeft)`
  padding-left: ${Layout.padding}px;
`

const PathLine = styled.View`
  flex: 1;
  border-top-width: 1px;
  border-top-color: ${Colors.secondary};
  margin: 0 2px;
`

const Path = styled.View`
  align-items: center;
  justify-content: center;
`

const DurationLabel = styled(Text)`
  font-size: 10px;
  text-align: center;
`

const Badge = styled.View`
  background-color: ${Colors.primary};
  align-items: center;
  justify-content: center;
  padding: 0 ${Layout.paddingSm}px;
  border-radius: ${Layout.borderRadius}px;
  height: 20px;
`

const Duration = styled(Text)`
  color: white;
  font-size: 12px;
`

const SeatsText = styled(TextBold)`
  font-size: 10px;
  text-align: center;
`

const PathRight = styled.View`
  justify-content: center;
`

const PathRightIcon = styled(PathRight)`
  padding-right: ${Layout.padding}px;
`

const _PathText = styled(Text)`
  font-size: 12px;
`

const PathText = props => <_PathText style={props.style}>{truncate(props.children, 12)}</_PathText>

const DetailLabel = styled(_PathText)`

`

const DetailText = styled(DetailLabel)`
  color: ${Colors.secondary};
`

const DetailTextBold = styled(DetailText)`
  font-family: ${Font.bold};
`

const StatusText = styled(DetailLabel)`
  text-align: center;
`

const SuccessText = styled(StatusText)`
  color: ${Colors.success};
`

const DangerText = styled(StatusText)`
  color: ${Colors.danger};
`

const Right = styled.View`
  flex: 1;
  align-items: flex-end;
  height: 100%;
`

const Amount = styled(Title)`
  color: ${Colors.secondary};
  font-size: 18px;
  margin-bottom: ${Layout.padding}px;
`

const CollapseIconContainer = styled.View`
  align-items: center;
  justify-content: flex-end;
`

const CategoryContainer = styled.View`
  align-items: center;
  justify-content: flex-end;
`

const Category = styled(Text)`
  color: ${Colors.secondary};
  font-size: 8px;
`
