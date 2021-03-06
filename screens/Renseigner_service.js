import React from "react";
import {
    StyleSheet,
    Dimensions, 
    ScrollView,
    Alert,
    Image,
    ActivityIndicator
    
} from "react-native";
import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Block , Text,theme} from "galio-framework";
import { Button, Modal, Center, Spinner, Heading,} from "native-base";


import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import base64 from 'react-native-base64';
import RNPickerSelect from 'react-native-picker-select'
import moment from "moment";
import Day from '../services/Date';

import requete from '../services/Fetch'
import { Input } from "../components";
import { argonTheme } from "../constants";
import { TouchableOpacity } from "react-native-gesture-handler";

const { width, height } = Dimensions.get("screen");
let validation;

const placeholder = {
    label: "Mode de paiement",
    value: null,
    color: '#9EA0A4',
};

//const racine = 'http://172.22.32.1/Tracking/public/api/';
const racine = 'https:tracking.socecepme.com/api/';
class Renseigner_service extends React.Component{

    constructor(props){
        super(props);
        this.state={
          prix_ref:0,
          prix_tot_ref:0,
          prix_tot:0,
          variation:0,
          prix_unitaire:0,
          qtite:0,
          produit_id:'',
          commentaire:null,
          preuve:"none",
          image: null,
          etat:'none',
          old_prixunit:0,
          old_qtite:0,
          old_preuve:'',
          old_etat:'',
          old_reference:'',
          old_commentaire:'',
          seller_id:'',
          raison_modif:"none",
          vente_id:'',
          newDate:"aucune nouvelle date choisie",
          date_ref:'',
          url:'',
          remise:0,
          ventefssr_id:'',
          entreprise_email:'',
          entreprise_contact:'',
          entreprisesiege_social:'',
          loading:false,
          mode_de_paie: 1,
          showModal: false,
          showModal2: false,
        };
        const { route } = this.props;
        this.params=route.params;
    };
    async showVenteCommercial() {
        const vente = await requete.fetchshowVenteCommercial(this.params.params.choixcmrcl, this.params.params.date, this.params.params.choixentreprise, this.params.params.choixproduit );
        console.log('TTTTTTest'+vente);
        this.setState({ old_etat: vente.ventes[0].etat });
        this.setState({ old_preuve: vente.ventes[0].preuve });
        this.setState({ old_prixunit: vente.ventes[0].prix_de_vente});
        this.setState({ old_qtite: vente.ventes[0].quantite });
        this.setState({ old_reference: vente.ventes[0].reference });
        this.setState({ vente_id: vente.ventes[0].id });
        this.setState({ seller_id: vente.ventes[0].user_id });
        this.setState({ old_commentaire: vente.ventes[0].raison_responsable });
    }
    
    async showvente(){
        let ref= this.params.params.choixref.split(" ")
        console.log(ref)
        const vente = await requete.fetchshowvente(ref[0]);
        console.log('TTTTTTest'+vente);
        this.setState({ date_ref: ref[ref.length-1] });
        this.setState({ old_etat: vente.ventes[0].etat });
        this.setState({ old_preuve: vente.ventes[0].preuve });
        this.setState({ old_prixunit: vente.ventes[0].prix_de_vente});
        this.setState({ old_qtite: vente.ventes[0].quantite });
        this.setState({ old_reference: vente.ventes[0].reference });
        this.setState({ vente_id: vente.ventes[0].id });
        this.setState({ seller_id: vente.ventes[0].user_id });
        this.setState({ old_commentaire: vente.ventes[0].raison_responsable });
    }

    async calcul(input, field) {

        const{route, navigation}=this.props;
        const {params}  = route.params;
        const {backparams}  = route.params;
        const calculs = await requete.fetchcalculprix(params.choixproduit);
        //console.log('vvvvvvvvvv',calculs.produits[0]);
        let produit;
        if(field=='prix'){
            this.setState({
            prix_unitaire:input,
            })
        } else if(field=='qte'){
            this.setState({
            qtite:input,
            })
        }
        calculs.produits.map(item=>{item.raison_social==params.choixentreprise? produit=item:''});
        console.log('produit', produit);
        this.setState({prix_ref: produit.prix_de_reference});
        this.setState({produit_id: produit.produit_id});
        this.setState({prix_tot_ref: parseInt(this.state.prix_ref)*parseInt(this.state.qtite)}); 
        this.setState({prix_tot: parseInt(this.state.prix_unitaire)*parseInt(this.state.qtite)});
        this.setState({variation:parseInt(this.state.prix_tot)-parseInt(this.state.prix_tot_ref)});
        this.setState({entreprise_contact: produit.contact});
        this.setState({entreprise_email: produit.email});
        this.setState({entreprisesiege_social: produit.siege_social});

        /* this.setState({prix_ref: calculs.produits[0].prix_de_reference});
        this.setState({produit_id: calculs.produits[0].produit_id});
        this.setState({prix_tot_ref: parseInt(this.state.prix_ref)*parseInt(this.state.qtite)}); 
        this.setState({prix_tot: parseInt(this.state.prix_unitaire)*parseInt(this.state.qtite)});
        this.setState({variation:parseInt(this.state.prix_tot)-parseInt(this.state.prix_tot_ref)}); */
        
    }

    comparer(){

        const{route, navigation}=this.props;
        const {params}  = route.params;
        const {backparams}  = route.params;

        if(typeof backparams!=='undefined' && backparams.prix_unitaire!=null && this.state.prix_unitaire==0){
            const ref=backparams.prix_ref;
            if(isNaN(parseInt(backparams.prix_unitaire)) || parseInt(backparams.prix_unitaire)=='' ){
                validation="non";
                return {prefix: "", etat:false, suffix:""};
            }
            if(parseInt(backparams.prix_unitaire)>=parseInt(ref)){
                validation="oui";
            return {prefix: "Bonne Affaire !!!", etat:true, suffix:""};
            } else {
                validation="non";
                return {prefix: "vous ne pouvez pas vendre "+" "+backparams.choixprdt, etat:false, suffix:" "+"a ce prix"};
            }

        }
        else{
            const ref=this.state.prix_ref;
            if(isNaN(parseInt(this.state.prix_unitaire)) || parseInt(this.state.prix_unitaire)=='' ){
                validation="non";
                return {prefix: "", etat:false, suffix:""};
            }
            if(parseInt(this.state.prix_unitaire)>=parseInt(ref)){
                validation="oui";
            return {prefix: "Bonne Affaire !!!", etat:true, suffix:""};
            } else {
                validation="non";
                return {prefix: "vous ne pouvez pas vendre "+" "+this.params.params.choixproduit, etat:false, suffix:" "+"a ce prix"};
            }
        }
    }

