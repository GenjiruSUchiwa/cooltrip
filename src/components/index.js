import React from "react"
import styled from "styled-components"
import {Colors, Layout, Font, Shadows} from "../constants"


// Root container
export const Root = styled.View`
  flex: 1;
`


// Content centered container
export const Container = styled(Root)`
  align-items: center;
  justify-content: center;
`


// Full width container
export const Block = styled.View`
  width: 100%;
`


// TelInput container
export const InputContainer = styled.View`
  width: 100%;
  height: 50px;
  border: 1px solid ${Colors.border};
  border-radius: ${Layout.borderRadius}px;
  background-color: white;
  padding-right: ${Layout.padding}px;
  align-items: center;
  flex-direction: row;
`


// Logo
const LogoComponent = styled.Image`
  width: ${props => props.size || 256}px;
  height: ${props => props.size || 256}px;
`
export const Logo = (props) => <LogoComponent source={require('../assets/images/cooltrip-logo.png')} {...props} />


// Default text
export const Text = styled.Text`
  color: ${Colors.text};
  font-size: 24px;
  font-family: ${Font.regular};
`


// Bold text
export const TextBold = styled(Text)`
  font-family: ${Font.bold};
`
export const B = styled.Text`
  font-family: ${Font.bold};
`


// Empty row
export const BR = styled.View`
  width: ${props => props.width || (props.sm ? Layout.paddingSm : props.lg ? Layout.paddingLg : props.xl ? Layout.paddingXl : Layout.padding)}px;
  height: ${props => props.height || (props.sm ? Layout.paddingSm : props.lg ? Layout.paddingLg : props.xl ? Layout.paddingXl : Layout.padding)}px;
`


// Horizontal line
export const HR = styled.View`
  width: 100%;
  border-top-width: 1px;
  border-top-color: ${Colors.placeholder};
`


// Rounded container with shadow and title
const _TitledContainer = styled.View`
  height: ${props => props.height || Layout.listItemHeight * (props.sm ? .5 : 1)}px;
  background-color: white;
  padding: ${Layout.padding}px;
`
const _RoundedTitledContainer = styled(_TitledContainer)`
  border-radius: ${Layout.borderRadius}px;
`
const TitledContainerTitle = styled(TextBold)`
  font-size: 10px;
  margin-bottom: ${Layout.padding}px;
`
export const TitledContainer = props => (
  <_TitledContainer {...props}>
    {props.title && <TitledContainerTitle>{props.title}</TitledContainerTitle>}
    {props.children}
  </_TitledContainer>
)
export const RoundedShadowContainer = props => (
  <_RoundedTitledContainer style={Shadows.default} {...props}>
    {props.title && <TitledContainerTitle>{props.title}</TitledContainerTitle>}
    {props.children}
  </_RoundedTitledContainer>
)


// Tab container
const _TabContainer = styled.View`
  flex: 1;
`
const TabContainerHeaderBackground = styled.View`
  background-color: ${Colors.primary};
  height: ${Layout.padding + Layout.listItemHeight / 2}px;
  bottom: 0;
`
const TabContainerContent = styled.View`
  width: 100%;
  height: 100%;
  padding: 0 ${Layout.padding}px;
  position: absolute;
`
export const TabContainer = props => (
  <_TabContainer>
    {
      !props.noHeaderBg && <TabContainerHeaderBackground/>
    }
    <TabContainerContent style={props.style}>
      {props.children}
    </TabContainerContent>
  </_TabContainer>
)


// Path start icon
const CircleWrapper = styled.View`
  width: ${props => props.sm ? 10 : 20}px;
  height: ${props => props.sm ? 10 : 20}px;
  padding: ${props => props.sm ? 1 : 2}px;
  border-radius: 10px;
  border: ${props => props.sm ? 1 : 2}px solid ${Colors.secondary};
  align-items: center;
  justify-content: center;
`

const Circle = styled.View`
  flex: 1;
  width: 100%;
  border-radius: 8px;
  background-color: ${Colors.secondary};
`

export const DoubleCircleIcon = props => (
  <CircleWrapper {...props}>
    <Circle/>
  </CircleWrapper>
)

