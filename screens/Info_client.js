import React from "react";
import Autocomplete from 'react-native-autocomplete-input';
import {
    StyleSheet,
    Dimensions, 
    ScrollView,
    Alert,
    TouchableOpacity,
    ActivityIndicator
    
} from "react-native";
import { Block , Text,theme} from "galio-framework";

import { Button,  Input } from "../components";
import { argonTheme } from "../constants";
import AutocompleteRN from "./AutocompleteExample";

const { width, height } = Dimensions.get("screen");

const placeholder = {
    /*label: 'choisir l'etat de la vente',
    value: null,
    color: '#9EA0A4',*/
  };
const API = 'https://tracking.socecepme.com/api';

class Info_client extends React.Component{

    constructor(props){
        super(props);
        this.state={     
          nom:"client lamda",
          email:"client@client.com",
          contact:"000000000",
          numsep:null,
          localisation:'client lamda',
          clients: [],
          //query: '',
          hide:false,
          isLoading:false
        };
        const { route } = this.props;
        this.params=route.params;
    }

    componentDidMount() {
        fetch(`${API}/clients`).then(res => res.json()).then((json) => {
          const {clients } = json;
          console.log('clientssss',json)
          this.setState({ clients });
        });
    }

    formatMillier( nombre){
        this.setState({contact:nombre})
        nombre += '';
        var sep = '-';
        var reg = /(\d+)(\d{3})/;
        console.log(reg);
        while( reg.test( nombre)) {
          nombre = nombre.replace( reg, '$1' +sep +'$2');
        }
        this.setState({numsep:nombre});
        return nombre;
    }
    findClient(query) {
        if (query === '') {
          return [];
        }
    
        const { clients } = this.state;
        const regex = new RegExp(`${query.trim()}`, 'i');
        let result=clients.filter(client => client.nom_client.search(regex) >= 0);
        let Noms=result.map((item)=>(item.nom_client+'_'+item.email+'_'+item.contact+'_'+item.localisation));
        let Nomssandou=[...new Set(Noms)];
        let Nomf=Nomssandou.map((item)=>({nom_client:item.split('_')[0], email:item.split('_')[1], contact:item.split('_')[2], localisation:item.split('_')[3]}));
        console.log(Noms,Nomssandou, Nomf);
        return Nomf;
    }
    envoyer(){
        this.setState({ isLoading: true }) 
        
        if(this.state.nom!="client lamda" && this.state.nom!="client tierce"&& this.state.email!="client@client.com" && this.state.localisation!='client lamda', this.state.contact!="000000000"){
            //enregistrement du client interne
            if(this.params.params.fssrinterne==="oui"){
                console.log('bonjour bonjour');
                const data = new FormData();
                data.append("nom_client", this.params.params.choixentrprse);
                data.append("email", this.params.params.email);
                data.append("contact", this.params.params.contact);
                data.append("localisation", this.params.params.siege_social);
                data.append("vente_id", this.params.params.ventefssr_id);
                fetch('http://tracking.socecepme.com/api/clients', {  
                    method: 'POST',
                    body: data
                }).then(response => response.text())
                .then(result => {
                    console.log(result);
                })
                .catch(error => console.log(error));    
    
            }
            //enregistrement du client externe
            const formData = new FormData();
            formData.append("nom_client", this.state.nom);
            formData.append("email", this.state.email);
            formData.append("contact", this.state.contact);
            formData.append("localisation", this.state.localisation);
            formData.append("vente_id", this.params.params.vente_id);
            fetch('https://tracking.socecepme.com/api/clients', {  
                method: 'POST',
                body: formData
            }).then(response => response.text())
            .then(result => {
                console.log(result);
                Alert.alert("Vente:"+" "+this.params.params.choixproduit+" "+"du"+" "+this.params.params.date_vente+" "+"en attente de validation")
                this.props.navigation.navigate('Home');
            })
            .catch(error => alert("erreur sur le serveur: les donnees du client n'ont pas pu etre enregistrees"));    
        }
        else if(this.state.nom=="client tierce"){
            //enregistrement du client interne
            if(this.params.params.fssrinterne==="oui"){
                console.log('bonjour bonjour');
                const data = new FormData();
                data.append("nom_client", this.params.params.choixentrprse);
                data.append("email", this.params.params.email);
                data.append("contact", this.params.params.contact);
                data.append("localisation", this.params.params.siege_social);
                data.append("vente_id", this.params.params.ventefssr_id);
                fetch('https://tracking.socecepme.com/api/clients', {  
                    method: 'POST',
                    body: data
                }).then(response => response.text())
                .then(result => {
                    console.log(result);
                })
                .catch(error => console.log(error));    
    
            }
            //enregistrement du client externe
            const formData = new FormData();
            formData.append("nom_client", this.state.nom);
            formData.append("email", this.state.email);
            formData.append("contact", this.state.contact);
            formData.append("localisation", this.state.localisation);
            formData.append("vente_id", this.params.params.vente_id);
            fetch('https://tracking.socecepme.com/api/clients', {  
                method: 'POST',
                body: formData
            }).then(response => response.text())
            .then(result => {
                console.log(result);
                Alert.alert("Vente:"+" "+this.params.params.choixproduit+" "+"du"+" "+this.params.params.date_vente+" "+"en attente de validation")
                this.props.navigation.navigate('Home');
            })
            .catch(error => alert("erreur sur le serveur: les donnees du client n'ont pas pu etre enregistrees"));    
        }
        else{
            alert("Renseignez tous les champs SVP");
        }

    }

