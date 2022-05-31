import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Alert, Dimensions,Linking,Text, ActivityIndicator } from 'react-native';
import { Table, TableWrapper, Row,  Col, Cell} from 'react-native-table-component';
import { Block, theme} from "galio-framework";
 
import { Button} from "../components";
import { argonTheme } from '../constants';

const { width, height } = Dimensions.get("screen");
const racine = 'https://tracking.socecepme.com/api/';
export default class Consulter_les_revenus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      myArray: [],
      header: [],
      widthArr: [],
      url:'',
      isLoading:true
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
  closeActivityIndicator = () => setTimeout(() => this.setState({
    isLoading: false }), 60000)
  componentDidMount(){
    const state = this.state;
    const { navigation, route } = this.props;
    const { params } = route.params;
  
    console.log(params);
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };

    fetch(`${racine}consulter/${params.groupe}/${params.entreprise}/${params.categorie}/${params.service_prdt}/${params.user_id}/${params.user_type}/${params.contact}/${params.startDate}/${params.endDate}`, requestOptions)
    .then(response => response.text())
    .then(result => {
      var rslt = JSON.parse(result);
      console.log("rslttttt", rslt);
      if(rslt['status'] === 'ok' && rslt['data'].length>0) {
        let myArray = rslt['data'];
        let header = rslt['header'];
        let widthArr=[];
        for(let i=0; i < header.length; i++) {
          widthArr.push(100);
        }
        this.setState({myArray, isLoading:false, header, widthArr});
        //this.closeActivityIndicator();
      }
      else{
        alert('desole pas de resultat disponible');
      }
      
    })
    .catch(error => {
      console.log(error);
      alert("erreur de chargement des donnees");
    });

    var requestOptions2 = {
      method: 'GET',
      redirect: 'follow'
    };

    fetch(`${racine}exportconsulter/${params.groupe}/${params.entreprise}/${params.categorie}/${params.service_prdt}/${params.user_id}/${params.user_type}/${params.contact}/${params.startDate}/${params.endDate}`, requestOptions2)
    .then(response => response.text())
    .then(result => {
      var rslt = JSON.parse(result);
      if(rslt['status']=='ok' && rslt['url'].length > 0){
        let url = rslt['url'];
        this.setState({url});
      }
      else{
        alert('desole pas de resultat disponible');
      }
      
    })
    .catch(error => {
      console.log(error);
      alert("erreur de chargement des donnees");
    });

  }
  exporter(){

    const state = this.state;
    const { navigation, route } = this.props;
    const { params } = route.params;

    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };

    fetch(`${racine}exportconsulter/${params.groupe}/${params.entreprise}/${params.categorie}/${params.service_prdt}/${params.user_id}/${params.user_type}/${params.contact}/${params.startDate}/${params.endDate}`, requestOptions)
    .then(response => response.text())
    .then(result => {
      console.log(result);
      var rslt = JSON.parse(result);
      if(rslt['status']==='ok' && rslt['url'].length>0){
        let url = rslt['url'];
        //this.setState({url});
        Linking.openURL(url);
      }
      else{
        alert('desole pas de resultat disponible');
      }
      
    })
    .catch(error => {
      console.log(error);
      alert("erreur de chargement des donnees");
    });
    
  }
  render() {

    const state = this.state;
    const { navigation, route } = this.props;
    const { params } = route.params;
    let tableHead = state.header;
    let widthArr = state.widthArr;
    console.log('paramssss', params)
    //let tableHead= ['Date','Reference de la vente','Statut de la vente','Groupe','Entreprise','categorie','produit', 'cuvee/batch','unite de mesure','fournisseur/type fournisseur','Prix de reference','prix de vente','remise','variation', 'quantite', 'total vente','Total M-1','Total N-1','YTD','LYTD','YTD var','commercial','commentaire commercial', 'remarques du responsable','nom du client', 'telephone du client', 'Email du client', 'Localiation du client'];
    //let widthArr=[100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100];
    
    const { isLoading } = this.state;
    
    //cas commercial: un produit
    if(params.service_prdt!=="toutprod" && params.service_prdt!=="service" && params.entreprise!=="toutentr" && params.groupe!="toutgrpe" && params.user_type==8 && params.categorie !== 'toutcat' && params.cuvee === null){
    
      let tableData=[];
      state.myArray.map((item)=>
        item.etat!="rejete"?
        tableData.push([
        item.date_vente,
        item.reference,
        item.etat=="a modifier" ? <Button  style={styles.btn} onPress={() =>navigation.navigate("RenseignerService",{
          params:{
          "choixentreprise": params.entreprise,
          "choixproduit": params.service_prdt,
          "choixref": item.reference, 
          "type": "modif",
          "modif": "ref",
          "reprise": "oui",
          "date": item.date_vente,
          "type_user": params.user_type,
          "raison_responsable": item.raison_responsable,
          "remise": item.remise,
          "mode_de_paiement": item.mode_de_paiement,
          "poste": params.poste,
          "cuvee": item.cuvee,
          "categorie": item.categorie,
          "fournisseur": item.fournisseur,
          "prix_de_reference": item.prix_de_reference
        }})}>{item.etat}</Button> : 
        item.etat,
        item.groupe,
        item.raison_social,
        item.categorie,
        item.nom,
        item.cuvee,
        item.unite,
        item.fournisseur,
        item.prix_de_reference,
        this.formatMillier(item.prix_de_vente),
        item.remise,
        item.mode_de_paiement === 1 ? 'comptant': 'a credit' ,
        item.type_entree === 1 ? 'revenu': 'autre entree',
        item.variation,
        item.quantite,
        item.total,
        item.lastmonth,
        item.lastyear,
        item.ytd,
        item.lytd,
        item.varYTD,
        item.nom_user,
        item.commentaire_commercial,
        item.raison_responsable,
        item.nom_client,
        item.contact,
        item.email,
        item.localisation
      ])
      :test=0
      );
      console.log(tableData);
      console.log("test============"+tableHead+"test2++++++++++:"+tableData);
      return (
        <View style={styles.globale_container}>
          <Block  right>
            <Button center color="default"
              onPress={() => Linking.openURL(state.url)}
              style={styles.optionsButtone}> 
              EXPORTER
            </Button> 
             {/* <Button center color="default"
              onPress={() => this.exporter()}
              style={styles.optionsButtone}> 
              EXPORTER
            </Button> */}
          </Block>
        <View style={styles.container}>
          <ScrollView horizontal={true}>
            <View>
              <Block>
                  <Text  h1
                    style={styles.caption}
                  >
                      Details des ventes de: {params.service_prdt} du {params.startDate} au {params.endDate}
                  </Text>
                </Block> 
                <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                  <Row data={tableHead} style={styles.header}  widthArr={widthArr} textStyle={styles.titleText}/>
                </Table>
                <ScrollView style={styles.dataWrapper}>
                  <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                    {tableData.map((rowData,index)=>  
                      <Row
                        data={rowData}
                        key={index}
                        widthArr={widthArr}
                        style={[styles.row,index%2 && {backgroundColor: '#F7F6E7'}]}
                        textStyle={styles.text}
                      />
                    )}
                  </Table>
                  <ActivityIndicator
                    color="#00ff00"
                    size="large"
                    style = {styles.activityIndicator}
                    animating ={isLoading}
                  /> 
                </ScrollView>
            </View>
          </ScrollView>
        </View>
        </View>
      )
    }
    //commercial tous les produits d'une categorie
    if(params.service_prdt === "toutprod" && params.entreprise!=='toutentr'&& params.groupe!='toutgrpe' && params.categorie !== "categorie"  &&  params.categorie !== "toutcat"  && params.user_type === 8){
    
      let tableData=[];
      state.myArray.map((item)=>
        item.etat!="rejete" && params.categorie==item.categorie?
        tableData.push([
        item.date_vente,
        item.reference,
        item.etat=="a modifier" ? <Button  style={styles.btn} onPress={() =>navigation.navigate("RenseignerService",{
          params:{
          "choixentreprise": params.entreprise,
          "choixproduit": params.service_prdt,
          "choixref": item.reference, 
          "type":"modif",
          "modif":"ref",
          "reprise":"oui",
          "date": item.date_vente,
          "type_user": params.user_type,
          "raison_responsable": item.raison_responsable,
          "remise": item.remise,
          "mode_de_paiement": item.mode_de_paiement,
          "cuvee": item.cuvee,
          "categorie": item.categorie,
          "fournisseur": item.fournisseur,
          "poste": params.poste,
          "prix_de_reference": item.prix_de_reference
        }})}>{item.etat}</Button> : 
        item.etat,
        item.groupe,
        item.raison_social,
        item.categorie,
        item.nom,
        item.cuvee,
        item.unite,
        item.fournisseur,
        item.prix_de_reference,
        this.formatMillier(item.prix_de_vente),
        item.remise,
        item.mode_de_paiement === 1 ? 'comptant': 'a credit' ,
        item.type_entree === 1 ? 'revenu': 'autre entree',
        item.variation,
        item.quantite,
        item.total,
        item.lastmonth,
        item.lastyear,
        item.ytd,
        item.lytd,
        item.varYTD,
        item.nom_user,
        item.commentaire_commercial,
        item.raison_responsable,
        item.nom_client,
        item.contact,
        item.email,
        item.localisation
      ])
      :test=0
      );
      console.log(tableData);
      console.log("test============"+tableHead+"test2++++++++++:"+tableData);
      return (
        <View style={styles.globale_container}>
          <Block  right>
            <Button center color="default"
              onPress={() => Linking.openURL(state.url)}
              style={styles.optionsButtone}> 
              EXPORTER
            </Button> 
          </Block>
        <View style={styles.container}>
          <ScrollView horizontal={true}>
            <View>
              <Block>
                  <Text  h1
                    style={styles.caption}
                  >
                    Details des ventes de: {params.entreprise} categorie {params.categorie} du {params.startDate} au {params.endDate}
                  </Text>
                </Block> 
                <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                  <Row data={tableHead} style={styles.header}  widthArr={widthArr} textStyle={styles.titleText}/>
                </Table>
                <ScrollView style={styles.dataWrapper}>
                  <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                    {tableData.map((rowData,index)=>  
                      <Row
                        data={rowData}
                        key={index}
                        widthArr={widthArr}
                        style={[styles.row,index%2 && {backgroundColor: '#F7F6E7'}]}
                        textStyle={styles.text}
                      />
                    )}
                  </Table>
                  <ActivityIndicator
                    color="#00ff00"
                    size="large"
                    style = {styles.activityIndicator}
                    animating ={isLoading}
                  /> 
                </ScrollView>
            </View>
          </ScrollView>
        </View>
        </View>
      )
    }
    //commercial:tous les produits pour ceux qui n'ont pas de categorie
    else if(params.service_prdt === "toutprod" && params.entreprise!=='toutentr'&& params.groupe!='toutgrpe'&& params.categorie === "categorie"   && params.user_type === 8)
    {

      let tableData=[], test=0;
      state.myArray.map((item)=>
        item.etat!="rejete"?
        tableData.push([
        item.date_vente,
        item.reference,
        item.etat === "a modifier" ? <Button  style={styles.btn} onPress={() =>navigation.navigate("RenseignerService",{
          params:{
          "choixentreprise": item.raison_social,
          "choixproduit": item.nom,
          "choixref": item.reference, 
          "type": "modif",
          "modif": "ref",
          "reprise": "oui",
          "date": item.date_vente,
          "type_user": params.user_type,
          "raison_responsable": item.raison_responsable,
          "remise":item.remise,
          "mode_de_paiement": item.mode_de_paiement,
          "cuvee": item.cuvee,
          "categorie": item.categorie,
          "fournisseur": item.fournisseur,
          "poste": params.poste,
          "prix_de_reference": item.prix_de_reference
        }})}>{item.etat}</Button> : 
        item.etat,
        item.groupe,
        item.raison_social,
        item.categorie,
        item.nom,
        item.cuvee,
        item.unite,
        item.fournisseur,
        item.prix_de_reference,
        this.formatMillier(item.prix_de_vente),
        item.remise,
        item.mode_de_paiement === 1 ? 'comptant': 'a credit' ,
        item.type_entree === 1 ? 'revenu': 'autre entree',
        item.variation,
        item.quantite,
        item.total,
        item.lastmonth,
        item.lastyear,
        item.ytd,
        item.lytd,
        item.varYTD,
        item.nom_user,
        item.commentaire_commercial,
        item.raison_responsable,
        item.nom_client,
        item.contact,
        item.email,
        item.localisation
      ])
      :test=0
      );
      console.log(tableData);
      console.log("test============"+tableHead+"test2++++++++++:"+tableData);
      return (
        <View style={styles.globale_container}>
          <Block  right>
            <Button center color="default"
              onPress={() => Linking.openURL(state.url)}
              style={styles.optionsButtone}> 
              EXPORTER
            </Button>
          </Block>
        <View style={styles.container}>
          <ScrollView horizontal={true}>
            <View>
              <Block>
                <Text  h1
                  style={styles.caption}
                >
                    Details des ventes de: {params.entreprise} du {params.startDate} au {params.endDate}
                </Text>
                </Block> 
                <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                  <Row data={tableHead} style={styles.header}  widthArr={widthArr} textStyle={styles.titleText}/>
                </Table>
                <ScrollView style={styles.dataWrapper}>
                  <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                    {tableData.map((rowData,index)=>  
                      <Row
                        data={rowData}
                        key={index}
                        widthArr={widthArr}
                        style={[styles.row,index%2 && {backgroundColor: '#F7F6E7'}]}
                        textStyle={styles.text}
                      />
                    )}
                  </Table>
                  <ActivityIndicator
                    color="#00ff00"
                    size="large"
                    style = {styles.activityIndicator}
                    animating ={isLoading}
                  />   
                </ScrollView>    
            </View>
          </ScrollView>
        </View>
        </View>
      )
     
    }
    //cas commercial par cuvee
    else if(params.service_prdt !== "toutprod" && params.entreprise!=='toutentr'&& params.groupe!='toutgrpe' && params.cuvee!==null && params.categorie!='categorie' && params.categorie!='toutcat' && params.user_type==8)
    {

      let tableData=[], test=0;
      state.myArray.map((item)=>
        item.etat!="rejete" && item.cuvee==params.cuvee?
        tableData.push([
        item.date_vente,
        item.reference,
        item.etat=="a modifier" ? <Button  style={styles.btn} onPress={() =>navigation.navigate("RenseignerService",{
          params:{
          "choixentreprise": item.raison_social,
          "choixproduit": item.nom,
          "choixref": item.reference, 
          "type": "modif",
          "modif": "ref",
          "reprise": "oui",
          "date": item.date_vente,
          "type_user": params.user_type,
          "raison_responsable": item.raison_responsable,
          "remise": item.remise,
          "mode_de_paiement": item.mode_de_paiement,
          "cuvee": item.cuvee,
          "categorie": item.categorie,
          "fournisseur": item.fournisseur,
          "poste": params.poste,
          "prix_de_reference": item.prix_de_reference
        }})}>{item.etat}</Button> : 
        item.etat,
        item.groupe,
        item.raison_social,
        item.categorie,
        item.nom,
        item.cuvee,
        item.unite,
        item.fournisseur,
        item.prix_de_reference,
        this.formatMillier(item.prix_de_vente),
        item.remise,
        item.mode_de_paiement === 1 ? 'comptant': 'a credit' ,
        item.type_entree === 1 ? 'revenu': 'autre entree',
        item.variation,
        item.quantite,
        item.total,
        item.lastmonth,
        item.lastyear,
        item.ytd,
        item.lytd,
        item.varYTD,
        item.nom_user,
        item.commentaire_commercial,
        item.raison_responsable,
        item.nom_client,
        item.contact,
        item.email,
        item.localisation
      ])
      :test=0
      );
      console.log(tableData);
      console.log("test============"+tableHead+"test2++++++++++:"+tableData);
      return (
        <View style={styles.globale_container}>
          <Block  right>
            <Button center color="default"
              onPress={() => Linking.openURL(state.url)}
              style={styles.optionsButtone}> 
              EXPORTER
            </Button>
          </Block>
        <View style={styles.container}>
          <ScrollView horizontal={true}>
            <View>
              <Block>
                <Text  h1
                  style={styles.caption}
                >
                    Details des ventes de: {params.entreprise} cuvee {params.cuvee} du {params.startDate} au {params.endDate}
                </Text>
                </Block> 
                <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                  <Row data={tableHead} style={styles.header}  widthArr={widthArr} textStyle={styles.titleText}/>
                </Table>
                <ScrollView style={styles.dataWrapper}>
                  <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                    {tableData.map((rowData,index)=>  
                      <Row
                        data={rowData}
                        key={index}
                        widthArr={widthArr}
                        style={[styles.row,index%2 && {backgroundColor: '#F7F6E7'}]}
                        textStyle={styles.text}
                      />
                    )}
                  </Table>
                  <ActivityIndicator
                    color="#00ff00"
                    size="large"
                    style = {styles.activityIndicator}
                    animating ={isLoading}
                  />   
                </ScrollView>    
            </View>
          </ScrollView>
        </View>
        </View>
      )
     
    }
    //cas commercial...toutes les entreprises
    else if(params.entreprise === "toutentr" && params.user_type==8)
    {

      let tableData=[], test=0;
      state.myArray.map((item)=>
        item.etat!="rejete"?
        tableData.push([
        item.date_vente,
        item.reference,
        item.etat=="a modifier" ? <Button  style={styles.btn} onPress={() =>navigation.navigate("RenseignerService",{
          params:{
          "choixentreprise":item.raison_social,
          "choixproduit":item.nom,
          "choixref":item.reference, 
          "type":"modif",
          "modif":"ref",
          "reprise":"oui",
          "date":item.date_vente,
          "type_user":params.user_type,
          "raison_responsable":item.raison_responsable,
          "remise":item.remise,
          "mode_de_paiement": item.mode_de_paiement,
          "cuvee":item.cuvee,
          "categorie":item.categorie,
          "fournisseur":item.fournisseur,
          "poste": params.poste,
          "prix_de_reference":item.prix_de_reference
        }})}>{item.etat}</Button> : 
        item.etat,
        item.groupe,
        item.raison_social,
        item.categorie,
        item.nom,
        item.cuvee,
        item.unite,
        item.fournisseur,
        item.prix_de_reference,
        this.formatMillier(item.prix_de_vente),
        item.remise,
        item.mode_de_paiement === 1 ? 'comptant': 'a credit' ,
        item.type_entree === 1 ? 'revenu': 'autre entree',
        item.variation,
        item.quantite,
        item.total,
        item.lastmonth,
        item.lastyear,
        item.ytd,
        item.lytd,
        item.varYTD,
        item.nom_user,
        item.commentaire_commercial,
        item.raison_responsable,
        item.nom_client,
        item.contact,
        item.email,
        item.localisation
      ])
      :test=0
      );
      console.log(tableData);
      console.log("test============"+tableHead+"test2++++++++++:"+tableData);
      return (
        <View style={styles.globale_container}>
          <Block  right>
            <Button center color="default"
              onPress={() => Linking.openURL(state.url)}
              style={styles.optionsButtone}> 
              EXPORTER
            </Button>
          </Block>
        <View style={styles.container}>
          <ScrollView horizontal={true}>
            <View>
              <Block>
                <Text  h1
                  style={styles.caption}
                >
                    Details des ventes de: {params.groupe} du {params.startDate} au {params.endDate}
                </Text>
                </Block> 
                <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                  <Row data={tableHead} style={styles.header}  widthArr={widthArr} textStyle={styles.titleText}/>
                </Table>
                <ScrollView style={styles.dataWrapper}>
                  <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                    {tableData.map((rowData,index)=>  
                      <Row
                        data={rowData}
                        key={index}
                        widthArr={widthArr}
                        style={[styles.row,index%2 && {backgroundColor: '#F7F6E7'}]}
                        textStyle={styles.text}
                      />
                    )}
                  </Table>
                  <ActivityIndicator
                    color="#00ff00"
                    size="large"
                    style = {styles.activityIndicator}
                    animating ={isLoading}
                  /> 
                </ScrollView>
            </View>
          </ScrollView>
        </View>
        </View>
      )
     
    }
    //cas commercial...tous les groupes
    else if(params.groupe === "toutgrpe" && params.user_type==8)
    {

      let tableData=[], test=0;
      state.myArray.map((item)=>
        item.etat!="rejete"?
        tableData.push([
        item.date_vente,
        item.reference,
        item.etat=="a modifier" ? <Button  style={styles.btn} onPress={() =>navigation.navigate("RenseignerService",{
          params:{
          "choixentreprise": item.raison_social,
          "choixproduit": item.nom,
          "choixref": item.reference, 
          "type": "modif",
          "modif": "ref",
          "reprise": "oui",
          "date": item.date_vente,
          "type_user": params.user_type,
          "raison_responsable": item.raison_responsable,
          "remise": item.remise,
          "mode_de_paiement": item.mode_de_paiement,
          "cuvee": item.cuvee,
          "categorie": item.categorie,
          "fournisseur": item.fournisseur,
          "poste": params.poste,
          "prix_de_reference": item.prix_de_reference
        }})}>{item.etat}</Button> : 
        item.etat,
        item.groupe,
        item.raison_social,
        item.categorie,
        item.nom,
        item.cuvee,
        item.unite,
        item.fournisseur,
        item.prix_de_reference,
        this.formatMillier(item.prix_de_vente),
        item.remise,
        item.mode_de_paiement === 1 ? 'comptant': 'a credit' ,
        item.type_entree === 1 ? 'revenu': 'autre entree',
        item.variation,
        item.quantite,
        item.total,
        item.lastmonth,
        item.lastyear,
        item.ytd,
        item.lytd,
        item.varYTD,
        item.nom_user,
        item.commentaire_commercial,
        item.raison_responsable,
        item.nom_client,
        item.contact,
        item.email,
        item.localisation
      ])
      :test=0
      );
      console.log(tableData);
      console.log("test============"+tableHead+"test2++++++++++:"+tableData);
    
      return (
        <View style={styles.globale_container}>
          <Block  right>
            <Button center color="default"
              onPress={() => Linking.openURL(state.url)}
              style={styles.optionsButtone}> 
              EXPORTER
            </Button>
          </Block>
        <View style={styles.container}>
          <ScrollView horizontal={true}>
            <View>
              <Block>
                <Text  h1
                  style={styles.caption}
                >
                  Details des ventes Holding du {params.startDate} au {params.endDate}
                </Text>
                </Block> 
                <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                  <Row data={tableHead} style={styles.header}  widthArr={widthArr} textStyle={styles.titleText}/>
                </Table>
                <ScrollView style={styles.dataWrapper}>
                  <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                    {tableData.map((rowData,index)=>  
                      <Row
                        data={rowData}
                        key={index}
                        widthArr={widthArr}
                        style={[styles.row,index%2 && {backgroundColor: '#F7F6E7'}]}
                        textStyle={styles.text}
                      />
                    )}
                  </Table>
                  <ActivityIndicator
                    color="#00ff00"
                    size="large"
                    style = {styles.activityIndicator}
                    animating ={isLoading}
                  /> 
                </ScrollView>
            </View>
          </ScrollView>
        </View>
        </View>
      )
    }
    //cas directeur...un produit
    else if(params.service_prdt !== "toutprod" && params.entreprise !== "toutentr" && params.groupe !== "toutgrpe" && params.user_type==2 && params.categorie !== "toutcat" && params.cuvee === null){
      let tableData=[], test=0;
      state.myArray.map((item)=>
        item.etat!="rejete"?
        tableData.push([
        item.date_vente,
        item.reference,
        item.etat=="modifie" ? 
        <Button center style={styles.btn} onPress={() =>
          navigation.navigate("ValidationTracking",{
          params:{
            "prix_unitaire": item.prix_de_vente, 
            "quantite": item.quantite, 
            "preuve": item.preuve, 
            "prix_de_reference": item.prix_de_reference, 
            "produit": item.nom, 
            "date": item.date_vente, 
            "commentaire_commercial": item.commentaire_commercial, 
            "user_id": item.user_id, 
            "produit_service_id": item.produit_service_id, 
            "reference": item.reference,
            "validation":"modifier",
            "remise": item.remise,
            "mode_de_paiement": item.mode_de_paiement,
            "cuvee": item.cuvee,
            "categorie": item.categorie,
            "fournisseur": item.fournisseur,
            "poste": params.poste,
            "vente_id": item.vente_id,
            "modif_id": item.modif_id}})}>{item.etat}
        </Button> : 
        item.etat,
        item.groupe,
        item.raison_social,
        item.categorie,
        item.nom,
        item.cuvee,
        item.unite,
        item.fournisseur,
        item.prix_de_reference,
        this.formatMillier(item.prix_de_vente),
        item.remise,
        item.mode_de_paiement === 1 ? 'comptant': 'a credit' ,
        item.type_entree === 1 ? 'revenu': 'autre entree',
        item.variation,
        item.quantite,
        item.total,
        item.lastmonth,
        item.lastyear,
        item.ytd,
        item.lytd,
        item.varYTD,
        item.nom_user,
        item.commentaire_commercial,
        item.raison_responsable,
        item.nom_client,
        item.contact,
        item.email,
        item.localisation
      ])
      :test=0
      );
      console.log(tableData);
      console.log("test============"+tableHead+"test2++++++++++:"+tableData);
    
      return (
        <View style={styles.globale_container}>
          <Block  right>
            <Button center color="default"
              onPress={() => Linking.openURL(state.url)}
              style={styles.optionsButtone}> 
              EXPORTER
            </Button>
          </Block>
        <View style={styles.container}>
          <ScrollView horizontal={true}>
            <View>
              <Block>
                <Text  h1
                  style={styles.caption}
                >
                    Details des ventes de: {params.entreprise} {params.service_prdt} du {params.startDate} au {params.endDate}
                </Text>
                </Block> 
                <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                  <Row data={tableHead} style={styles.header}  widthArr={widthArr} textStyle={styles.titleText}/>
                </Table>
                <ScrollView style={styles.dataWrapper}>
                  <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                    {tableData.map((rowData,index)=>  
                      <Row
                        data={rowData}
                        key={index}
                        widthArr={widthArr}
                        style={[styles.row,index%2 && {backgroundColor: '#F7F6E7'}]}
                        textStyle={styles.text}
                      />
                    )}
                  </Table>
                  <ActivityIndicator
                    color="#00ff00"
                    size="large"
                    style = {styles.activityIndicator}
                    animating ={isLoading}
                  /> 
                </ScrollView>
            </View>
          </ScrollView>
        </View>
        </View>
      );
    }
    //cas directeur tous les produits d'une categorie
    else if(params.service_prdt === "toutprod" && params.entreprise !=='toutentr' && params.groupe!='toutgrpe' && params.categorie !== "categorie"  &&  params.categorie !== "toutcat"  && params.user_type === 2){
      let tableData=[], test=0;
      state.myArray.map((item)=>
        item.etat!="rejete" && item.categorie==params.categorie?
        tableData.push([
        item.date_vente,
        item.reference,
        item.etat=="modifie" ? 
        <Button center style={styles.btn} onPress={() =>
          navigation.navigate("ValidationTracking",{
          params:{
            "prix_unitaire":item.prix_de_vente, 
            "quantite":item.quantite, 
            "preuve":item.preuve, 
            "prix_de_reference":item.prix_de_reference, 
            "produit":item.nom, 
            "date":item.date_vente, 
            "commentaire_commercial":item.commentaire_commercial, 
            "user_id":item.user_id, 
            "produit_service_id":item.produit_service_id, 
            "reference":item.reference,
            "validation":"modifier",
            "remise":item.remise,
            "mode_de_paiement": item.mode_de_paiement,
            "cuvee":item.cuvee,
            "categorie":item.categorie,
            "fournisseur":item.fournisseur,
            "poste": params.poste,
            "vente_id": item.vente_id,
            "modif_id":item.modif_id}})}>{item.etat}
        </Button> : 
        item.etat,
        item.groupe,
        item.raison_social,
        item.categorie,
        item.nom,
        item.cuvee,
        item.unite,
        item.fournisseur,
        item.prix_de_reference,
        this.formatMillier(item.prix_de_vente),
        item.remise,
        item.mode_de_paiement === 1 ? 'comptant': 'a credit' ,
        item.type_entree === 1 ? 'revenu': 'autre entree',
        item.variation,
        item.quantite,
        item.total,
        item.lastmonth,
        item.lastyear,
        item.ytd,
        item.lytd,
        item.varYTD,
        item.nom_user,
        item.commentaire_commercial,
        item.raison_responsable,
        item.nom_client,
        item.contact,
        item.email,
        item.localisation
      ])
      :test=0
      );
      console.log(tableData);
      console.log("test============"+tableHead+"test2++++++++++:"+tableData);
    
      return (
        <View style={styles.globale_container}>
          <Block  right>
            <Button center color="default"
              onPress={() => Linking.openURL(state.url)}
              style={styles.optionsButtone}> 
              EXPORTER
            </Button>
          </Block>
        <View style={styles.container}>
          <ScrollView horizontal={true}>
            <View>
              <Block>
                <Text  h1
                  style={styles.caption}
                >
                    Details des ventes de: {params.service_prdt} du {params.startDate} au {params.endDate}
                </Text>
                </Block> 
                <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                  <Row data={tableHead} style={styles.header}  widthArr={widthArr} textStyle={styles.titleText}/>
                </Table>
                <ScrollView style={styles.dataWrapper}>
                  <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                    {tableData.map((rowData,index)=>  
                      <Row
                        data={rowData}
                        key={index}
                        widthArr={widthArr}
                        style={[styles.row,index%2 && {backgroundColor: '#F7F6E7'}]}
                        textStyle={styles.text}
                      />
                    )}
                  </Table>
                  <ActivityIndicator
                    color="#00ff00"
                    size="large"
                    style = {styles.activityIndicator}
                    animating ={isLoading}
                  /> 
                </ScrollView>
            </View>
          </ScrollView>
        </View>
        </View>
      );
    }
    //directeur:tous les produits pour ceux qui n'ont pas de categorie
    else if(params.service_prdt === "toutprod" && params.entreprise!=='toutentr'&& params.groupe!='toutgrpe'&& params.categorie === "categorie"   && params.user_type === 2) {
      let tableData=[], test=0;
      state.myArray.map((item)=>
        item.etat!="rejete"?
        tableData.push([
        item.date_vente,
        item.reference,
        item.etat=="modifie" ? 
        <Button center style={styles.btn} onPress={() =>
          navigation.navigate("ValidationTracking",{
          params:{
            "prix_unitaire": item.prix_de_vente, 
            "quantite": item.quantite, 
            "preuve": item.preuve, 
            "prix_de_reference": item.prix_de_reference, 
            "produit": item.nom, 
            "date": item.date_vente, 
            "commentaire_commercial": item.commentaire_commercial, 
            "user_id": item.user_id, 
            "produit_service_id": item.produit_service_id, 
            "reference": item.reference,
            "validation": "modifier",
            "remise": item.remise,
            "mode_de_paiement": item.mode_de_paiement,
            "cuvee": item.cuvee,
            "categorie": item.categorie,
            "fournisseur":item.fournisseur,
            "poste": params.poste,
            "vente_id": item.vente_id,
            'modif_id':item.modif_id}})}>{item.etat}
        </Button> : 
        item.etat,
        item.groupe,
        item.raison_social,
        item.categorie,
        item.nom,
        item.cuvee,
        item.unite,
        item.fournisseur,
        item.prix_de_reference,
        this.formatMillier(item.prix_de_vente),
        item.remise,
        item.mode_de_paiement === 1 ? 'comptant': 'a credit' ,
        item.type_entree === 1 ? 'revenu': 'autre entree',
        item.variation,
        item.quantite,
        item.total,
        item.lastmonth,
        item.lastyear,
        item.ytd,
        item.lytd,
        item.varYTD,
        item.nom_user,
        item.commentaire_commercial,
        item.raison_responsable,
        item.nom_client,
        item.contact,
        item.email,
        item.localisation
      ])
      :test=0
      );
      console.log(tableData);
      console.log("test============"+tableHead+"test2++++++++++:"+tableData);
    
      return (
        <View style={styles.globale_container}>
          <Block  right>
            <Button center color="default"
              onPress={() => Linking.openURL(state.url)}
              style={styles.optionsButtone}> 
              EXPORTER
            </Button>
          </Block>
        <View style={styles.container}>
          <ScrollView horizontal={true}>
            <View>
              <Block>
                <Text  h1
                  style={styles.caption}
                >
                  Details des ventes de: {params.entreprise} du {params.startDate} au {params.endDate}
                </Text>
              </Block> 
              <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                <Row data={tableHead} style={styles.header}  widthArr={widthArr} textStyle={styles.titleText}/>
              </Table>
              <ScrollView style={styles.dataWrapper}>
                <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                  {tableData.map((rowData,index)=>  
                    <Row
                      data={rowData}
                      key={index}
                      widthArr={widthArr}
                      style={[styles.row,index%2 && {backgroundColor: '#F7F6E7'}]}
                      textStyle={styles.text}
                    />
                  )}
                </Table>
                <ActivityIndicator
                  color="#00ff00"
                  size="large"
                  style = {styles.activityIndicator}
                  animating ={isLoading}
                /> 
              </ScrollView>
            </View>
          </ScrollView>
        </View>
        </View>
      )
    }
    //cas directeur par cuvee
    else if(params.service_prdt !== "toutprod" && params.entreprise !== 'toutentr'&& params.groupe !== 'toutgrpe' && params.cuvee !== null && params.categorie !== 'categorie' && params.categorie !== 'toutcat' && params.user_type === 2) {
      let tableData=[], test=0;
      state.myArray.map((item)=>
        item.etat!="rejete" && item.cuvee==params.cuvee?
        tableData.push([
        item.date_vente,
        item.reference,
        item.etat=="modifie" ? 
        <Button center style={styles.btn} onPress={() =>
          navigation.navigate("ValidationTracking",{
          params:{
            "prix_unitaire":item.prix_de_vente, 
            "quantite":item.quantite, 
            "preuve":item.preuve, 
            "prix_de_reference":item.prix_de_reference, 
            "produit":item.nom, 
            "date":item.date_vente, 
            "commentaire_commercial":item.commentaire_commercial, 
            "user_id":item.user_id, 
            "produit_service_id":item.produit_service_id, 
            "reference":item.reference,
            "validation":"modifier",
            "remise":item.remise,
            "mode_de_paiement": item.mode_de_paiement,
            "cuvee":item.cuvee,
            "categorie":item.categorie,
            "fournisseur":item.fournisseur,
            "poste": params.poste,
            "vente_id": item.vente_id,
            'modif_id':item.modif_id}})}>{item.etat}
        </Button> : 
        item.etat,
        item.groupe,
        item.raison_social,
        item.categorie,
        item.nom,
        item.cuvee,
        item.unite,
        item.fournisseur,
        item.prix_de_reference,
        this.formatMillier(item.prix_de_vente),
        item.remise,
        item.mode_de_paiement === 1 ? 'comptant': 'a credit' ,
        item.type_entree === 1 ? 'revenu': 'autre entree',
        item.variation,
        item.quantite,
        item.total,
        item.lastmonth,
        item.lastyear,
        item.ytd,
        item.lytd,
        item.varYTD,
        item.nom_user,
        item.commentaire_commercial,
        item.raison_responsable,
        item.nom_client,
        item.contact,
        item.email,
        item.localisation
      ])
      :test=0
      );
      console.log(tableData);
      console.log("test============"+tableHead+"test2++++++++++:"+tableData);
    
      return (
        <View style={styles.globale_container}>
          <Block  right>
            <Button center color="default"
              onPress={() => Linking.openURL(state.url)}
              style={styles.optionsButtone}> 
              EXPORTER
            </Button>
          </Block>
        <View style={styles.container}>
          <ScrollView horizontal={true}>
            <View>
              <Block>
                <Text  h1
                  style={styles.caption}
                >
                    Details des ventes de: {params.entreprise} du {params.startDate} au {params.endDate}
                </Text>
              </Block> 
              <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                <Row data={tableHead} style={styles.header}  widthArr={widthArr} textStyle={styles.titleText}/>
              </Table>
              <ScrollView style={styles.dataWrapper}>
                <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                  {tableData.map((rowData,index)=>  
                    <Row
                      data={rowData}
                      key={index}
                      widthArr={widthArr}
                      style={[styles.row,index%2 && {backgroundColor: '#F7F6E7'}]}
                      textStyle={styles.text}
                    />
                  )}
                </Table>
                <ActivityIndicator
                  color="#00ff00"
                  size="large"
                  style = {styles.activityIndicator}
                  animating ={isLoading}
                /> 
              </ScrollView>
            </View>
          </ScrollView>
        </View>
        </View>
      )
    }
    //cas directeur toutes les entreprises
    else if(params.entreprise === "toutentr" && params.user_type === 2){
      let tableData=[], test=0;
      state.myArray.map((item)=>
        item.etat!="rejete"?
        tableData.push([
        item.date_vente,
        item.reference,
        item.etat=="modifie" ? 
        <Button center style={styles.btn} onPress={() =>
          navigation.navigate("ValidationTracking",{
          params:{
            "prix_unitaire": item.prix_de_vente, 
            "quantite": item.quantite, 
            "preuve": item.preuve, 
            "prix_de_reference": item.prix_de_reference, 
            "produit": item.nom,
            "date":item.date_vente, 
            "commentaire_commercial": item.commentaire_commercial, 
            "user_id": item.user_id, 
            "produit_service_id": item.produit_service_id, 
            "reference": item.reference,
            "validation":"modifier",
            "remise": item.remise,
            "mode_de_paiement": item.mode_de_paiement,
            "cuvee": item.cuvee,
            "categorie": item.categorie,
            "fournisseur": item.fournisseur,
            "poste": params.poste,
            "vente_id": item.vente_id,
            "modif_id": item.modif_id}})}>{item.etat}
        </Button> : 
        item.etat,
        item.groupe,
        item.raison_social,
        item.categorie,
        item.nom,
        item.cuvee,
        item.unite,
        item.fournisseur,
        item.prix_de_reference,
        this.formatMillier(item.prix_de_vente),
        item.remise,
        item.mode_de_paiement === 1 ? 'comptant': 'a credit' ,
        item.type_entree === 1 ? 'revenu': 'autre entree',
        item.variation,
        item.quantite,
        item.total,
        item.lastmonth,
        item.lastyear,
        item.ytd,
        item.lytd,
        item.varYTD,
        item.nom_user,
        item.commentaire_commercial,
        item.raison_responsable,
        item.nom_client,
        item.contact,
        item.email,
        item.localisation
      ])
      :test=0
      );
      console.log(tableData);
      console.log("test============"+tableHead+"test2++++++++++:"+tableData);
    
      return (
        <View style={styles.globale_container}>
          <Block  right>
            <Button center color="default"
              onPress={() => Linking.openURL(state.url)}
              style={styles.optionsButtone}> 
              EXPORTER
            </Button>
          </Block>
        <View style={styles.container}>
          <ScrollView horizontal={true}>
            <View>
              <Block>
                <Text  h1
                  style={styles.caption}
                >
                  Details des ventes de: {params.groupe} du {params.startDate} au {params.endDate}
                </Text>
                </Block> 
                <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                  <Row data={tableHead} style={styles.header}  widthArr={widthArr} textStyle={styles.titleText}/>
                </Table>
                <ScrollView style={styles.dataWrapper}>
                  <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                    {tableData.map((rowData,index)=>  
                      <Row
                        data={rowData}
                        key={index}
                        widthArr={widthArr}
                        style={[styles.row,index%2 && {backgroundColor: '#F7F6E7'}]}
                        textStyle={styles.text}
                      />
                    )}
                  </Table>
                  <ActivityIndicator
                    color="#00ff00"
                    size="large"
                    style = {styles.activityIndicator}
                    animating ={isLoading}
                  /> 
                </ScrollView>
            </View>
          </ScrollView>
        </View>
        </View>
      )
    }
    //cas directeur Holding
    else if(params.groupe === "toutgrpe" && params.user_type === 2){
      let tableData=[], test=0;
      state.myArray.map((item)=>
        item.etat!="rejete"?
        tableData.push([
        item.date_vente,
        item.reference,
        item.etat=="modifie" ? 
        <Button center style={styles.btn} onPress={() =>
          navigation.navigate("ValidationTracking",{
          params:{
            "prix_unitaire":item.prix_de_vente, 
            "quantite":item.quantite, 
            "preuve":item.preuve, 
            "prix_de_reference":item.prix_de_reference, 
            "produit":item.nom,
            "date":item.date_vente, 
            "commentaire_commercial": item.commentaire_commercial, 
            "user_id":item.user_id, 
            "produit_service_id": item.produit_service_id, 
            "reference": item.reference,
            "validation": "modifier",
            "remise": item.remise,
            "mode de paiement" : item.mode_de_paiement,
            "cuvee":item.cuvee,
            "categorie":item.categorie,
            "fournisseur":item.fournisseur,
            "poste": params.poste,
            "vente_id": item.vente_id,
            "modif_id":item.modif_id}})}>{item.etat}
        </Button> : 
        item.etat,
        item.groupe,
        item.raison_social,
        item.categorie,
        item.nom,
        item.cuvee,
        item.unite,
        item.fournisseur,
        item.prix_de_reference,
        this.formatMillier(item.prix_de_vente),
        item.remise,
        item.mode_de_paiement === 1 ? 'comptant': 'a credit' ,
        item.type_entree === 1 ? 'revenu': 'autre entree',
        item.variation,
        item.quantite,
        item.total,
        item.lastmonth,
        item.lastyear,
        item.ytd,
        item.lytd,
        item.varYTD,
        item.nom_user,
        item.commentaire_commercial,
        item.raison_responsable,
        item.nom_client,
        item.contact,
        item.email,
        item.localisation
      ])
      :test=0
      );
      console.log(tableData);
      console.log("test============"+tableHead+"test2++++++++++:"+tableData);
    
      return (
        <View style={styles.globale_container}>
            <Block  right>
              <Button center color="default"
                onPress={() => Linking.openURL(state.url)}
                style={styles.optionsButtone}> 
                EXPORTER
              </Button>
          </Block>
        <View style={styles.container}>
          <ScrollView horizontal={true}>
            <View>
              <Block>
                <Text  h1
                  style={styles.caption}
                >
                    Details des ventes Holding du {params.startDate} au {params.endDate}
                </Text>
                </Block> 
                <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                  <Row data={tableHead} style={styles.header}  widthArr={widthArr} textStyle={styles.titleText}/>
                </Table>
                <ScrollView style={styles.dataWrapper}>
                  <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                    {tableData.map((rowData,index)=>  
                      <Row
                        data={rowData}
                        key={index}
                        widthArr={widthArr}
                        style={[styles.row,index%2 && {backgroundColor: '#F7F6E7'}]}
                        textStyle={styles.text}
                      />
                    )}
                  </Table>
                  <ActivityIndicator
                    color="#00ff00"
                    size="large"
                    style = {styles.activityIndicator}
                    animating ={isLoading}
                  /> 
                </ScrollView>
            </View>
          </ScrollView>
        </View>
        </View>
      );

    }
    //cas responsable de vente...un produit
    else if(params.service_prdt !== "toutprod" && params.entreprise !== "toutentr" && params.groupe !== "toutgrpe" && params.user_type>2 && params.user_type<8 && params.categorie !== "toutcat" && params.cuvee === null){
      
      let tableData=[], test=0;
      state.myArray.map((item)=>
        item.etat!="rejete"?
        tableData.push([
        item.date_vente,
        item.reference,
        item.etat=="en attente" ? 
        <Button center style={styles.btn} onPress={() =>
          navigation.navigate("ValidationTracking",{
          params:{
            "prix_unitaire":item.prix_de_vente, 
            "quantite":item.quantite, 
            "preuve":item.preuve, 
            "prix_de_reference":item.prix_de_reference, 
            "produit":item.nom, "date":item.date_vente, 
            "commentaire_commercial":item.commentaire_commercial, 
            "user_id":item.user_id, 
            "produit_service_id":item.produit_service_id, 
            "reference":item.reference,
            "remise":item.remise,
            "mode_de_paiement": item.mode_de_paiement,
            "cuvee":item.cuvee,
            "categorie":item.categorie,
            "fournisseur":item.fournisseur,
            "poste": params.poste,
            "vente_id": item.vente_id,
            "validation":"renseigner"}})}>{item.etat}
        </Button> : 
        item.etat,
        item.groupe,
        item.raison_social,
        item.categorie,
        item.nom,
        item.cuvee,
        item.unite,
        item.fournisseur,
        item.prix_de_reference,
        this.formatMillier(item.prix_de_vente),
        item.remise,
        item.mode_de_paiement === 1 ? 'comptant': 'a credit' ,
        item.type_entree === 1 ? 'revenu': 'autre entree',
        item.variation,
        item.quantite,
        item.total,
        item.lastmonth,
        item.lastyear,
        item.ytd,
        item.lytd,
        item.varYTD,
        item.nom_user,
        item.commentaire_commercial,
        item.raison_responsable,
        item.nom_client,
        item.contact,
        item.email,
        item.localisation
      ])
      :test=0
      );
      console.log(tableData);
      console.log("test============"+tableHead+"test2++++++++++:"+tableData);
    
      return (
        <View style={styles.globale_container}>
          <Block  right>
            <Button center color="default"
              onPress={() => Linking.openURL(state.url)}
              style={styles.optionsButtone}> 
              EXPORTER
            </Button>
          </Block>
        <View style={styles.container}>
          <ScrollView horizontal={true}>
            <View>
              <Block>
                <Text  h1
                  style={styles.caption}
                >
                  Details des ventes de: {params.service_prdt} du {params.startDate} au {params.endDate}
                </Text>
              </Block> 
              <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                <Row data={tableHead} style={styles.header}  widthArr={widthArr} textStyle={styles.titleText}/>
              </Table>
              <ScrollView style={styles.dataWrapper}>
                <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                  {tableData.map((rowData,index)=>  
                    <Row
                      data={rowData}
                      key={index}
                      widthArr={widthArr}
                      style={[styles.row,index%2 && {backgroundColor: '#F7F6E7'}]}
                      textStyle={styles.text}
                    />
                  )}
                </Table>
                <ActivityIndicator
                  color="#00ff00"
                  size="large"
                  style = {styles.activityIndicator}
                  animating ={isLoading}
                /> 
              </ScrollView>
            </View>
          </ScrollView>
        </View>
        </View>
      );
    }
    //cas responsable tous les produits d'une categorie
    else if(params.service_prdt === "toutprod" && params.entreprise !=='toutentr' && params.groupe!='toutgrpe' && params.categorie !== "categorie"  &&  params.categorie !== "toutcat" && params.user_type > 2 && params.user_type < 8) {
      
      let tableData=[], test=0;
      state.myArray.map((item)=>
        item.etat!="rejete" && item.categorie==params.categorie?
        tableData.push([
        item.date_vente,
        item.reference,
        item.etat=="en attente" ? 
        <Button center style={styles.btn} onPress={() =>
          navigation.navigate("ValidationTracking",{
          params:{
            "prix_unitaire": item.prix_de_vente, 
            "quantite": item.quantite, 
            "preuve": item.preuve, 
            "prix_de_reference":item.prix_de_reference, 
            "produit":item.nom,
            "date": item.date_vente, 
            "commentaire_commercial": item.commentaire_commercial, 
            "user_id": item.user_id, 
            "produit_service_id": item.produit_service_id, 
            "reference": item.reference,
            "remise": item.remise,
            "mode_de_paiement": item.mode_de_paiement,
            "cuvee":item.cuvee,
            "categorie": item.categorie,
            "fournisseur": item.fournisseur,
            "poste": params.poste,
            "vente_id": item.vente_id,
            "validation":"renseigner"}})}>{item.etat}
        </Button> : 
        item.etat,
        item.groupe,
        item.raison_social,
        item.categorie,
        item.nom,
        item.cuvee,
        item.unite,
        item.fournisseur,
        item.prix_de_reference,
        this.formatMillier(item.prix_de_vente),
        item.remise,
        item.mode_de_paiement === 1 ? 'comptant': 'a credit' ,
        item.type_entree === 1 ? 'revenu': 'autre entree',
        item.variation,
        item.quantite,
        item.total,
        item.lastmonth,
        item.lastyear,
        item.ytd,
        item.lytd,
        item.varYTD,
        item.nom_user,
        item.commentaire_commercial,
        item.raison_responsable,
        item.nom_client,
        item.contact,
        item.email,
        item.localisation
      ])
      :test=0
      );
      console.log(tableData);
      console.log("test============"+tableHead+"test2++++++++++:"+tableData);
    
      return (
        <View style={styles.globale_container}>
          <Block  right>
            <Button center color="default"
              onPress={() => Linking.openURL(state.url)}
              style={styles.optionsButtone}> 
              EXPORTER
            </Button>
          </Block>
        <View style={styles.container}>
          <ScrollView horizontal={true}>
            <View>
              <Block>
                <Text  h1
                  style={styles.caption}
                >
                  Details des ventes de: {params.entreprise} categorie {params.categorie} du {params.startDate} au {params.endDate}
                </Text>
              </Block> 
              <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                <Row data={tableHead} style={styles.header}  widthArr={widthArr} textStyle={styles.titleText}/>
              </Table>
              <ScrollView style={styles.dataWrapper}>
                <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                  {tableData.map((rowData,index)=>  
                    <Row
                      data={rowData}
                      key={index}
                      widthArr={widthArr}
                      style={[styles.row,index%2 && {backgroundColor: '#F7F6E7'}]}
                      textStyle={styles.text}
                    />
                  )}
                </Table>
                <ActivityIndicator
                  color="#00ff00"
                  size="large"
                  style = {styles.activityIndicator}
                  animating ={isLoading}
                /> 
              </ScrollView>
            </View>
          </ScrollView>
        </View>
        </View>
      );
    }
    //responsable:tous les produits pour ceux qui n'ont pas de categorie
    else if(params.service_prdt === "toutprod" && params.entreprise!=='toutentr'&& params.groupe!='toutgrpe'&& params.categorie === "categorie" && params.user_type>2 && params.user_type<8) 
    {
     
      let tableData=[], test=0;
      state.myArray.map((item)=>
        item.etat!="rejete"?
        tableData.push([
        item.date_vente,
        item.reference,
        item.etat=="en attente" ? 
        <Button center style={styles.btn} onPress={() =>
          navigation.navigate("ValidationTracking",{
          params:{
            "prix_unitaire": item.prix_de_vente, 
            "quantite": item.quantite, 
            "preuve": item.preuve, 
            "prix_de_reference": item.prix_de_reference, 
            "produit": item.nom,
            "date": item.date_vente, 
            "commentaire_commercial": item.commentaire_commercial, 
            "user_id": item.user_id, 
            "produit_service_id": item.produit_service_id, 
            "reference":item.reference,
            "remise": item.remise,
            "mode_de_paiement": item.mode_de_paiement,
            "cuvee": item.cuvee,
            "categorie": item.categorie,
            "fournisseur": item.fournisseur,
            "poste": params.poste,
            "vente_id": item.vente_id,
            "validation":"renseigner"}})}>{item.etat}
        </Button> : 
        item.etat,
        item.groupe,
        item.raison_social,
        item.categorie,
        item.nom,
        item.cuvee,
        item.unite,
        item.fournisseur,
        item.prix_de_reference,
        this.formatMillier(item.prix_de_vente),
        item.remise,
        item.mode_de_paiement === 1 ? 'comptant': 'a credit' ,
        item.type_entree === 1 ? 'revenu': 'autre entree',
        item.variation,
        item.quantite,
        item.total,
        item.lastmonth,
        item.lastyear,
        item.ytd,
        item.lytd,
        item.varYTD,
        item.nom_user,
        item.commentaire_commercial,
        item.raison_responsable,
        item.nom_client,
        item.contact,
        item.email,
        item.localisation
      ])
      :test=0
      );
      console.log(tableData);
      console.log("test============"+tableHead+"test2++++++++++:"+tableData);
    
      return (
        <View style={styles.globale_container}>
          <Block  right>
            <Button center color="default"
              onPress={() => Linking.openURL(state.url)}
              style={styles.optionsButtone}> 
              EXPORTER
            </Button>
          </Block>
          <View style={styles.container}>
            <ScrollView horizontal={true}>
              <View>
                <Block>
                  <Text  h1
                    style={styles.caption}
                  >
                    Details des ventes de: {params.entreprise} du {params.startDate} au {params.endDate}
                  </Text>
                </Block> 
                <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                  <Row data={tableHead} style={styles.header}  widthArr={widthArr} textStyle={styles.titleText}/>
                </Table>
                <ScrollView style={styles.dataWrapper}>
                  <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                    {tableData.map((rowData,index)=>  
                      <Row
                        data={rowData}
                        key={index}
                        widthArr={widthArr}
                        style={[styles.row,index%2 && {backgroundColor: '#F7F6E7'}]}
                        textStyle={styles.text}
                      />
                    )}
                  </Table>
                  <ActivityIndicator
                    color="#00ff00"
                    size="large"
                    style = {styles.activityIndicator}
                    animating ={isLoading}
                  /> 
                </ScrollView>
              </View>
            </ScrollView>
          </View>
        </View>
      );
    }
    //cas responsable par cuvee
    else if(params.service_prdt !== "toutprod" && params.entreprise !== 'toutentr'&& params.groupe !== 'toutgrpe' && params.cuvee !== null && params.categorie !== 'categorie' && params.categorie !== 'toutcat' && params.user_type > 2 && params.user_type < 8)
    {
     
      let tableData=[], test=0;
      state.myArray.map((item)=>
        item.etat!="rejete" && item.cuvee==params.cuvee?
        tableData.push([
        item.date_vente,
        item.reference,
        item.etat=="en attente" ? 
        <Button center style={styles.btn} onPress={() =>
          navigation.navigate("ValidationTracking",{
          params:{
            "prix_unitaire": item.prix_de_vente, 
            "quantite": item.quantite, 
            "preuve": item.preuve, 
            "prix_de_reference": item.prix_de_reference, 
            "produit": item.nom,
            "date":item.date_vente, 
            "commentaire_commercial": item.commentaire_commercial, 
            "user_id": item.user_id, 
            "produit_service_id": item.produit_service_id, 
            "reference": item.reference,
            "remise": item.remise,
            "mode_de_paiement": item.mode_de_paiement,
            "cuvee": item.cuvee,
            "categorie":item.categorie,
            "fournisseur": item.fournisseur,
            "poste": params.poste,
            "vente_id": item.vente_id,
            "validation": "renseigner"}})}>{item.etat}
        </Button> : 
        item.etat,
        item.groupe,
        item.raison_social,
        item.categorie,
        item.nom,
        item.cuvee,
        item.unite,
        item.fournisseur,
        item.prix_de_reference,
        this.formatMillier(item.prix_de_vente),
        item.remise,
        item.mode_de_paiement === 1 ? 'comptant': 'a credit' ,
        item.type_entree === 1 ? 'revenu': 'autre entree',
        item.variation,
        item.quantite,
        item.total,
        item.lastmonth,
        item.lastyear,
        item.ytd,
        item.lytd,
        item.varYTD,
        item.nom_user,
        item.commentaire_commercial,
        item.raison_responsable,
        item.nom_client,
        item.contact,
        item.email,
        item.localisation
      ])
      :test=0
      );
      console.log(tableData);
      console.log("test============"+tableHead+"test2++++++++++:"+tableData);
    
      return (
        <View style={styles.globale_container}>
          <Block  right>
            <Button center color="default"
              onPress={() => Linking.openURL(state.url)}
              style={styles.optionsButtone}> 
              EXPORTER
            </Button>
          </Block>
          <View style={styles.container}>
            <ScrollView horizontal={true}>
              <View>
                <Block>
                  <Text  h1
                    style={styles.caption}
                  >
                      Details des ventes de: {params.entreprise} du {params.startDate} au {params.endDate}
                  </Text>
                </Block> 
                <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                  <Row data={tableHead} style={styles.header}  widthArr={widthArr} textStyle={styles.titleText}/>
                </Table>
                <ScrollView style={styles.dataWrapper}>
                  <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                    {tableData.map((rowData,index)=>  
                      <Row
                        data={rowData}
                        key={index}
                        widthArr={widthArr}
                        style={[styles.row,index%2 && {backgroundColor: '#F7F6E7'}]}
                        textStyle={styles.text}
                      />
                    )}
                  </Table>
                  <ActivityIndicator
                    color="#00ff00"
                    size="large"
                    style = {styles.activityIndicator}
                    animating ={isLoading}
                  /> 
                </ScrollView>
              </View>
            </ScrollView>
          </View>
        </View>
      );
    }
    //cas responsable de vente...toutes les entreprises
    else if(params.entreprise === "toutentr" && params.user_type > 2 && params.user_type < 8)
    {
      let tableData=[], test=0;
      state.myArray.map((item)=>
        item.etat!="rejete"?
        tableData.push([
        item.date_vente,
        item.reference,
        item.etat=="en attente" ? 
        <Button center style={styles.btn} onPress={() =>
          navigation.navigate("ValidationTracking",{
          params:{
            "prix_unitaire":item.prix_de_vente, 
            "quantite":item.quantite, 
            "preuve":item.preuve, 
            "prix_de_reference":item.prix_de_reference, 
            "produit":item.nom, "date":item.date_vente, 
            "commentaire_commercial":item.commentaire_commercial, 
            "user_id":item.user_id, 
            "produit_service_id":item.produit_service_id, 
            "reference":item.reference,
            "remise":item.remise,
            "mode_de_paiement": item.mode_de_paiement,
            "cuvee":item.cuvee,
            "categorie":item.categorie,
            "fournisseur":item.fournisseur,
            "poste": params.poste,
            "vente_id": item.vente_id,
            "validation":"renseigner"}})}>{item.etat}
        </Button> : 
        item.etat,
        item.groupe,
        item.raison_social,
        item.categorie,
        item.nom,
        item.cuvee,
        item.unite,
        item.fournisseur,
        item.prix_de_reference,
        this.formatMillier(item.prix_de_vente),
        item.remise,
        item.mode_de_paiement === 1 ? 'comptant': 'a credit' ,
        item.type_entree === 1 ? 'revenu': 'autre entree',
        item.variation,
        item.quantite,
        item.total,
        item.lastmonth,
        item.lastyear,
        item.ytd,
        item.lytd,
        item.varYTD,
        item.nom_user,
        item.commentaire_commercial,
        item.raison_responsable,
        item.nom_client,
        item.contact,
        item.email,
        item.localisation
      ])
      :test=0
      );
      console.log(tableData);
      console.log("test============"+tableHead+"test2++++++++++:"+tableData);
    
      return (
        <View style={styles.globale_container}>
          <Block  right>
            <Button center color="default"
              onPress={() => Linking.openURL(state.url)}
              style={styles.optionsButtone}> 
              EXPORTER
            </Button>
          </Block>
        <View style={styles.container}>
          <ScrollView horizontal={true}>
            <View>
              <Block>
                <Text  h1
                  style={styles.caption}
                >
                    Details des ventes de: {params.groupe} du {params.startDate} au {params.endDate}
                </Text>
              </Block> 
              <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                <Row data={tableHead} style={styles.header}  widthArr={widthArr} textStyle={styles.titleText}/>
              </Table>
              <ScrollView style={styles.dataWrapper}>
                <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                  {tableData.map((rowData,index)=>  
                    <Row
                      data={rowData}
                      key={index}
                      widthArr={widthArr}
                      style={[styles.row,index%2 && {backgroundColor: '#F7F6E7'}]}
                      textStyle={styles.text}
                    />
                  )}
                </Table>
                <ActivityIndicator
                  color="#00ff00"
                  size="large"
                  style = {styles.activityIndicator}
                  animating ={isLoading}
                /> 
              </ScrollView>
            </View>
          </ScrollView>
        </View>
        </View>
      );
    }

    //cas responsable de vente...tous les groupes
    else if(params.groupe === "toutgrpe" && params.user_type > 2 && params.user_type < 8)
    {

      let tableData=[], test=0;
      state.myArray.map((item)=>
        item.etat!="rejete"?
        tableData.push([
        item.date_vente,
        item.reference,
        item.etat=="en attente" ? 
        <Button center style={styles.btn} onPress={() =>
          navigation.navigate("ValidationTracking",{
          params:{
            "prix_unitaire":item.prix_de_vente, 
            "quantite":item.quantite, 
            "preuve":item.preuve, 
            "prix_de_reference":item.prix_de_reference, 
            "produit":item.nom, "date":item.date_vente, 
            "commentaire_commercial":item.commentaire_commercial, 
            "user_id":item.user_id, 
            "produit_service_id":item.produit_service_id, 
            "reference":item.reference,
            "remise":item.remise,
            "mode_de_paiement": item.mode_de_paiement,
            "cuvee":item.cuvee,
            "categorie":item.categorie,
            "fournisseur":item.fournisseur,
            "poste": params.poste,
            "vente_id": item.vente_id,
            "validation":"renseigner"}})}>{item.etat}
        </Button> : 
        item.etat,
        item.groupe,
        item.raison_social,
        item.categorie,
        item.nom,
        item.cuvee,
        item.unite,
        item.fournisseur,
        item.prix_de_reference,
        this.formatMillier(item.prix_de_vente),
        item.remise,
        item.mode_de_paiement === 1 ? 'comptant': 'a credit' ,
        item.type_entree === 1 ? 'revenu': 'autre entree',
        item.variation,
        item.quantite,
        item.total,
        item.lastmonth,
        item.lastyear,
        item.ytd,
        item.lytd,
        item.varYTD,
        item.nom_user,
        item.commentaire_commercial,
        item.raison_responsable,
        item.nom_client,
        item.contact,
        item.email,
        item.localisation
      ])
      :test=0
      );
      //console.log(tableData);
      //console.log("test============"+tableHead+"test2++++++++++:"+tableData);
    
      return (
        <View style={styles.globale_container}>
          <Block  right>
            <Button center color="default"
              onPress={() => Linking.openURL(state.url)}
              style={styles.optionsButtone}> 
              EXPORTER
            </Button>
          </Block>
        <View style={styles.container}>
          <ScrollView horizontal={true}>
            <View>
              <Block>
                  <Text  h1
                    style={styles.caption}
                  >
                      Details des ventes Holding du {params.startDate} au {params.endDate}
                  </Text>
              </Block> 
              <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                <Row data={tableHead} style={styles.header}  widthArr={widthArr} textStyle={styles.titleText}/>
              </Table>
              <ScrollView style={styles.dataWrapper}>
                <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                  {tableData.map((rowData,index)=>  
                    <Row
                      data={rowData}
                      key={index}
                      widthArr={widthArr}
                      style={[styles.row,index%2 && {backgroundColor: '#F7F6E7'}]}
                      textStyle={styles.text}
                    />
                  )}
                </Table>
                <ActivityIndicator
                  color="#00ff00"
                  size="large"
                  style = {styles.activityIndicator}
                  animating ={isLoading}
                /> 
              </ScrollView>
            </View>
          </ScrollView>
        </View>
        </View>
      );
    }
  }
}
 
