import React from "react";
import {StyleSheet, Dimensions, ScrollView, Alert, TouchableHighlightBase} from "react-native";
import {Block, Text, theme} from "galio-framework";
import RNPickerSelect from 'react-native-picker-select';

import {Button, Input} from "../components"
import moment from "moment";
import requete from "../services/Fetch";
import Day from '../services/Date';
import argonTheme from "../constants/Theme";

const { width, height } = Dimensions.get("screen");

const placeholder1 = {
  /*label: 'filtrer...',
  value: null,
  color: '#9EA0A4',*/
};
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
  label: 'service/produit',
  value: null,
  color: '#9EA0A4',
};
const placeholder5 = {
  label: 'cuvee',
  value: null,
  color: '#9EA0A4',
};
const placeholder6 = {
  label: 'reference',
  value: null,
  color: '#9EA0A4',
};
const placeholder7 = {
  label: 'categorie',
  value: null,
  color: '#9EA0A4',
};

class Modif_par_reference extends React.Component{
    
  constructor(props)
  {
    super(props);
    this.state = {
      entreprises:[],
      groupes:[],
      references:[],
      services:[],
      service:[],
      categories:[],
      ventes:[],
      cuvees:[],
      choixcat:null,
      choixcuvee:null,
      choixentrpse:'entreprise',
      choixprdt:'service/produit',
      choixref:"reference",
      choixgrpe:'groupe',
      prix_ref:0,
      type_vente:'individuelle',
      produit_id:'',
      tabprod_id:[]
    };
    const { route } = this.props;
    this.params=route.params;
  };

  async componentDidMount() {
    
    const groupes = await requete.fetchGroupes(this.params.params.nom, this.params.params.contact);
    let groupes2=groupes.map((item) => item.nom);
    let groupesandou=[...new Set(groupes2)]
    let groupesf = groupesandou.map(item => ({
      label: item,
      value: item
    }));
      
    this.setState({groupes:groupesf});
    const ventes = await requete.fetchindexventes();
    this.setState({ ventes: ventes['ventes'] });
  }
    
  async choixentreprise(value){

    this.setState({choixgrpe:value})
    const entreprises = await requete.fetchEntreprises(value);
    let entreprisesf = entreprises.map(item => ({
      label: item.raison_social,
      value: item.raison_social
    }));
    this.setState({entreprises:entreprisesf});

  }
  async choixcategorie(value){
    this.setState({choixentrpse:value});
    let table=['KmerFood','Agripeel','Wecare SCI','Tropical'];
    const services = await requete.fetchProduits(value);
    let test=0, cats=[];
    console.log('ssssssssssss', services);    
    if(services.length>0){
      if(table.includes(value)){
        this.setState({services:services})
        services.map((item) => item.categorie!==null?cats.push(item.categorie):test=1);
        let catsSandou=[...new Set(cats)] 
        console.log('catssssansdou',catsSandou);
        let categories=catsSandou.map(item => ({
          label: item,
          value: item
        }));
        console.log('cats', cats);
        let produit_prix=services.map(item=>({produit:item.nom, prix:item.prix_de_reference, categorie:item.categorie, cuvee:item.cuvee}));
        this.setState({produit_prix:produit_prix});
        this.setState({categories:categories});
      }
      else{
        let produitsf = services.map(item => ({
          label: item.nom,
          value: item.nom
        })); 
        this.setState({service:produitsf});
        let produit_prix=services.map(item=>({produit:item.nom, prix:item.prix_de_reference}));
        this.setState({produit_prix:produit_prix});
      }
    }
    else{
      this.setState({service:{
        label: "aucun produit/service",
        value: "aucun produit/service"
      }});
    }
  }

  async choixservice(value){
    this.setState({choixcat:value});
    var test=0; var prods=[];
      this.state.services.map(item => (item.categorie==value?
      prods.push(item.nom): 
      test=0)); 
      let prodsSandou=[...new Set(prods)] 
        console.log('proddssansdou',prodsSandou);
        let produitsf=prodsSandou.map(item => ({
          label: item,
          value: item
        }));
    this.setState({service:produitsf});
    console.log('ppppppprod',produitsf);
  }
  choixcuvee(value) {
    var test=0, cuvees=[], tabprod_id=[];
    this.setState({choixprdt:value});
    this.state.services.map(item => (item.categorie==this.state.choixcat && item.nom==value?
    cuvees.push({
      label: item.cuvee,
      value: item.cuvee
    }) && tabprod_id.push({id:item.id, categorie:item.categorie, nom:item.nom, cuvee:item.cuvee}): 
      test=0)); 
    this.setState({cuvees:cuvees});
    this.setState({tabprod_id});
    console.log(cuvees);
  }

