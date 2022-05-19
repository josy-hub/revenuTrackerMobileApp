  import React from "react";
  import moment from "moment";
  import {
    StyleSheet,
    Dimensions,
    ScrollView,
    Alert,
    Image,
    TouchableOpacity,
    ActivityIndicator
  } from "react-native";
  import RNPickerSelect from 'react-native-picker-select';
  import { Block, Text, theme} from "galio-framework";
  import Autocomplete from 'react-native-autocomplete-input';
 
  import entreprise from '../services/Fetch';
  import Day from '../services/Date';
  import { Button, Input, Icon} from "../components";
  import argonTheme from "../constants/Theme";
  import { Images} from "../constants";

  const { width, height } = Dimensions.get("screen");

  const placeholder1 = {
    label: 'groupe',
    value: null,
    color: '#9EA0A4'//'#9EA0A4',
  };
  const placeholder2 = {
    label: 'entreprise',
    value: null,
    color: '#9EA0A4',
  };
  const placeholder3 = {
    label: 'service/produit',
    value: null,
    color: '#9EA0A4',
  };
  const placeholder4 = {
    label: 'categorie',
    value: null,
    color: '#9EA0A4',
  };
  const placeholder5 = {
    label: 'cuvee',
    value: null,
    color: '#9EA0A4',
  };
  const placeholder6 = {
    label: 'type de fournisseur',
    value: null,
    color: '#9EA0A4',
  };
  const placeholder7 = {
    label: 'fournisseur',
    value: null,
    color: '#9EA0A4',
  };
  let now = new Date();
  let mindate=now-549094194;
  let mindatef=new Date(mindate);

  const racine = 'http://172.31.96.1/Tracking/public/api/';
  //const racine = 'https:tracking.socecepme.com/api/';
  class Choix_service_renseigner extends React.Component {
    
    constructor(props){
      super(props);
      this.test="current"
      this.state={
        groupes:[],
        entreprises:[],
        services:[],
        categories:[],
        service:[],
        cuvees:[],
        fournisseurs:[],  
        choixgrpe:null,
        choixentrpse:null,
        choixprdt:null,
        choixcat:null,
        choixcuvee:null,
        choixfssr:null,
        choixtypefssr:null,
        date:now,
        newDate:"aucune date choisie",
        choixgrpeupdated:null,
        choixentrpseupdated:null,
        choixprdtupdated:null,
        produit_prix:'',
        fsseurExt:null,
        tablefssrs:[],
        type_vente:'individuelle',
        produit_id:'',
        tabprod_id:[]
      };
      const { route } = this.props;
      this.params=route.params;
     
    }; 

    async componentDidMount() {

      const{route, navigation}=this.props;
      const {backparams}  = route.params;

      const groupes = await entreprise.fetchGroupes(this.params.params.nom, this.params.params.contact);
      console.log(groupes);
      let groupes2=groupes.map((item) => item.nom);
      let groupesandou=[...new Set(groupes2)]
      let groupesf = groupesandou.map(item => ({
        label: item,
        value: item
      }));
        
      this.setState({groupes:groupesf});
      const fournisseurs= await entreprise.fetchFournisseurs();
      this.setState({tablefssrs:fournisseurs['fournisseurs']}); 
      console.log('tablefssrs', fournisseurs['fournisseurs']) ; 
  
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
      let table=['KmerFood','Agripeel','Wecare SCI','Tropical'];
      const services = await entreprise.fetchProduits(value);
      let test=0, cats=[], categories=[];
      console.log('ssssssssssss', services);    
      if(services.length>0){
        if(table.includes(value)){
          this.setState({services:services})
          /* let cats= */services.map((item) => item.categorie!==null?cats.push(item.categorie):test=1);
          let catsSandou=[...new Set(cats)] 
          console.log('catssssansdou',catsSandou);
          catsSandou.map(item => (item!="Ancienne vente"?categories.push({
            label: item,
            value: item
          }):test=0));
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
          value: "aucun produit/service"}});
      }
    }
    choixservice(value){
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
    choixcuvee(value){
      var test=0, cuvees=[], tabprod_id=[];
      this.setState({choixprdt:value});
      /* let cuvees= */this.state.services.map(item => (item.categorie==this.state.choixcat && item.nom==value?
      cuvees.push({
        label: item.cuvee!=null? item.cuvee : "pas de cuvee disponible",
        value: item.cuvee
      }) && tabprod_id.push({id:item.id, categorie:item.categorie, nom:item.nom, cuvee:item.cuvee}): 
        test=0)); 
      this.setState({cuvees:cuvees});
      this.setState({tabprod_id});
      console.log(cuvees);
    }
    findFournisseur(query) {
      if (query === '') {
        return [];
      }
  
      const { tablefssrs } = this.state;
      const regex = new RegExp(`${query.trim()}`, 'i');
      let result=tablefssrs.filter(fssr=> fssr.nom_fournisseur.search(regex) >= 0);
      let Noms=result.map((item)=>(item.nom_fournisseur+'_'+item.email+'_'+item.contact+'_'+item.localisation));
      let Nomssandou=[...new Set(Noms)];
      let Nomf=Nomssandou.map((item)=>({nom_fssr:item.split('_')[0], email:item.split('_')[1], contact:item.split('_')[2], localisation:item.split('_')[3]}));
      console.log(Noms,Nomssandou, Nomf);
      return Nomf;
    }
    choixfournisseur(value){
      this.setState({choixtypefssr:value});
      let prod_id=0, fsseurs=[];
      if(value=='interne'){
        this.state.tabprod_id.map(item=>{(item.categorie==this.state.choixcat && item.nom==this.state.choixprdt && item.cuvee==this.state.choixcuvee)? prod_id=item.id :''})
        this.state.tablefssrs.map(item=>(item.produit_id==prod_id && item.type_fournisseur=='interne'? fsseurs.push(item.nom_fournisseur):''));
        let fnsrsSandou=[...new Set(fsseurs)] 
        let fournisseurs=fnsrsSandou.map(item => ({
          label: item,
          value: item
        }))
        this.setState({fournisseurs:fournisseurs});
        console.log(fournisseurs);
      }
    }
    async savefssr(value){
      const{route, navigation}=this.props;
      const {backparams}  = route.params;
      let table=this.state.tablefssrs.map(item=>item.nom_fournisseur)
      console.log('tttttable', table);
      let prod_id=0;
      if(!table.includes(value) && typeof backparams!=='undefined' && backparams.nom_fournisseur!=null && backparams.type_fournisseur=='externe'){
        this.state.tabprod_id.map(item=>{(item.categorie==backparams.categorie && item.nom==backparams.choixprdt && item.cuvee==backparams.cuvee)? prod_id=item.id :''})
        console.log('tttt',this.state.tabprod_id );
        console.log('iiiiid', prod_id );
        let data = {  
          "nom_fournisseur": backparams.nom_fournisseur,
          "type_fournisseur": backparams.type_fournisseur,
          "produit_id":prod_id,
          "email": null,
          "contact":null,
          "localisation":null
        };
        console.log('dataaaaa', data);
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
        const URL=`${racine}fournisseurs`;
        await fetch(URL, requestOptions)
          .then(response => response.text())
          .then(result => {
            //var rslt = JSON.parse(result);
              console.log('Success:', result);
            //this.setState({fournisseur_id:rslt['fournisseur'].id})
          })
          .catch((error) => {
            console.error('Error:', error);
          });

      }
      else if(!table.includes(value)){
        this.state.tabprod_id.map(item=>{(item.categorie==this.state.choixcat && item.nom==this.state.choixprdt && item.cuvee==this.state.choixcuvee)? prod_id=item.id :''})
        console.log('tttt',this.state.tabprod_id );
        console.log('iiiiid', prod_id );
        let data = {  
          "nom_fournisseur": this.state.fsseurExt,
          "type_fournisseur": this.state.choixtypefssr,
          "produit_id":prod_id,
          "email": null,
          "contact":null,
          "localisation":null
        };
        console.log('dataaaaa', data);
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
        const URL=`${racine}fournisseurs`;
        await fetch(URL, requestOptions)
          .then(response => response.text())
          .then(result => {
            //var rslt = JSON.parse(result);
              console.log('Success:', result);
            //this.setState({fournisseur_id:rslt['fournisseur'].id})
          })
          .catch((error) => {
            console.error('Error:', error);
          });
      }

    }
    OnDateChange = (newDate) => {
      let convertedDate=moment(newDate).format("YYYY-MM-DD")
      this.setState({newDate:convertedDate});  
   
    }
    
    
    sauvegarder=async()=>{

      var date =new Date();
      var s = date.getSeconds();
      var m= date.getMinutes();
      var h= date.getHours();
      if(this.state.choixgrpe!=null || typeof backparams!=='undefined' && backparams.choixgrpe!=null){
        let data={
          groupe:this.state.choixgrpe==null?backparams.choixgrpe:backparams.choixgrpe,
          entreprise:this.state.choixentrpse,
          service_produit:this.state.choixprdt,
          date_vente:this.state.newDate=="aucune date choisie"? null:this.state.newDate,
          prix_unitaire:null,
          quantite:null,
          justificatif_vente:null,
          commentaire:null,
          produit_id:null,
          user_contact:this.params.params.contact,
          prix_reference:null,
          categorie:this.state.categorie,
          cuvee:this.state.choixcuvee,
          remise:null,
          //fournisseur_id:fssr_id==0? this.state.fssr_id : fssr_id,
          type_fournisseur:this.state.choixtypefssr,
          nom_fournisseur:this.state.fsseurExt!=null?this.state.fsseurExt:this.state.choixfssr,
          type_de_vente:this.state.type_vente,
          groupe_de_vente_id:this.state.type_vente=='groupee'?date+':'+h+':'+m+':'+s:null

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
        const URL=`${racine}sauvegardes`;
        
        fetch(URL, requestOptions)
        .then(response => response.text())
        .then(result => {
            console.log('Success:', result);
            Alert.alert("Donnees sauvegardees avec succes. Vous pouvez continuer plus tard");
            this.setState({
              choixgrpe:null,
              choixentrpse:null,
              choixprdt:null,
              choixcat:null,
              choixcuvee:null,
              choixfssr:null,
              choixtypefssr:null,
              fsseurExt:null,
              newDate:"aucune date choisie",
              type_vente:'individuelle'
            })
        })
        .catch((error) => {
            console.error('Error:', error);
            Alert.alert("Erreur: vos donnees n'ont pas pu est sauvegardees");
        });
      }
      else{
        Alert.alert("Erreur: vous ne pouvez pas sauvegarder le vide");
      }
      
    }
    
    sauvegardes(){
      this.props.navigation.navigate('Sauvegardes',{params:{contact:this.params.params.contact, place:"choixservice"}})
    }
    suivant()
    {
      const{route, navigation}=this.props;
      const {params}  = route.params;
      const {backparams}  = route.params;

      var date =new Date();
      var s = date.getSeconds();
      var m= date.getMinutes();
      var h= date.getHours();
      console.log(s, m, h);
      
      if( this.state.choixgrpe!=null &&  
          this.state.choixentrpse!=null &&
          this.state.choixprdt!=null &&
          this.state.choixprdt!="aucun produit/service" && 
          this.state.newDate!="aucune date choisie"&&
          this.state.newDate!=null
      )
      {
        let prix_ref=0; let fssr_id=0;
        let table=this.state.produit_prix
        for(let i=0; i<table.length; i++){
          console.log(table[i].produit);
          if(table[i].produit==this.state.choixprdt && table[i].categorie==this.state.choixcat && table[i].cuvee==this.state.choixcuvee){
            prix_ref=table[i].prix;
          }
        }
        if(this.state.choixtypefssr=='externe'){
          this.savefssr(this.state.fsseurExt);
        }
        this.props.navigation.navigate('RenseignerService',{
          params: {
            "user_id":params.user_id,
            "user_type":params.user_type,
            "choixgroupe":this.state.choixgrpe, 
            "choixentreprise":this.state.choixentrpse,
            "choixproduit":this.state.choixprdt, 
            "date":this.state.newDate,
            "type":"renseigner",
            "prix_ref":prix_ref,
            "contact":params.contact,
            "categorie":this.state.choixcat,
            "cuvee":this.state.choixcuvee,
            //"fournisseur_id":fssr_id==0? this.state.fssr_id : fssr_id,
            "type_de_vente":this.state.type_vente,
            "groupe_de_vente_id":this.state.type_vente=='groupee'?date+':'+h+':'+m+':'+s:null,
            "choixtypefssr":this.state.choixtypefssr,
            "choixfssr":this.state.choixfssr,
            "fsseurExt":this.state.fsseurExt,

          }
        });
      }
      else if(
        typeof backparams!=='undefined'&&
        backparams.choixgrpe!=null &&
        backparams.choixentrpse!=null &&
        backparams.choixprdt!=null &&
        backparams.newDate!=null)
      {
        if(backparams.choixtypefssr=='externe' && backparams.nom_fournisseur!=null){
          this.savefssr(backparams.nom_fournisseur);
        }
        this.props.navigation.navigate('RenseignerService',{
          params: {
            "user_id":params.user_id,
            "user_type":params.user_type,
            "choixgroupe":backparams.choixgrpe, 
            "choixentreprise":backparams.choixentrpse,
            "choixproduit":backparams.choixprdt, 
            "date":backparams.newDate,
            "type":"renseigner",
            "prix_ref":backparams.prix_ref,
            "contact":params.contact,
            "categorie":backparams.categorie,
            "cuvee":backparams.choixcuvee,
            //"fournisseur_id":backparams.fssr_id,
            "type_de_vente":backparams.type_vente,
            "groupe_de_vente_id":backparams.groupe_vente_id,
            "choixtypefssr":backparams.choixtypefssr,
            "choixfssr":backparams.choixfssr,
            "fsseurExt":backparams.fsseurExt

          }
        });
      }
      else
      {
        alert("Renseignez tous les champs SVP");
      }
    }

    render() {
    
      const{route, navigation}=this.props;
      const {params}  = route.params;
      const {backparams}  = route.params;
      const {isLoading} = this.state;
      const { fsseurExt, email, contact, localisation } = this.state;
      let test=0;
      let valeur='aucune valeur';
      typeof backparams!=='undefined'&& backparams.type_fournisseur=='externe' && fsseurExt==null && backparams.nom_fournisseur!=null?
       valeur=backparams.nom_fournisseur:
       fsseurExt!=null? 
       valeur=fsseurExt:null;
      const fssrs = this.findFournisseur(valeur);
      const state=this.state;
      return (
          <Block  style={styles.choixservice_container}>
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
                      placeholderTextColor="black"
                      value={typeof backparams!=='undefined'&& this.state.choixgrpe==null? backparams.choixgrpe: this.state.choixgrpe}
                      onValueChange={(value) => this.choixentreprise(value)}
                      items={this.state.groupes}
                    />   
                </Block>
                <Text style={{marginTop:20}}>Choisir une entreprise</Text>
                <Block card style={{marginBottom:20,borderColor: theme.COLORS.SUCCESS,}}>
                  <RNPickerSelect
                    style={{
                     // placeholder: {color: "black"},
                      inputIOS: { color: "black" },
                      inputAndroid: { color: "black" },
                    }}
                    placeholder={placeholder2}
                    value={typeof backparams!=='undefined'&& this.state.choixentrpse==null? backparams.choixentrpse: this.state.choixentrpse}
                    onValueChange={(value) => this.choixcategorie(value)}
                    items={this.state.entreprises}
                  /> 
                </Block>
                {
                  (this.state.choixentrpse=='Tropical'||this.state.choixentrpse=='KmerFood'||this.state.choixentrpse=='Agripeel'||this.state.choixentrpse=='Wecare SCI' || typeof backparams!=='undefined'&& backparams.choixentrpse=="KmerFood"||typeof backparams!=='undefined'&& backparams.choixentrpse=="Wecare SCI" ||typeof backparams!=='undefined'&& backparams.choixentrpse=="Tropical" || typeof backparams!=='undefined'&& backparams.choixentrpse=="Agripeel")?
                  <Block>
                    <Text /* style={{marginTop:20}} */>Choisir une categorie de produit</Text>
                    <Block card style={{marginBottom:20, borderColor: theme.COLORS.SUCCESS,}}>
                      <RNPickerSelect
                        style={{
                        // placeholder: {color: "black"},
                          inputIOS: { color: "black" },
                          inputAndroid: { color: "black" },
                        }}
                        placeholder={placeholder4}
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
                          placeholder={placeholder3}
                          value={typeof backparams!=='undefined'&& this.state.choixprdt==null? backparams.choixprdt: this.state.choixprdt} 
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
                        value={typeof backparams!=='undefined'&& this.state.choixcuvee==null? backparams.cuvee: this.state.choixcuvee} 
                        onValueChange={(value) =>this.setState({choixcuvee:value}) }
                        items={this.state.cuvees}
                      />  
                    </Block>
                    {this.state.choixentrpse!="Tropical" && this.state.choixentrpse!="Agripeel"?
                      <Block>
                        <Text>Type de fournisseur</Text>
                        <Block card style={{marginBottom:20, borderColor: theme.COLORS.SUCCESS,}}>
                          <RNPickerSelect
                            style={{
                              //placeholder: {color: "black"},
                              inputIOS: { color: "black" },
                              inputAndroid: { color: "black" },
                            }}
                            placeholder={placeholder6}
                            value={typeof backparams!=='undefined'&& this.state.choixtypefssr==null? backparams.type_fournisseur: this.state.choixtypefssr} 
                            onValueChange={(value) =>this.choixfournisseur(value) }
                            items={[{label:'interne', value:'interne'},{label:'externe', value:'externe'}]}
                          />  
                        </Block>
                      </Block>
                    :null}
                    {
                      this.state.choixtypefssr=='interne'|| typeof backparams!=='undefined' && backparams.type_fournisseur=='interne'?
                      <Block>
                        <Text>choisir le fournisseur</Text>
                        <Block card style={{borderColor: theme.COLORS.SUCCESS,}}>
                          <RNPickerSelect
                            style={{
                              //placeholder: {color: "black"},
                              inputIOS: { color: "black" },
                              inputAndroid: { color: "black" },
                            }}
                            placeholder={placeholder7}
                            value={typeof backparams!=='undefined'&& this.state.choixfssr==null? backparams.nom_fournisseur: this.state.choixfssr} 
                            onValueChange={(value) =>this.setState({choixfssr:value}) }
                            items={this.state.fournisseurs}
                          />  
                        </Block>
                      </Block>
                    : this.state.choixtypefssr=='externe'|| typeof backparams!=='undefined' && backparams.type_fournisseur=='externe'?
                    <Block >
                      <Autocomplete
                        autoCapitalize="none"
                        autoCorrect={false}
                        listContainerStyle={styles.listcontainer}
                        inputContainerStyle={styles.inputcontainerstyle}
                        hideResults={this.state.hide}
                        data={/* fssrs.length === 1  && fssrs[0].nom_fournisseur ? []: */fssrs}
                        defaultValue={typeof backparams!=='undefined' && fsseurExt==null? backparams.nom_fournisseur:fsseurExt}
                        onChangeText={text => this.setState({fsseurExt:text})}
                        placeholder="Nom du fournisseur"
                        placeholderTextColor="black"
                        renderItem={({ item, i }) => (
                          <TouchableOpacity onPress={() =>{this.setState({ fsseurExt: item.nom_fssr, email:item.email,localisation:item.localisation, hide:true})}} 
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
                            <Text adjustsFontSizeToFit>{item.nom_fssr+':\t'+item.localisation+':\t'+item.contact+':\t'+item.email}</Text>
                          </TouchableOpacity>
                        )}  
                      />
                    </Block>:null
                    }
                    
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
                          value={typeof backparams!=='undefined'&& this.state.choixprdt==null? backparams.choixprdt: this.state.choixprdt} 
                          onValueChange={(value) =>this.setState({choixprdt:value}) }
                          items={this.state.service}
                        />  
                    </Block>
                  </Block>
                }             
                <Block style={{ paddingHorizontal: theme.SIZES.BASE, marginTop:20 }}>
                  <Day OnDateChange={this.OnDateChange} />
                  {typeof backparams!=='undefined' && this.state.newDate=="aucune date choisie"?
                    <Block middle><Text>{backparams.newDate}</Text></Block>:
                    <Block middle><Text>{this.state.newDate}</Text></Block>
                    }
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
                  <Button center color="default" 
                    style={styles.optionsButtonr} 
                    onPress={() =>{
                      <ActivityIndicator
                        color="#00ff00"
                        size="large"
                        style = {styles.activityIndicator}
                        animating ={isLoading}
                      />,
                    this.suivant()
                  }}
                  >
                    SUIVANT
                  </Button>
                </Block>
              </Block> 
            </ScrollView>
          </Block>         
      );       
    }
  }
  
  const styles= StyleSheet.create({
    
    choixservice_container:{
      flex:1

    },
    choix_card:{
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
    optionsButtonr: {
      width: "auto",
      height: 34,
      paddingHorizontal: "auto",
      paddingVertical: 10,
      backgroundColor:"orange",
      marginBottom:10,
      marginRight:theme.SIZES.BASE/5,
        
    },
    optionsButtonl: {
      width: "auto",
      height: 34,
      paddingHorizontal: theme.SIZES.BASE/5,
      paddingVertical: 10,
      backgroundColor:"orange",
      //marginTop:-45,
      marginBottom:10,
      marginLeft:theme.SIZES.BASE/5
      
      
    },
    shadow: {
      shadowColor: 'black',
      shadowOffset: { width: 0, height: 4 },
      shadowRadius: 4,
      shadowOpacity: 0.1,
      elevation: 2,
    },
    optionsButtonm: {
      width: "auto",
      height: 34,
      paddingHorizontal: theme.SIZES.BASE/5,
      paddingVertical: 10,
      backgroundColor:"orange",
      //marginTop:-35,
      marginBottom:10,
      marginHorizontal:theme.SIZES.BASE/5
      
      
    },
    tinyLogo: {
      width: 66,
      height: 58
    },
    inputIcons: {
      marginRight: 12
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
      //height:"110%",
      //marginRight:"30%"
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
    }
  })

  export default Choix_service_renseigner;