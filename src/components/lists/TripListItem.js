import React from "react"
import FAIcon from "react-native-vector-icons/FontAwesome"
import styled from "styled-components"
import {Colors, Layout, Font} from "../../constants"
import {Text, TextBold, RoundedShadowContainer as _RoundedShadowContainer, DoubleCircleIcon, HR, B, BR} from "../"
import _BookButton from "../buttons/BookButton"
import {truncate, to2Digits, logo} from "../../helpers"
import Date from "../../helpers/Date"


export default class TripListItem extends React.Component {
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
    const {data, style, buttonLabel, infoStyle, noPrice, noSeats} = this.props
    const onSelect = this.props.onSelect || (() => null)
    const startDate = data.startDate.split(' ')
    const endDate = data.endDate.split(' ')

    const {collapsed} = this.state

    return (
      <Touchable onPress={this._toggleCollapse} style={style}>
        <RoundedShadowContainer collapsed={collapsed}>
          <ContainerRow>
            <Left>
              <LeftHeader>
                <CompanyLogo source={logo(data.company.logo)}/>
                <CompanyName>{truncate(data.company.name, 30)}</CompanyName>
              </LeftHeader>
              <LeftBody>
                <PathLeft>
                  <PathTextHeader>
                    {data.path.begin.city.shortName + ', ' + data.path.begin.street}
                  </PathTextHeader>
                  <PathText>{Date.isoToFr(startDate[0])}</PathText>
                  <PathTextBold>{startDate[1]}</PathTextBold>
                </PathLeft>
                <PathLeftIcon>
                  <DoubleCircleIcon sm/>
                </PathLeftIcon>
                <PathLine/>
                <Path>
                  <DurationLabel>Durée</DurationLabel>
                  <Badge>
                    <Duration>{data.duration}</Duration>
                  </Badge>
                  {
                    noSeats ? <SeatsText/>
                      : data.seats && data.available ? <SeatsText>{to2Digits(data.seats)} pls</SeatsText>
                      : <SeatsText>--</SeatsText>
                  }
                </Path>
                <PathLine/>
                <PathRightIcon>
                  <FAIcon name="map-marker" size={10} color={Colors.secondary}/>
                </PathRightIcon>
                <PathRight>
                  <PathTextHeader>
                    {data.path.end.city.shortName + ', ' + data.path.end.street}
                  </PathTextHeader>
                  <PathText>{Date.isoToFr(endDate[0])}</PathText>
                  <PathText>{endDate[1]}</PathText>
                </PathRight>
              </LeftBody>
              {
                !collapsed && (
                  <DetailBlock>
                    <HR/>
                    <Detail>
                      <DetailText>
                        <B>Départ : </B>
                        {data.path.begin.street}, {data.path.begin.city.name}
                      </DetailText>
                      <BR sm/>
                      <DetailText>
                        <B>Arrivée : </B>
                        {data.path.end.street}, {data.path.end.city.name}
                      </DetailText>
                    </Detail>
                  </DetailBlock>
                )
              }
            </Left>
            {
              !noPrice && (
                <Right>
                  <BookButtonContainer>
                    <BookButton
                      label={buttonLabel}
                      amount={data.amount}
                      onPress={onSelect}
                      infoStyle={infoStyle}
                      available={data.seats && data.available}
                      altText={!data.seats ? "Plein !" : "Passé !"}
                    />
                  </BookButtonContainer>
                </Right>
              )
            }
            <CategoryContainer>
              <FAIcon name={this.categoriesIcons[data.category]} size={16} color={Colors.secondary}/>
              <Category>{data.category}</Category>
            </CategoryContainer>
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
  padding-bottom: 0;
  border: 1px ${Colors.placeholder};
  height: auto;
`

const ContainerRow = styled.View`
  flex-direction: row;
`

const Left = styled.View`
  flex: 4;
  padding-right: ${Layout.padding}px;
`

const LeftHeader = styled.View`
  flex-direction: row;
  align-items: center;
`

const CompanyLogo = styled.Image`
  width: 32px;
  height: 32px;
  border-radius: ${Layout.borderRadius}px;
  margin-right: ${Layout.padding}px;
`

const Badge = styled.View`
  background-color: ${Colors.primary};
  align-items: center;
  justify-content: center;
  padding: 0 ${Layout.paddingSm}px;
  border-radius: ${Layout.borderRadius}px;
  height: 20px;
`

const CompanyName = styled(TextBold)`
  color: ${Colors.text};
  font-size: 12px;
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

const PathTextHeader = styled(PathText)`
  color: ${Colors.secondary};
`

const PathTextBold = styled(PathText)`
  font-family: ${Font.bold};
`

const DetailBlock = styled.View`
  min-height: 50px;
`

const Detail = styled.View`
  flex: 1;
  padding: ${Layout.padding}px 0;
`

const DetailText = styled(_PathText)`
  text-align: left;
`

const Right = styled.View`
  flex: 1;
  align-items: flex-end;
  margin-top: ${3.5 * Layout.padding}px;
`

const CollapseIconContainer = styled.View`
  align-items: center;
  justify-content: flex-end;
`

const CategoryContainer = styled.View`
  align-items: center;
  justify-content: flex-end;
  position: absolute;
  right: 0;
`

const Category = styled(Text)`
  color: ${Colors.secondary};
  font-size: 10px;
`

const BookButtonContainer = styled.View`
  flex: 1;
  justify-content: center;
  width: 100%;
`

const BookButton = styled(_BookButton)`
  
`
