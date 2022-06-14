import React from "react";
import {
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  ImageBackground,
  Platform,
  TouchableOpacity,
} from "react-native";
import { Block, Text, theme, Icon } from "galio-framework";
import requete from "../services/Fetch";
import RNPickerSelect from "react-native-picker-select";

import { Button, Input } from "../components";
import { HeaderHeight } from "../constants/utils";
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
    label: 'service/produit',
    value: null,
    color: '#9EA0A4',
};
const placeholder5 = {
    label: 'cuvee',
    value: null,
    color: '#9EA0A4',
};
const placeholder7 = {
    label: 'categorie',
    value: null,
    color: '#9EA0A4',
};
const racine = 'https:tracking.socecepme.com/api/';

class Editer_prix_ref_Produit extends React.Component {
    constructor(props) {
        super(props);
        const { route } = this.props;
        const {type}=route.params;
        this.state = {
            groupes:[],
            entreprises:[],
            categories: [],
            services: [],
            ventes:[],
            produit_prix: null,
            produits:[],
            choixgrpe:null,
            choixentrpse:null,
            choixprdt:null,
            cuvees:[],
            choixcat:null,
            choixcuvee:null,
            groups:[],
            cuvee:null,
            prod:null,
            prods:[],
            nvprix_ref1:null,
            nvprix_ref2:null,
            cat:null,
            produit_id:'',
            tabprod_id:[],
            autrecat: false,
            autreservice: false,
            commerciaux: [],
            commercial: null,
            coms: [],
        };
        this.params=route.params;
    }
  
    async componentDidMount() {
    
        const groupes = await requete.fetchGroupes(this.params.params.nom, this.params.params.contact);
        let groupes2=groupes.map((item) => item.nom);
        let groupesandou=[...new Set(groupes2)]
        let groupesf = groupesandou.map(item => ({
          label: item,
          value: item
        }));
        console.log("ggggg",groupes);
        const produits= await requete.rechproduits();
        this.setState({prods:produits});     
        this.setState({groupes:groupesf, groups:groupes});
    }
        
    async choixentreprise(value){
    
        this.setState({choixgrpe:value})
        const entreprises = await requete.fetchEntreprises(value);
        let entreprisesf = entreprises.map(item => ({
          label: item.raison_social,
          value: item.raison_social
        }));
        this.setState({ entreprises:entreprisesf});
    
    }

    async choixcategorie(value, place){
        this.setState({ choixentrpse: value });
        let table = ['KmerFood','Agripeel','Wecare SCI','Tropical', 'PEEX', 'Wecare Logistic', 'WecareFood'];
        const services = await requete.fetchProduits(value);
        const commerciaux = await requete.fetchchoixcommercial(value);
        let commerciauxf = commerciaux['users'].map(item => ({
            label: item.nom,
            value: item.nom
        }));
        let test=0, cats=[];
        console.log('ssssssssssss', services);    
        if(services.length > 0) {
            if(table.includes(value)) {
                if(place !== 'nvprod') {
                    this.setState({ produits: services })
                    services.map((item) => item.categorie !== null ? cats.push(item.categorie):test=1);
                    let catsSandou = [...new Set(cats)] 
                    console.log('catssssansdou', catsSandou);
                    let categories = catsSandou.map(item => ({
                        label: item,
                        value: item
                    }));
                    console.log('cats', cats);
                    let produit_prix = services.map(item => ({produit:item.nom, prix:item.prix_de_reference, categorie:item.categorie, cuvee:item.cuvee}));
                    this.setState({ produit_prix: produit_prix });
                    this.setState({ categories: categories, commerciaux: commerciauxf, coms: commerciaux['users']  });
                }
                else {
                    console.log("nouveau produit")
                    this.setState({ produits: services })
                    services.map((item) => item.categorie !== null ? cats.push(item.categorie):test=1);
                    let catsSandou = [...new Set(cats)] 
                    console.log('catssssansdou', catsSandou);
                    let cats1 = [{
                        label: 'autre',
                        value: 'autre'
                    }]
                    let catDef = catsSandou.map(item => ({
                        label: item,
                        value: item
                    }));
                    let categories = cats1.concat(catDef)
                    let produit_prix = services.map(item => ({produit:item.nom, prix:item.prix_de_reference, categorie:item.categorie, cuvee:item.cuvee}));
                    this.setState({ produit_prix: produit_prix });
                    this.setState({ categories: categories, commerciaux: commerciauxf, coms: commerciaux['users']  });
                }
                
            }
            else {
                let produitsf = services.map(item => ({
                    label: item.nom,
                    value: item.nom
                })); 
                this.setState({ services : produitsf });
                let produit_prix = services.map(item=>({produit:item.nom, prix:item.prix_de_reference}));
                this.setState({ produit_prix:produit_prix, commerciaux: commerciauxf, coms: commerciaux['users']  });
            }
        }
        else {
            this.setState({ services: {
                label: "aucun produit/service",
                value: "aucun produit/service"
            }});
        }
    }

