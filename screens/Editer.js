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
import { Block, Text, theme} from "galio-framework";

import {argonTheme } from "../constants";
import { HeaderHeight } from "../constants/utils";
import { CardHome } from "../components/CardHome";


const { width, height } = Dimensions.get("screen");

const thumbMeasure = (width - 48 - 32) / 3;
const placeholder = {
    label: 'groupe',
    value: null,
    color: '#9EA0A4',
  };
  const placeholder1 = {
    label: 'entreprise',
    value: null,
    color: '#9EA0A4',
  };
  const placeholder2 = {
    label: 'produit',
    value: null,
    color: '#9EA0A4',
  };

class Editer extends React.Component {
  constructor(props) {
    super(props);
    const { route } = this.props;
    const {type}=route.params;
    this.state = {
      
    };
    /* const { route } = this.props;
        this.params=route.params; */
  }
  async componentDidMount(){
    
  }
  
  
  
  
  render() {
    const { navigation, route } = this.props;
    const {params}  = route.params;
    return (
        <Block flex >
            <ScrollView>
                <Block 
                    style={{ 
                        marginHorizontal:20,
                        marginTop:50, 
                        marginBottom:10     
                    }}><Text  h5 color={argonTheme.COLORS.DEFAULT}>Que voulez vous-faire?</Text>
                </Block>
                <Block flex style={styles.profileCard}>
                    <Block column space="between">
                        <TouchableOpacity
                            onPress={() =>
                                this.props.navigation.navigate(
                                    "EditerProduit",{
                                        
                                        params: {"user_id":params.id,"nom":params.nom, "contact":params.contact,"user_type":params.type,"entreprise_id":params.entreprise_id}
                                    
                                    })
                            }
                        >
                            <CardHome
                            title="renseigner les donnees"
                            iconFamily="Galio"
                            icon="list-bullet"
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() =>
                                this.props.navigation.navigate(
                                "ModifParReference",{
                                    screen:'ModifParReference',
                                    params: {"user_id":params.id,"nom":params.nom, "contact":params.contact,"user_type":params.type,"entreprise_id":params.entreprise_id}
                                })
                            }
                        >
                            <CardHome
                                title="modifier les revenus"
                                iconFamily="Galio"
                                icon="list-bullet"
                            />
                        </TouchableOpacity>
                    </Block>
                </Block>
            </ScrollView>
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
    main_container: {
        width: width,
        height: height - 70,
    },
    footer: {
        width: width,
        height: 70,
        backgroundColor: "#2ECC71",
      },
});
export default Editer;