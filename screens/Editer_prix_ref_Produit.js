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
const racine = 'https:tracking.socecepme.com/api/';

class Editer_prix_ref_Produit extends React.Component {
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
            groups:[],
            cuvee:null,
            prod:null,
            prods:[],
            nvprix_ref1:null,
            nvprix_ref2:null,
            cat:null,
        };
    }
  
    async componentDidMount() {
        const { route } = this.props;
        const {params}  = route.params;
        const groupes = await requete.fetchGroupes(params.nom, params.contact);
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
    this.setState({entreprises:entreprisesf});

    }
    async choixproduit(value){
    this.setState({choixentrprse:value});
    const services = await requete.fetchProduits(value);
    console.log(services);
    if(services.length>0){
        let produitsf = requete.map(item => (item.cuvee!=null?{
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
    }
    envoyer(value) {
        const URL = racine + 'createProduit';
        const data = new FormData();
        let groupe_id=0, entreprise_id=0, produit_id=0;
        if(value=='prix_ref'&& this.state.choixgrpe!=null && this.state.choixentrprse!=null && this.state.choixprdt!=null && this.state.nvprix_ref1!=null){
            
            let rslt=this.state.choixprdt.split('_');
            console.log(rslt);
            this.state.prods.map(item=>(item.nom==rslt[0] && item.raison_social==this.state.choixentrprse && item.cuvee==rslt[1]? produit_id=item.id:item.cuvee==null && item.nom==rslt[0] && item.raison_social==this.state.choixprdt? produit_id=item.id:null));
            data.append("categorie", item.categorie);
            data.append("nom", this.state.choixprdt);
            data.append("cuvee", item.cuvee);
            data.append("prix_de_reference", this.state.prix_ref);
            data.append("unite", item.unite);
            data.append("equipe_id", item.equipe_id);
            data.append("entreprise_id", item.entreprise_id);
            fetch(racine + `updateProduit/${produit_id}`, {  
                method: 'POST',
                body: data
            }).then(response => response.text())
            .then(result => {
                alert("prix de reference enregistre avec succes")
                console.log(result);
                this.setState({
                    cat:null,
                    choixprdt:null,
                    choixgrpe:null,
                    choixentrpse:null
                })
            })
            .catch(error => console.log(error));
        }
        else if(value=='nvprod'&& this.state.choixgrpe!=null && this.state.choixentrprse!=null && /* this.state.cat!=null && */ this.state.prod!=null && this.state.nvprix_ref2!=null && /* this.state.cuvee!=null&& */ this.state.unite!=null){
            this.state.groups.map(item=>(item.raison_social==this.state.choixentrprse?entreprise_id=item.id:null));
            data.append("categorie", this.state.cat);
            data.append("nom", this.state.prod);
            data.append("cuvee", this.state.cuvee);
            data.append("prix_de_reference", this.state.prix_ref);
            data.append("unite", this.state.unite);
            data.append("equipe_id", item.equipe_id);
            data.append("entreprise_id", entreprise_id);
            fetch(URL, {  
                method: 'POST',
                body: data
            }).then(response => response.text())
            .then(result => {
                alert("prix de reference enregistre avec succes")
                console.log(result);
                this.setState({
                    cat:null,
                    choixprdt:null,
                    choixgrpe:null,
                    choixentrpse:null
                })
            })
            .catch(error => console.log(error));        
        } 
        else{
            alert("Vous n'avez pas renseigne d'objectifs");
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
        return (
            <Block style={styles.global_container}>
                <ScrollView>                
                    <Block 
                        style={{ 
                            marginHorizontal:10,
                            marginTop:20, 
                            marginBottom:20     
                        }}>
                        <Text
                            h5
                            color={argonTheme.COLORS.DEFAULT}
                        >
                            Editer Prix de reference/Nouveau produit
                        </Text>
                    </Block>
                    <Block style={styles.Reference_card}>
                        <Block card style={[styles.card,{marginTop:40}]}>
                            <Text style={{fontSize:18, alignItems:"center",justifyContent:'center', fontWeight:"bold"}} color={theme.COLORS.ICON}>
                                Editer le prix de reference{'\n'}       
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
                                        onValueChange={(value) => this.choixentreprise(value)}
                                        items={this.state.groupes}
                                    />   
                                </Block>
                                <Text style={{marginTop:10}}>Choisir une entreprise</Text>
                                <Block card style={{borderColor: theme.COLORS.SUCCESS, paddingHorizontal: theme.SIZES.BASE,backgroundColor: "#fff"}}>
                                    <RNPickerSelect
                                        style={{
                                            inputIOS: { color: "black" },
                                            inputAndroid: { color: "black" },
                                            marginBottom:10
                                        }} 
                                        placeholder={placeholder}
                                        onValueChange={(value) => this.choixproduit(value)}
                                        items={this.state.entreprises}
                                    />   
                                </Block>
                                <Text style={{marginTop:10}}>Choisir un produit</Text>
                                <Block card style={{borderColor: theme.COLORS.SUCCESS, paddingHorizontal: theme.SIZES.BASE,backgroundColor: "#fff"}}>
                                    <RNPickerSelect
                                        style={{
                                            inputIOS: { color: "black" },
                                            inputAndroid: { color: "black" },
                                            marginBottom:10
                                        }} 
                                        placeholder={placeholder2}
                                        onValueChange={(value) => this.setState({choixprdt:value})}
                                        items={this.state.prods}
                                    />   
                                </Block>
                            </Block>
                            <Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
                                <Input //type="numeric"
                                    keyboardType="numeric"
                                    right
                                    placeholder="entrer le prix de reference"
                                    style={{
                                        borderColor: theme.COLORS.SUCCESS,
                                        borderRadius: 4,
                                        backgroundColor: "#fff",
                                        marginBottom:10,
                                        width:"110%"
                                    }}
                                    help="Prix de reference"
                                    TopHelp
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
                                            marginBottom:10
                                        }} 
                                        placeholder={placeholder}
                                        onValueChange={(value) => this.choixentreprise(value)}
                                        items={this.state.groupes}
                                    />   
                                </Block>
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
                                    //keyboardType="numeric"
                                    right
                                    placeholder="entrer la categorie du produit"
                                    style={{
                                        borderColor: theme.COLORS.SUCCESS,
                                        borderRadius: 4,
                                        backgroundColor: "#fff",
                                        marginBottom:10,
                                        width:"110%"
                                    }}
                                    help="Categorie de produit"
                                    TopHelp
                                    value={this.state.cat}
                                    onChangeText={(input) =>this.setState({cat:input})}
                                    placeholderTextColor="black"
                                    iconContent={<Block />}
                                />
                            </Block>
                            <Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
                                <Input //type="numeric"
                                    //keyboardType="numeric"
                                    right
                                    placeholder="entrer le nom du produit"
                                    style={{
                                        borderColor: theme.COLORS.SUCCESS,
                                        borderRadius: 4,
                                        backgroundColor: "#fff",
                                        marginBottom:10,
                                        width:"110%"
                                    }}
                                    help="nom du produit"
                                    TopHelp
                                    value={this.state.prod}
                                    onChangeText={(input) =>this.setState({prod:input})}
                                    placeholderTextColor="black"
                                    iconContent={<Block />}
                                />
                            </Block>
                            <Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
                                <Input //type="numeric"
                                    keyboardType="numeric"
                                    right
                                    placeholder="entrer la cuvee/batch"
                                    style={{
                                        borderColor: theme.COLORS.SUCCESS,
                                        borderRadius: 4,
                                        backgroundColor: "#fff",
                                        marginBottom:10,
                                        width:"110%"
                                    }}
                                    help="Cuvee/batch"
                                    TopHelp
                                    value={this.state.cuvee}
                                    onChangeText={(input) =>this.setState({cuvee:input})}
                                    placeholderTextColor="black"
                                    iconContent={<Block />}
                                />
                            </Block>
                            <Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
                                <Input //type="numeric"
                                    keyboardType="numeric"
                                    right
                                    placeholder="entrer l'unite de mesure'"
                                    style={{
                                        borderColor: theme.COLORS.SUCCESS,
                                        borderRadius: 4,
                                        backgroundColor: "#fff",
                                        marginBottom:10,
                                        width:"110%"
                                    }}
                                    help="unite de mesure"
                                    TopHelp
                                    value={this.state.unite}
                                    onChangeText={(input) =>this.setState({unite:input})}
                                    placeholderTextColor="black"
                                    iconContent={<Block />}
                                />
                            </Block>
                            <Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
                                <Input //type="numeric"
                                    keyboardType="numeric"
                                    right
                                    placeholder="entrer le prix de reference"
                                    style={{
                                        borderColor: theme.COLORS.SUCCESS,
                                        borderRadius: 4,
                                        backgroundColor: "#fff",
                                        marginBottom:10,
                                        width:"110%"
                                    }}
                                    help="Prix de reference"
                                    TopHelp
                                    value={this.state.prix_ref}
                                    onChangeText={(input) =>this.setState({prix_ref2:input})}
                                    placeholderTextColor="black"
                                    iconContent={<Block />}
                                />
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