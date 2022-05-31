import React from "react";
import {
  StyleSheet,
  ImageBackground,
  Image,
  Dimensions,
  StatusBar,
  KeyboardAvoidingView,
  TouchableOpacity,
  ScrollView
} from "react-native";
import { Block, Text} from "galio-framework";

import { Button, Icon, Input } from "../components";
import { Images, argonTheme } from "../constants";


const { width, height } = Dimensions.get("screen");


class Register extends React.Component {
  
    constructor(props){
      super(props)
      this.state={
        username:'',
        password:'',
        params:[]
      }
    }
    
    updateValue(input, field){
      if(field=='username'){
        this.setState({
          username:input,
        })
      }
      else if(field=='password'){
        this.setState({
          password:input,
        })
      }
    }

    connexion(props){
      console.log("testttt");
      let collection={
        username:this.state.username,
        password:this.state.password
      }
      //const {navigate}=this.props.navigation;
      var myHeaders = new Headers();
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Content-Type", "application/json");

      var raw = JSON.stringify(collection);
      //console.log(raw);

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };
    //const racine = 'http://172.22.32.1/Tracking/public/api/';
    const racine = 'https://tracking.socecepme.com/api/';
    fetch(racine + 'login', requestOptions)
      .then(response => response.text())
      .then(result => { 
        var rslt = JSON.parse(result);
        console.log(rslt);
        console.log(rslt['user'].contact);
        if(rslt["status"]==="ok"){
           this.props.navigation.navigate('Home',{
            screen:'Home',//donne sans et avec ca
            params:{"id":rslt['user'].id,"contact":rslt['user'].contact, "type":rslt['user'].type, "entreprise_id":rslt['user'].entreprise_id,"raison_social":rslt['entreprise'].raison_social, "nom":rslt['user'].nom, "poste":rslt['user'].poste, "photo":rslt['user'].photo, "email":rslt['user'].email, "pass":rslt['user'].password, "equipe_id":rslt['user'].equipe_id, "username":rslt['user'].username},
          }); 
        }
        else{
          alert("vos identifiants sont invalides");
        }
      })
      .catch(error => alert("erreur sur le serveur: votre page n'a pas pu etre chargee correctement"));
  }
  render() {
  
    return (
      <Block style={styles.Main_container}>
        <Block flex middle>
          <StatusBar hidden />
          <ImageBackground
            source={Images.RegisterBackground}
            style={{ width, height }}
          >
            <ScrollView>
              <Image
                style={styles.tinyLogo}
                source={Images.Applilogo}
              />
              <Block flex middle>
                <Block style={[styles.registerContainer]}>
                  <KeyboardAvoidingView
                      style={{ flex: 1 }}
                        behavior="padding"
                        enabled
                        >
                    <Block center width={width * 0.8} style={{ marginBottom: 20,marginTop:40,opacity:100}}>
                      <Input
                        onChangeText={(input) =>this.updateValue(input,'username')}
                        borderless
                        placeholder="Nom d'utilisateur"
                        placeholderTextColor="black"
                        autoCompleteType="username"
                        iconContent={
                          <Icon
                            size={16}
                            color={argonTheme.COLORS.ICON}
                            name="hat-3"
                            family="ArgonExtra"
                            style={styles.inputIcons}
                          />
                        }
                      />
                    </Block>
                      <Block center width={width * 0.8}>
                        <Input
                          onChangeText={(input) =>this.updateValue(input,'password')}
                          password
                          viewPass
                          borderless
                          placeholder="Mot de passe"
                          placeholderTextColor="black"
                          autoCompleteType="password"
                          iconContent={
                            <Icon
                              size={16}
                              color={argonTheme.COLORS.ICON}
                              name="padlock-unlocked"
                              family="ArgonExtra"
                              style={styles.inputIcons}
                            />
                          }
                        />
                        <TouchableOpacity onPress={() => this.props.navigation.navigate("ResetPassword")}>
                          <Block row style={styles.passwordCheck}>
                            <Text bold size={15} color="black">
                              mot de passe oublié
                            </Text>
                          </Block>
                        </TouchableOpacity>
                      </Block>
                      <Block middle>
                        <Button 
                          color="success" 
                          style={styles.createButton}
                          onPress={() => this.connexion()}
                        >
                          <Text bold size={14} color={argonTheme.COLORS.WHITE}>
                            CONNEXION
                          </Text>
                        </Button>
                      </Block>
                  </KeyboardAvoidingView>
                </Block>
              </Block>
            </ScrollView>
          </ImageBackground>
        </Block>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  Main_container:{
    flex:1,
    flexDirection:"row"
  },
  registerContainer: {
    width: width * 0.9,
    height:height * 0.6, //height * 0.6,
    marginBottom:10,
    backgroundColor: '#616A6B',
    borderRadius: 4,
    opacity:0.8,
    shadowColor: argonTheme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 1,
    overflow: "hidden"
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
    width: width * 0.5,
    marginTop: 10,
    marginBottom:5
  },
  tinyLogo: {
    width: width * 0.3,
    height: height*0.15,
    position:'relative',
    marginHorizontal:width * 0.35,
    marginTop:35,
    marginBottom:20
  },
});

export default Register;