    async choixservice(value, place) {
        var test=0; var prods=[];
        if (place !== 'nvprod') {
            this.setState({choixcat:value});
            this.state.produits.map(item => (item.categorie === value ?
            prods.push(item.nom): 
            test=0)); 
            let prodsSandou=[...new Set(prods)] 
            console.log('proddssansdou',prodsSandou);
            let produitsf=prodsSandou.map(item => ({
                label: item,
                value: item
            }));
            this.setState({ services: produitsf });
            console.log('ppppppprod', produitsf);
        }
        else {
            if(value !== 'autre') {
                this.setState({choixcat:value});
                this.state.produits.map(item => (item.categorie === value ?
                prods.push(item.nom): 
                test=0)); 
                let prodsSandou=[...new Set(prods)] 
                console.log('proddssansdou',prodsSandou);
                let prods1 = [{
                    label: 'autre',
                    value: 'autre'
                }]
                let prodsf=prodsSandou.map(item => ({
                    label: item,
                    value: item
                }));
                let produitsf = prods1.concat(prodsf)
                this.setState({ services: produitsf });
                console.log('ppppppprod', produitsf);
            }
            else {
                this.setState({ autrecat: true })
            }
        }
    }
    choixcuvee(value, place) {
        var test=0, cuvees=[], tabprod_id=[];
        if (place !== 'nvprod') {
            this.setState({choixprdt:value});
            this.state.produits.map(item => (item.categorie==this.state.choixcat && item.nom==value?
            cuvees.push({
            label: item.cuvee,
            value: item.cuvee
            }) && tabprod_id.push({id:item.id, categorie:item.categorie, nom:item.nom, cuvee:item.cuvee}): 
            test=0)); 
            this.setState({ cuvees:cuvees });
            this.setState({ tabprod_id });
            console.log(cuvees);
        }
        else {
            if (value !== 'autre') {
                this.setState({choixprdt: value, autreservice: false});
                this.state.produits.map(item => (item.categorie==this.state.choixcat && item.nom==value?
                cuvees.push({
                label: item.cuvee,
                value: item.cuvee
                }) && tabprod_id.push({id:item.id, categorie:item.categorie, nom:item.nom, cuvee:item.cuvee}): 
                test=0)); 
                this.setState({ cuvees:cuvees });
                this.setState({ tabprod_id });
                console.log(cuvees);
            }
            else {
                this.setState({ autreservice: true })
            }
        }
    }   