    render(){
        
    const { navigation, route } = this.props;
    const params  = route.params;
    console.log('params',params);
    const { nom, email, contact, localisation } = this.state;
    const clients = this.findClient(nom);
    const {isLoading} = this.state;
    console.log(this.state);
        return(
            <Block style={styles.globale_container}>
                <ScrollView keyboardShouldPersistTaps='always'>
                    <Block 
                        style={{ 
                            justifyContent: "center",
                            alignItems: "center",
                            marginHorizontal:50,
                            marginTop:50,
                            marginBottom:20,
                            width:"auto"      
                        }}>
                        <Text  h4 
                            color={argonTheme.COLORS.DEFAULT}>
                            Informations sur le client {/* (faculatives) */}
                        </Text>
                    </Block>
                    <Block style={styles.Info_card}>
                        <Text style={{ paddingHorizontal: theme.SIZES.BASE }}>Nom du client</Text>                
                        <Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
                            {/* <Input 
                                right
                                placeholder="Nom"
                                style={{
                                    borderColor: theme.COLORS.SUCCESS,
                                    borderRadius: 4,
                                    backgroundColor: "#fff"
                                }}
                                help="Nom du client"
                                TopHelp
                                onChangeText={(input) =>this.setState({nom:input})}
                                placeholderTextColor="black"
                                iconContent={<Block />}
                            /> */}
                            <Autocomplete
                                autoCapitalize="none"
                                autoCorrect={false}
                                listContainerStyle={styles.listcontainer}
                                //containerStyle={styles.autocompleteContainer}
                                inputContainerStyle={styles.inputcontainerstyle}
                                hideResults={this.state.hide}
                                //data={clients.length === 1 && comp(query, clients[0].nom_client) ? [] : clients.nom_client}
                                data={clients.length === 1 && clients[0].nom_client==="client lamda"? []:clients}
                                defaultValue={nom!=="client lamda"? nom: null}
                                onChangeText={text => this.setState({ nom: text })}
                                placeholder="Nom du client"
                                placeholderTextColor="black"
                                renderItem={({ item, i }) => (
                                    <TouchableOpacity onPress={() =>{this.setState({ nom: item.nom_client, email:item.email,/* contact:item.contact ,*/ localisation:item.localisation, hide:true}), this.formatMillier(item.contact)}} 
                                        style={{
                                            height: 80,
                                            flex: 1,
                                            justifyContent: 'center',
                                            borderRadius: 8,
                                            borderBottomWidth:1,
                                            borderColor:"#2ECC71",
                                            backgroundColor: "#F5FCFF",
                                            paddingHorizontal: theme.SIZES.BASE/2,
                                        }}
                                    >
                                        <Text adjustsFontSizeToFit>{item.nom_client+':\t'+item.localisation+':\t'+item.contact+':\t'+item.email}</Text>
                                    </TouchableOpacity>
                                )}  
                            />
                        </Block>
                        <Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
                            <Input type='email-address'
                                right
                                placeholder="E-mail"
                                value={email!=="client@client.com"? email : null}
                                style={{
                                    borderColor: theme.COLORS.SUCCESS,
                                    borderRadius: 4,
                                    backgroundColor: "#fff"
                                }}
                                help="E-mail du client"
                                TopHelp
                                onChangeText={(input) =>this.setState({email:input})}
                                placeholderTextColor="black"
                                iconContent={<Block />}
                            />
                        </Block>
                        <Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
                            <Input type="numeric"
                                right
                                placeholder="contact"
                                value={this.state.numsep}
                                //maxLength={9}
                                style={{
                                    borderColor: theme.COLORS.SUCCESS,
                                    borderRadius: 4,
                                    backgroundColor: "#fff",
                                }}
                                help="contact du client"
                                TopHelp
                                onChangeText={(input) =>this.formatMillier(input)}
                                placeholderTextColor="black"
                                iconContent={<Block />}
                            />
                        </Block>
                        <Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
                            <Input 
                                right
                                placeholder="Localisation du client"
                                style={{
                                    borderColor: theme.COLORS.SUCCESS,
                                    borderRadius: 4,
                                    backgroundColor: "#fff",
                                }}
                                value={localisation!='client lamda'? localisation: null}
                                help="Localisation du client"
                                TopHelp
                                onChangeText={(input) =>this.setState({localisation:input})}
                                placeholderTextColor="black"
                                iconContent={<Block />}
                            />
                        </Block>
                    </Block>
                    <Block flex={1.25} right>
                        <Button center color="default" 
                            style={styles.optionsButtonr} 
                            onPress={() => this.envoyer() }>
                            ENVOYER
                            <ActivityIndicator
                                color="#00ff00"
                                size="large"
                                style = {styles.activityIndicator}
                                animating ={isLoading}
                            /> 
                        </Button>
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
    Info_card:{
        padding: theme.SIZES.BASE,
        marginHorizontal: theme.SIZES.BASE*1.1,
        marginTop: 20,
        borderTopLeftRadius: 6,
        borderTopRightRadius: 6,
        height:"auto",
        backgroundColor: theme.COLORS.WHITE,
        shadowColor: "black",
        shadowOffset: { width: 2, height: 4 },
        shadowRadius: 8,
        shadowOpacity: 100,
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
    autocompleteContainer: {
        marginLeft: 10,
        marginRight: 10,
    
    },
    inputcontainerstyle:{
        borderColor: theme.COLORS.SUCCESS,
        borderRadius: 4,
        backgroundColor: "#fff",
        paddingHorizontal: theme.SIZES.BASE,
        width:"100%",
    //marginLeft:

    },
    listcontainer:{
        borderRadius: 4,
        backgroundColor: "white",
        paddingHorizontal: theme.SIZES.BASE
    },
    itemText: {
        fontSize: 15,
        margin: 2
    },
    descriptionContainer: {
    // `backgroundColor` needs to be set otherwise the
    // autocomplete input will disappear on text input.
    backgroundColor: '#F5FCFF',
        marginTop: 8
    },
    infoText: {
        textAlign: 'center'
    },
    titleText: {
        fontSize: 18,
        fontWeight: '500',
        marginBottom: 10,
        marginTop: 10,
        textAlign: 'center'
    },
    directorText: {
        color: 'grey',
        fontSize: 12,
        marginBottom: 10,
        textAlign: 'center'
    },
    openingText: {
        textAlign: 'center'
    },
    activityIndicator: {
        height: 80,
        marginTop: height/5,
        marginRight:"80%"
    
    }
});
export default Info_client;