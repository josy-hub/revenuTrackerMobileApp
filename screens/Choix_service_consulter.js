import React from "react";
import {
  StyleSheet,
  Dimensions,
  ScrollView,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { Block, Text, theme } from "galio-framework";
import moment from 'moment';

import entreprise from "../services/Fetch";
import { Button} from "../components";
import argonTheme from "../constants/Theme";
import Plage from "./Plage_date_consulter";

const { width, height } = Dimensions.get("screen");

const placeholder1 = {
  label: 'tout',
  value: 'toutgrpe',
  color: '#9EA0A4',
};
/*const placeholderc = {
  label: 'tout',
  value: 'toutgrpe',
  color: '#9EA0A4',
};*/
const placeholder2 = {
  label: 'tout',
  value: 'toutentr',
  color: '#9EA0A4',
};
const placeholder3 = {
   label: 'tout',
  value: 'toutprod',
  color: 'black',
};
const placeholder4 = {
  label: 'tout',
  value: 'categorie',
  color: '#9EA0A4',
};
const placeholder5 = {
  label: 'cuvee',
  value: null,
  color: '#9EA0A4',
};
/* const placeholder6 = {
  label: 'type de fournisseur',
  value: null,
  color: '#9EA0A4',
};
const placeholder7 = {
  label: 'fournisseur',
  value: null,
  color: '#9EA0A4',
};
 */
let now = new Date();
let mindate = now - 549094194;
let mindatef = new Date(mindate);
class Choix_service_consulter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      groupes: [],
      entreprises: [],
      services: [],
      choixgrpe: "toutgrpe",
      service:[],
      choixentrpse: "toutentr",
      choixprdt: "toutprod",
      categorie:'categorie',
      choixcuvee:null,
      date: now,
      startDate:"null",
      endDate:"null",
      tabdate:[],
      categories:[],
      cuvees:[],
      etat:"good"
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

  async choixcategorie(value){
    this.setState({choixentrpse:value});
    let table=['KmerFood','Agripeel','Wecare SCI','Tropical', 'PEEX', 'Wecare Logistic', 'WecareFood'];
    const services = await entreprise.fetchProduits(value);
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
      this.setState({services:{
        label: "aucun produit/service",
        value: "aucun produit/service"}});
    }
  }

  async choixservice(value){
    
    this.setState({categorie:value});
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

   /* this.setState({choixentrpse:value})
    const services = await entreprise.fetchProduits(value);
    
    if(services.length>0){
      let produitsf = services.map(item => ({
        label: item.nom,
        value: item.nom
      }));
      this.setState({services:produitsf});
    }
    else{
      this.setState({services:{
        label: "aucun produit/service",
        value: "aucun produit/service"}});
      //Alert.alert("Desole, cette entreprise n'a pas de produits renseignes");
    }*/
  }

  choixcuvee(value){
    var test=0, cuvees=[], tabprod_id=[];
    this.setState({choixprdt:value});
    /* let cuvees= */this.state.services.map(item => (item.categorie==this.state.categorie && item.nom==value?
    cuvees.push({
      label: item.cuvee,
      value: item.cuvee
    }) && tabprod_id.push({id:item.id, categorie:item.categorie, nom:item.nom, cuvee:item.cuvee}): 
      test=0)); 
    this.setState({cuvees:cuvees});
    this.setState({tabprod_id});
    console.log(cuvees);
  }

  onRangeDateChange = (newRangeDate) => {
    console.log(newRangeDate.startDate);
    let bool = moment(newRangeDate.startDate).isSame(newRangeDate.endDate, 'year');
    if(bool) {
      this.setState({
        startDate:newRangeDate.startDate,
        endDate:newRangeDate.endDate,
        etat:"good"
      });
    }
    else{
      alert('Desole plage de date beaucoup trop grande. Il s\'agira du traitement d\'une grande quantite de donnees qui ralentira le systeme. Nous vous conseillons de decouper la plage sur l\'intervalle d\'une annee.');
      this.setState({
        etat:"bad"
      })
    }
    
  }
  onRangeDateChangeRapport = (newRangeDate) => { 
    let bool=moment(newRangeDate.startDate).isSame(newRangeDate.endDate, 'month');
    if(bool){
      this.setState({
        startDate:newRangeDate.startDate,
        endDate:newRangeDate.endDate,
        etat:"good"
      });
    } 
    else{
      alert("La plage de date doit etre sur la periode d'un mois pour generation des rapports");
      this.setState({
        etat:"bad"
      })
    }
    
  }

  envoyerConsulter() {

    if (
      this.state.choixgrpe === "toutgrpe" &&
      this.state.startDate !== "null"&&
      this.state.endDate !== "null" &&
      this.state.etat === "good"
    ) {
      this.props.navigation.navigate("ConsulterRevenus", {
        params: {
          "startDate":this.state.startDate,
          "endDate":this.state.endDate,
          "user_id":this.params.params.user_id,
          "user_type":this.params.params.user_type,
          "entreprise":"entreprise",
          "groupe":this.state.choixgrpe,
          "categorie":'categorie',
          "service_prdt":"service",
          "contact":this.params.params.contact,
          "cuvee":this.state.choixcuvee },
          "poste": this.params.params.poste,
      });
    }
    else if (
      this.state.choixgrpe !== "toutgrpe" &&
      this.state.choixentrpse === "toutentr" &&
      this.state.startDate !== "null"&&
      this.state.endDate !== "null" &&
      this.state.etat === "good"
    ) {
      this.props.navigation.navigate("ConsulterRevenus", {
        params: {
          "startDate":this.state.startDate,
          "endDate":this.state.endDate,
          "user_id":this.params.params.user_id,
          "user_type":this.params.params.user_type,
          "entreprise":this.state.choixentrpse,
          "groupe":this.state.choixgrpe,
          "categorie":'categorie',
          "service_prdt":"service",
          "contact":this.params.params.contact,
          "cuvee":this.state.choixcuvee,
          "poste": this.params.params.poste,
        },
      });
    } 
    else if (
      this.state.choixgrpe !== "toutgrpe" &&
      this.state.choixentrpse !== "toutentr" &&
      this.state.choixprdt === "toutprod"&&
      this.state.startDate !== "null" &&
      this.state.endDate !== "null" &&
      this.state.etat === "good"
    ) {
      this.props.navigation.navigate("ConsulterRevenus", {
        params: {
          "startDate":this.state.startDate,
          "endDate":this.state.endDate,
          "user_id":this.params.params.user_id,
          "user_type":this.params.params.user_type,
          "entreprise":this.state.choixentrpse,
          "groupe":this.state.choixgrpe,
          "categorie":this.state.categorie,
          "service_prdt":this.state.choixprdt,
          "contact":this.params.params.contact,
          "cuvee":this.state.choixcuvee,
          "poste": this.params.params.poste,
        },
      });
    } 
    else if (
      this.state.choixgrpe != "toutgrpe" &&
      this.state.choixentrpse != "toutentr" &&
      this.state.choixprdt != "aucun produit/service" &&
      this.state.choixprdt != "toutprod" && 
      this.state.startDate != "null" &&
      this.state.endDate != "null" &&
      this.state.etat === "good"
    ) {
      this.props.navigation.navigate("ConsulterRevenus", {
        params: {
          "startDate":this.state.startDate,
          "endDate":this.state.endDate,
          "user_id":this.params.params.user_id,
          "user_type":this.params.params.user_type,
          "entreprise":this.state.choixentrpse,
          "groupe":this.state.choixgrpe,
          "categorie":this.state.categorie,
          "service_prdt":this.state.choixprdt,
          "contact":this.params.params.contact,
          "cuvee":this.state.choixcuvee,
          "poste": this.params.params.poste,
        },
      });
    } 
    else {
      alert("Veuillez specifier vos choix avec une plage de date sur une periode d'un an max ou Renseignez tous les champs SVP");
    } 
  }
  envoyerRapport(){
   
    if (
      this.state.choixgrpe === "toutgrpe" &&
      this.state.startDate !="null"&&
      this.state.endDate !="null"&&
      this.state.etat=="good"
    ) {
      this.props.navigation.navigate("Rapports", {
        params: {"startDate":this.state.startDate, "endDate":this.state.endDate, "user_id":this.params.params.user_id,"user_type":this.params.params.user_type, "entreprise":"entreprise", "groupe":this.state.choixgrpe, "categorie":'categorie', "service_prdt":"service", "contact":this.params.params.contact },
      });
    } 
    else if (
      this.state.choixgrpe !== "toutgrpe" &&
      this.state.choixentrpse === "toutentr" &&
      this.state.startDate !== "null"&&
      this.state.endDate !== "null"&&
      this.state.etat === "good"
    ) {
      this.props.navigation.navigate("Rapports", {
        params: {"startDate":this.state.startDate, "endDate":this.state.endDate, "user_id":this.params.params.user_id,"user_type":this.params.params.user_type, "entreprise":this.state.choixentrpse, "groupe":this.state.choixgrpe, "categorie":'categorie', "service_prdt":"service", "contact":this.params.params.contact },
      });
    }
    else if (
      this.state.choixgrpe !== "toutgrpe" &&
      this.state.choixentrpse !== "toutentr" &&
      this.state.categorie === "categorie" &&
      this.state.startDate !== "null" &&
      this.state.endDate !== "null"&&
      this.state.etat === "good"
    ) {
      this.props.navigation.navigate("Rapports", {
        params: {"startDate":this.state.startDate, "endDate":this.state.endDate, "user_id":this.params.params.user_id,"user_type":this.params.params.user_type, "entreprise":this.state.choixentrpse, "groupe":this.state.choixgrpe, "service_prdt":this.state.choixprdt,"categorie":this.state.categorie, "contact":this.params.params.contact },
      });
    } 
    else if (
      this.state.choixgrpe !== "toutgrpe" &&
      this.state.choixentrpse !== "toutentr" &&
      this.state.categorie !== "categorie" &&
      this.state.startDate !== "null" &&
      this.state.endDate !== "null"&&
      this.state.etat === "good"
    ) {
      this.props.navigation.navigate("Rapports", {
        params: {"startDate":this.state.startDate, "endDate":this.state.endDate, "user_id":this.params.params.user_id,"user_type":this.params.params.user_type, "entreprise":this.state.choixentrpse, "groupe":this.state.choixgrpe, "service_prdt":this.state.choixprdt,"categorie":this.state.categorie, "contact":this.params.params.contact },
      });
    } 
    else {
      alert("Veuillez specifier vos choix avec une plage de date sur la periode d'un mois ou Renseignez tous les champs SVP");
    } 
  }

  render() {
    const { navigation, route } = this.props;
    const { params } = route.params; 
    console.log('cuveee', this.state.cuvees)
    return (
      <Block style={styles.choixservice_container}>
        <ScrollView>
          <Block style={{width:width}}>
            <Text h4
                
              style={{ 
                marginTop:50,
                marginHorizontal:20
              }}
                color={argonTheme.COLORS.DEFAULT}
            >
              Renseigner les champs
            </Text>
          </Block>
          { params.rapport === "non"?
            <Block>
              <Block space="between" style={styles.choix_card}>
                <Text>Choisir un groupe</Text>
                <Block card style={{ borderColor: theme.COLORS.SUCCESS}}>
                  <RNPickerSelect
                    style={{
                      //placeholder: {color: "black"},
                      inputIOS: { color: "black" },
                      inputAndroid: { color: "black" },
                    }}
                    placeholder={placeholder1}
                    onValueChange={(value) => this.choixentreprise(value)}
                    items={this.state.groupes}
                  />
                </Block>
                <Text style={{ marginTop: 20 }}>Choisir une entreprise</Text>
                <Block card style={{ marginBottom: 20, borderColor: theme.COLORS.SUCCESS}}>
                  <RNPickerSelect
                    style={{
                      //placeholder: {color: "black"},
                      inputIOS: { color: "black" },
                      inputAndroid: { color: "black" },
                    }}
                    placeholder={placeholder2}
                    onValueChange={(value) =>
                      //this.choixservice(value)
                      this.choixcategorie(value)
                    }
                    items={this.state.entreprises}
                  />
                </Block>
                {
                  (this.state.choixentrpse === 'KmerFood' || this.state.choixentrpse === 'Agripeel' || this.state.choixentrpse === 'WecareFood')?
                  <Block>
                    <Text>Choisir une categorie de produit</Text>
                    <Block card style={{marginBottom:20, borderColor: theme.COLORS.SUCCESS,}}>
                      <RNPickerSelect
                        style={{
                        // placeholder: {color: "black"},
                          inputIOS: { color: "black" },
                          inputAndroid: { color: "black" },
                        }}
                        placeholder={placeholder4}
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
                          placeholder={placeholder3}
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
                        onValueChange={(value) =>this.setState({choixcuvee:value}) }
                        items={this.state.cuvees}
                      />  
                    </Block>
                  </Block>:
                  ( this.state.choixentrpse === 'Wecare SCI' || this.state.choixentrpse === 'PEEX' || this.state.choixentrpse === 'Tropical' || this.state.choixentrpse === 'Wecare Logistic')?
                  <Block>
                    <Text >Choisir une categorie de produit</Text>
                    <Block card style={{marginBottom:20, borderColor: theme.COLORS.SUCCESS,}}>
                      <RNPickerSelect
                        style={{
                        // placeholder: {color: "black"},
                          inputIOS: { color: "black" },
                          inputAndroid: { color: "black" },
                        }}
                        placeholder={placeholder4}
                        value={this.state.choixcat}
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
                          placeholder={placeholder3}
                          value={this.state.choixprdt} 
                          onValueChange={(value) => this.setState({choixprdt:value}) }
                          items={this.state.service}
                        />  
                    </Block>
                  </Block>:
                  <Block>
                    <Text>Choisir un service</Text>
                    <Block card style={{ borderColor: theme.COLORS.SUCCESS }}>
                      <RNPickerSelect
                        style={{
                          //placeholder: {color: "black"},
                          inputIOS: { color: "black" },
                          inputAndroid: { color: "black" },
                        }}
                        placeholder={placeholder3}
                        onValueChange={(value) => this.setState({ choixprdt: value })}
                        items={this.state.service}
                        placeholderTextColor="black"
                      />
                    </Block>
                  </Block>
                }
                <Block
                  style={{ paddingHorizontal: theme.SIZES.BASE, marginTop: 20 }}
                >
                  <Plage onRangeDateChange={this.onRangeDateChange} />
                </Block>
              </Block>
              <Block flex={1.25} right>
              <Button
                center
                color="default"
                style={styles.optionsButton}
                onPress={() => {
                  this.envoyerConsulter();
                }}
              >
                SUIVANT
              </Button>
            </Block>
            </Block> 
          :
            <Block>
              <Block space="between" style={styles.choix_card}>
                <Text>Choisir un groupe</Text>
                <Block card style={{borderColor: theme.COLORS.SUCCESS,}}>
                  <RNPickerSelect
                    style={{
                      //placeholder: {color: "black"},
                      inputIOS: { color: "black" },
                      inputAndroid: { color: "black" },
                    }}
                    placeholder={placeholder1}
                    onValueChange={(value) => this.choixentreprise(value)}
                    items={this.state.groupes}
                  />
                </Block>
                <Text style={{ marginTop: 20 }}>Choisir une entreprise</Text>
                <Block card style={{marginBottom:20, borderColor: theme.COLORS.SUCCESS}}>
                  <RNPickerSelect
                    style={{
                      //placeholder: {color: "black"},
                      inputIOS: { color: "black" },
                      inputAndroid: { color: "black" },
                    }}
                    placeholder={placeholder2}
                    onValueChange={(value) =>
                      /* this.setState({choixentrpse:value}) */
                      this.choixcategorie(value)
                    }
                    items={this.state.entreprises}
                  />
                </Block>
                {( this.state.choixentrpse === 'Wecare SCI' ||
                  this.state.choixentrpse === 'PEEX' ||
                  this.state.choixentrpse === 'Tropical' ||
                  this.state.choixentrpse === 'KmerFood' ||
                  this.state.choixentrpse === 'WecareFood' ||
                  this.state.choixentrpse === 'Agripeel' ||
                  this.state.choixentrpse === 'Wecare Logistic'
                )?
                  <Block>
                    <Text>Choisir une categorie</Text>
                    <Block card style={{marginBottom:20, borderColor: theme.COLORS.SUCCESS,}}>
                      <RNPickerSelect
                        style={{
                          //placeholder: {color: "black"},
                          inputIOS: { color: "black" },
                          inputAndroid: { color: "black" },
                        }}
                        placeholder={placeholder4}
                        onValueChange={(value) => 
                          /* this.setState({ categorie: value }) */
                          this.choixservice(value)
                        }
                        items={this.state.categories}
                        placeholderTextColor="black"
                      />
                    </Block>
                    <Text>Choisir un service</Text>
                    <Block card style={{borderColor: theme.COLORS.SUCCESS,}}>
                      <RNPickerSelect
                        style={{
                          //placeholder: {color: "black"},
                          inputIOS: { color: "black" },
                          inputAndroid: { color: "black" },
                        }}
                        placeholder={placeholder3}
                        onValueChange={(value) => this.setState({ choixprdt: value })}
                        items={[{
                          label: "tout",
                          value: "toutprod"
                        }]}
                        placeholderTextColor="black"
                        disabled
                      />
                    </Block>
                  </Block>:
                  <Block>
                    <Text>Choisir un service</Text>
                    <Block card style={{borderColor: theme.COLORS.SUCCESS,}}>
                      <RNPickerSelect
                        style={{
                          //placeholder: {color: "black"},
                          inputIOS: { color: "black" },
                          inputAndroid: { color: "black" },
                        }}
                        placeholder={placeholder3}
                        onValueChange={(value) => this.setState({ choixprdt: value })}
                        items={[{
                          label: "tout",
                          value: "toutprod"
                        }]}
                        placeholderTextColor="black"
                        disabled
                      />
                    </Block>
                  </Block>
                }
                <Block
                  style={{ paddingHorizontal: theme.SIZES.BASE, marginTop: 20 }}
                >
                  <Plage onRangeDateChangeRapport={this.onRangeDateChangeRapport} Value={'rapport'} />
                </Block>
              </Block>
              <Block flex={1.25} right>
                <Button
                  center
                  color="default"
                  style={styles.optionsButton}
                  onPress={() => {
                    this.envoyerRapport();
                  }}
                >
                  SUIVANT
                </Button>
              </Block>
            </Block>
          }
        </ScrollView>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  choixservice_container: {
    flex: 1,
  },
  main_container: {
    width: width,
    height: height - 70,
  },
  choix_card: {
    padding: theme.SIZES.BASE * 2,
    marginHorizontal: theme.SIZES.BASE * 1.1,
    marginTop: 20,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: "black",
    shadowOffset: { width: 2, height: 4 },
    shadowRadius: 8,
    shadowOpacity: 100,
    height: "auto",
    
  },
  select: {
    //marginBottom: theme.SIZES.BASE,
    width: width - theme.SIZES.BASE * 2,
  },
  optionsButton: {
    width: "auto",
    height: 34,
    paddingHorizontal: theme.SIZES.BASE,
    paddingVertical: 10,
    backgroundColor: "orange",
    marginTop: 10,
    marginBottom: 10,
    marginRight:theme.SIZES.BASE*1.1
    //position:"absolute"
  },
  shadow: {
    shadowColor: "black",
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 4,
    shadowOpacity: 0.1,
    elevation: 2,
  },

  footer: {
    width: width,
    height: 70,
    backgroundColor: "green",
  },
});

export default Choix_service_consulter;
