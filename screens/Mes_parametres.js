import React from "react";
import {ScrollView, StyleSheet, Dimensions, Alert} from "react-native";
import {Block, Text,theme} from "galio-framework";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { argonTheme, tabs } from "../constants";
import {Button, Input} from "../components"


const {width, height}= Dimensions.get("screen");


class Mes_parametres extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
          oldemail:'',
          emailcompare: null,
          newemail: null,
          oldpass:'',
          passcompare: null,
          newpass: null,
          confirmpass: null,
          entreprise_id:'',
          type:'',
          photo:'',
          poste:'',
          username:'',
          equipe_id:'',
          nom:'',
          user_id:''


        
        }
    }
    async componentDidMount() {

        try{
            const notifications = await AsyncStorage.getItem('notifications');
            const value=JSON.parse(notifications);
            console.log('localstorage', value)
            if(value !== null){
             this.setState({
                entreprise_id:value.entreprise_id,
                equipe_id:value.equipe_id,
                nom:value.nom,
                username:value.username,
                poste:value.poste,
                contact:value.contact,
                type:value.type,
                photo:value.photo,
                oldemail:value.email,
                oldpass:value.pass,
                user_id:value.user_id
             });
            }
        } catch(e){
             //Alert.alert("Erreur: les donnees sauvegardees n'ont pas pu etre recuperees");
        }
    }
    envoyer(update){
       
        console.log(this.state.newemail);
        console.log(this.state.oldemail);
        console.log(this.state.emailcompare);
        
        if(this.state.newemail !== null && this.state.emailcompare === this.state.oldemail && update === 1){
           console.log("bonjour", this.state.user_id)
            let someData={
                "entreprise_id": this.state.entreprise_id,
                "equipe_id":this.state.equipe_id,
                "nom": this.state.nom,
                "username":this.state.username,
                "poste":this.state.poste,
                "contact": this.state.contact,
                "email": this.state.newemail,
                "type":this.state.type,
                "password":this.state.oldpass,
                "photo":this.state.photo
            }
            let url=`https://tracking.socecepme.com/api/update/${this.state.user_id}/1`

            /* var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

            var urlencoded = new URLSearchParams();
            urlencoded.append("email", this.state.newemail)
            urlencoded.append("entreprise_id", this.state.entreprise_id)
            urlencoded.append("equipe_id", this.state.equipe_id)
            urlencoded.append("nom", this.state.nom)
            urlencoded.append("username", this.state.username)
            urlencoded.append("poste", this.state.poste)
            urlencoded.append("type", this.state.type)
            urlencoded.append("password", this.state.oldpass)
            urlencoded.append("photo", this.state.photo)
            urlencoded.append("contact", this.state.contact); */

            /* var requestOptions = {
                method: 'PUT',
                headers: myHeaders,
                body: urlencoded,
                redirect: 'follow'
            }; */
            const putMethod = {
                method: 'PUT', 
                headers: {
                 'Content-type': 'application/json; charset=UTF-8' 
                },
                body: JSON.stringify(someData) 
            }
               
            fetch(url, putMethod)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                Alert.alert("Email modifie avec succes");
                this.setState({
                    newemail: null,
                    emailcompare: null
                })
            }) 
            .catch(error => alert("erreur sur le serveur: votre modification n'a pas ete prise en compte")); 
       
        }
        else if(this.state.newpass!='none' && this.state.confirmpass===this.state.newpass && update==2){
            
            let URL='https://tracking.socecepme.com/api/login';
            
            let collection={
                username:this.state.username,
                password:this.state.passcompare
            }
            
            console.log(collection);

            var myHeaders = new Headers();
            myHeaders.append("Accept", "application/json");
            myHeaders.append("Content-Type", "application/json");
    
            var raw = JSON.stringify(collection);
    
            var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
            };
    
            fetch(URL, requestOptions)
              .then(response => response.text())
              .then(result => { 
                var rslt = JSON.parse(result);
                console.log(rslt);
                console.log(rslt['user'].contact);
               
                if(rslt["status"]=="ok"){

                    let someData={
                        "entreprise_id": this.state.entreprise_id,
                        "equipe_id":this.state.equipe_id,
                        "nom": this.state.nom,
                        "username":this.state.username,
                        "poste":this.state.poste,
                        "contact": this.state.contact,
                        "email": this.state.oldemail,
                        "type":this.state.type,
                        "password":this.state.newpass,
                        "photo":this.state.photo
                    }
                    let url=`https://tracking.socecepme.com/api/update/${this.state.user_id}/2`
                    const putMethod = {
                        method: 'PUT', 
                        headers: {
                            'Content-type': 'application/json; charset=UTF-8' 
                        },
                        body: JSON.stringify(someData) 
                    }
                    
                    fetch(url, putMethod)
                    .then(response => response.json())
                    .then(data => {
                        console.log(data);
                        Alert.alert("mot de passe modifie avec succes");
                        //this.props.navigation.navigate('Home');
                        this.setState({
                            newpass: null,
                            passcompare: null,
                            confirmpass: null
                        })
                    }) 
                    .catch(error => alert("erreur sur le serveur: votre modification n'a pas ete prise en compte")); 

                }
                else{
                    alert("Mot de passe incorrect");
                }
                })
                .catch(error => alert("erreur sur le serveur: votre page n'a pas pu etre chargee correctement"));
        }
        else{
            Alert.alert("Champ(s) vide(s) ou valeurs entrees pas correctes");
        }
    
    }
    render(){
        const {navigation}=this.props
        return(
            <Block style={styles.globale_container}>
                <ScrollView>
                    <Block style={[styles.parametres_card,{marginaBottom:10}]}>
                        <Text  h4 
                            style={{
                                justifyContent:"center",
                                alignItems:"center", 
                                marginBottom: 20
                            }}
                            color={argonTheme.COLORS.DEFAULT}
                        >
                            Changer votre email
                        </Text>
                        <Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
                            <Text>Adresse actuelle</Text>
                            <Input type='email-address'
                                right
                                placeholder="Adresse actuelle"
                                style={{
                                    borderColor: theme.COLORS.SUCCESS,
                                    borderRadius: 4,
                                    backgroundColor: "#fff",
                                    marginBottom: 10
                                }}
                                value={this.state.emailcompare}
                                onChangeText={(input) =>this.setState({emailcompare:input})}
                                placeholderTextColor="black"
                                iconContent={<Block />}
                            />
                        </Block>
                        <Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
                            <Text>Nouvelle adresse</Text>
                            <Input type='email-address'
                                right
                                placeholder="Nouvelle adresse"
                                style={{
                                    borderColor: theme.COLORS.SUCCESS,
                                    borderRadius: 4,
                                    backgroundColor: "#fff",
                                    marginBottom: 10
                                }}
                                value={this.state.newemail}
                                onChangeText={(input) =>this.setState({newemail:input})}
                                placeholderTextColor="black"
                                iconContent={<Block />}
                            />
                        </Block>
                        <Block flex={1.25} right>
                            <Button center color="default" 
                            style={styles.optionsButton} 
                            onPress={() => this.envoyer(1)}>
                            ENVOYER
                            </Button>
                        
                        </Block>   
                    </Block>
                    <Block style={styles.parametres_card}>
                    <Text  h4 
                            style={{
                                justifyContent: "center",
                                alignItems: "center", 
                                marginBottom: 20
                            }}
                            color={argonTheme.COLORS.DEFAULT}
                        >
                            Changer votre mot de passe
                        </Text>
                        <Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
                            <Text>Mot de passe actuel</Text>
                            <Input
                                right
                                onChangeText={(input) =>this.setState({passcompare:input})}
                                password
                                viewPass
                                placeholder="Mot de passe actuel"
                                style={{
                                    borderColor: theme.COLORS.SUCCESS,
                                    borderRadius: 4,
                                    backgroundColor: "#fff",
                                    marginBottom: 20
                                }}
                                value={this.state.passcompare}
                                placeholderTextColor="black"
                                iconContent={<Block />}
                            />
                        </Block>
                        <Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
                            <Text>Nouveau mot de passe</Text>
                            <Input
                                right
                                onChangeText={(input) =>this.setState({newpass:input})}
                                password
                                viewPass
                                placeholder="Nouveau mot de passe"
                                style={{
                                    borderColor: theme.COLORS.SUCCESS,
                                    borderRadius: 4,
                                    backgroundColor: "#fff",
                                    marginBottom: 20
                                }}
                                value = {this.state.newpass}
                                placeholderTextColor="black"
                                iconContent={<Block />}
                            />
                            <Text>confirmer le mot de passe</Text>  
                            <Input
                                right
                                onChangeText={(input) =>this.setState({confirmpass:input})}
                                password
                                viewPass
                                placeholder="Confirmer le mot de passe"
                                value = {this.state.confirmpass}
                                style={{
                                    borderColor: theme.COLORS.SUCCESS,
                                    borderRadius: 4,
                                    backgroundColor: "#fff",
                                    marginBottom: 20
                                }}
                                placeholderTextColor="black"
                                iconContent={<Block />}
                            />  
                        </Block>
                        <Block flex={1.25} right>
                            <Button center color="default" 
                            style={styles.optionsButton} 
                            onPress={() => this.envoyer(2)}>
                            ENVOYER
                            </Button>
                        </Block>   
                    </Block>
                    <Block style={styles.footer}></Block>
                </ScrollView>
            </Block>

        );
    }
}

const styles=StyleSheet.create({
    globale_container:{
        flex:1,
        flexDirection:"row"

    },
    main_container:{
        width:width,
        height:height
    },
    parametres_card:{
        padding: theme.SIZES.BASE*2,
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
    optionsButton: {
        width: "auto",
        height: 34,
        paddingHorizontal: theme.SIZES.BASE,
        paddingVertical: 10,
        backgroundColor:"orange",
        marginTop:30
      },
    footer:{
        width:width,
        height:50,
        backgroundColor:'#2ECC71',
        marginTop:20

    }
})

export default Mes_parametres;