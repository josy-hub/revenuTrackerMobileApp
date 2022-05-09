import React from "react";
import {
  StyleSheet,
  Dimensions,
  ScrollView,
  Platform,
} from "react-native";
import { Block, Text, theme} from "galio-framework";
import requete from "../services/Fetch";
import RNPickerSelect from "react-native-picker-select";

import { Button, Input } from "../components";
import {argonTheme } from "../constants";
import { HeaderHeight } from "../constants/utils";
import Plage from "./Plage_date_consulter";

const { width, height } = Dimensions.get("screen");

const thumbMeasure = (width - 48 - 32) / 3;
const placeholder0 = {
    /*label: 'filtrer...',
    value: null,
    color: '#9EA0A4',*/
};
const placeholder = {
    label: 'groupe',
    value: null,
    color: '#9EA0A4',
  };
  const placeholder1 = {
    label: 'entreprise',
    value: null,
    color: '#9EA0A4',
  };
  const placeholder2 = {
    label: 'produit',
    value: null,
    color: '#9EA0A4',
  };

class RenseignerObjectifs extends React.Component {
  constructor(props) {
    super(props);
    const { route } = this.props;
    const {type}=route.params;
    this.state = {
      groupes:[],
      entreprises:[],
      produits:[],
      choixgrpe:null,
      choixentrprse:null,
      choixprdt:null,
      montantg:null,
      montanth:null,
      montante:null,
      montantp:null,
      groups:[],
      prods:[],
      startDate:null,
      endDate:null


    };
  }
  async componentDidMount(){
    const { route } = this.props;
    const {params}  = route.params;
    const groupes = await requete.fetchGroupes(params.nom, params.contact);
    let groupes2=groupes.map((item) => item.nom);
    let groupesandou=[...new Set(groupes2)]
    let groupesf = groupesandou.map(item => ({
      label: item,
      value: item
    }));
    let entreprisesf = groupes.map(item => ({
      label: item.raison_social,
      value: item.raison_social
    }));
    const produits= await requete.rechproduits();
    let produitsf=produits.map(item => (item.cuvee!=null?
        {
            label: item.nom+'_'+item.raison_social+'_'+item.cuvee,
            value: item.nom+'_'+item.raison_social+'_'+item.cuvee
        }:
        {
            label: item.nom+'_'+item.raison_social,
            value: item.nom+'_'+item.raison_social
        }
    ));
    this.setState({produits:produitsf, prods:produits});
    this.setState({entreprises:entreprisesf});     
    this.setState({groupes:groupesf, groups:groupes});
  }
  onRangeDateChange = (newRangeDate) => {
    console.log(newRangeDate.startDate);
    this.setState({startDate:newRangeDate.startDate});
    this.setState({endDate:newRangeDate.endDate});
    
  }
  
