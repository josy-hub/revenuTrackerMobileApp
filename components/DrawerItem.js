import React from "react";
import { StyleSheet, TouchableOpacity, Linking } from "react-native";
import { Block, Text, theme } from "galio-framework";

import Icon from "./Icon";
import argonTheme from "../constants/Theme";
import AsyncStorage from '@react-native-async-storage/async-storage';

class DrawerItem extends React.Component {
  renderIcon = () => {
    const { title, focused } = this.props;
    const screens = [
      "Home",
      "Commissions",
      "Mes paramètres",
      "Notifications",
      "Deconnexion"        
    ];

    switch (title) {
      case "Home":
        return (
          <Icon                                       
            name="shop"
            family="ArgonExtra"
            size={14}
            color={focused ? "white" : argonTheme.COLORS.PRIMARY}
          />
        );
      case "Commissions":
        return (<Icon
          name="chart-pie-35"
          family="ArgonExtra"
          size={14}
          color={focused ? "white" : argonTheme.COLORS.WARNING}
        />);
      case "Mes paramètres":
        return (<Icon
          name="chart-pie-35"
          family="ArgonExtra"
          size={14}
          color={focused ? "white" : "rgba(0,0,0,0.5)"}
        />);
      case "A propos":
        return (<Icon
          name="spaceship"
          family="ArgonExtra"
          size={14}
          color={focused ? "white" : "rgba(0,0,0,0.5)"}
        />);
        case "Notifications":
        return (<Icon
          name="bell"
          family="ArgonExtra"
          size={14}
          color={focused ? "white" : argonTheme.COLORS.WARNING}
        />);
      case "Connexion":
        return (<Icon 
        name="padlock-unlocked"
          family="ArgonExtra"
          size={14}
          color={focused ? "white" : argonTheme.COLORS.WARNING}
        
        />);
      default:
        return null;
    }
  };

  render() {
    const { focused, title, navigation, state} = this.props;
    //const{routes}=state
    //console.log(user_type);
    const containerStyles = [
      styles.defaultStyle,
      focused ? [styles.activeStyle, styles.shadow] : null
    ];

    return (
      <TouchableOpacity
        style={{ height: 60 }}
        onPress={() => navigation.navigate(title) /*{
          title=="Deconnexion" || title=="Connexion"?
          (navigation.navigate(title),
          AsyncStorage.removeItem('notifications'))
          :
          navigation.navigate(title)
        }*/}
      >
        <Block flex row style={containerStyles}>
          <Block middle flex={0.1} style={{ marginRight: 5 }}>
            {this.renderIcon()}
          </Block>
          <Block row center flex={0.9}>
            <Text
              size={15}
              bold={focused ? true : false}
              color={focused ? "white" : "rgba(0,0,0,0.5)"}
            >
              {title == "Connexion" ? "Deconnexion" : title}
            </Text>
          </Block>
        </Block>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  defaultStyle: {
    paddingVertical: 16,
    paddingHorizontal: 16
  },
  activeStyle: {
    backgroundColor: argonTheme.COLORS.ACTIVE,
    borderRadius: 4
  },
  shadow: {
    shadowColor: theme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowRadius: 8,
    shadowOpacity: 0.1
  }
});

export default DrawerItem;