const styles = StyleSheet.create({
  globale_container:{
    flex:1,
  },
  container: { 
    flex: 1, 
    padding: 16, 
    paddingTop: 30, 
    backgroundColor: '#fff' 
  },
  header: { 
    height: 60, 
    backgroundColor:  '#616A6B',
  },
  produit: { 
    flex: 1, 
    backgroundColor: "#2ECC71",
    width: 80
  },
  singleHead: { 
    width: 180, 
    height: 40, 
    backgroundColor: '#616A6B' 
  },
  singleHeadtoutprod: { 
    width: 90, 
    height: 60, 
    backgroundColor: '#616A6B' 
  },
  text: { 
    textAlign: 'center', 
    fontWeight: '100' 
  },
  titleText: { 
    marginRight: 6, 
    textAlign:'center',
    fontWeight: '100' 
  },
  dataWrapper: { 
    marginTop: -1 
  }, 
  title: { 
    flex: 1, 
    backgroundColor: '#f6f8fa' 
  },
  wrapper: { 
    flexDirection: 'row' 
  },
  btn: { 
    width: "auto", 
    height: 30, 
    backgroundColor: "#848482", 
    paddingHorizontal: theme.SIZES.BASE,
    borderRadius: 2,
    marginHorizontal:theme.SIZES.BASE/2,
    //marginLeft:40, 
  },
  btnt: { 
    width: 100, 
    height: 30, 
    backgroundColor: "#848482", 
    paddingHorizontal: theme.SIZES.BASE,
    borderRadius: 2,
    marginHorizontal:theme.SIZES.BASE, 
  },
  optionsButtone: {
    width: "auto",
    //height: 30,
    height: 'auto',
    paddingHorizontal: theme.SIZES.BASE,
    paddingVertical: 10,
    backgroundColor:"orange",
    marginTop:10,
    marginBottom:10,
    marginRight:10
    
  },
  optionsButtong: {
    width: "auto",
    height: 30,
    paddingHorizontal: theme.SIZES.BASE,
    paddingVertical: 10,
    backgroundColor:"orange",
    marginTop:10,
    marginBottom:10,
    marginLeft:10,
    position:"absolute"
    
  },
  optionsButtonc: {
    width: "auto",
    height: 30,
    paddingHorizontal: theme.SIZES.BASE,
    paddingVertical: 10,
    backgroundColor:"orange",
    marginTop:10,
    marginBottom:10,
    //marginLeft:10,
    //marginRight:10,
    position:"absolute",
    //alignItems:"center",
    
    
  },
  row: { height: 40, backgroundColor: argonTheme.COLORS.SUCCESS },
  caption: { 
    textAlign:'center',
    fontWeight: '100',
    fontSize:30,
    color:"#2ECC71" 
  },
  activityIndicator: {
    //justifyContent: 'center',
    //alignItems: 'center',
    height: 80,
    marginTop: height/5,
    marginRight:"80%"

  }
});