  async reference(value){
    let table=['KmerFood','Agripeel','Wecare SCI','Tropical'];
    if(table.includes(this.state.choixentrpse)) {
      this.setState({choixcuvee:value});
      let references=[];
      const ventes = await requete.fetchreference(this.state.choixentrpse,this.state.choixprdt, value);  
      if(ventes.length>0) {
        ventes.map(item =>(item.categorie==this.state.choixcat && item.cuvee==value? references.push({
          label: `${item.reference} du ${item.date_vente}`,
          value: `${item.reference} du ${item.date_vente}`
        }) :null));
        let prix_ref=0;
        ventes.map(item=>(
          item.categorie==this.state.choixcat && item.cuvee==value?
          prix_ref=item.prix_de_reference:null
        ));
        this.setState({references:references});
        this.setState({prix_ref:prix_ref});
      }
      else{
        this.setState({references:[{
          label:"pas de reference", 
          value:"pas de reference"
        }]});
        Alert.alert("Desole ce produit/service n'a jamais ete vendu!!!");
      }
    }
    else {
      this.setState({ choixprdt: value });
      const ventes = await requete.fetchreference(this.state.choixentrpse,value);
      if(ventes.length>0){
        let references = ventes.map(item => ({
          label: `${item.reference} du ${item.date_vente}`,
          value: `${item.reference} du ${item.date_vente}`
        }));
        let prix_ref=0;
        ventes.map(item=>(
          prix_ref=item.prix_de_reference
        ));
        this.setState({references:references});
        this.setState({prix_ref:prix_ref});
      }
      else{
        this.setState({references:[{
          label:"pas de reference", 
          value:"pas de reference"
        }]});
        Alert.alert("Desole ce produit/service n'a jamais ete vendu!!!");
      }
    }
  }

  envoyer(){

    var date =new Date();
    var s = date.getSeconds();
    var m= date.getMinutes();
    var h= date.getHours();

    if( 
      this.state.choixgrpe!='groupe' && 
      this.state.choixentrpse!='entreprise' && 
      this.state.choixprdt!='service/produit' && 
      this.state.choixprdt!="aucun produit/service" && 
      this.state.choixref!="reference" &&
      this.state.choixref!="pas de reference" 
    )
    {
      this.props.navigation.navigate('RenseignerService',{
        params: {
          //"nom":this.params.params.nom,
          //"contact":this.params.params.contact, 
          "choixentreprise":this.state.choixentrpse,
          "choixproduit":this.state.choixprdt,
          "choixref":this.state.choixref, 
          "type":"modif",
          "modif":"ref",
          "type_user":this.params.params.user_type,
          "reprise":"non",
          "prix_de_reference":this.state.prix_ref,
          "type_vente":this.state.type_vente,
          "groupe_de_vente_id":this.state.type_vente=='groupee'?date+':'+h+':'+m+':'+s:null

        }
      });
    }
    else
    {
      Alert.alert("Renseignez tous les champs SVP");
    }

  }

