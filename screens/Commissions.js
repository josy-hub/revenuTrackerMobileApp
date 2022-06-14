import React from "react";
import {StyleSheet, ScrollView, Dimensions} from "react-native";
import { Block, Text,theme} from "galio-framework";

import {Button, Input} from "../components"

const { width, height } = Dimensions.get("screen");

class Commissions extends React.Component{
    render(){
        const {navigation}=this.props;
        return(
            <Block style={styles.global_container}>
                    <ScrollView>
                        <Block card style={[styles.card,{marginTop:40}]}>
                            <Text>
                                Vous avez une commissions de 10% du prix de vente du produit xxx renseigne le 01/02/2020 soit 1000FCFA. 
                            </Text>
                            <Block flex={1.25} right>
                                <Button center color="default" 
                                    style={styles.optionsButton} 
                                    /* onPress={() => navigation.navigate("Consulter_les_revenus")} */
                                >
                                    details sur la vente
                                </Button>
                            </Block>
                        </Block>
                        <Block card style={styles.card}>
                            <Text>
                            Vous avez une commissions de 1% du prix de vente du produit xxx renseigne le 04/02/2020 soit 10FCFA. 
                            </Text>
                            <Block flex={1.25} right>
                                <Button center color="default" 
                                    style={styles.optionsButton} 
                                     onPress={() => {}}>
                                    details sur la vente
                                </Button>
                            </Block>
                        </Block>
                        <Block card style={styles.card}>
                            <Text>
                            Vous avez une commissions de 5% du prix de vente du produit xxx renseigne le 01/02/2020 soit 50FCFA. 
                            </Text>
                            <Block flex={1.25} right>
                                <Button center color="default" 
                                    style={styles.optionsButton} 
                                    onPress={() => {}}>
                                    details sur la vente
                                </Button>
                            </Block>
                        </Block>
                    </ScrollView>
            </Block>
        );
    }
}
styles=StyleSheet.create({
    global_container:{
        flex:1,
        flexDirection:"row"

    },
    main_container:{
        width: width, 
        height: height - 70
    },
    card:{
        padding: theme.SIZES.BASE*2,
        //marginHorizontal: theme.SIZES.BASE*1.1,
        //marginTop: 40,
        borderTopLeftRadius: 6,
        borderTopRightRadius: 6,
        backgroundColor: "#8BDF83",
        shadowColor: "black",
        shadowOffset: { width: 2, height: 4 },
        shadowRadius: 8,
        opacity:0.8
        //shadowOpacity: 100,
    },
    optionsButton: {
        width: "auto",
        height: 34,
        paddingHorizontal: theme.SIZES.BASE,
        paddingVertical: 10,
        backgroundColor:"orange",
        marginTop:40
      },
    footer:{
        width: width,
        height: 50, 
        backgroundColor:"green",
        marginTop:10,
        //opacity:100

    }

})
export default Commissions;