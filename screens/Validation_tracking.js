import React from "react";
import {StyleSheet,Dimensions, ScrollView, Image,Alert} from "react-native";
import { Block , Text,theme} from "galio-framework";
import RNPickerSelect from 'react-native-picker-select';


import { Button, Select, Icon, Input, Header, Switch } from "../components";
import { argonTheme } from "../constants";
import Home from "./Home";


const { width, height } = Dimensions.get("screen");
const placeholder1 = {
    label: 'etat',
    value: null,
    color: 'black',
  };

class Validation_tracking extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            etat:"etat",
            commentaire:"RAS",

        };
        const { route } = this.props;
        this.params=route.params;
    }

    envoyerrenseigner(){

        let data = {  
            "reference": this.params.params.reference,
            "quantite": this.params.params.quantite,
            "etat": this.state.etat,
            "prix_de_vente":this.params.params.prix_unitaire,
            "commentaire_commercial":this.params.params.commentaire_commercial,
            "raison_responsable": this.state.commentaire,
            "user_id": this.params.params.user_id,
            "produit_service_id": this.params.params.produit_service_id,
            "date_vente": this.params.params.date,
            "preuve": this.params.params.preuve,
            "remise":this.params.params.remise,
            "type_de_vente":this.params.params.type_vente,
            "groupe_de_vente_id":this.params.params.groupe_vente_id
        };

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
        const URL=`http://tracking.socecepme.com/api/ventes/${this.params.params.reference}`;
        if(this.state.etat!="none" && this.state.etat!="valide" && this.state.commentaire!="none" ){
            fetch(URL, requestOptions)
            .then(response => response.text())
            .then(result => {
                console.log('Success:', result);
                Alert.alert("Vente:"+" "+this.params.params.produit+" "+"du"+" "+this.params.params.date+" "+`${this.state.etat}`)
                this.props.navigation.navigate('Home');
            })
            .catch((error) => {
                console.error('Error:', error);
                alert("erreur sur le serveur: la validation n'a pas ete prise en compte");
            });
        }
        if(this.state.etat=="valide" ){
            fetch(URL, requestOptions)
            .then(response => response.text())
            .then(result => {
                console.log('Success:', result);
                Alert.alert("Vente:"+" "+this.params.params.produit+" "+"du"+" "+this.params.params.date+" "+`${this.state.etat}`)
                this.props.navigation.navigate('Home');
            })
            .catch((error) => {
                console.error('Error:', error);
                alert("erreur sur le serveur: la validation n'a pas ete prise en compte");
            });
        }
        else{
            alert("Remplissez tous les champs SVP");
        }
    }
    envoyermodifier(){
        let data = {  
           // "reference": this.params.params.reference,
            "nvquantite": this.params.params.quantite,
            "nvetat": this.state.etat,
            "nvprix":this.params.params.prix_unitaire,
            "raison_modif":this.params.params.commentaire_commercial,
            "commentaire_responsable":this.state.commentaire,
            "user_id": this.params.params.user_id,
            "vente_id": this.params.params.vente_id,
            "nvdate": this.params.params.date,
            "preuve": this.params.params.preuve,
            "remise":this.params.params.remise,
            "type_de_vente":this.params.params.type_vente,
            "groupe_de_vente_id":this.params.params.groupe_vente_id
        };

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
        //const URL=`http://tracking.socecepme.com/api/validation_modif/${this.params.params.reference}/${this.params.params.vente_id}`;
        //const URL="http://tracking.socecepme.com/api/validation_modif/";
        const URL='http:192.168.8.101/Tracking/public/api';
        if(this.state.etat!="etat" && this.state.commentaire!="none" ){
            fetch(URL+this.params.params.reference+'/'+this.params.params.modif_id, requestOptions)
            .then(response => response.text())
            .then(result => {
                console.log('Success:', result);
                Alert.alert("Modif Vente:"+" "+this.params.params.produit+" "+"du"+" "+this.params.params.date+" "+`${this.state.etat}`)
                this.props.navigation.navigate('Home');
            })
            .catch((error) => {
                console.error('Error:', error);
                alert("erreur sur le serveur: la validation n'a pas ete prise en compte");
            });
        }
        else{
            alert("Remplissez tous les champs SVP");
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
    render(){
        const { navigation, route } = this.props;
        const {params}=route.params;
        //console.log(params);
        console.log(this.state.etat);
        console.log(this.state.commentaire);
        console.log(this.params.params);
        return(
            params.validation=="renseigner"?
                <Block style={styles.Renseigner_container}>
                    <ScrollView>
                        <Block card style={styles.service_card}> 
                        
                            <Text  h5
                                    color={argonTheme.COLORS.DEFAULT}
                            >
                                Vente: {params.produit} du {params.date}
                            </Text>
                        </Block>
                        <Block style={styles.renseigner_card}>
                            <Block style={{flexDirection:"row", justifyContent:"space-between"}}>
                                <Block card style={[styles.card,{justifyContent:"flex-start"}]}> 
                                    <Text h5 color="white">
                                        Prix de ref: {params.prix_de_reference}
                                    </Text>
                                </Block>
                                <Block card style={[styles.card, {justifyContent:"flex-start", marginBottom:10}]}> 
                                    <Text h5 color="white">
                                    Prix tot ref: {this.formatMillier(parseInt(params.prix_de_reference)*parseInt(params.quantite))} FCFA
                                    </Text>
                                </Block>
                            </Block>
                            <Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
                                <Input
                                    right
                                    placeholder={`${params.prix_unitaire} FCFA`}
                                    style={{
                                    borderColor: theme.COLORS.SUCCESS,
                                    borderRadius: 4,
                                    backgroundColor: "#fff"
                                    }}
                                    help="Prix unitaire"
                                    TopHelp
                                    placeholderTextColor="grey"
                                    iconContent={<Block />}
                                    editable={false}
                                />
                            </Block>
                            <Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
                                <Input
                                    right
                                    placeholder={params.quantite}
                                    style={{
                                    borderColor: theme.COLORS.SUCCESS,
                                    borderRadius: 4,
                                    backgroundColor: "#fff"
                                    }}
                                    help="quantite"
                                    TopHelp
                                    placeholderTextColor="grey"
                                    iconContent={<Block />}
                                    editable={false}
                                />
                            </Block>
                            <Block style={{ paddingHorizontal: theme.SIZES.BASE,  marginTop:10 }}>
                                <Text>justificatif</Text>
                                <Image source={{ uri: 'http://tracking.socecepme.com/'+ params.preuve }} style={{ width: "100%", height: 300 }} />
                            </Block>
                            <Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
                                <Input
                                    right
                                    placeholder={params.commentaire_commercial}
                                    maxlength="100"
                                    style={{
                                    borderColor: theme.COLORS.SUCCESS,
                                    borderRadius: 4,
                                    backgroundColor: "#fff"
                                    }}
                                    help="commentaire"
                                    TopHelp
                                    placeholderTextColor="grey"
                                    iconContent={<Block />}
                                    editable={false}
                                    
                                />
                            </Block>
                            <Block style={{flexDirection:"row", justifyContent:"space-between",marginTop:10}}>
                                <Block card  style={[styles.card,{justifyContent:"flex-start"}]}> 
                                    <Text h5 color="white">
                                        var tot: {this.formatMillier((parseInt(params.prix_unitaire)*parseInt(params.quantite))-(parseInt(params.prix_de_reference)*parseInt(params.quantite)))} FCFA
                                    </Text>
                                </Block>
                                <Block card  style={[styles.card,{justifyContent:"flex-end"}]}> 
                                    <Text h5 color="white">
                                        Prix tot: {this.formatMillier(parseInt(params.prix_unitaire)*parseInt(params.quantite))} FCFA
                                    </Text>
                                </Block>
                            </Block>
                            <Block style={styles.divider} />
                            <Block style={{paddingHorizontal: theme.SIZES.BASE}}>
                                <Text>etat de la validation</Text>
                            </Block>
                            <Block card style={{paddingHorizontal: theme.SIZES.BASE,borderColor: theme.COLORS.SUCCESS, width:"90%", marginLeft:10, marginBottom:10}} >
                                <RNPickerSelect
                                    placeholder={placeholder1}
                                    onValueChange={(value) =>
                                    this.setState({ etat: value })
                                    }
                                    items={[
                                        {   label: "a modifier",
                                            value:"a modifier"
                                        },
                                        {   label: "valide",
                                            value:"valide"
                                        },
                                        {   label: "rejete",
                                            value:"rejete"
                                        },
                                        
                                    ]}
                                />  
                            </Block>
                            <Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
                                <Input
                                    right
                                    placeholder="commentaire (max 2 lignes)"
                                    maxlength="100"
                                    style={{
                                        borderColor: theme.COLORS.SUCCESS,
                                        borderRadius: 4,
                                        backgroundColor: "#fff",
                                        marginBottom:10
                                    }}
                                    help="Commentaire"
                                    TopHelp
                                    placeholderTextColor="black"
                                    onChangeText={(input) =>{this.setState({commentaire:input})}}
                                    iconContent={<Block />}
                                />
                            </Block>
                        </Block>
                        <Block flex={1.25} right>
                            <Button center color="default" 
                                style={styles.optionsButton} 
                                onPress={() => this.envoyerrenseigner()}>
                                ENVOYER
                            </Button>
                        </Block>
                    </ScrollView>
                </Block>
            :
                <Block style={styles.Renseigner_container}>
                    <ScrollView>
                        <Block card style={styles.service_card}> 
                        
                            <Text  h5
                                    color={argonTheme.COLORS.DEFAULT}
                            >
                            Modif Vente: {params.produit} du {params.date}
                            </Text>
                        </Block>
                        <Block style={styles.renseigner_card}>
                            <Block style={{flexDirection:"row", justifyContent:"space-between"}}>
                                <Block card style={[styles.card,{justifyContent:"flex-start"}]}> 
                                    <Text h5 color="white">
                                        Prix de ref: {params.prix_de_reference}
                                    </Text>
                                </Block>
                                <Block card style={[styles.card, {justifyContent:"flex-start", marginBottom:10}]}> 
                                    <Text h5 color="white">
                                    Prix tot ref: {this.formatMillier(parseInt(params.prix_de_reference)*parseInt(params.quantite))} FCFA
                                    </Text>
                                </Block>
                            </Block>
                            <Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
                                <Input
                                    right
                                    placeholder={`${params.prix_unitaire} FCFA`}
                                    style={{
                                    borderColor: theme.COLORS.SUCCESS,
                                    borderRadius: 4,
                                    backgroundColor: "#fff"
                                    }}
                                    help="Prix unitaire"
                                    TopHelp
                                    placeholderTextColor="grey"
                                    iconContent={<Block />}
                                    editable={false}
                                />
                            </Block>
                            <Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
                                <Input
                                    right
                                    placeholder={params.quantite}
                                    style={{
                                    borderColor: theme.COLORS.SUCCESS,
                                    borderRadius: 4,
                                    backgroundColor: "#fff"
                                    }}
                                    help="quantite"
                                    TopHelp
                                    placeholderTextColor="grey"
                                    iconContent={<Block />}
                                    editable={false}
                                />
                            </Block>
                            <Block style={{ paddingHorizontal: theme.SIZES.BASE, marginTop:10 }}>
                                <Text>preuve</Text>
                                <Image source={{ uri: params.preuve }} style={{ width: 200, height: 200 }} />
                            </Block>
                            <Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
                                <Input
                                    right
                                    placeholder={params.commentaire_commercial}
                                    maxlength="100"
                                    style={{
                                    borderColor: theme.COLORS.SUCCESS,
                                    borderRadius: 4,
                                    backgroundColor: "#fff"
                                    }}
                                    help="commentaire"
                                    TopHelp
                                    placeholderTextColor="grey"
                                    iconContent={<Block />}
                                    editable={false}
                                    
                                />
                            </Block>
                            <Block style={{flexDirection:"row", justifyContent:"space-between",marginTop:10}}>
                                <Block card  style={[styles.card,{justifyContent:"flex-start"}]}> 
                                    <Text h5 color="white">
                                        var tot: {this.formatMillier((parseInt(params.prix_unitaire)*parseInt(params.quantite))-(parseInt(params.prix_de_reference)*parseInt(params.quantite)))} FCFA
                                    </Text>
                                </Block>
                                <Block card  style={[styles.card,{justifyContent:"flex-end"}]}> 
                                    <Text h5 color="white">
                                        Prix tot: {this.formatMillier(parseInt(params.prix_unitaire)*parseInt(params.quantite))} FCFA
                                    </Text>
                                </Block>
                            </Block>
                            <Block style={styles.divider} />
                            <Block style={{paddingHorizontal: theme.SIZES.BASE}}>
                                <Text>etat de la validation</Text>
                            </Block>
                            <Block card style={{paddingHorizontal: theme.SIZES.BASE,borderColor: theme.COLORS.SUCCESS, width:320, marginLeft:10, marginBottom:10}} >
                                <RNPickerSelect
                                    placeholder={placeholder1}
                                    onValueChange={(value) =>
                                    this.setState({ etat: value })
                                    }
                                    items={[
                                        {   label: "a modifier",
                                            value:"a modifier"
                                        },
                                        {   label: "valide",
                                            value:"valide"
                                        },
                                        {   label: "rejete",
                                            value:"rejete"
                                        },
                                        
                                    ]}
                                />  
                            </Block>
                            <Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
                                <Input
                                    right
                                    placeholder="commentaire (max 2 lignes)"
                                    maxlength="100"
                                    style={{
                                        borderColor: theme.COLORS.SUCCESS,
                                        borderRadius: 4,
                                        backgroundColor: "#fff",
                                        marginBottom:10
                                    }}
                                    help="Commentaire"
                                    TopHelp
                                    placeholderTextColor="black"
                                    onChangeText={(input) =>{this.setState({commentaire:input})}}
                                    iconContent={<Block />}
                                />
                            </Block>
                        </Block>
                        <Block flex={1.25} right>
                            <Button center color="default" 
                                style={styles.optionsButton} 
                                onPress={() => this.envoyermodifier()}>
                                ENVOYER
                            </Button>
                        </Block>
                    </ScrollView>
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
        width: "auto", 
        height:50,
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
        marginHorizontal: theme.SIZES.BASE*1.1,
        marginTop: 20,
        borderTopLeftRadius: 6,
        borderTopRightRadius: 6,
        backgroundColor: theme.COLORS.WHITE,
        shadowColor: "black",
        shadowOffset: { width: 2, height: 4 },
        shadowRadius: 8,
        shadowOpacity: 100,

    },
    card:{
        backgroundColor:"#2ECC71",
        width:"50%", 
        height:"auto", 
        paddingHorizontal: theme.SIZES.BASE,
        //position:"relative"
    },
    divider: {
        width: "100%",
        //height:10,
        borderWidth: 5,
        borderColor: "#2ECC71",
        borderRadius:10,
        shadowOpacity:0.4,
        //backgroundColor:"orange",
        marginTop:20,
        marginBottom:20
      },
    optionsButton: {
        width: 99,
        height: 40,
        paddingHorizontal: theme.SIZES.BASE,
        paddingVertical: 10,
        marginRight:20,
        marginTop:10,
        backgroundColor:"orange",
        marginBottom:10
      },

})
export default Validation_tracking;