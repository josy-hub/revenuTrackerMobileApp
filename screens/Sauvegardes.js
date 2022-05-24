import react from "react";
import React from "react";
import {StyleSheet, ScrollView, Dimensions, Alert} from "react-native";
import { Block, Text,theme} from "galio-framework";
import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from "moment";

import {Button, Input} from "../components"
import requete from '../services/Fetch'
const { width, height } = Dimensions.get("screen");
const racine = 'https://tracking.socecepme.com/api/';
class Sauvegardes extends React.Component{
    constructor(props){
        super(props);
        this.state={
            myArray:[],
            annuler:false,
            key:'',
        };
    }
   async componentDidMount(){
        
        const{route}=this.props;
        const {params}  = route.params;
        const sauvegardes = await requete.fetchsauvegardes(params.contact);
        console.log("SSSSauvegardes",sauvegardes);
        if(sauvegardes.status=='ok' && sauvegardes.sauvegardes.length>0){
            let myArray=sauvegardes.sauvegardes;
            this.setState({ myArray});
        }
        else{
            alert('desole pas de sauvegardes disponibles');
        }      
    
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
    async continuer(groupe, entreprise, service, date, quantite, commentaire, prix_unitaire, justif, prix_ref, user_contact, produit_id, categorie, cuvee,remise, nom_fournisseur,type_fournisseur, type_de_vente, groupe_de_vente_id)
    {
        const{route}=this.props;
        const {params}  = route.params;
        if(params.place=="choixservice"){
            let collection={
                choixgrpe:groupe,
                choixentrpse:entreprise,
                choixprdt:service,
                newDate:date,
                prix_ref:prix_ref,
                categorie:categorie,
                cuvee:cuvee,
                nom_fournisseur:nom_fournisseur,
                type_fournisseur:type_fournisseur,
                type_de_vente:type_de_vente,
                groupe_de_vente_id:groupe_de_vente_id
              }
              console.log('cccoolllection', collection);
              this.props.navigation.navigate('ChoixServiceRenseigner',{backparams:collection});

        }
        else if(params.place=="renseignerservice"){          
            let elements={
                choixgrpe:groupe,
                choixentrpse:entreprise,
                choixprdt:service,
                newDate:date,
                prix_unitaire:prix_unitaire,
                qtite:quantite,
                image:justif,
                commentaire:commentaire,
                produit_id:produit_id,
                prix_tot:quantite==null||prix_unitaire==null? 0: this.formatMillier(parseInt(quantite)*parseInt(prix_unitaire)),
                prix_ref:prix_ref,
                prix_tot_ref:quantite==null? 0: this.formatMillier(parseInt(quantite)*parseInt(prix_ref)),
                variation:quantite==null? 0: this.formatMillier((parseInt(quantite)*parseInt(prix_ref))-(parseInt(quantite)*parseInt(prix_unitaire))),
                categorie:categorie,
                cuvee:cuvee,
                nom_fournisseur:nom_fournisseur,
                type_fournisseur:type_fournisseur,
                remise:remise,
                type_de_vente:type_de_vente,
                groupe_de_vente_id:groupe_de_vente_id

            }
            this.props.navigation.navigate('RenseignerService',{backparams:elements});      
        }
        
    }
    annuler(key, id){
        Alert.alert('Vous etes sur le point de supprimer definitivement cette sauvegarde.')
        this.setState({annuler:true, key:key});
        var requestOptions = {
            method: 'DELETE',
            redirect: 'follow'
        };
          
        fetch(racine + `sauvegarde/delete/${id}`, requestOptions)
        .then(response => response.text())
        .then(result =>{ 
            console.log(result)
            alert("Sauvegardes supprimee avec succes")
        })
        .catch(error => console.log('error', error));
    }
    render(){
        const{route, navigation}=this.props;
        const params  = route.params;
        return(
            <Block style={styles.global_container}>
                <ScrollView>
                    {this.state.myArray.map((Data,index)=> 
                        this.state.annuler==false? 
                        <Block card style={[styles.card,{marginTop:40}]} key={index}>
                            <Text>
                                Sauvegarde {Data.groupe} du {Data.created_at}. 
                            </Text>
                            <Block style={{flexDirection:"row", justifyContent:"space-between", marginTop:10}}>
                                <Button center  
                                    style={styles.optionsButton} 
                                    onPress={() => this.annuler(index, Data.id)}>
                                    Annuler
                                </Button>
                                <Button right 
                                    style={styles.optionsButton} 
                                    onPress={() => this.continuer(
                                        Data.groupe, 
                                        Data.entreprise, 
                                        Data.service_produit, 
                                        Data.date_vente, 
                                        Data.quantite, 
                                        Data.commentaire, 
                                        Data.prix_unitaire,
                                        Data.justificatif_vente,
                                        Data.prix_reference,
                                        Data.user_contact,
                                        Data.produit_id,
                                        Data.categorie,
                                        Data.cuvee,
                                        Data.remise,
                                        Data.nom_fournisseur,
                                        Data.type_fournisseur,
                                        Data.type_de_vente,
                                        Data.groupe_de_vente_id
                                    )}>
                                    Continuer
                                </Button>
                            </Block>
                        </Block>
                        :this.state.key==index?null
                        :<Block card style={[styles.card,{marginTop:40}]} key={index}>
                        <Text>
                            Sauvegarde {Data.groupe} du {Data.created_at}. 
                        </Text>
                        <Block style={{flexDirection:"row", justifyContent:"space-between", marginTop:10}}>
                            <Button center  
                                style={styles.optionsButton} 
                                onPress={() => this.annuler(index, Data.id)}>
                                Annuler
                            </Button>
                            <Button right 
                                style={styles.optionsButton} 
                                onPress={() => this.continuer(
                                    Data.groupe, 
                                    Data.entreprise, 
                                    Data.service_produit, 
                                    Data.date_vente, 
                                    Data.quantite, 
                                    Data.commentaire, 
                                    Data.prix_unitaire,
                                    Data.justificatif_vente,
                                    Data.prix_reference,
                                    Data.user_contact,
                                    Data.produit_id,
                                    Data.categorie,
                                    Data.cuvee,
                                    Data.remise,
                                    Data.nom_fournisseur,
                                    Data.type_fournisseur,
                                    Data.type_de_vente,
                                    Data.groupe_de_vente_id

                                )}>
                                Continuer
                            </Button>
                        </Block>
                    </Block>
                    )}
                </ScrollView>
            </Block>
        );
    }

    styles=StyleSheet.create({
        global_container:{
            flex:1,
            flexDirection:"row"
    
        },
        card:{
            padding: theme.SIZES.BASE*2,
            borderTopLeftRadius: 6,
            borderTopRightRadius: 6,
            backgroundColor: "#8BDF83",
            shadowColor: "black",
            shadowOffset: { width: 2, height: 4 },
            shadowRadius: 8,
            opacity:0.8
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

    })

}
export default Sauvegardes;