  envoyer(value){
    const URL='http://tracking.socecepme.com/api/objectifs_groupes';
    const URL1='http://tracking.socecepme.com/api/objectifs_entreprises';
    const URL2='http://tracking.socecepme.com/api/objectifs_produits';
    const URL3='http://tracking.socecepme.com/api/objectifs_holdings';
    const data = new FormData();
    let groupe_id=0, entreprise_id=0, produit_id=0;
    if(value=='groupe'&& this.state.choixgrpe!=null && this.state.montantg!=null && this.state.startDate!=null && this.state.endDate!=null){
        this.state.groups.map(item=>(item.nom==this.state.choixgrpe?groupe_id=item.groupe_id:null));
        data.append("libelle", this.state.montantg);
        data.append("debut", this.state.startDate);
        data.append("fin", this.state.endDate);
        data.append("groupe_id", groupe_id);
        fetch(URL, {  
            method: 'POST',
            body: data
        }).then(response => response.text())
        .then(result => {
            alert("Objectif enregistre avec succes")
            console.log(result);
            this.setState({
                montantg:null,
                startDate:null,
                endDate:null
            })
        })
        .catch(error => console.log(error));  
    }
    else if(value=='entreprise' && this.state.choixentrprse!=null && this.state.montante!=null && this.state.startDate!=null && this.state.endDate!=null){
        this.state.groups.map(item=>(item.raison_social==this.state.choixentrprse?entreprise_id=item.id:null));
        data.append("libelle", this.state.montante);
        data.append("debut", this.state.startDate);
        data.append("fin", this.state.endDate);
        data.append("entreprise_id", entreprise_id);
        fetch(URL1, {  
            method: 'POST',
            body: data
        }).then(response => response.text())
        .then(result => {
            alert("Objectif enregistre avec succes")
            console.log(result);
            this.setState({
                montante:null,
                startDate:null,
                endDate:null
            })
        })
        .catch(error => console.log(error));  
    }
    else if(value=='produit' && this.state.choixprdt!=null && this.state.montantp!=null && this.state.startDate!=null && this.state.endDate!=null){
        let rslt=this.state.choixprdt.split('_');
        console.log(rslt);
        this.state.prods.map(item=>(item.cuvee!=null && item.nom==rslt[0] && item.raison_social==rslt[1] && item.cuvee==rslt[2]? produit_id=item.id:item.cuvee==null && item.nom==rslt[0] && item.raison_social==rslt[1]? produit_id=item.id:null));
        data.append("libelle", this.state.montantp);
        data.append("debut", this.state.startDate);
        data.append("fin", this.state.endDate);
        data.append("produit_service_id", produit_id);
        fetch(URL2, {  
            method: 'POST',
            body: data
        }).then(response => response.text())
        .then(result => {
            alert("Objectif enregistre avec succes")
            console.log(result);
            this.setState({
                montantp:null,
                startDate:null,
                endDate:null
            })
        })
        .catch(error => console.log(error)); 
        console.log(produit_id,this.state.montantp,this.state.startDate, this.state.endDate ) ;
    } 
    else if(value=='holding' && this.state.montanth!=null && this.state.startDate!=null && this.state.endDate!=null){
        data.append("libelle", this.state.montanth);
        data.append("debut", this.state.startDate);
        data.append("fin", this.state.endDate);
        fetch(URL3, {  
            method: 'POST',
            body: data
        }).then(response => response.text())
        .then(result => {
            alert("Objectif enregistre avec succes")
            console.log(result);
            this.setState({
                montanth:null,
                startDate:null,
                endDate:null
            })
        })
        .catch(error => console.log(error));  
    }
    else{
        alert("Vous n'avez pas renseigne d'objectifs");
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
  
  render() {
    const { navigation, route } = this.props;
    const params  = route.params;
    console.log(params);
    return (
        

    <Block style={styles.global_container}>
    <ScrollView>                
    <Block 
        style={{ 
            marginHorizontal:10,
            marginTop:20, 
            marginBottom:20     
        }}>
        <Text  h5
            color={argonTheme.COLORS.DEFAULT}>
            Objectifs/prix de reference
        </Text>
    </Block>
    <Block style={styles.Reference_card}>
        <Text style={{marginHorizontal:theme.SIZES.BASE*1.1/3}}>filtrer</Text>
        <Block card style={{boderWeight:4, borderColor:"green", marginHorizontal:theme.SIZES.BASE*1.1/3}}>   
            <RNPickerSelect 
                placeholder={placeholder0}
                onValueChange={(value) =>{ 
                    if(value=='Renseigner les objectifs'){
                        navigation.navigate("RenseignerObjectifs") 
                    }
                    if(value=='Renseigner le prix de reference'){ 
                    }} 
                }
                items={[
                    { label: 'Renseigner les objectifs', value: 'Renseigner les objectifs'},
                    { label: 'Renseigner le prix de reference', value: 'Renseigner le prix de reference' },
                    
                ]}
            />
        </Block>
        <Block card style={[styles.card,{marginTop:40}]}>
            <Text style={{fontSize:18, alignItems:"center",justifyContent:'center', fontWeight:"bold"}} color={theme.COLORS.ICON}>
                Holding {'\n'}       
            </Text>
            <Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
            <Input 
                keyboardType="numeric"
                right
                placeholder="entrer le montant de l'objectif"
                style={{
                    borderColor: theme.COLORS.SUCCESS,
                    borderRadius: 4,
                    backgroundColor: "#fff",
                    marginBottom:10,
                    width:"110%"
                }}
                help="Montant de l'objectif"
                TopHelp
                value={this.state.montanth}
                onChangeText={(input) =>this.setState({montanth:input})}
                placeholderTextColor="black"
                iconContent={<Block />}
            />
        </Block>
        <Plage onRangeDateChange={this.onRangeDateChange} Value={'objectifs'}/>
        <Block style={{flexDirection:"row", justifyContent:"space-between", marginTop:10}}>
            <Button right 
                style={styles.optionsButton} 
                onPress={() => this.envoyer('holding')}>
                envoyer
            </Button>
        </Block>
    </Block>
    <Block card style={[styles.card,{marginTop:40}]}>
            <Text style={{fontSize:18, alignItems:"center",justifyContent:'center', fontWeight:"bold"}} color={theme.COLORS.ICON}>
                Groupe{'\n'}       
            </Text>
            <Block>
                <Text style={{marginTop:10}}>Choisir un groupe</Text>
                <Block card style={{borderColor: theme.COLORS.SUCCESS, paddingHorizontal: theme.SIZES.BASE,backgroundColor: "#fff"}}>
                    <RNPickerSelect
                        style={{
                            inputIOS: { color: "black" },
                            inputAndroid: { color: "black" },
                            marginBottom:10
                        }} 
                        placeholder={placeholder}
                        onValueChange={(value) => this.setState({choixgrpe:value})}
                        items={this.state.groupes}
                    />   
                </Block>
            </Block>
            <Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
            <Input 
                keyboardType="numeric"
                right
                placeholder="entrer le montant de l'objectif"
                style={{
                    borderColor: theme.COLORS.SUCCESS,
                    borderRadius: 4,
                    backgroundColor: "#fff",
                    marginBottom:10,
                    width:"110%"
                }}
                help="Montant de l'objectif"
                TopHelp
                value={this.state.montantg}
                onChangeText={(input) =>this.setState({montantg:input})}
                placeholderTextColor="black"
                iconContent={<Block />}
            />
        </Block>
        <Plage onRangeDateChange={this.onRangeDateChange} Value={'objectifs'}/>
        <Block style={{flexDirection:"row", justifyContent:"space-between", marginTop:10}}>
            <Button right 
                style={styles.optionsButton} 
                onPress={() => this.envoyer('groupe')}>
                envoyer
            </Button>
        </Block>
    </Block>
    <Block card style={[styles.card,{marginTop:40}]}>
            <Text style={{fontSize:18, alignItems:"center",justifyContent:'center', fontWeight:"bold"}} color={theme.COLORS.ICON}>
                Entreprise{'\n'}       
            </Text>
            <Block>
                <Text style={{marginTop:10}}>Choisir une entreprise</Text>
                <Block card style={{borderColor: theme.COLORS.SUCCESS, paddingHorizontal: theme.SIZES.BASE,backgroundColor: "#fff"}}>
                    <RNPickerSelect 
                        style={{
                            inputIOS: { color: "black" },
                            inputAndroid: { color: "black" },
                            marginBottom:10
                        }}
                        placeholder={placeholder1}
                        onValueChange={(value) => this.setState({choixentrprse:value})}
                        items={this.state.entreprises}
                    />   
                </Block>
            </Block>
            <Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
            <Input //type="numeric"
                keyboardType="numeric"
                right
                placeholder="entrer le montant de l'objectif"
                style={{
                    borderColor: theme.COLORS.SUCCESS,
                    borderRadius: 4,
                    backgroundColor: "#fff",
                    marginBottom:10,
                    width:"110%"
                }}
                help="Montant de l'objectif"
                TopHelp
                value={this.state.montante}
                onChangeText={(input) =>this.setState({montante:input})}
                placeholderTextColor="black"
                iconContent={<Block />}
            />
        </Block>
        <Plage onRangeDateChange={this.onRangeDateChange} Value={'objectifs'}/>
        <Block style={{flexDirection:"row", justifyContent:"space-between", marginTop:10}}>
            <Button right 
                style={styles.optionsButton} 
                onPress={() => this.envoyer('entreprise')}>
                envoyer
            </Button>
        </Block>
    </Block>
    <Block card style={[styles.card,{marginTop:40, marginBottom:20}]}>
            <Text style={{fontSize:18, alignItems:"center",justifyContent:'center', fontWeight:"bold"}} color={theme.COLORS.ICON}>
                Produit{'\n'}       
            </Text>
            <Block>
                <Text style={{marginTop:10}}>Choisir un produit</Text>
                <Block card style={{borderColor: theme.COLORS.SUCCESS, paddingHorizontal: theme.SIZES.BASE,backgroundColor: "#fff"}}>
                    <RNPickerSelect 
                        style={{
                            inputIOS: { color: "black" },
                            inputAndroid: { color: "black" },
                            marginBottom:10,
                            
                        }}
                        placeholder={placeholder2}
                        onValueChange={(value) => this.setState({choixprdt:value})}
                        items={this.state.produits}
                    />   
                </Block>
            </Block>
            <Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
            <Input
                keyboardType="numeric"
                right
                placeholder="entrer le montant de l'objectif"
                style={{
                    borderColor: theme.COLORS.SUCCESS,
                    borderRadius: 4,
                    backgroundColor: "#fff",
                    marginBottom:10,
                    width:"110%",
                }}
                help="Montant de l'objectif"
                TopHelp
                value={this.state.montantp}
                onChangeText={(input) =>this.setState({montantp:input})}
                placeholderTextColor="black"
                iconContent={<Block />}
            />
        </Block>
        <Plage onRangeDateChange={this.onRangeDateChange} Value={'objectifs'}/>
        <Block style={{flexDirection:"row", justifyContent:"space-between", marginTop:10}}>
            <Button right 
                style={styles.optionsButton} 
                onPress={() => this.envoyer('produit')}>
                envoyer
            </Button>
        </Block>
    </Block>
    </Block>
    </ScrollView>
    </Block>

             
       
    );
  }
}
const styles = StyleSheet.create({
    home: {
      marginTop: Platform.OS === "android" ? -HeaderHeight : 0,
      flex: 1,
    },
    main_container: {
      width: width,
      height: height - 70,
    },
    homeContainer: {
      flex:1
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
    profileCard: {
        //position: "relative",
        padding: theme.SIZES.BASE/2 ,
        marginHorizontal: theme.SIZES.BASE * 1.1,
        marginTop: 10,
        //width: width*0.9,
        height:"auto",//this.state.type==7||this.state.type==6?height*0.6:height*0.4,
        marginBottom:10,
        //marginVertical: height * 0.1,//theme.SIZES.BASE * 1.1,
        borderRadius: 6,
        //borderTopRightRadius: 6,
        backgroundColor: theme.COLORS.WHITE,
        shadowColor: "black",
        shadowOffset: { width: 2, height: 4 },
        shadowRadius: 8,
        shadowOpacity: 100,
        //zIndex: 1,
        justifyContent:"flex-end"
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
});
export default RenseignerObjectifs;