import React from "react";
import { useSafeArea } from "react-native-safe-area-context";
import {
  ScrollView,
  StyleSheet,
  Image
} from "react-native";
import { Block, Text, theme, Button } from "galio-framework";
import { DrawerItem as DrawerCustomItem } from '../components';
import { Images} from "../constants";

function CustomDrawerContent({ drawerPosition, navigation, profile, focused, state,...rest }) {
  const insets = useSafeArea();
  const screens = [
    "Home",
    "Notifications",
    "Commissions",
    "ResetPassword",
    "Mes paramètres",
    "A propos",
    "Connexion",        
  ];
  
  return (
    <Block
      style={styles.container}
      forceInset={{ top: 'always', horizontal: 'never' }}
    >
      <Block flex={0.06} style={styles.header}>
      <Image
        style={styles.tinyLogo}
        source={Images.Applilogo}
      />
        {/* <Text color="green" style={{paddingLeft:80}}>LOGO</Text> */}
      </Block>
      <Block flex style={{ paddingLeft: 8, paddingRight: 14 }}>
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          {screens.map((item, index) => {
            return (
              item !== "A propos" && item !== "ResetPassword" && 
                <DrawerCustomItem
                  title={item === "Deconnexion" ? "Connexion" : item}
                  key={index}
                  navigation={navigation}
                  state={state}
                  focused={state.index === index ? true : false}
                />
            );
          })}
            
            <Block flex style={{ marginTop: 24, marginVertical: 8, paddingHorizontal: 8 }}>
              <Block style={{ borderColor: "rgba(0,0,0,0.2)", width: '100%', borderWidth: StyleSheet.hairlineWidth }}/>
              <Text color="#8898AA" style={{ marginTop: 16, marginLeft: 8 }}>DOCUMENTATION</Text>
            </Block>
            <DrawerCustomItem title="A propos" navigation={navigation} />
        </ScrollView>
      </Block>
    </Block>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 28,
    paddingBottom: theme.SIZES.BASE,
    paddingTop: theme.SIZES.BASE * 3,
    justifyContent: 'center',
  },
  tinyLogo: {
    width: 66,
    height: 58
  },
});

export default CustomDrawerContent;
