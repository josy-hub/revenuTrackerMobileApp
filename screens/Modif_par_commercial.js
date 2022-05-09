import React from "react";
import {StyleSheet,Dimensions, ScrollView} from "react-native";
import { Block , Text,theme} from "galio-framework";
import RNPickerSelect from 'react-native-picker-select';
import moment from "moment";
import entreprise from "../services/Fetch";
import Day from '../services/Date';

import { Button, Select, Icon, Input, Header, Switch } from "../components";
import { argonTheme } from "../constants";


  const { width, height } = Dimensions.get("screen");
  const placeholder2 = {
    label: 'groupe',
    value: null,
    color: '#9EA0A4',
  };
  const placeholder3 = {
    label: 'entreprise',
    value: null,
    color: '#9EA0A4',
  };
  const placeholder4 = {
    label: 'commercial',
    value: null,
    color: '#9EA0A4',
  };
  const placeholder5 = {
    label: 'service/produit',
    value: null,
    color: '#9EA0A4',
  };

class Modif_par_commercial extends React.Component{
    constructor(props)
    {
        super(props);
        this.state = {
            date:"2016-05-15",
            entreprises:[],
            groupes:[],
            commerciaux:[],
            services:[],
            choixgrpe:'groupe',
            choixentrpse:'entreprise',
            choixprdt:'service/produit',
            choixcmrcl:'commercial',
            newDate:"aucune date choisie",
            prix_ref:0,
            ventes:[],
            vente:[],
            choixvente:'vente',
            users:[]
        };
        const { route } = this.props;
        this.params=route.params;
    }

    async componentDidMount() {
      
      const groupes = await entreprise.fetchGroupes(this.params.params.nom, this.params.params.contact);
      let groupes2=groupes.map((item) => item.nom);
      let groupesandou=[...new Set(groupes2)]
      let groupesf = groupesandou.map(item => ({
        label: item,
        value: item
      }));
        
      this.setState({groupes:groupesf});
    }
    
    async choixentreprise(value){
  
        this.setState({choixgrpe:value})
        const entreprises = await entreprise.fetchEntreprises(value);
        let entreprisesf = entreprises.map(item => ({
          label: item.raison_social,
          value: item.raison_social
        }));
        this.setState({entreprises:entreprisesf});
  
    }

    async choixservice(value){
      
      this.setState({choixentrpse:value})
      const services = await entreprise.fetchProduits(value);
      const commerciaux = await entreprise.fetchchoixcommercial(value);

      console.log(commerciaux['users']);
      let commerciaux2=commerciaux['users'].map((item) => item.nom);
      let commerciauxsandou=[...new Set(commerciaux2)]
      let commerciauxf=commerciauxsandou.map((item) =>({  label: item,value: item}));
      this.setState({ commerciaux: commerciauxf });
      this.setState({'users':commerciaux});
      console.log(commerciauxf);
      
      if(services.length>0){
        let produitsf = services.map(item => ({
          label: item.nom,
          value: item.nom
        }));
        let prix_ref=0;
        services.map(item=>(
          prix_ref=item.prix_de_reference
        ));
        this.setState({services:produitsf});
        this.setState({prix_ref:prix_ref});
        
      }
      else{
        this.setState({services:[{
          label: "aucun produit/service",
          value: "aucun produit/service"}]});
        //Alert.alert("Desole, cette entreprise n'a pas de produits renseignes");
      }
    }
  
    OnDateChange = (newDate) => {
      let convertedDate=moment(newDate).format("YYYY-MM-DD")
      this.setState({newDate:convertedDate});     
    }
    async ChoixVente(value){
      let tab=[], contact;
      this.setState({choixcmrcl:value})
      this.state.users.map((item)=>(item.nom==value?contact=item.contact:''));
      const ventes = await entreprise.fetchchoixvente(value, contact, this.state.choixentrpse, this.state.newDate);
      console.log(ventes);
      if(ventes['ventes'].length>0){
        ventes.ventes.map(item =>(tab.push({
        label: `Vente ${item.categorie!=null?item.categorie:item.nom_produit +item.categorie!=null?','+item.nom_produit:''+item.cuvee!=null?item.cuvee:''} du ${item.date_vente}`,
        value: `Vente ${item.categorie!=null?item.categorie:item.nom_produit +item.categorie!=null?','+item.nom_produit:''+item.cuvee!=null?item.cuvee:''} du ${item.date_vente}`
        })));
        this.setState({vente:tab});
        this.setState({ventes:ventes['ventes']});
      }
      else{
        this.setState({vente:[{
          label: "aucune vente de ce commercial",
          value: "aucune vente de ce commercial"}]});
        //Alert.alert("Desole, cette entreprise n'a pas de produits renseignes");
      }
      
    } 

