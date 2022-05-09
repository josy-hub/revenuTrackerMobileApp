import React from "react";
import {
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  ImageBackground,
  Platform,
  TouchableOpacity,
} from "react-native";
import { Block, Text, theme, Icon } from "galio-framework";
import AsyncStorage from '@react-native-async-storage/async-storage';


import { Images, argonTheme } from "../constants";
import { HeaderHeight } from "../constants/utils";
import { CardHome } from "../components/CardHome";

const { width, height } = Dimensions.get("screen");

const thumbMeasure = (width - 48 - 32) / 3;

class Home extends React.Component {
  constructor(props) {
    super(props);
    const { route } = this.props;
    const {type}=route.params;
    this.state = {
      type:type,
      entreprise_id:"",
      ventes:[],

    };
    
  }
   
  async componentDidMount(){
    
    await AsyncStorage.removeItem("notifications");
    const { navigation, route } = this.props;
    const params  = route.params;
    
    let notifications={
      type:params.type,
      contact:params.contact,
      user_id:params.id,
      email:params.email,
      pass:params.pass,
      nom:params.nom,
      username:params.username,
      poste:params.poste,
      photo:params.photo,
      equipe_id:params.equipe_id,
      entreprise:params.raison_social    
    }
    console.log('notifs',notifications);
    try{
        await AsyncStorage.setItem('notifications', JSON.stringify(notifications))
    } catch(e){
        console.log(e);
    }
  }
  
  render() {
    const { navigation, route } = this.props;
    const params  = route.params;
    return (
      <Block flex style={styles.home}>
        <Block flex style={styles.main_container}>
          <ImageBackground
            source={Images.Home1Background}
            style={styles.homeContainer}
            imageStyle={styles.home1Background}
          >
            <Block card style={styles.name_container}>
              <Text bold size={18} color="#FFF" style={{ textAlign: "center" }}>
                User {params.nom}, {params.poste} de {params.raison_social}
              </Text>
            </Block>
            <ScrollView style={{ width, height }} keyboardShouldPersistTaps="always">
              <Block flex style={styles.profileCard}>
                <Block style={{ paddingBottom: -HeaderHeight * 2 }}> 
                  <Block column space="between" >
                    { params.type==8?
                      <Block>
                        <TouchableOpacity
                          onPress={() =>
                            this.props.navigation.navigate(
                              "ChoixServiceRenseigner",{
                                params: {"user_id":params.id, "nom":params.nom, "contact":params.contact, "user_type":params.type,"entreprise_id":params.entreprise_id}
                              } 
                            )
                          }
                        >
                          <CardHome
                            title="renseigner les revenus"
                            iconFamily="Galio"
                            icon="list-bullet"
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                        onPress={() =>
                          this.props.navigation.navigate(
                            "ChoixServiceConsulter",{
                              screen:'ChoixServiceConsulter',
                              params: {"user_id":params.id,"nom":params.nom, "contact":params.contact,"user_type":params.type,"entreprise_id":params.entreprise_id, "rapport":"oui"}
                            })
                        }
                      >
                        <CardHome
                          title="Rapports"
                          iconFamily="Galio"
                          icon="list-bullet"
                        />
                      </TouchableOpacity>
                      </Block> 
                    : params.type==2?
                      <TouchableOpacity
                        onPress={() =>
                          this.props.navigation.navigate(
                            "ChoixServiceConsulter",{
                              screen:'ChoixServiceConsulter',
                              params: {"user_id":params.id,"nom":params.nom, "contact":params.contact,"user_type":params.type,"entreprise_id":params.entreprise_id, "rapport":"oui"}
                            })
                        }
                      >
                        <CardHome
                          title="Rapports"
                          iconFamily="Galio"
                          icon="list-bullet"
                        />
                      </TouchableOpacity>
                    :
                      <Block>  
                        <TouchableOpacity
                          onPress={() =>
                            this.props.navigation.navigate(
                              "Editer",{
                                screen:'Editer',
                                params: {"user_id":params.id,"nom":params.nom, "contact":params.contact,"user_type":params.type,"entreprise_id":params.entreprise_id}
                              })
                          }
                        >
                          <CardHome
                            title="Editer"
                            iconFamily="Galio"
                            icon="list-bullet"
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() =>
                            this.props.navigation.navigate(
                              "ChoixServiceConsulter",{
                                screen:'ChoixServiceConsulter',
                                params: {"user_id":params.id,"nom":params.nom, "contact":params.contact,"user_type":params.type,"entreprise_id":params.entreprise_id, "rapport":"oui"}
                              })
                          }
                        >
                        <CardHome
                          title="Rapports"
                          iconFamily="Galio"
                          icon="list-bullet"
                        />
                      </TouchableOpacity>
                    </Block>
                    }                    
                  </Block>
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate(
                        "ChoixServiceConsulter",
                        {
                          
                            params: {"user_id":params.id, "nom":params.nom, "contact":params.contact, "user_type":params.type,"entreprise_id":params.entreprise_id, "rapport":"non"}
                          
                        }
                      )
                    }
                  >
                    <CardHome
                      title="consulter les revenus"
                      iconFamily="Galio"
                      icon="list-bullet"
                    />
                  </TouchableOpacity>
                </Block>
              </Block>
            </ScrollView>
          </ImageBackground>
        </Block>
        <Block style={styles.footer}></Block>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  home: {
    marginTop: Platform.OS === "android" ? -HeaderHeight : 0,
    // marginBottom: -HeaderHeight * 2,
    flex: 1,
  },
  main_container: {
    width: width,
    height: height - 70,
  },
  homeContainer: {
    flex:1
  },
  home1Background: {
    width: width,
    height: height / 2.45,
  },
  profileCard: {
    padding: theme.SIZES.BASE/2 ,
    marginHorizontal: theme.SIZES.BASE * 1.1,
    marginTop: 10,
    height:"auto",
    marginBottom:10,
    borderRadius: 6,
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: "black",
    shadowOffset: { width: 2, height: 4 },
    shadowRadius: 8,
    shadowOpacity: 100,
    justifyContent:"flex-end"
  },
  avatarContainer: {
    position: "relative",
    marginTop: 83,
  },
  avatar: {
    width: 124,
    height: 124,
    borderRadius: 62,
    borderWidth: 0,
  },
  name_container: {
    opacity: 0.5,
    //position: "relative",
    marginBottom: 10,
    backgroundColor: "#0F0303",
    padding: 4,
    height:75,
    marginTop:(height/2.45)-75,
    width: width,
    alignItems:"center",
    alignSelf: 'center'
  },
  footer: {
    width: width,
    height: 70,
    backgroundColor: "#2ECC71",
  },
});

export default Home;
