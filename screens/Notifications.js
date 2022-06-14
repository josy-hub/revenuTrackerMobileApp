import React from "react";
import {StyleSheet, ScrollView, Dimensions, TouchableOpacity} from "react-native";
import { Block, Text,theme} from "galio-framework";
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from "moment";
import consulter from '../services/Fetch';
import { Images, argonTheme } from "../constants";
import { Button} from "../components";


const { width, height } = Dimensions.get("screen");
let now = moment(new Date()).format("YYYY-MM-DD");
//let mindate=now-549094194;
let mindate=now-1868494194;
//let mindatef=new Date(mindate);
let d = new Date(mindate);
let convertedDate=moment(d).format("YYYY-MM-DD")
let count=0;

class Notifications extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
          type:'',
          contact:'',
          count:'',
          etat:'',
          user_id:'',
          entreprise:'',
          notifications:'',
          ventes:[]
        
        }
    }

    async componentDidMount() {

        try{
            const notifications = await AsyncStorage.getItem('notifications');
            const value=JSON.parse(notifications);
            console.log('valueeeee',value)
            if(value !==null){
             this.setState({
               type:value.type,
               contact:value.contact,
               user_id:value.user_id,
               entreprise:value.entreprise,
               notifications:"notifications"
             });
            }
        } catch(e){
             //Alert.alert("Erreur: les donnees sauvegardees n'ont pas pu etre recuperees");
        }

        const ventes = await consulter.notifications(this.state.type, this.state.contact, this.state.entreprise );
        if(ventes['status']=='ok'){
            console.log('vvvventes',ventes);
            this.setState({ventes:ventes['ventes']});
        }
        else{
            alert('pas de notifications pour vous');
        }
        /*const ventes = await consulter.fetchindexventes();
        if(this.state.type==8){
            for(let i=0; i<ventes['ventes'].length; i++){

                if(ventes['ventes'][i].contact_user==this.state.contact && ventes['ventes'][i].etat=="a modifier"){
                    count++; 
                }
            } 
            this.setState({count:count, etat:"a modifier"});
        }
        else if(this.state.type>1 && this.state.type<8){
            for(let i=0; i<ventes['ventes'].length; i++){
                if(ventes['ventes'][i].etat=="en attente"){
                    count++; 
                }
            } 
            this.setState({count:count, etat:"en attente"});

        }*/
    }
    formatMillier( nombre){
        nombre += '';
        var sep = ' ';
        var reg = /(\d+)(\d{3})/;
        while( reg.test( nombre)) {
          nombre = nombre.replace( reg, '$1' +sep +'$2');
        }
        return nombre;
    }
        
    render(){
        /*const{route}=this.props;
        const params  = route.params;*/
        console.log(this.state.user_id);
        const{ventes}=this.state
        return(
            <Block style={styles.global_container}>
                <ScrollView>
                    <Block card style={styles.service_card}> 
                        <Text  h5
                            /* color={argonTheme.COLORS.DEFAULT} */
                        >
                            Vous avez au total: {ventes.length} notifications
                        </Text>
                    </Block>
                    {
                    ventes.length>0 ?
                    ( 
                        this.state.type==8?
                        ventes.map((item, index)=>
                        <Block card style={[styles.card,{marginTop:40}]} key={index}>
                            <Text style={{fontSize:18, alignItems:"center",justifyContent:'center', fontWeight:"bold"}} color={theme.COLORS.ICON}>
                                Vente {item.nom}{'\n'}       
                            </Text>
                            <Text>
                                quantite: {item.quantite};{'\n'}
                                unite: {item.unite};{'\n'}
                                prix de reference: {item.prix_de_reference};{'\n'}
                                prix de vente: {this.formatMillier(item.prix_de_vente)} FCFA;{'\n'}
                                prix total de vente: {this.formatMillier(item.quantite*item.prix_de_vente)} FCFA;{'\n'}
                                entreprise: {item.raison_social};{'\n'}
                                date: {item.date_vente};{'\n'} 
                            </Text>
                            <Block style={{flexDirection:"row", justifyContent:"space-between", marginTop:10}}>
                                <Button right 
                                    style={styles.optionsButton} 
                                    onPress={() => this.props.navigation.navigate("RenseignerService",
                                        {
                                            params:{
                                                "choixentreprise":item.raison_social,
                                                "choixproduit":item.nom,
                                                "choixref":item.reference, 
                                                "type":"modif",
                                                "modif":"ref",
                                                "reprise":"oui",
                                                "date":item.date_vente,
                                                "type_user":this.state.type,
                                                "raison_responsable":item.raison_responsable,
                                                "prix_de_reference":item.prix_de_reference,
                                                "remise":item.remise,
                                                "type_vente":item.type_de_vente,
                                                "groupe_vente_id":item.groupe_de_vente_id

                                            }
                                        }
                                    )}>
                                    modifier
                                </Button>
                            </Block>
                        </Block>)
                        :
                        ventes.map((item, index)=>
                        <Block card style={[styles.card,{marginTop:40}]} key={index}>
                            <Text style={{fontSize:18, alignItems:"center",justifyContent:'center', fontWeight:"bold"}} color={theme.COLORS.ICON}>
                                Vente {item.nom}{'\n'}       
                            </Text>
                            <Text>
                                quantite: {item.quantite};{'\n'}
                                unite: {item.unite};{'\n'}
                                prix de reference: {item.prix_de_reference};{'\n'}
                                prix de vente: {this.formatMillier(item.prix_de_vente)} FCFA;{'\n'}
                                prix total de vente: {this.formatMillier(item.quantite*item.prix_de_vente)} FCFA;{'\n'}
                                entreprise: {item.raison_social};{'\n'}
                                date: {item.date_vente};{'\n'}
                                commercial: {item.nom_user}. 
                            </Text>
                            <Block style={{flexDirection:"row", justifyContent:"space-between", marginTop:10}}>
                                <Button right 
                                    style={styles.optionsButton} 
                                    onPress={() => this.props.navigation.navigate("ValidationTracking",
                                        {
                                            params:{
                                                "prix_unitaire":item.prix_de_vente, 
                                                "quantite":item.quantite, 
                                                "preuve":item.preuve, 
                                                "prix_de_reference":item.prix_de_reference, 
                                                "produit":item.nom, "date":item.date_vente, 
                                                "commentaire_commercial":item.commentaire_commercial, 
                                                "user_id":item.user_id, 
                                                "produit_service_id":item.produit_service_id, 
                                                "reference":item.reference,
                                                "validation":this.state.type>2?"renseigner":"modifier",
                                                "remise":item.remise,
                                                "type_vente":item.type_de_vente,
                                                "groupe_vente_id":item.groupe_de_vente_id
                                            }
                                        }
                                    )}>
                                    Valider
                                </Button>
                            </Block>
                        </Block>)
                    )
                    :
                    <Block card style={[styles.card,{marginTop:40}]}>
                        <Text>
                            Vous n'avez pas de notifications
                        </Text>
                    </Block>
                    }
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
        marginHorizontal: theme.SIZES.BASE*1.1/3,
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
    footer:{
        width: width,
        height: 70, 
        backgroundColor:"green",
        marginTop:10,
    },
    optionsButton: {
        width: 100,
        height: 34,
        paddingHorizontal: theme.SIZES.BASE/8,
        paddingVertical: 5,
        backgroundColor:"orange",
        marginTop:5,
        marginBottom:10,
        marginRight:theme.SIZES.BASE*1.1,
    },
    service_card:{
        width: "auto", 
        height:"auto",
        backgroundColor:argonTheme.COLORS.SWITCH_OFF,
        marginHorizontal:5,
        paddingHorizontal: "auto",
        marginTop:20,
        //marginBottom:20,
        alignItems:"center",
        justifyContent:"center",
        //position:"relative"
        
    },

})
export default Notifications;