    envoyer()
    {
      if( this.state.choixgrpe!='groupe' && 
          this.state.choixentrpse!='entreprise' && 
          this.state.choixvente!='vente' && 
          this.state.choixvente!="aucune vente de ce commercial" && 
          this.state.choixcmrcl!='commercial' && 
          this.state.newDate!="aucune date choisie"
      )
      {
        let rslt=this.state.choixvente.split(' ');
        let kind=0, tab=[], prix_ref=0;
        this.state.ventes.map((item)=>(item.categorie!=null && item.categorie==rslt[1] && item.nom_produit==rslt[3] && item.cuvee==rslt[4]? tab.push(item.type_de_vente ,item.groupe_de_vente_id, item.prix_de_reference): item.categorie==null? (kind='1' , prix_ref=item.prix_de_refence):''))
        this.props.navigation.navigate('RenseignerService',{
            params: {
              //"user_id":this.params.params.user_id,
              //"user_type":this.params.params.user_type,
              "choixgroupe":this.state.choixgrpe, 
              "choixentreprise":this.state.choixentrpse,
              "choixproduit":this.state.choixprdt,
              "choixcmrcl":this.state.choixcmrcl, 
              "date":this.state.newDate,
              "type":"modif",
              "modif":"commercial",
              "type_user":this.params.params.user_type,
              "reprise":"non",
              "prix_de_reference":kind==0?tab[2]:prix_ref,
              'groupe_vente':kind==0? tab[1]:null,
              'type_vente':kind==0? tab[0]:null
            }
        });
      }
      else
      {
        alert("Renseignez tous les champs SVP");
      }
    }

    render(){
        const { navigation } = this.props;

        return(
            <Block style={styles.global_container}>
                <ScrollView>
                    <Block
                        style={{ 
                            marginHorizontal:20,
                            marginTop:50,
                        
                        }}>
                        <Text  h4         
                            color={argonTheme.COLORS.DEFAULT}>
                            Renseigner les champs
                        </Text>
                    </Block>
                    <Block style={styles.modif_card}>
                        <Text style={{marginTop:10}}>Choisir un groupe</Text>
                        <Block card style={{borderColor: theme.COLORS.SUCCESS, paddingHorizontal: theme.SIZES.BASE}}>
                            <RNPickerSelect 
                                placeholder={placeholder2}
                                onValueChange={(value) => this.choixentreprise(value)}
                                items={this.state.groupes}
                            />   
                        </Block>
                        <Text style={{marginTop:10}}>Choisir une entreprise</Text>
                        <Block card style={{borderColor: theme.COLORS.SUCCESS, paddingHorizontal: theme.SIZES.BASE}}>
                            <RNPickerSelect
                              placeholder={placeholder3}
                              onValueChange={(value) =>
                                this.choixservice(value)
                              }
                              items={this.state.entreprises}
                            />  

                        </Block>
                        <Block middle style={{marginTop:10}}>
                          <Text>{this.state.newDate}</Text>
                        </Block>
                        <Day OnDateChange={this.OnDateChange}/>
                        <Text style={{marginTop:10}}>Choisir un commercial</Text>
                        <Block card style={{marginBottom:10,borderColor: theme.COLORS.SUCCESS, paddingHorizontal: theme.SIZES.BASE}}>
                            <RNPickerSelect
                                placeholder={placeholder4}
                                onValueChange={(value) =>
                                  this.ChoixVente(value)
                                  }
                                  items={this.state.commerciaux}
                            />  
                        </Block>
                        <Text>Choisir la vente du commercial</Text>
                        <Block card style={{marginBottom:10,borderColor: theme.COLORS.SUCCESS,paddingHorizontal: theme.SIZES.BASE}}>
                            <RNPickerSelect
                              placeholder={placeholder5}
                              onValueChange={(value) => this.setState({choixvente:value})}
                              items={this.state.vente}
                            />  
                        </Block>             
                    </Block>
                    <Block flex={1.25} right>
                        <Button center color="default" 
                            style={styles.optionsButton} 
                            onPress={()=>{this.envoyer()}}>
                            SUIVANT
                        </Button>
                    </Block>
                </ScrollView> 
            
            </Block>
        );
    }
}

const styles=StyleSheet.create({

    global_container:{
        flex:1,
        flexDirection:"row"
  
    },
    /*main_container:{
        width:width,
        height:height-70
    },*/
    modif_card:{
        padding: theme.SIZES.BASE*2,
        marginHorizontal: theme.SIZES.BASE*1.1,
        marginTop: 10,
        borderTopLeftRadius: 6,
        borderTopRightRadius: 6,
        backgroundColor: theme.COLORS.WHITE,
        shadowColor: "black",
        shadowOffset: { width: 2, height: 4 },
        shadowRadius: 8,
        shadowOpacity: 100,
        height:"auto"
    },
    optionsButton: {
        width: "auto",
        height: 34,
        paddingHorizontal: theme.SIZES.BASE,
        paddingVertical: 10,
        backgroundColor:"orange",
        marginTop:10,
        marginRight:theme.SIZES.BASE*1.1,
        marginBottom:10
      },
    /*footer:{
        width:width,
        height:70,
        backgroundColor:"green"
        }*/

})

export default Modif_par_commercial;