import react from "react";
import React from "react";
import {StyleSheet, ScrollView, Dimensions, Alert, ActivityIndicator} from "react-native";
import { Block, Text,theme} from "galio-framework";
import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from "moment";
import { Button, Modal, Center, Spinner, Heading,} from "native-base";

import {Input} from "../components"
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
            isLoading: true,
            showModal: false,
            showModal2: false,
        };
    }
   async componentDidMount(){
        
        const{route}=this.props;
        const {params}  = route.params;
        const sauvegardes = await requete.fetchsauvegardes(params.contact);
        console.log("SSSSauvegardes",sauvegardes);
        if(sauvegardes.status=='ok' && sauvegardes.sauvegardes.length>0){
            let myArray=sauvegardes.sauvegardes;
            this.setState({ myArray, isLoading: false});
        }
        else{
            alert('desole pas de sauvegardes disponibles');
        }      
    
    }
    async componentDidUpdate(prevProps, prevState){
        
        if(this.state.annuler !== false){
            console.log('bbbbonjour')
            const{route}=this.props;
            const {params}  = route.params;
            const sauvegardes = await requete.fetchsauvegardes(params.contact);
            console.log("SSSSauvegardes",sauvegardes);
            if(sauvegardes.status=='ok' && sauvegardes.sauvegardes.length>0){
                let myArray=sauvegardes.sauvegardes;
                this.setState({ myArray, isLoading: false});
            }
            else{
                alert('desole pas de sauvegardes disponibles');
            } 
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
        if(params.place === 1){
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
        else if(params.place === 2){          
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
        console.log('idddd', id)
        this.setState({annuler:true, key:key, showModal: false, showModal2: true});
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };
          
        fetch(`${racine}sauvegarde/delete/${id}`, requestOptions)
        .then(response => response.text())
        .then(result =>{ 
            console.log(result)
            this.setState({ showModal2: false })
            alert("Sauvegardes supprimee avec succes")
        })
        .catch(error => {
            console.log('error', error)
            this.setState({ showModal2: false })
        });
    }
    render(){
        const{route, navigation}=this.props;
        const { params }  = route.params;
        const { isLoading } = this.state;
        console.log(params)
        return(
            <Block style={styles.global_container}>
                <ScrollView>
                    {this.state.myArray.map((Data, index)=>
                        parseInt(Data.mode) === parseInt(params.place) &&
                        <Block card style={[styles.card,{marginTop:40}]} key={index}>
                            <Text>
                                Sauvegarde {Data.groupe} du {Data.created_at}. 
                            </Text>
                            <Block style={{flexDirection:"row", justifyContent:"space-between", marginTop:10}}>
                                <Button  
                                    style={[styles.optionsButton, {justifyContent:'flex-start', height: "auto"}]} 
                                    onPress={() => this.setState({ showModal: true })}>
                                    Annuler
                                </Button>
                                <Button 
                                    style={[styles.optionsButton, {justifyContent:'flex-end', height: "auto"}]} 
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
                            <Modal isOpen={this.state.showModal} onClose={() => this.setState({showModal: false})}>
                            <Modal.Content maxWidth="400px">
                                <Modal.CloseButton />
                                <Modal.Header>Suppression vente</Modal.Header>
                                <Modal.Body>
                                    <Text>
                                        Etes-vous sure de vouloir definitivement supprimer cette sauvegarde?
                                    </Text>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button.Group variant="ghost" space={2}>
                                        <Button onPress={() => this.setState({ showModal: false })}>
                                            Non
                                        </Button>
                                        <Button onPress={() => this.annuler(index, Data.id)}>
                                            oui
                                        </Button>
                                    </Button.Group>
                                </Modal.Footer>
                            </Modal.Content>
                        </Modal>
                        <Modal isOpen={this.state.showModal2}>
                            <Modal.Content maxWidth="400px">
                                <Modal.Header>Suppression vente</Modal.Header>
                                <Modal.Body space={2} justifyContent="center" direction="row">
                                    <Spinner accessibilityLabel="Loading posts" />
                                    <Heading color="primary.500" fontSize="md">
                                        Veuillez patienter
                                    </Heading>
                                </Modal.Body>
                            </Modal.Content>
                        </Modal>
                        </Block>
                    )}
                    <ActivityIndicator
                        color="#00ff00"
                        size="large"
                        style = {{
                            marginTop: 50,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                        animating ={isLoading}
                    /> 
                </ScrollView>
            </Block>
            /* <Block style={styles.global_container}>
                <ScrollView>
                    {this.state.myArray.map((Data,index)=> 
                        this.state.annuler === false && Data.mode === params.place? 
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
                    <ActivityIndicator
                        color="#00ff00"
                        size="large"
                        style = {{
                            marginTop: 50,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                        animating ={isLoading}
                    /> 
                </ScrollView>
            </Block> */
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
            height: "auto",
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