  render(){
    const { navigation,route } = this.props;
    const {params}=route.params
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
              <Block style={styles.Reference_card}>
                  <Text>filtrer</Text>
                  <Block card style={{boderWeight:4, borderColor:"green"}}>   
                      <RNPickerSelect 
                        placeholder={placeholder1}
                        onValueChange={(value) =>{ 
                          if(value=='par reference de la vente'){
                            navigation.navigate("ModifParReference") 
                          }
                          if(value=='par commercial'){
                            navigation.navigate("ModifParCommercial",{
                              params: {"user_id":params.user_id,"nom":params.nom,"contact":params.contact, "user_type":params.user_type,"entreprise_id":params.entreprise_id}
                            }) 
                          }} 
                        }
                        items={[
                          { label: 'par reference de la vente', value: 'par reference de la vente'},
                          { label: 'par commercial', value: 'par commercial' },
                            
                        ]}
                      />
                  </Block>
                  <Block style={{marginTop:15, marginBottom:15}}> 
                      <Text>Choisir un groupe</Text>
                      <Block card style={{borderColor: theme.COLORS.SUCCESS, paddingHorizontal: theme.SIZES.BASE}}>
                        <RNPickerSelect
                          style={{
                            //placeholder: {color: "black"},
                            inputIOS: { color: "black" },
                            inputAndroid: { color: "black" },
                          }}
                          placeholder={placeholder2}
                          onValueChange={(value) =>
                            this.choixentreprise(value)
                          }
                          items={this.state.groupes}
                        />  
                      </Block>
                  </Block>
                  <Block style={{marginTop:15, marginBottom:15}}> 
                    <Text>Choisir une entreprise</Text>
                    <Block card style={{borderColor: theme.COLORS.SUCCESS, paddingHorizontal: theme.SIZES.BASE}}>
                      <RNPickerSelect
                        style={{
                          //placeholder: {color: "black"},
                          inputIOS: { color: "black" },
                          inputAndroid: { color: "black" },
                        }}
                        placeholder={placeholder3}
                        onValueChange={(value) =>
                          this.choixcategorie(value)
                        }
                        items={this.state.entreprises}
                      />  
                    </Block>
                  </Block>
                  {
            (this.state.choixentrpse=='KmerFood'||this.state.choixentrpse=='Agripeel'||this.state.choixentrpse=='Wecare SCI' || typeof backparams!=='undefined'&& backparams.choixentrpse=="KmerFood"||typeof backparams!=='undefined'&& backparams.choixentrpse=="Wecare SCI" ||typeof backparams!=='undefined'&& backparams.choixentrpse=="Tropical" || typeof backparams!=='undefined'&& backparams.choixentrpse=="Agripeel")?
            <Block>
              <Text /* style={{marginTop:20}} */>Choisir une categorie de produit</Text>
              <Block card style={{marginBottom:20, borderColor: theme.COLORS.SUCCESS,}}>
                <RNPickerSelect
                  style={{
                  // placeholder: {color: "black"},
                    inputIOS: { color: "black" },
                    inputAndroid: { color: "black" },
                  }}
                  placeholder={placeholder7}
                  value={typeof backparams!=='undefined'&& this.state.choixcat==null? backparams.categorie: this.state.choixcat}
                  onValueChange={(value) => this.choixservice(value)}
                  items={this.state.categories}
                /> 
              </Block>
              <Text>Choisir un service/produit</Text>
              <Block card style={{marginBottom:20,borderColor: theme.COLORS.SUCCESS,}}>
                  <RNPickerSelect
                    style={{
                      //placeholder: {color: "black"},
                      inputIOS: { color: "black" },
                      inputAndroid: { color: "black" },
                    }}
                    placeholder={placeholder4}
                    value={this.state.choixprdt} 
                    onValueChange={(value) =>this.choixcuvee(value) }
                    items={this.state.service}
                  />  
              </Block>
              <Text>Choisir une cuvee/batch</Text>
              <Block card style={{marginBottom:20, borderColor: theme.COLORS.SUCCESS,}}>
                <RNPickerSelect
                  style={{
                    //placeholder: {color: "black"},
                    inputIOS: { color: "black" },
                    inputAndroid: { color: "black" },
                  }}
                  placeholder={placeholder5}
                  value={this.state.choixcuvee} 
                  onValueChange={(value) =>this.reference(value) }
                  items={this.state.cuvees}
                />  
              </Block>
              </Block>
              :                
              <Block>
              <Text>Choisir un service</Text>
              <Block card style={{marginBottom:15,borderColor: theme.COLORS.SUCCESS,paddingHorizontal: theme.SIZES.BASE}}>
                <RNPickerSelect
                  style={{
                    //placeholder: {color: "black"},
                    inputIOS: { color: "black" },
                    inputAndroid: { color: "black" },
                  }}
                  placeholder={placeholder4}
                  onValueChange={(value) => this.reference(value)}
                  items={this.state.services}
                />  
              </Block>
              </Block>
              }
              <Text>Reference de la vente</Text>
              <Block card style={{ paddingHorizontal: theme.SIZES.BASE, borderColor: theme.COLORS.SUCCESS }}>
              {
                <RNPickerSelect
                  style={{
                    //placeholder: {color: "black"},
                    inputIOS: { color: "black" },
                    inputAndroid: { color: "black" },
                  }}
                  placeholder={placeholder6}
                  onValueChange={(value) => this.setState({ choixref: value })}
                  items={this.state.references}
                /> 
                  
              }
              </Block>   
              </Block>
              <Block flex={1.25} right>
                <Button center color="default" 
                  style={styles.optionsButton} 
                  onPress={() =>this.envoyer()}>
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
  Reference_card:{
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
    height:"auto"
  },
  optionsButton: {
    width: 99,
    height: 40,
    paddingHorizontal: theme.SIZES.BASE,
    paddingVertical: 10,
    marginRight:theme.SIZES.BASE*1.1,
    marginTop:10,
    marginBottom:10,
    backgroundColor:"orange"
  },
  /* footer:{
    width:width,
    height:70,
    backgroundColor:"green"
  }*/
})

export default Modif_par_reference;