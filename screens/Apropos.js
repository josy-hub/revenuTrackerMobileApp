import React from "react";
import {
    StyleSheet,
    Dimensions, 
    ScrollView,
    Alert,
    
} from "react-native";
import { Block , Text,theme} from "galio-framework";

import { Button,  Input } from "../components";
import { argonTheme } from "../constants";

const { width, height } = Dimensions.get("screen");


class Apropos extends React.Component{

    constructor(props){
        super(props);
        
    }

    
    render(){
        
        return(
            <Block style={styles.globale_container}>
                <ScrollView>
                    <Block >
                        <Block style={styles.single_card}>
                            <Block 
                                style={{ 
                                    justifyContent: "center",
                                    alignItems: "center",
                                    marginTop:10,
                                    marginBottom:20,
                                    width:"auto",
                                    fontWeight: 'bold',       
                                }}>
                                <Text  h4 
                                    color={"#2ECC71"}>
                                    Renseigner les revenus
                                </Text>
                                
                            </Block>

                            <Text style={{fontWeight: 'bold', fontSize:20, textDecorationLine: 'underline'}}>   
                                Note:
                            </Text>                
                            <Text style={{fontStyle: 'italic'}}>   
                                Cette rubrique ne concerne que les commerciaux.{"\n"}
                            </Text> 
                            <Text 
                                adjustsFontSizeToFit
                                style={{fontSize:18}}>
                                    
                                {"\t"}{"\t"}En fonction du service vendu par le commercial, il a obligation de renseigner les informations de ladite vente.
                                Une fois a l'accueil, la premiere etape du processus "Renseigner les revenus" consiste a cliquer sur le bouton renseigner les revenus. 
                                Par la suite, il suffit de renseigner les champs avec les informations appropriees(groupe, entreprise...). Il existe deux possibilites: 
                                soit sauvegarder la vente qui est en cours d'enregistrement et revenir plus tard continuer en cliquant sur terminer; soit alors poursuivre
                                son enregistrement des donnees en cliquant sur suivant.{"\n"}{"\n"}{"\t"}{"\t"} La page suivante permet d'apporter les details de la vente avec le prix, la quantite, 
                                la preuve de la vente... {"\n"}{"\n"}{"\t"}{"\t"} De meme que la page precedente, on peut soit sauvegarder et terminer plus tard ou passer a la page suivante. La derniere page du processus renseigner les revenus est
                                la page en rapport avec les informations du client.{"\n"}{"\n"}{"\t"}{"\t"} Le client ici represente celui a qui  le produit ou le service a ete vendu. Si ces informations ne sont pas renseignees car facultatives, 
                                le nom pas defaut du client sera "client lamda", son adresse email "client@client.com", son contact "000000000".
                                Une fois le processus acheve, un email est envoye au responsable de vente pour la validation de ladite vente. Et, des que le responsable valide, de meme, un email est envoye au au commercial mentionnant l'etat de la vente.
                            </Text>
                        </Block>
                        <Block style={styles.single_card}>
                            <Block 
                                style={{ 
                                    justifyContent: "center",
                                    alignItems: "center",
                                    marginHorizontal:10,
                                    marginTop:10,
                                    marginBottom:20,
                                    width:"auto",
                                    fontWeight: 'bold',        
                                }}>
                                <Text  h4 
                                    color={"#2ECC71"}>
                                    Modifier les revenus
                                </Text>
                                
                            </Block>

                            <Text style={{fontWeight: 'bold', fontSize:20, textDecorationLine: 'underline'}}>   
                                Note:
                            </Text>               
                            <Text style={{fontStyle: 'italic'}}>    
                                Cette rubrique exclut les commerciaux.{"\n"}
                            </Text>
                            <Text 
                                adjustsFontSizeToFit
                                style={{fontSize:18}}>
                                {"\t"}{"\t"}A partir de la page d'accueil, le responsable souhaitant modifier une vente clique sur modifier les revenus. 
                                Par la suite, il fera le choix entre modifier en fonction de la refenrence de la vente ou alors en fonction du commercial ayant effectue
                                la vente. Des que cela est fait, il lui suffira de renseigner les champs avec les valeurs adequates. Une fois termine, un email est envoye a la hierarchie pour validation. 
                            </Text>
                        </Block>
                        <Block style={styles.single_card}>
                            <Block 
                                style={{ 
                                    justifyContent: "center",
                                    alignItems: "center",
                                    marginHorizontal:10,
                                    marginTop:10,
                                    marginBottom:20,
                                    width:"auto",
                                    fontWeight: 'bold',      
                                }}>
                                <Text  h4 
                                    color={"#2ECC71"}>
                                    consulter les revenus
                                </Text>
                                
                            </Block>
                                            
                            <Text style={{fontWeight: 'bold', fontSize:20, textDecorationLine: 'underline'}}>   
                                Note:
                            </Text>
                            <Text style={{fontStyle: 'italic'}}>
                                Cette rubrique imbrique consulter/valider/modifier(pour les commerciaux).{"\n"}
                            </Text>
                            <Text 
                                adjustsFontSizeToFit
                                style={{fontSize:18}}>
                                {"\t"}{"\t"}Le processus debute a la page d'accueil en cliquant intuitivement sur le bouton consulter les revenus. par la suite, il suffit de renseigner de maniere adequate les champs qui vont suivre.
                                En fonction du choix qui est fait par l'utilisateur, differents tableaux apparaitront. Il est possible en cliquant sur les boutons apparaissant dans la colonne etat de se rendre soit dans 
                                la page permettant de valider les revenus soit dans celle permettant au commercial de modifier. L'export des donnees sur Excel est possible dans cette rubrique. 
                            </Text>
                        </Block>
                        <Block style={styles.single_card}>
                            <Block 
                                style={{ 
                                    justifyContent: "center",
                                    alignItems: "center",
                                    marginHorizontal:10,
                                    marginTop:10,
                                    marginBottom:20,
                                    width:"auto",
                                    fontWeight: 'bold',    
                                }}>
                                <Text  h4 
                                    color={"#2ECC71"}>
                                    Rapport
                                </Text>
                                
                            </Block>
                                            
                            <Text 
                                adjustsFontSizeToFit
                                style={{fontSize:18}}>   
                                {"\t"}{"\t"}Comme son nom l'indique, cette rubrique fournit un rapport des ventes en permettant l'export sur Excel. 
                            </Text>
                        </Block>
                    </Block>
                        
                </ScrollView>

            </Block>

        );
    }
}

const styles = StyleSheet.create({
    globale_container:{
         flex:1,
        // flexDirection:"row"
    },
    optionsButtonr: {
        width: "auto",
        height: 34,
        paddingHorizontal: theme.SIZES.BASE,
        paddingVertical: 10,
        backgroundColor:"orange",
        marginTop:10,
        marginBottom:10,
        marginRight:theme.SIZES.BASE*1.1,
        position:"relative"
        
    },
    single_card:{
        padding: theme.SIZES.BASE*2,
        marginHorizontal: theme.SIZES.BASE*1.1,
        marginTop: 20,
        marginBottom:10,
        borderTopLeftRadius: 6,
        borderTopRightRadius: 6,
        backgroundColor: theme.COLORS.WHITE,
        shadowColor: "black",
        shadowOffset: { width: 2, height: 4 },
        shadowRadius: 8,
        shadowOpacity: 100,
        

    },
    
});
export default Apropos;