    async suivant(){
        const{route, navigation}=this.props;
        const {params}  = route.params;
        const {backparams}  = route.params;
        console.log("mode paie",this.state.mode_de_paie);
        
        const URL1 =racine + 'ventes/';
        const URL = racine + 'photo';
        let A, prix_unitairefssr=0, prix_unitaireconso=0, entreprisefssr, collectionfssr, produitfssr, fssr_interne='non'; 

        if(validation=="oui" && this.state.prix_unitaire>0 && this.state.qtite>0 && this.state.commentaire!=null && this.state.image!=null && this.state.mode_de_paie!=null){
            this.setState({ showModal2: true })
            this.setState({ showModal: false })
           //enregistrement du justif
            var data = new FormData();
            data.append('preuve', {
                uri: this.state.image, // your file path string
                name: '00206919-661e-469a-a19d-a8ba5587f5dc.jpg',
                type: 'image/jpg'
            })
        
            //enregistrement de la vente avec calcul de ratio dans le cas ou le fournisseur est interne
            if(params.choixtypefssr=='interne'){
                fssr_interne='oui';
                //calcul ratio
               A=parseInt(this.state.prix_unitaire)-parseInt(this.state.prix_ref); 
               prix_unitairefssr=parseInt(this.state.prix_ref)+(30*A)/100;
               prix_unitaireconso=(A*70)/100;
               console.log('prix_unitairecccconso', prix_unitaireconso);
               console.log('prix_unitairefffffsr', prix_unitairefssr);
               
               const produits = await requete.fetchcalculprix(params.choixproduit);
               produits['produits'].map(item=>{item.raison_social==params.choixfssr? produitfssr=item:''});
               //enregistrement de la vente du fournisseur
               data.append('reference', 'lepass')
                data.append('quantite', this.state.qtite)
                data.append('etat', 'en attente')
                data.append('prix_de_vente', prix_unitairefssr)
                data.append('commentaire_commercial', this.state.commentaire)
                data.append('raison_responsable', 'RAS')
                data.append('user_id', params.user_id)
                data.append('produit_service_id', produitfssr.produit_id)
                data.append('date_vente', params.date)
                data.append('remise', this.state.remise)
                data.append('type_de_vente', params.type_de_vente)
                data.append('poste', params.poste)
                data.append('mode_de_paiement', this.state.mode_de_paie)
                data.append('groupe_de_vente_id', params.groupe_de_vente_id)

                var myHeaders = {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data'
                };
                var requestOptions = {
                    method: 'POST',
                    headers: myHeaders,
                    body: data,
                };   

                await fetch(URL1+params.choixproduit+'/'+params.choixfssr, requestOptions)
                .then(response => response.text())
                .then(result => {
                    console.log(result);
                    var rslt = JSON.parse(result);
                    this.setState({ventefssr_id:rslt['ventes'].id});
                })
                .catch(error =>{
                    console.log(error)
                    this.setState({ showModal2: false })
                });
            }
            else if(params.choixtypefssr=='externe'){
                entreprisefssr=params.fssrExt;
            }
            data.append('reference', 'lepass')
            data.append('quantite', this.state.qtite)
            data.append('etat', 'en attente')
            data.append('prix_de_vente', prix_unitaireconso!=0? prix_unitaireconso:this.state.prix_unitaire)
            data.append('commentaire_commercial', this.state.commentaire)
            data.append('raison_responsable', 'RAS')
            data.append('user_id', params.user_id)
            data.append('produit_service_id', this.state.produit_id)
            data.append('date_vente', params.date)
            data.append('remise', this.state.remise)
            data.append('type_de_vente', params.type_de_vente)
            data.append('poste', params.poste)
            data.append('mode_de_paiement', this.state.mode_de_paie)
            data.append('groupe_de_vente_id', params.groupe_de_vente_id)
            
            var myHeaders = {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data'
            };
            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: data,
            };     

            fetch(URL1+params.choixproduit+'/'+params.choixentreprise, requestOptions)
            .then(response => response.text())
            .then(result => {
                console.log(result);
                var rslt = JSON.parse(result);
                this.props.navigation.navigate('InfoClient', {
                    params:{
                    "vente_id":rslt['ventes'].id,
                    "choixproduit":params.choixproduit,
                    "date_vente":params.date,
                    "ventefssr_id":this.state.ventefssr_id,
                    "fssrinterne":fssr_interne,
                    "contact":this.state.entreprise_contact,
                    "siege_social":this.state.entreprisesiege_social,
                    "email":this.state.entreprise_email,
                    "choixentrprse":params.choixentreprise
        
                }})
            })
            .catch(error =>{ 
                Alert.alert("erreur sur le serveur: vos donnees n'ont pas pu etre enregistrees")
                this.setState({ showModal2: false })
            });     
        }
        else if(validation=="oui" &&   typeof backparams!=='undefined' /* && backparams.prix_unitaire>0 && backparams.qtite>0 && backparams.commentaire!=null && backparams.image!=null && backparams.choixprdt!=null && backparams.newDate!=null */){
            this.setState({ showModal2: true })
            this.setState({ showModal: false })
            //enregistrement du justif
            var data = new FormData();
            data.append('image', {
                uri: this.state.image==null && backparams.image!=null?backparams.image:this.state.image, // your file path string
                name: '00206919-661e-469a-a19d-a8ba5587f5dc.jpg',
                type: 'image/jpg'
            })
            
            //enregistrement de la vente sauvegardee avec calcul de ratio dans le cas ou le fournisseur est interne
            if(backparams.type_fournisseur=='interne'){
                fssr_interne='oui';
                //calcul ratio
               A=parseInt(this.state.prix_unitaire<=0 && backparams.prix_unitaire>0?backparams.prix_unitaire:this.state.prix_unitaire)-parseInt(this.state.prix_ref==null && backparams.prix_ref!=null? backparams.prix_ref:this.state.prix_ref); 
               prix_unitairefssr=parseInt(this.state.prix_ref==null && backparams.prix_ref!=null? backparams.prix_ref:this.state.prix_ref)+(30*A)/100;
               prix_unitaireconso=(A*70)/100;
               console.log('prix_unitairecccconso', prix_unitaireconso);
               console.log('prix_unitairefffffsr', prix_unitairefssr);
               
               const produits = await requete.fetchcalculprix(backparams.choixprdt);
               produits['produits'].map(item=>{item.raison_social==backparams.nom_fournisseur? produitfssr=item:''});
               //enregistrement de la vente du fournisseur
                data.append('reference', 'lepass')
                data.append('quantite', this.state.qtite==null && backparams.qtite!=null?backparams.qtite:this.state.qtite)
                data.append('etat', 'en attente')
                data.append('prix_de_vente', prix_unitairefssr)
                data.append('commentaire_commercial', this.state.commentaire==null && backparams.commentaire!=null?backparams.commentaire:this.state.commentaire)
                data.append('raison_responsable', 'RAS')
                data.append('user_id', params.user_id)
                data.append('produit_service_id', produitfssr.produit_id)
                data.append('date_vente', backparams.date!=null??backparams.date)
                data.append('remise', this.state.remise==null && backparams.remise!=null? backparams.remise:this.state.remise)
                data.append('type_de_vente', backparams.type_de_vente!=null??backparams.type_de_vente)
                data.append('poste', params.poste)
                data.append('mode_de_paiement', this.state.mode_de_paie==null && backparams.mode_de_paie!=null? backparams.mode_de_paie:this.state.mode_de_paie)
                data.append('groupe_de_vente_id', backparams.groupe_de_vente_id!=null??backparams.groupe_de_vente_id)

                var myHeaders = {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data'
                };
                var requestOptions = {
                    method: 'POST',
                    headers: myHeaders,
                    body: data,
                };   

                await fetch(URL1+backparams.choixprdt!=null??backparams.choixprdt+'/'+backparams.nom_fournisseur!=null??backparams.nom_fournisseur, requestOptions)
                .then(response => response.text())
                .then(result => {
                    console.log(result);
                    var rslt = JSON.parse(result);
                    this.setState({ventefssr_id:rslt['ventes'].id});
                })
                .catch(error =>{
                    console.log(error)
                    this.setState({ showModal2: false })
                });

            }
            else if(backparams.choixtypefssr=='externe'){
                entreprisefssr=backparams.nom_fournisseur;
            }
            //enregistrement de la vente normale
            data.append('reference', 'lepass')
            data.append('quantite', this.state.qtite==null && backparams.qtite!=null?backparams.qtite:this.state.qtite)
            data.append('etat', 'en attente')
            data.append('prix_de_vente', this.state.prix_unitaire<=0 && backparams.prix_unitaire>0?backparams.prix_unitaire:this.state.prix_unitaire)
            data.append('commentaire_commercial', this.state.commentaire==null && backparams.commentaire!=null?backparams.commentaire:this.state.commentaire)
            data.append('raison_responsable', 'RAS')
            data.append('user_id', params.user_id)
            data.append('produit_service_id', this.state.produit_id ? this.state.produit_id:backparams.produit_id)
            data.append('date_vente', backparams.newDate)
            data.append('remise', this.state.remise==null && backparams.remise!=null? backparams.remise:this.state.remise)
            data.append('type_de_vente', backparams.type_de_vente!=null??backparams.type_de_vente)
            data.append('poste', params.poste)
            data.append('mode_de_paiement', this.state.mode_de_paie==null && backparams.mode_de_paie!=null? backparams.mode_de_paie:this.state.mode_de_paie)
            data.append('groupe_de_vente_id', backparams.groupe_de_vente_id!=null??backparams.groupe_de_vente_id)
    
            var myHeaders = {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data'
            };
            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: data,
            };
    
