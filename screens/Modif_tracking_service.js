import React from "react";
import {StyleSheet,Dimensions, ScrollView} from "react-native";
import { Block , Text,theme} from "galio-framework";


import { Button, Select, Icon, Input, Header, Switch } from "../components";
import { argonTheme } from "../constants";
import Home from "./Home";


const { width, height } = Dimensions.get("screen");

class Modif_tracking_service extends React.Component{

    render(){
        const { navigation } = this.props;
        return(
      <Block style={styles.Renseigner_container}>
          <Block style={styles.main_container}>
                <ScrollView>
                    <Block card style={styles.service_card}> 
                    
                            <Text  h5
                                    color={argonTheme.COLORS.DEFAULT}
                            >
                                Service/produit XXX du XX/XX/XX
                            </Text>
                        </Block>
                    <Block style={styles.renseigner_card}>
                            <Block card top style={styles.card}> 
                                <Text h5 color="white">
                                    Prix  ref
                                </Text>
                            </Block>
                            <Block card style={[styles.card, {marginHorizontal:180, marginTop:-70}]}> 
                                <Text h5 color="white">
                                    Prix tot ref
                                </Text>
                            </Block>
                            <Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
                                    <Input
                                        right
                                        placeholder="entrer le prix unitaire"
                                        style={{
                                        borderColor: theme.COLORS.SUCCESS,
                                        borderRadius: 4,
                                        backgroundColor: "#fff"
                                        }}
                                        help="Prix unitaire"
                                        TopHelp
                                        placeholderTextColor="black"
                                        iconContent={<Block />}
                                    />
                            </Block>
                            <Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
                                <Input
                                    right
                                    placeholder="entrer la quantite"
                                    style={{
                                    borderColor: theme.COLORS.SUCCESS,
                                    borderRadius: 4,
                                    backgroundColor: "#fff"
                                    }}
                                    help="quantite"
                                    TopHelp
                                    placeholderTextColor="black"
                                    iconContent={<Block />}
                                />
                            </Block>
                            <Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
                                <Input type="numeric"
                                    right
                                    placeholder="upload"
                                    style={{
                                    borderColor: theme.COLORS.SUCCESS,
                                    borderRadius: 4,
                                    backgroundColor: "#fff"
                                    }}
                                    help="preuve"
                                    TopHelp
                                    placeholderTextColor="black"
                                    iconContent={<Block />}
                                />
                            </Block>
                            <Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
                                <Input
                                    right
                                    placeholder="la raison de la modification (max 2 lignes)"
                                    maxlength="100"
                                    style={{
                                    borderColor: theme.COLORS.SUCCESS,
                                    borderRadius: 4,
                                    backgroundColor: "#fff"
                                    }}
                                    help="La raison de la modification"
                                    TopHelp
                                    placeholderTextColor="black"
                                    iconContent={<Block />}
                                />
                            </Block>
                            <Block card  bottom style={styles.card}> 
                                <Text h5 color="white">
                                var tot
                                </Text>
                            </Block>
                            <Block card  style={[styles.card,{marginHorizontal:-10, marginTop:-70}]}> 
                                <Text h5 color="white">
                                    Prix tot
                                </Text>
                            </Block>
                    </Block>
                    <Block flex={1.25} right>
                        <Button center color="default" 
                            style={styles.optionsButton} 
                            onPress={() => navigation.navigate("Calendrier")}>
                            ENVOYER
                        </Button>
                    </Block>
                </ScrollView>
          </Block>
          <Block style={styles.footer}>

          </Block>
      </Block>
        );
    }
}

const styles= StyleSheet.create({

    Renseigner_container:{
        flex:1,
        flexDirection:"row"
    },
    service_card:{
        width: 350, 
        height:50,
        backgroundColor:argonTheme.COLORS.SWITCH_OFF,
        marginHorizontal:30,
        marginTop:75,
        marginBottom:-5,
        alignItems:"center",
        justifyContent:"center",
        
    },
    main_container:{
        width: width, 
        height: height - 70

    },
    renseigner_card:{

        padding: theme.SIZES.BASE,
        marginHorizontal: theme.SIZES.BASE*1.1,
        marginTop: 20,
        borderTopLeftRadius: 6,
        borderTopRightRadius: 6,
        backgroundColor: theme.COLORS.WHITE,
        shadowColor: "black",
        shadowOffset: { width: 2, height: 4 },
        shadowRadius: 8,
        shadowOpacity: 100,
    // zIndex: 1

    },
    card:{
        backgroundColor:"green",
         width:150, 
         height:70, 
         paddingHorizontal: theme.SIZES.BASE,
         paddingVertical: 10,
         //zindex:1
    },
    optionsButton: {
        width: 99,
        height: 40,
        paddingHorizontal: theme.SIZES.BASE,
        paddingVertical: 10,
        marginRight:20,
        marginTop:10,
        backgroundColor:"orange"
      },
    footer:{
        width: width,
        height: 70, 
        backgroundColor:"green"

    }



})
export default Modif_tracking_service;