    /* async choixproduit(value) {
        this.setState({ choixentrpse:value });
        const services = await requete.fetchProduits(value);
        console.log('services', services);
        if(services.length>0){
            let produitsf = requete.map(item => (item.cuvee != null ? {
                label: item.nom+'_'+item.cuvee,
                value: item.nom+'_'+item.cuvee
            }:
            {
                label:item.nom,
                value:item.nom
            })); 
            this.setState({produits:produitsf});
            let produit_prix=services.map(item=>({produit:item.nom, prix:item.prix_de_reference}));
            this.setState({produit_prix:produit_prix});
        }
        else{
            this.setState({service:{
                label: "aucun produit/service",
                value: "aucun produit/service"}});
        }
    } */
    envoyer(value) {
        const URL = racine + 'createProduit';
        const data = new FormData();
        let groupe_id=0, entreprise_id=0, produit_id=0;
        if(value === 'prix_ref' && this.state.choixgrpe !== null && this.state.choixentrpse !== null && this.state.choixprdt!=null && this.state.nvprix_ref1!=null){
            
            let nom =this.state.choixprdt;
            console.log(nom)
            this.state.prods.map(item => {
                if( item.nom === nom &&
                    item.raison_social === this.state.choixentrpse &&
                    item.categorie === this.state.choixcat &&
                    item.cuvee === this.state.cuvee
                ) {
                    data.append("categorie", item.categorie);
                    data.append("nom", this.state.choixprdt);
                    data.append("cuvee", item.cuvee);
                    data.append("prix_de_reference", this.state.nvprix_ref1 + ' FCFA');
                    data.append("unite", item.unite);
                    data.append("equipe_id", item.equipe_id);
                    data.append("entreprise_id", item.entreprise_id);
                    fetch(racine + `updateProduit/${item.id}`, {  
                        method: 'POST',
                        body: data
                    }).then(response => response.text())
                    .then(result => {
                        alert("prix de reference enregistre avec succes")
                        console.log(result);
                        this.setState({
                            choixcat:null,
                            choixprdt:null,
                            choixgrpe:null,
                            choixentrpse:null,
                            nvprix_ref1: null
                        })
                    })
                    .catch(error => console.log(error));
                } else if (
                    item.cuvee === null &&
                    item.categorie === this.state.choixcat &&
                    item.nom === nom &&
                    item.raison_social === this.state.choixentrpse
                ){
                    data.append("categorie", item.categorie);
                    data.append("nom", this.state.choixprdt);
                    data.append("cuvee", item.cuvee);
                    data.append("prix_de_reference", this.state.prix_ref + ' FCFA');
                    data.append("unite", item.unite);
                    data.append("equipe_id", item.equipe_id);
                    data.append("entreprise_id", item.entreprise_id);
                    fetch(racine + `updateProduit/${item.id}`, {  
                        method: 'POST',
                        body: data
                    }).then(response => response.text())
                    .then(result => {
                        alert("prix de reference enregistre avec succes")
                        console.log(result);
                        this.setState({
                            choixcat:null,
                            choixprdt:null,
                            choixgrpe:null,
                            choixentrpse:null,
                            cuvee: null,
                            nvprix_ref1: null
                        })
                    })
                    .catch(error => console.log(error)); 
                } else if (
                    item.cuvee === null &&
                    item.categorie === null &&
                    item.nom === nom &&
                    item.raison_social === this.state.choixentrpse
                ) {
                    data.append("categorie", item.categorie);
                    data.append("nom", this.state.choixprdt);
                    data.append("cuvee", item.cuvee);
                    data.append("prix_de_reference", this.state.prix_ref + ' FCFA');
                    data.append("unite", item.unite);
                    data.append("equipe_id", item.equipe_id);
                    data.append("entreprise_id", item.entreprise_id);
                    fetch(racine + `updateProduit/${item.id}`, {  
                        method: 'POST',
                        body: data
                    }).then(response => response.text())
                    .then(result => {
                        alert("prix de reference enregistre avec succes")
                        console.log(result);
                        this.setState({
                            choixcat:null,
                            choixprdt:null,
                            choixgrpe:null,
                            choixentrpse:null,
                            nvprix_ref1: null
                        })
                    })
                    .catch(error => console.log(error));
                }
                else {
                    alert("Renseignez tous les champs SVP");
                }
            });
        }
        else if(value === 'nvprod' && this.state.choixgrpe !== null && this.state.choixentrpse !== null &&  this.state.nvprix_ref2!==null &&  this.state.unite !== null && this.state.commercial !== null){
            this.state.coms.map(item => {
                if(
                    this.state.cuvee !== null &&
                    this.state.choixprdt !== null &&
                    this.state.choixcat !== null &&
                    this.state.choixentrpse === item.raison_social &&
                    this.state.commercial === item.nom
                ) {
                    console.log('tttttttestttt')
                    data.append("categorie", this.state.autrecat ? this.state.cat : this.state.choixcat );
                    data.append("nom", this.state.autreservice ? this.state.prod : this.state.choixprdt);
                    data.append("cuvee", this.state.cuvee);
                    data.append("prix_de_reference", this.state.nvprix_ref2);
                    data.append("unite", this.state.unite);
                    data.append("equipe_id", item.equipe_id);
                    data.append("entreprise_id", item.entreprise_id);
                    fetch(URL, {  
                        method: 'POST',
                        body: data
                    }).then(response => response.text())
                    .then(result => {
                        alert("nouveau produit enregistre avec succes!")
                        console.log(result);
                        this.setState({
                            cat: null,
                            choixcat: null,
                            prod: null,
                            cuvee: null,
                            choixprdt:null,
                            choixgrpe:null,
                            choixentrpse:null,
                            autrecat:null,
                            autreservice: null,
                            nvprix_ref2: null,
                            unite: null,
                            commercial: null
                        })
                    })
                    .catch(error => console.log(error));  
                }
                else if(
                    this.state.prod !== null &&
                    this.state.choixcat !== null &&
                    this.state.choixentrpse === item.raison_social &&
                    this.state.commercial === item.nom
                ) {
                    data.append("categorie", this.state.autrecat ? this.state.cat : this.state.choixcat );
                    data.append("nom", this.state.prod);
                    data.append("cuvee", null);
                    data.append("prix_de_reference", this.state.nvprix_ref2);
                    data.append("unite", this.state.unite);
                    data.append("equipe_id", item.equipe_id);
                    data.append("entreprise_id", item.entreprise_id);
                    fetch(URL, {  
                        method: 'POST',
                        body: data
                    }).then(response => response.text())
                    .then(result => {
                        alert("nouveau produit enregistre avec succes!")
                        console.log(result);
                        this.setState({
                            cat: null,
                            choixcat: null,
                            prod: null,
                            cuvee: null,
                            choixprdt:null,
                            choixgrpe:null,
                            choixentrpse:null,
                            autrecat:null,
                            autreservice: null,
                            nvprix_ref2: null,
                            unite: null,
                            commercial: null
                        })
                    })
                    .catch(error => console.log(error)); 
                }
                else if (
                    this.state.prod !== null &&
                    this.state.choixentrpse === item.raison_social &&
                    this.state.commercial === item.nom 
                ) {
                    data.append("categorie", null);
                    data.append("nom", this.state.prod );
                    data.append("cuvee", null);
                    data.append("prix_de_reference", this.state.nvprix_ref2);
                    data.append("unite", this.state.unite);
                    data.append("equipe_id", item.equipe_id);
                    data.append("entreprise_id", item.entreprise_id);
                    fetch(URL, {  
                        method: 'POST',
                        body: data
                    }).then(response => response.text())
                    .then(result => {
                        alert("nouveau produit enregistre avec succes!")
                        console.log(result);
                        this.setState({
                            cat: null,
                            choixcat: null,
                            prod: null,
                            cuvee: null,
                            choixprdt:null,
                            choixgrpe:null,
                            choixentrpse:null,
                            autrecat:null,
                            autreservice: null,
                            nvprix_ref2: null,
                            unite: null,
                            commercial: null
                        })
                    })
                    .catch(error => console.log(error));
                }
                /* else{
                    alert("Renseignez tous les champs SVP");
                } */
            })      
        } 
        else{
            alert("Renseignez tous les champs SVP");
        }
    }
    formatMillier( nombre) {
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
        const { autrecat } = this.state
        const { autreservice } = this.state
        return (
            <Block style={styles.global_container}>
                <ScrollView>
                    {/* Modifier le prix de reference */}                
                    <Block style={styles.Reference_card}>
                        <Block card style={[styles.card,{marginTop:40}]}>
                            <Text style={{fontSize:18, alignItems:"center", justifyContent:'center', fontWeight:"bold"}} color={theme.COLORS.ICON}>
                                Editer le prix de reference{'\n'}       
                            </Text>
                            <Block style={{marginTop:15, marginBottom:20}}> 
                                <Text>Choisir un groupe</Text>
                                <Block card style={{borderColor: theme.COLORS.SUCCESS, paddingHorizontal: theme.SIZES.BASE, backgroundColor: "#fff"}}>
                                    <RNPickerSelect
                                    style={{
                                        //placeholder: {color: "black"},
                                        inputIOS: { color: "black" },
                                        inputAndroid: { color: "black" },
                                    }}
                                    placeholder={placeholder2}
                                    value={this.state.choixgrpe}
                                    onValueChange={(value) =>
                                        this.choixentreprise(value)
                                    }
                                    items={this.state.groupes}
                                    />  
                                </Block>
                                </Block>
                                <Block style={{ marginBottom:20}}> 
                                <Text>Choisir une entreprise</Text>
                                <Block card style={{borderColor: theme.COLORS.SUCCESS, paddingHorizontal: theme.SIZES.BASE, backgroundColor: "#fff"}}>
                                    <RNPickerSelect
                                    style={{
                                        //placeholder: {color: "black"},
                                        inputIOS: { color: "black" },
                                        inputAndroid: { color: "black" },
                                    }}
                                    placeholder={placeholder3}
                                    value={this.state.choixentrpse}
                                    onValueChange={(value) =>
                                        this.choixcategorie(value, "ref")
                                    }
                                    items={this.state.entreprises}
                                    />  
                                </Block>
                                </Block>
                                
                                {(
                                this.state.choixentrpse === 'KmerFood' ||
                                this.state.choixentrpse === 'Agripeel' ||
                                this.state.choixentrpse === 'WecareFood'
                                )?
                                <Block>
                                    <Text /* style={{marginTop:20}} */>Choisir une categorie de produit</Text>
                                    <Block card style={{marginBottom:20, borderColor: theme.COLORS.SUCCESS, backgroundColor: "#fff"}}>
                                    <RNPickerSelect
                                        style={{
                                            // placeholder: {color: "black"},
                                            inputIOS: { color: "black" },
                                            inputAndroid: { color: "black" },
                                        }}
                                        placeholder={placeholder7}
                                        onValueChange={(value) => this.choixservice(value, "ref")}
                                        items={this.state.categories}
                                    /> 
                                    </Block>
                                    <Text>Choisir un service/produit</Text>
                                    <Block card style={{marginBottom:20,borderColor: theme.COLORS.SUCCESS, backgroundColor: "#fff"}}>
                                        <RNPickerSelect
                                        style={{
                                            //placeholder: {color: "black"},
                                            inputIOS: { color: "black" },
                                            inputAndroid: { color: "black" },
                                        }}
                                        placeholder={placeholder4}
                                        /* value={this.state.choixprdt} */ 
                                        onValueChange={(value) =>this.choixcuvee(value, "ref") }
                                        items={this.state.services}
                                        />  
                                    </Block>
                                    <Text>Choisir une cuvee/batch</Text>
                                    <Block card style={{marginBottom:20, borderColor: theme.COLORS.SUCCESS, backgroundColor: "#fff"}}>
                                    <RNPickerSelect
                                        style={{
                                        //placeholder: {color: "black"},
                                        inputIOS: { color: "black" },
                                        inputAndroid: { color: "black" },
                                        }}
                                        placeholder={placeholder5} 
                                        onValueChange={(value) =>this.setState({ cuvee: value }) }
                                        items={this.state.cuvees}
                                    />  
                                    </Block>
                                </Block>:
                                (
                                    this.state.choixentrpse === 'Wecare SCI' ||
                                    this.state.choixentrpse === 'PEEX' ||
                                    this.state.choixentrpse === 'Tropical' ||
                                    this.state.choixentrpse === 'Wecare Logistic'
                                )?
                                <Block>
                                    <Text >Choisir une categorie de produit</Text>
                                    <Block card style={{marginBottom:20, borderColor: theme.COLORS.SUCCESS, backgroundColor: "#fff"}}>
                                    <RNPickerSelect
                                        style={{
                                        // placeholder: {color: "black"},
                                        inputIOS: { color: "black" },
                                        inputAndroid: { color: "black" },
                                        }}
                                        placeholder={placeholder4}
                                        onValueChange={(value) => this.choixservice(value, "ref")}
                                        items={this.state.categories}
                                    /> 
                                    </Block>
                                    <Text>Choisir un service/produit</Text>
                                    <Block card style={{marginBottom:20,borderColor: theme.COLORS.SUCCESS, backgroundColor: "#fff"}}>
                                        <RNPickerSelect
                                        style={{
                                            //placeholder: {color: "black"},
                                            inputIOS: { color: "black" },
                                            inputAndroid: { color: "black" },
                                        }}
                                        placeholder={placeholder3} 
                                        onValueChange={(value) => this.setState({choixprdt:value})}
                                        items={this.state.services}
                                        />  
                                    </Block>
                                </Block>
                                :                
                                <Block>
                                    <Text>Choisir un service</Text>
                                    <Block card style={{marginBottom:20,borderColor: theme.COLORS.SUCCESS,paddingHorizontal: theme.SIZES.BASE, backgroundColor: "#fff"}}>
                                    <RNPickerSelect
                                        style={{
                                        //placeholder: {color: "black"},
                                        inputIOS: { color: "black" },
                                        inputAndroid: { color: "black" },
                                        }}
                                        placeholder={placeholder4}
                                        value={this.state.choixprdt}
                                        onValueChange={(value) => this.setState({ choixprdt:value })}
                                        items={this.state.services}
                                    />  
                                    </Block>
                                </Block>
                            }
                            <Block>
                                <Text>Nouveau prix de reference</Text>
                                <Input
                                    keyboardType="numeric"
                                    right
                                    placeholder="entrer le prix de reference"
                                    style={{
                                        borderColor: theme.COLORS.SUCCESS,
                                        borderRadius: 4,
                                        backgroundColor: "#fff",
                                        marginBottom:10,
                                    }}
                                    value={this.state.nvprix_ref1}
                                    onChangeText={(input) =>this.setState({nvprix_ref1:input})}
                                    placeholderTextColor="black"
                                    iconContent={<Block />}
                                />
                            </Block>
                            <Block style={{flexDirection:"row", justifyContent:"space-between", marginTop:10}}>
                                <Button right 
                                    style={styles.optionsButton} 
                                    onPress={() => this.envoyer('prix_ref')}>
                                    envoyer
                                </Button>
                            </Block>
                        </Block>
                        {/* ajouter un nouveau produit */}
                        <Block card style={[styles.card,{marginTop:40}]}>
                            <Text style={{fontSize:18, alignItems:"center",justifyContent:'center', fontWeight:"bold"}} color={theme.COLORS.ICON}>
                                Ajouter un nouveau produit{'\n'}       
                            </Text>
                            <Block>
                                <Text style={{marginTop:10}}>Choisir un groupe</Text>
                                <Block card style={{borderColor: theme.COLORS.SUCCESS, paddingHorizontal: theme.SIZES.BASE,backgroundColor: "#fff"}}>
                                    <RNPickerSelect
                                        style={{
                                            inputIOS: { color: "black" },
                                            inputAndroid: { color: "black" },
                                            marginBottom:20
                                        }} 
                                        placeholder={placeholder2}
                                        value={this.state.choixgrpe}
                                        onValueChange={(value) => this.choixentreprise(value)}
                                        items={this.state.groupes}
                                    />   
                                </Block>
                                <Text style={{marginTop:20}}>Choisir une entreprise</Text>
                                <Block card style={{borderColor: theme.COLORS.SUCCESS, paddingHorizontal: theme.SIZES.BASE,backgroundColor: "#fff", marginBottom:20}}>
                                    <RNPickerSelect 
                                        style={{
                                            inputIOS: { color: "black" },
                                            inputAndroid: { color: "black" },
                                        }}
                                        placeholder={placeholder3}
                                        value={this.state.choixentrpse}
                                        onValueChange={(value) => this.choixcategorie(value, "nvprod")}
                                        items={this.state.entreprises}
                                    />   
                                </Block>
                            </Block>
                            {(
                                this.state.choixentrpse === 'KmerFood' ||
                                this.state.choixentrpse === 'Agripeel' ||
                                this.state.choixentrpse === 'WecareFood'
                                )?
                                <Block>
                                    <Text>Categorie de produit</Text>
                                    <Block card style={{marginBottom:20, borderColor: theme.COLORS.SUCCESS, backgroundColor: "#fff"}}>
                                        <RNPickerSelect
                                            style={{
                                                // placeholder: {color: "black"},
                                                inputIOS: { color: "black" },
                                                inputAndroid: { color: "black" },
                                            }}
                                            placeholder={placeholder7}
                                            onValueChange={(value) => this.choixservice(value, "nvprod")}
                                            items={this.state.categories}
                                        /> 
                                    </Block>
                                    {autrecat && 
                                        <Block style={{ marginBottom: 20 }}>
                                            <Block>
                                                <Text>Categorie du produit</Text>
                                                <Input //type="numeric"
                                                    maxLength={30}
                                                    right
                                                    placeholder="entrer la categorie du produit"
                                                    style={{
                                                        borderColor: theme.COLORS.SUCCESS,
                                                        borderRadius: 4,
                                                        backgroundColor: "#fff",
                                                        marginBottom: 20,
                                                    }}
                                                    onChangeText={(input) =>this.setState({ cat : input})}
                                                    placeholderTextColor="black"
                                                    iconContent={<Block />}
                                                />
                                            </Block>
                                            <Block>
                                                <Text>Nom du produit</Text>
                                                <Input //type="numeric"
                                                    //keyboardType="numeric"
                                                    right
                                                    placeholder="entrer le nom du produit"
                                                    style={{
                                                        borderColor: theme.COLORS.SUCCESS,
                                                        borderRadius: 4,
                                                        backgroundColor: "#fff",
                                                        marginBottom:20,
                                                    }}
                                                    onChangeText={(input) =>this.setState({prod:input})}
                                                    placeholderTextColor="black"
                                                    iconContent={<Block />}
                                                />
                                            </Block>
                                            <Block>
                                                <Text>Cuvee</Text>
                                                <Input //type="numeric"
                                                    maxLength={30}
                                                    right
                                                    placeholder="entrer la cuvee"
                                                    style={{
                                                        borderColor: theme.COLORS.SUCCESS,
                                                        borderRadius: 4,
                                                        backgroundColor: "#fff",
                                                        //marginBottom:20,
                                                    }}
                                                    onChangeText={(input) =>this.setState({cuvee:input})}
                                                    placeholderTextColor="black"
                                                    iconContent={<Block />}
                                                />
                                            </Block>
                                        </Block>
                                    }
                                    {!autrecat && 
                                        <Block>
                                            <Text>Choisir un service/produit</Text>
                                            <Block card style={{marginBottom:20, borderColor: theme.COLORS.SUCCESS, backgroundColor: "#fff"}}>
                                                <RNPickerSelect
                                                    style={{
                                                        //placeholder: {color: "black"},
                                                        inputIOS: { color: "black" },
                                                        inputAndroid: { color: "black" },
                                                    }}
                                                    placeholder={placeholder4} 
                                                    onValueChange={(value) =>this.choixcuvee(value, 'nvprod') }
                                                    items={this.state.services}
                                                />  
                                            </Block>
                                            {autreservice &&
                                                <Block>
                                                    <Text> Nom du produit</Text>
                                                    <Input
                                                        right
                                                        placeholder="entrer le nom du produit"
                                                        style={{
                                                            borderColor: theme.COLORS.SUCCESS,
                                                            borderRadius: 4,
                                                            backgroundColor: "#fff",
                                                            marginBottom:20,
                                                        }}
                                                        onChangeText={(input) =>this.setState({ prod: input })}
                                                        placeholderTextColor="black"
                                                        iconContent={<Block />}
                                                    />
                                                </Block>
                                            }
                                            <Text>cuvee/batch</Text>
                                            <Block>
                                                <Input
                                                    maxLength={30}
                                                    right
                                                    placeholder="entrer la cuvee/batch"
                                                    style={{
                                                        borderColor: theme.COLORS.SUCCESS,
                                                        borderRadius: 4,
                                                        backgroundColor: "#fff",
                                                        marginBottom:20,
                                                    }}
                                                    onChangeText={(input) =>this.setState({cuvee:input})}
                                                    placeholderTextColor="black"
                                                    iconContent={<Block />}
                                                />
                                            </Block>
                                        </Block>
                                    }
                                </Block>:
                                (
                                    this.state.choixentrpse === 'Wecare SCI' ||
                                    this.state.choixentrpse === 'PEEX' ||
                                    this.state.choixentrpse === 'Tropical' ||
                                    this.state.choixentrpse === 'Wecare Logistic'
                                )?
                                <Block>
                                    <Text >Choisir une categorie de produit</Text>
                                    <Block card style={{marginBottom:20, borderColor: theme.COLORS.SUCCESS, backgroundColor: "#fff"}}>
                                        <RNPickerSelect
                                            style={{
                                            // placeholder: {color: "black"},
                                            inputIOS: { color: "black" },
                                            inputAndroid: { color: "black" },
                                            }}
                                            placeholder={placeholder4}
                                            onValueChange={(value) => this.choixservice(value, "nvprod")}
                                            items={this.state.categories}
                                        /> 
                                    </Block>
                                    {autrecat && 
                                        <Block style={{ marginBottom:20 }}>
                                            <Block>
                                                <Text>Categorie du produit</Text>
                                                <Input
                                                    right
                                                    placeholder="entrer la categorie du produit"
                                                    style={{
                                                        borderColor: theme.COLORS.SUCCESS,
                                                        borderRadius: 4,
                                                        backgroundColor: "#fff",
                                                    }}
                                                    onChangeText={(input) =>this.setState({ cat : input})}
                                                    placeholderTextColor="black"
                                                    iconContent={<Block />}
                                                />
                                            </Block>
                                        </Block>
                                    }
                                    <Block>
                                        <Text>Nom du produit</Text>
                                        <Input 
                                            right
                                            placeholder="entrer le nom du produit"
                                            style={{
                                                borderColor: theme.COLORS.SUCCESS,
                                                borderRadius: 4,
                                                backgroundColor: "#fff",
                                                marginBottom:20,
                                            }}
                                            onChangeText={(input) =>this.setState({prod:input})}
                                            placeholderTextColor="black"
                                            iconContent={<Block />}
                                        />
                                    </Block>
                                </Block>
                                :                
                                <Block>
                                    <Text>Nom du produit</Text>
                                    <Input 
                                        right
                                        placeholder="entrer le nom du produit"
                                        style={{
                                            borderColor: theme.COLORS.SUCCESS,
                                            borderRadius: 4,
                                            backgroundColor: "#fff",
                                            marginBottom:20,
                                        }}
                                        onChangeText={(input) =>this.setState({prod:input})}
                                        placeholderTextColor="black"
                                        iconContent={<Block />}
                                    />
                                </Block>
                            }
                            <Block>
                                <Text>Unite de mesure</Text>
                                <Input //type="numeric"
                                    //keyboardType="numeric"
                                    right
                                    placeholder="entrer l'unite de mesure"
                                    maxLength={30}
                                    style={{
                                        borderColor: theme.COLORS.SUCCESS,
                                        borderRadius: 4,
                                        backgroundColor: "#fff",
                                        marginBottom:20,
                                    }}
                                    value={this.state.unite}
                                    onChangeText={(input) =>this.setState({unite:input})}
                                    placeholderTextColor="black"
                                    iconContent={<Block />}
                                />
                            </Block>
                            <Block>
                                <Text>Prix de reference</Text>
                                <Input //type="numeric"
                                    keyboardType="numeric"
                                    right
                                    placeholder="entrer le prix de reference"
                                    style={{
                                        borderColor: theme.COLORS.SUCCESS,
                                        borderRadius: 4,
                                        backgroundColor: "#fff",
                                        marginBottom:20,
                                    }}
                                    value={this.state.nvprix_ref2}
                                    onChangeText={(input) =>this.setState({nvprix_ref2:input})}
                                    placeholderTextColor="black"
                                    iconContent={<Block />}
                                />
                            </Block>
                            <Block style={{marginBottom: 10 }}>
                                <Text>Commerciel charge de la vente de ce produit</Text>
                                <Block card style={{ borderColor: theme.COLORS.SUCCESS, backgroundColor: "#fff"}}>
                                <RNPickerSelect
                                    style={{
                                        //placeholder: {color: "black"},
                                        inputIOS: { color: "black" },
                                        inputAndroid: { color: "black" },
                                    }}
                                    placeholder={placeholder4}
                                    onValueChange={(value) => this.setState({commercial:value})}
                                    value ={this.state.commercial}
                                    items={this.state.commerciaux}
                                />  
                                </Block>
                            </Block>
                            <Block style={{flexDirection:"row", justifyContent:"space-between", marginTop:10}}>
                                <Button right 
                                    style={styles.optionsButton} 
                                    onPress={() => this.envoyer('nvprod')}>
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
      // marginBottom: -HeaderHeight * 2,
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
export default Editer_prix_ref_Produit;