            fetch(URL1+backparams.choixprdt!=null??backparams.choixprdt+'/'+backparams.choixentrpse!=null??backparams.choixentrpse, requestOptions)
            .then(response => response.text())
            .then(result => {
                console.log(result);
                var rslt = JSON.parse(result);
                this.props.navigation.navigate('InfoClient', {
                    params:{
                    "vente_id":rslt['ventes'].id,
                    "choixproduit":backparams.choixprdt!=null??backparams.choixprdt,
                    "date_vente":backparams.date!=null??backparams.date,
                    "ventefssr_id":this.state.ventefssr_id,
                    "fssrinterne":fssr_interne,
                    "contact":this.state.entreprise_contact,
                    "siege_social":this.state.entreprisesiege_social,
                    "email":this.state.entreprise_email,
                    "choixentrprse":backparams.choixentrpse!=null??backparams.choixentrpse
        
                }})
            })
            .catch(error =>{
                Alert.alert("erreur sur le serveur: vos donnees n'ont pas pu etre enregistrees")
                this.setState({ showModal2: false })
            });     
        }
        else if(validation=='non' && parseInt(this.state.prix_unitaire)>=0 && parseInt(this.state.qtite)>0 && this.state.commentaire!=null && this.state.image!=null && this.state.mode_de_paie!=null) {
            alert("vous ne pouvez pas vendre"+' '+ params.choixentreprise+' '+"a ce prix");
        }
        else if(validation=='non' && parseInt(this.state.qtite)<=0 && this.state.commentaire!="none" && this.state.image!=null && this.state.mode_de_paie!=null){
            alert("Les valeurs entrees ne sont pas valides");
        }

        else if(validation=='non' && typeof backparams!=='undefined' && parseInt(backparams.prix_unitaire)>=0 && parseInt(backparams.qtite)>0 && backparams.commentaire!="none" && backparams.image!=null && backparams.choixprdt!=null && this.state.mode_de_paie!=null){
            alert("vous ne pouvez pas vendre"+' '+ backparams.choixentrpse+' '+"a ce prix");
        }
        else if(validation=='non' && typeof backparams!=='undefined' && parseInt(backparams.qtite)<=0 && backparams.commentaire!=null && backparams.image!=null && backparams.choixprdt!=null && this.state.mode_de_paie!=null){
            alert("Les valeurs entrees ne sont pas valides");
        }
        else{
            alert("Remplissez tous les champs SVP ou completez votre sauvegarde en rentrant a la page precedente");
        }
    }

    async sauvegarder() {
        const{route, navigation}=this.props;
        const {backparams}  = route.params;
        if(validation === "oui" && this.state.prix_unitaire>0 && this.state.qtite>0 || validation=="oui" && typeof backparams!=undefined) { //&& backparams.prix_unitaire>0 && backparams.state.qtite>0

            Alert.alert('le mode sauvegarde ne sauvegarde pas les justifs.')
            let data={
                groupe:this.params.params.choixgroupe,
                entreprise:this.params.params.choixentreprise,
                service_produit:this.params.params.choixproduit,
                date_vente:this.params.params.date,
                prix_unitaire:this.state.prix_unitaire,
                quantite:this.state.qtite,
                justificatif_vente: 'justif',
                //justificatif_vente:this.state.image!=null? this.state.url: this.state.image,
                commentaire:this.state.commentaire,
                produit_id:this.state.produit_id,
                user_contact:this.params.params.contact,
                prix_reference:this.state.prix_ref,
                categorie:this.params.params.categorie,
                cuvee:this.params.params.cuvee,
                type_fournisseur:this.params.params.choixtypefssr,
                nom_fournisseur:this.params.params.choixfssr,
                remise:this.state.remise,
                type_de_vente:this.params.params.type_de_vente,
                groupe_de_vente_id:this.params.params.groupe_de_vente_id,
                mode_de_paiement: this.state.mode_de_paie === null? 1 : this.state.mode_de_paie,
            }
            var myHeaders = new Headers();
            myHeaders.append("Accept", "application/json");
            myHeaders.append("Content-Type", "application/json");
            var raw = JSON.stringify(data);
            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };
            const URL = racine + 'save/revfin';
            
            fetch(URL, requestOptions)
            .then(response => response.text())
            .then(result => {
                console.log('Success:', result);
                Alert.alert("Donnees sauvegardees avec succes. Vous pouvez continuer plus tard")
                //this.props.navigation.navigate('Home');
                this.setState({
                    prix_tot_ref:0,
                    prix_tot:0,
                    variation:0,
                    prix_unitaire:0,
                    qtite:0,
                    commentaire:null,
                    image: null,
                    remise:0,
                    mode_de_paie: null
                })
            })
            .catch((error) => {
                console.error('Error:', error);
                Alert.alert("Erreur: vos donnees n'ont pas pu est sauvegardees");
            });
        }
        else{
            alert("Desole vous ne pouvez pas sauvegarder le vide.");
        }
    }
    sauvegardes(){
        this.props.navigation.navigate('Sauvegardes',{params:{contact:this.params.params.contact, place: 2 }})
    }
    
    async envoyerModifier(){
        let nvetat = '', ref = '';
        this.params.params.reprise=="non"?
        nvetat="modifie"
        :
        nvetat="en attente";
        
        if(this.params.params.modif === "ref" && this.params.params.reprise === "non"){
            let reftab= this.params.params.choixref.split(" ");
            ref=reftab[0];
        }
        else if(this.params.params.modif === "ref" && this.params.params.reprise === "oui")
        {
            ref=this.params.params.choixref;   
        }
        else if(this.params.params.modif === "commercial" && this.params.params.reprise === "non")
        {
            ref=this.state.old_reference;   
        }

        const URL = racine + 'modifier_fin';
        const URL1 = racine + 'sauvegardephoto';
        
        if(validation === "oui" && parseInt(this.state.prix_unitaire)>0 && parseInt(this.state.qtite)>0 && this.state.raison_modif !== "none"  && this.state.newDate !== "aucune nouvelle date choisie" && this.state.image !== null){
            this.setState({ showModal2: true })
            this.setState({ showModal: false })
            //sauvegarde du justif
            var data = new FormData();
            data.append('preuve', {
                uri: this.state.image, // your file path string
                name: '00206919-661e-469a-a19d-a8ba5587f5dc.jpg',
                type: 'image/jpg'
            })
            data.append('quantite', this.state.qtite)
            data.append('etat', nvetat)
            data.append('prix_de_vente', this.state.prix_unitaire)
            data.append('commentaire_commercial', this.state.raison_modif)
            data.append('raison_responsable', 'RAS')
            data.append('user_id', this.state.seller_id)
            data.append('date_vente', this.state.newDate)
            data.append('remise', this.state.remise)
            data.append('mode_de_paiement', 
                this.state.mode_de_paie === null && 
                typeof this.params.backparams != 'undefined' &&
                this.params.backparams.mode_de_paie !=null ?
                this.params.backparams.mode_de_paie :
                this.state.mode_de_paie
            )
    
            var myHeaders = {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data'
            };
            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: data,
            }; 

            fetch(URL + '/' + this.state.vente_id + '/' + this.params.params.type_user + '/' + this.params.params.poste , requestOptions)
            .then(response => response.text())
            .then(result => {
                console.log(result);
                if(this.params.params.modif === "ref"){
                    this.setState({ showModal2: false })
                    Alert.alert("Modification:"+" "+this.params.params.choixproduit+" "+"du"+" "+this.state.date_ref+" "+"effective")
                    this.props.navigation.navigate('Home');
                }
                else{
                    this.setState({ showModal2: false })
                    Alert.alert("Modification:"+" "+this.params.params.choixproduit+" "+"du"+" "+this.params.params.date+" "+"effective")
                    this.props.navigation.navigate('Home');
                }

            })
            .catch(error => {
                this.setState({ showModal2: false })
                alert("erreur sur le serveur: votre page n'a pas pu etre chargee correctement")
            });     
        }
        /* else if(validation=='non' && parseInt(this.state.prix_unitaire)>=0 && parseInt(this.state.qtite)>0 && this.state.raison_modif!="none"&& this.state.newDate!="aucune nouvelle date choisie", this.state.image!=null){
            alert("vous ne pouvez pas vendre"+' '+ this.params.params.choixproduit+' '+"a ce prix");
        }
        else if(validation=='non' && parseInt(this.state.qtite)<=0 && this.state.raison_modif!="none" && this.state.newDate!="aucune nouvelle date choisie" && this.state.image!=null){
            alert("Les valeurs entrees ne sont pas valides");
        } */
        else{
            alert("Verifiez vos valeurs et Remplissez tous les champs SVP");
        }
    }
    OnDateChange = (newDate) => {
        let convertedDate=moment(newDate).format("YYYY-MM-DD")
        this.setState({newDate:convertedDate});     
    }
    render() {
        let { image } = this.state;
        let { prix_unitaire }=this.state;
        let { qtite }=this.state;
        const{ route, navigation }=this.props;
        const { params }  = route.params;
        console.log(params);
        console.log(qtite);
        const { backparams }  = route.params;
        const { loading } = this.state;
        
        //renseigner les revenus
        if(this.params.params.type=="renseigner"){
            return(
                <Block style={styles.Renseigner_container}>
                    <ScrollView>
                        <Block card style={styles.service_card}> 
                            <Text  h5
                                color={argonTheme.COLORS.DEFAULT}
                            >
                                Vente: {typeof backparams!=='undefined' && this.state.prix_tot==0 ? backparams.choixprdt : params.choixproduit} du {typeof backparams!=='undefined' && this.state.prix_tot==0 ? backparams.newDate : params.date}
                            </Text>
                        </Block>
                        <Block style={styles.renseigner_card}>
                            <Block style={{flexDirection:"row", justifyContent:"space-between", marginTop:10}}>
                                <Block card  style={[styles.card,{justifyContent:"flex-start"}]}> 
                                    <Text h5 color='white'>
                                        Prix de ref: {typeof backparams!=='undefined' && this.state.prix_tot==0? backparams.prix_ref:params.prix_ref}
                                    </Text>
                                </Block>
                                <Block card style={[styles.card, {justifyContent: "flex-end"}]}> 
                                    <Text h5 color='white'>
                                        Prix tot ref: {typeof backparams!=='undefined' && this.state.prix_tot_ref==0? backparams.prix_tot_ref: this.state.prix_tot_ref}FCFA
                                    </Text>
                                </Block>
                            </Block>
                            {typeof backparams!=='undefined'?
                                <Block>
                                    <Block style={{ paddingHorizontal: theme.SIZES.BASE, marginTop:20 }}>
                                        <Text>Prix unitaire numerique (FCFA)</Text>
                                        <Input //type="numeric"
                                            keyboardType="numeric"
                                            right
                                            placeholder="entrer le prix unitaire"
                                            style={{
                                                borderColor: theme.COLORS.SUCCESS,
                                                borderRadius: 4,
                                                backgroundColor: '#fff'
                                            }}
                                            value={this.state.prix_unitaire==0?? backparams.prix_unitaire}
                                            onChangeText={(input) =>{this.calcul(input,"prix")}}
                                            placeholderTextColor="black"
                                            iconContent={<Block />}
                                                
                                        />
                                        {!this.comparer().etat?<Text style={{ color: 'red',display:this.comparer().prefix==""? 'none':'flex'}}> {this.comparer().prefix} {this.comparer().suffix} </Text>:<Text style={{ color: '#2ECC71' }}>{this.comparer().prefix}</Text>}
                                    </Block>
                                    <Block style={{ paddingHorizontal: theme.SIZES.BASE, marginTop: 10 }}>
                                        <Text>quantite numerique</Text>
                                        <Input //type="numeric"
                                            keyboardType="numeric"
                                            right
                                            placeholder="entrer la quantite"
                                            style={{
                                                borderColor: theme.COLORS.SUCCESS,
                                                borderRadius: 4,
                                                backgroundColor: '#fff'
                                            }}
                                            value={qtite==0?? backparams.qtite}
                                            onChangeText={(input) =>this.calcul(input,"qte")}
                                            placeholderTextColor='black'
                                            iconContent={<Block />}
                                        />
                                    </Block>
                                </Block>
                                :
                                <Block>
                                    <Block style={{ paddingHorizontal: theme.SIZES.BASE, marginTop:30 }}>
                                        <Text>Prix unitaire numerique (FCFA)</Text>
                                        <Input //type="numeric"
                                            keyboardType="numeric"
                                            right
                                            placeholder="entrer le prix unitaire"
                                            style={{
                                                borderColor: theme.COLORS.SUCCESS,
                                                borderRadius: 4,
                                                backgroundColor: '#fff'
                                            }}
                                            onChangeText={(input) =>{this.calcul(input,"prix")}}
                                            placeholderTextColor='black'
                                            iconContent={<Block />}
                                                
                                        />
                                        {!this.comparer().etat?<Text style={{color:'red',display:this.comparer().prefix==""? 'none':'flex'}}> {this.comparer().prefix} {this.comparer().suffix} </Text>:<Text style={{color:"#2ECC71"}}>{this.comparer().prefix}</Text>}
                                    </Block>
                                    <Block style={{ paddingHorizontal: theme.SIZES.BASE, marginTop:10 }}>
                                        <Text>quantite numerique</Text>
                                        <Input //type="numeric"
                                            keyboardType="numeric"
                                            right
                                            placeholder="entrer la quantite"
                                            style={{
                                                borderColor: theme.COLORS.SUCCESS,
                                                borderRadius: 4,
                                                backgroundColor: '#fff'
                                            }}
                                            onChangeText={(input) =>this.calcul(input,"qte")}
                                            placeholderTextColor='black'
                                            iconContent={<Block />}
                                        />
                                    </Block>
                                </Block>

                            }
                            <Block  flex={1.25} middle style={{ paddingHorizontal: theme.SIZES.BASE, marginTop:10 }}>
                                {/* <TouchableOpacity onPress={this._takeImage}><Text>PHOTOGRAPHIER LE JUSTIFICATIF</Text></TouchableOpacity> */}
                                <Button style={styles.uploadButton} onPress={this._takeImage} > PHOTOGRAPHIER LE JUSTIFICATIF DE LA VENTE </Button>
                                <Text>OU</Text>
                                <Button style={styles.uploadButton} onPress={this._pickImage} > CHOISIR LE JUSTIFICATIF DE LA VENTE </Button>
                                {typeof backparams!=='undefined' && image==null ? backparams.image && <Image source={{ uri: backparams.image}} style={{ width: 200, height: 200 }} /> : image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
                            </Block>
                            <Block style={{ paddingHorizontal: theme.SIZES.BASE, marginTop:10 }}>
                                <Text>mode de paiement</Text>
                                <Block card style={{borderColor: theme.COLORS.SUCCESS,}}>
                                    <RNPickerSelect 
                                        style={{
                                            inputIOS: { color: 'black' },
                                            inputAndroid: { color: 'black' },
                                        }}
                                        placeholder={placeholder}
                                        placeholderTextColor='black'
                                        value={this.state.mode_de_paie}
                                        onValueChange={(value) => this.setState({mode_de_paie: value})}
                                        items={[
                                            {
                                                label: 'comptant',
                                                value: 1
                                            },
                                            {
                                                label: 'a credit',
                                                value: 2
                                            },
                                        ]}
                                    />
                                </Block>     
                            </Block>
                            <Block style={{ paddingHorizontal: theme.SIZES.BASE, marginTop:10 }}>
                                <Text>commentaire</Text>
                                <Input
                                    right
                                    placeholder="commentaire (max 2 lignes)"
                                    maxLength={100}
                                    style={{
                                        borderColor: theme.COLORS.SUCCESS,
                                        borderRadius: 4,
                                        backgroundColor: '#fff',
                                        //marginBottom:10
                                    }}
                                    placeholderTextColor='black'
                                    value={typeof backparams!=='undefined' && this.state.commentaire==null ? backparams.commentaire: this.state.commentaire }
                                    onChangeText={(input) =>{this.setState({commentaire:input})}}
                                    iconContent={<Block />}
                                />
                            </Block>
                            <Block style={{flexDirection:"row", justifyContent:"space-between", marginTop:10}}>
                                <Block card style={[styles.card,{justifyContent:"flex-start"}]}> 
                                    <Text h5 color='white'>
                                        var tot: {typeof backparams!=='undefined'  && this.state.variation==0 ? backparams.variation: this.state.variation}FCFA
                                    </Text>
                                </Block>
                                <Block card  style={[styles.card, {justifyContent:"flex-end"}]}> 
                                    <Text h5 color='white'>
                                        Prix tot: {typeof backparams!=='undefined'  && this.state.prix_tot==0 ? backparams.prix_tot:this.state.prix_tot}FCFA
                                    </Text>
                                </Block>
                            </Block>
                        </Block>
                        <Block style={{flexDirection:"row", justifyContent:"space-between", marginTop:10}}>
                            <Block /* flex={1.25} left */ style={{justifyContent:"flex-start"}}>
                                <Button  
                                    style={styles.optionsButtonl} 
                                    onPress={() =>{this.sauvegardes()}}
                                >
                                    SAUVEGARDES
                                </Button>
                            </Block>
                            <Block /* flex={1.25} center */ style={{justifyContent:"center"}}>
                                <Button  
                                    style={styles.optionsButtonm} 
                                    onPress={() =>{this.sauvegarder()}}
                                >
                                    SAUVEGARDER
                                </Button>
                            </Block> 
                            <Block /* flex={1.25} right */style={{justifyContent:"flex-end"}}>
                                <Button center /* color='default' */ 
                                    style={styles.optionsButtonr} 
                                    onPress={() =>{
                                    this.setState({ showModal: true })
                                }}
                                >
                                    SUIVANT
                                </Button>
                            </Block>
                        </Block>
                        <Modal isOpen={this.state.showModal} onClose={() => this.setState({showModal: false})}>
                            <Modal.Content maxWidth="400px">
                                <Modal.CloseButton />
                                <Modal.Header>Recapitulatif de la vente</Modal.Header>
                                <Modal.Body>
                                    <Text>groupe: {params.choixgroupe}</Text>
                                    <Text>entreprise: {params.choixentreprise}</Text>
                                    {params.categorie ? 
                                        <Text>categorie: {params.categorie}</Text>
                                    :   null
                                    }
                                    <Text>produit: {params.choixproduit}</Text>
                                    {params.cuvee ? 
                                        <Text>cuvee: {params.cuvee}</Text>
                                    :   null
                                    }
                                    <Text>quantite: {this.state.qtite}</Text>
                                    <Text>prix de vente: {this.state.prix_unitaire} FCFA </Text>
                                     <Text>mode de paiement: {this.state.mode_de_paie === 1 ? 'comptant': 'a credit'}</Text>
                                    {params.choixtypefssr === 'interne' ? 
                                        <Text>fournisseur: {params.choixfssr}</Text>
                                    :   params.choixtypefssr === 'externe' ?
                                        <Text>fournisseur: {params.fsseurExt}</Text>
                                    :   null
                                    }
                                    <Text>date: {params.date}</Text>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button.Group variant="ghost" space={2}>
                                        <Button
                                            onPress={() => this.setState({showModal: false})}
                                        >
                                            REPRENDRE
                                        </Button>
                                        <Button onPress={() => { this.suivant() }}>
                                            SUIVANT
                                        </Button>
                                    </Button.Group>
                                </Modal.Footer>
                            </Modal.Content>
                        </Modal>
                        <Modal isOpen={this.state.showModal2} /* onClose={() => this.setState({showModal2: false})} bg={'transparent'} */>
                            <Modal.Content maxWidth="400px">
                                {/* <Modal.CloseButton /> */}
                                <Modal.Header>Recapitulatif de la vente</Modal.Header>
                                <Modal.Body space={2} justifyContent="center" direction="row">
                                    <Spinner accessibilityLabel="Loading posts" />
                                    <Heading color="primary.500" fontSize="md">
                                        Veuillez patienter
                                    </Heading>
                                </Modal.Body>
                            </Modal.Content>
                        </Modal>
                    </ScrollView>           
                </Block>
            )
        }

        //modifier les revenus
        else if(this.params.params.type=="modif"){
           // this.showVenteCommercial()
            return(
                <Block style={styles.Renseigner_container}>
                    <ScrollView>
                        <Block card style={styles.service_card}> 
                           { 
                                this.params.params.modif=="ref" && this.params.params.reprise=="non"?
                                    <Text  h5
                                            color={argonTheme.COLORS.DEFAULT}
                                    >
                                        modif: {this.params.params.choixproduit} du {this.state.date_ref}
                                    </Text>
                                :
                                   <Text  h5
                                            color={argonTheme.COLORS.DEFAULT}
                                        >
                                            modif: {this.params.params.choixproduit} du {this.params.params.date}
                                        </Text>
                            }
                        </Block>
                        <Block style={styles.renseigner_card}>
                            <Block style={{flexDirection:"row", justifyContent:"space-between"}}>
                                <Block card style={[styles.card, {justifyContent:"flex-start"}]}> 
                                    <Text h5 color='white'>
                                        Prix de ref: {this.params.params.prix_de_reference}
                                    </Text>
                                </Block>
                                <Block card style={[styles.card,{justifyContent:"flex-end"}]}> 
                                    <Text h5 color='white'>
                                        Prix tot ref: {this.state.prix_tot_ref}fcfa
                                    </Text>
                                </Block>
                            </Block>
                            <Block style={{ paddingHorizontal: theme.SIZES.BASE, marginTop: 20 }}>
                                <Text>{`ancien prix unitaire: ${this.state.old_prixunit} FCFA`}</Text>
                                <Input type="numeric"
                                    right
                                    placeholder="entrer le nouveau prix unitaire"
                                    style={{
                                        borderColor: theme.COLORS.SUCCESS,
                                        borderRadius: 4,
                                        backgroundColor: '#fff'
                                    }}
                                    onChangeText={(input) =>{this.calcul(input,"prix")}}
                                    placeholderTextColor='black'
                                    iconContent={<Block />}
                                        
                                />
                                {!this.comparer().etat?<Text style={{color:'red',display:this.comparer().prefix==""? 'none':'flex'}}> {this.comparer().prefix} {this.comparer().suffix} </Text>:<Text style={{color:"#2ECC71"}}>{this.comparer().prefix}</Text>}
                            </Block >
                                <Block style={{ paddingHorizontal: theme.SIZES.BASE, marginTop: 10 }}>
                                    <Text>{`ancienne quantite: ${this.state.old_qtite}`}</Text>
                                    <Input type="numeric"
                                        right
                                        placeholder="entrer la nouvelle quantite"
                                        style={{
                                            borderColor: theme.COLORS.SUCCESS,
                                            borderRadius: 4,
                                            backgroundColor: '#fff'
                                        }}
                                        onChangeText={(input) =>this.calcul(input,"qte")}
                                        placeholderTextColor='black'
                                        iconContent={<Block />}
                                    />
                                </Block>
                                <Block style={{paddingHorizontal: theme.SIZES.BASE, marginTop:10}}>
                                    <Text style={{marginBottom:-10}}>{this.state.newDate}</Text>    
                                    <Day OnDateChange={this.OnDateChange}/>
                                </Block >
                                <Block  flex={1.25} middle style={{paddingHorizontal: theme.SIZES.BASE, marginTop:10}}>
                                    <Button style={{marginTop:10, backgroundColor:'#2ECC71',marginBottom:10, width:"100%"}}/* style={styles.uploadButton} */ 
                                    onPress={this._pickImage} > JUSTIFICATIF DE LA VENTE </Button>
                                    {image && <Image source={{ uri:image}} style={{ width: 200, height: 200 }} /> }
                                </Block>
                                { this.params.params.reprise=="non"?
                                    <Block style={{ paddingHorizontal: theme.SIZES.BASE, marginTop: 10 }}>
                                        <Text> Raison de la modif </Text>
                                        <Input
                                            right
                                            placeholder="commentaire (max 2 lignes)"
                                            maxLength={100}
                                            style={{
                                                borderColor: theme.COLORS.SUCCESS,
                                                borderRadius: 4,
                                                backgroundColor: '#fff',
                                                marginBottom:10
                                            }}
                                            placeholderTextColor='black'
                                            onChangeText={(input) =>{this.setState({raison_modif:input})}}
                                            iconContent={<Block />}
                                        />
                                    </Block>
                                    :
                                    
                                    <Block style={{ paddingHorizontal: theme.SIZES.BASE, marginTop: 10 }}>
                                        <Text>commentaire du responsable</Text>
                                        <Input
                                            right
                                            placeholder={this.params.params.raison_responsable}
                                            maxLength={100}
                                            style={{
                                                borderColor: theme.COLORS.SUCCESS,
                                                borderRadius: 4,
                                                backgroundColor: '#fff',
                                                marginBottom:10
                                            }}
                                            placeholderTextColor='grey'
                                            iconContent={<Block />}
                                            editable={false}
                                            
                                        />
                                        <Text>nouveau commentaire </Text>
                                        <Input
                                            right
                                            placeholder="commentaire (max 2 lignes)"
                                            maxLength={100}
                                            style={{
                                                borderColor: theme.COLORS.SUCCESS,
                                                borderRadius: 4,
                                                backgroundColor: '#fff',
                                                marginBottom:10
                                            }}
                                            placeholderTextColor='black'
                                            onChangeText={(input) =>{this.setState({raison_modif:input})}}
                                            iconContent={<Block />}
                                        />
                                    
                                    </Block>
                                }
                                <Block style={{flexDirection:"row", justifyContent:"space-between",marginTop:10}}>
                                    <Block card style={[styles.card,{justifyContent:"flex-start"}]}> 
                                        <Text h5 color='white'>
                                            var tot: {this.state.variation}fcfa
                                        </Text>
                                    </Block>
                                    <Block card  style={[styles.card,{justifyContent:"flex-end"}]}> 
                                        <Text h5 color='white'>
                                            Prix tot: {this.state.prix_tot}fcfa
                                        </Text>
                                    </Block>
                                </Block>
                        </Block>
                        <Block flex={1.25} right>
                            <Button center
                                style={styles.optionsButtonmodif} 
                                onPress={() => {this.setState({ showModal: true })}}>
                                ENVOYER
                            </Button>
                        </Block>
                        <Modal isOpen={this.state.showModal} onClose={() => this.setState({showModal: false})}>
                            <Modal.Content maxWidth="400px">
                                <Modal.CloseButton />
                                <Modal.Header>Recapitulatif de la Modification</Modal.Header>
                                <Modal.Body>
                                    <Text>entreprise: {params.choixentreprise}</Text>
                                    {params.categorie ? 
                                        <Text>categorie: {params.categorie}</Text>
                                    :   null
                                    }
                                    <Text>produit: {params.choixproduit}</Text>
                                    {params.cuvee ? 
                                        <Text>cuvee: {params.cuvee}</Text>
                                    :   null
                                    }
                                    <Text>quantite: {this.state.qtite}</Text>
                                    <Text>prix de vente: {this.state.prix_unitaire} FCFA </Text>
                                     <Text>mode de paiement: {this.state.mode_de_paie === 1 ? 'comptant': 'a credit'}</Text>
                                    {params.choixtypefssr === 'interne' ? 
                                        <Text>fournisseur: {params.choixfssr}</Text>
                                    :   params.choixtypefssr === 'externe' ?
                                        <Text>fournisseur: {params.fsseurExt}</Text>
                                    :   null
                                    }
                                    <Text>date: {this.state.newDate}</Text>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button.Group variant="ghost" space={2}>
                                        <Button
                                            onPress={() => this.setState({showModal: false})}
                                        >
                                            REPRENDRE
                                        </Button>
                                        <Button onPress={() => { this.envoyerModifier() }}>
                                            ENVOYER
                                        </Button>
                                    </Button.Group>
                                </Modal.Footer>
                            </Modal.Content>
                        </Modal>
                        <Modal isOpen={this.state.showModal2} /* onClose={() => this.setState({showModal2: false})} bg={'transparent'} */>
                            <Modal.Content maxWidth="400px">
                                {/* <Modal.CloseButton /> */}
                                <Modal.Header>Recapitulatif de la Modification</Modal.Header>
                                <Modal.Body space={2} justifyContent="center" direction="row">
                                    <Spinner accessibilityLabel="Loading posts" />
                                    <Heading color="primary.500" fontSize="md">
                                        Veuillez patienter
                                    </Heading>
                                </Modal.Body>
                            </Modal.Content>
                        </Modal>
                    </ScrollView>           
                </Block>
            )

        }
    }
    

    componentDidMount() {
        if(this.params.params.type=="modif" && this.params.params.modif=="commercial"){
            this.showVenteCommercial();
        }
        else if(this.params.params.type=="modif" && this.params.params.modif=="ref"){
            this.showvente();
        }
        /*else if(this.params.params.type=="renseigner"){
            this.getsauvegarde();
        }*/
        this.getPermissionAsync();
      }
    
      getPermissionAsync = async () => {
        if (Constants.platform.ios) {
          const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
          if (status !== 'granted') {
            alert('D??sol??, nous avons besoin une autorisation de la camera pour que cela fonctionne!');
          }
        }
      };
    
      _pickImage = async () => {
        try {
          let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.image,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
            //base64:true,
            //exif:true
          });
          if (!result.cancelled) {
            this.setState({ image: result.uri });
          }
    
          console.log(result);
        } catch (E) {
          console.log(E);
        }
      };
      _takeImage= async () =>{
        try {
            let result = await ImagePicker.launchCameraAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.image,
              allowsEditing: true,
              aspect: [4, 3],
              quality: 1,
              //base64:true,
              //exif:true
            });
            if (!result.cancelled) {
              this.setState({ image: result.uri });
            }
      
            console.log(result);
        } catch (E) {
            console.log(E);
        }
      };
}

