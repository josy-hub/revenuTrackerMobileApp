import React from "react";
import {
  StyleSheet,
  ImageBackground,
  Dimensions,
  StatusBar,
  KeyboardAvoidingView,
  Image,
  Alert
} from "react-native";
import { Block, Checkbox, Text, theme } from "galio-framework";

import { Button, Icon, Input } from "../components";
import { Images, argonTheme } from "../constants";

const { width, height } = Dimensions.get("screen");

class Reset_passord extends React.Component {
  constructor(props){
    super(props);
    this.state={
      email:'none'
    };
  }
  envoyer(){
    if(this.state.email!="none" ){
      var myHeaders = new Headers();
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Content-Type", "application/json");
      var raw = JSON.stringify({email:this.state.email});
      var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
          redirect: 'follow'
      };
      const URL="http://tracking.socecepme.com/api/password/email";
      
          fetch(URL, requestOptions)
          .then(response => response.text())
          .then(result => {
              console.log('Success:', result);
              Alert.alert("un Email vous a ete envoye, consultez votre boite SVP")
              this.props.navigation.navigate("Connexion")
          })
          .catch((error) => {
              console.error('Error:', error);
              alert("erreur sur le serveur: impossible de continuer la reintialisation du mot de passe");
          });
    }
    else{
        alert("Entrer votre adresse Email SVP");
    }
  }
  render() {
    const {navigation}=this.props;
    console.log(this.state.email);
    return (
      <Block flex>
        <StatusBar hidden />
        <ImageBackground
          source={Images.RegisterBackground}
          style={{width, height}}
        >
          <Block>
            <Image
              style={styles.tinyLogo}
              source={Images.Applilogo}
              />
          </Block> 
            <Block style={styles.registerContainer}>
              <Block flex center>
                <KeyboardAvoidingView
                  style={{ flex: 1 }}
                  behavior="padding"
                  enabled
                >
                  <Block width={width * 0.8} style={{ marginBottom: 60,marginTop:80}}>
                    <Input
                      borderless
                      placeholder="Email"
                      placeholderTextColor="black"
                      iconContent={
                        <Icon
                          size={16}
                          color={argonTheme.COLORS.ICON}
                          name="ic_mail_24px"
                          family="ArgonExtra"
                          style={styles.inputIcons}
                        />
                      }
                      onChangeText={(input) =>{this.setState({email:input})}}
                    />
                  </Block>
                  <Block middle>
                    <Button 
                      color="success" 
                      style={styles.createButton}
                      onPress={() =>this.envoyer()}
                      >
                      <Text bold size={14} color={argonTheme.COLORS.WHITE}>
                        ENVOYER
                      </Text>
                    </Button>
                  </Block>
                </KeyboardAvoidingView>
              </Block>
          </Block>
        </ImageBackground>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  registerContainer: {
    width: width * 0.9,
    height: height * 0.5,
    backgroundColor: "#616A6B",
    borderRadius: 4,
    shadowColor: argonTheme.COLORS.BLACK,
    opacity:0.6,
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 1,
    overflow: "hidden",
    marginHorizontal:theme.SIZES.BASE
  },
  socialConnect: {
    backgroundColor: argonTheme.COLORS.WHITE,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#8898AA"
  },
  socialButtons: {
    width: 120,
    height: 40,
    backgroundColor: "#fff",
    shadowColor: argonTheme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 1
  },
  socialTextButtons: {
    color: argonTheme.COLORS.PRIMARY,
    fontWeight: "800",
    fontSize: 14
  },
  inputIcons: {
    marginRight: 12
  },
  passwordCheck: {
    paddingLeft: 15,
    paddingTop: 13,
    paddingBottom: 30
  },
  createButton: {
    borderColor:theme.COLORS.WARNING,
    width: width * 0.5,
    marginTop: 25
  },
  tinyLogo: {
    width: width * 0.3,
    height: height*0.15,
    position:'relative',
    marginHorizontal:width * 0.35,
    marginTop:60,
    marginBottom:25
  },
});

export default Reset_passord;