const styles= StyleSheet.create({

    Renseigner_container:{
        flex:1,
        flexDirection:"row"
    },
    service_card:{
        width: "auto", 
        /* height:50, */
        height: "auto",
        backgroundColor:argonTheme.COLORS.SWITCH_OFF,
        marginHorizontal:5,
        marginTop:20,
        marginBottom:20,
        alignItems:"center",
        justifyContent:"center",
        position:"relative"
        
    },
    renseigner_card:{
        padding: theme.SIZES.BASE,
        marginHorizontal:5,
        borderTopLeftRadius: 6,
        borderTopRightRadius: 6,
        height:"auto",
        backgroundColor: theme.COLORS.WHITE,
        shadowColor: 'black',
        shadowOffset: { width: 2, height: 4 },
        shadowRadius: 8,
        shadowOpacity: 100,
        width:"auto"
    },
    card:{
        backgroundColor: '#2ECC71',
        width:"50%", 
        height:"auto", 
        paddingHorizontal: theme.SIZES.BASE,
    },
    optionsButtonr: {
        width: "auto",
        /* height: 34, */
        height: "auto",
        paddingHorizontal: "auto",
        paddingVertical: 10,
        backgroundColor: 'orange',
        marginBottom:10,
        marginRight:theme.SIZES.BASE/5,
          
      },
    optionsButtonl: {
        width: "auto",
        /* height: 34, */
        height: "auto",
        paddingHorizontal: theme.SIZES.BASE/5,
        paddingVertical: 10,
        backgroundColor: 'orange',
        //marginTop:-45,
        marginBottom:10,
        marginLeft:theme.SIZES.BASE/5
    
    
    },
    optionsButtonm: {
        width: "auto",
        /* height: 34, */
        height: "auto",
        paddingHorizontal: theme.SIZES.BASE/5,
        paddingVertical: 10,
        backgroundColor: 'orange',
        //marginTop:-35,
        marginBottom:10,
        marginHorizontal:theme.SIZES.BASE/5
        
        
    },
      optionsButtonmodif: {
        width: "auto",
        height: "auto",
        paddingHorizontal: theme.SIZES.BASE,
        paddingVertical: 10,
        backgroundColor: 'orange',
        marginTop:10,
        marginBottom:10,
        marginRight:theme.SIZES.BASE*1.1,
        position:"relative"
        
      },
    uploadButton: {
        width:"100%",
        //height: 50,
        height: "auto",
        paddingHorizontal: theme.SIZES.BASE/2,
        paddingVertical: 10,
        marginTop:10,
        backgroundColor: '#2ECC71',
        marginBottom:10,
        fontSize:50
    },
    activityIndicator: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 80,
        marginTop: height/5,
        zIndex:1
    
    }
})

export default Renseigner_service;