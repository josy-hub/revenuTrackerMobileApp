import React, { Component } from 'react';
import { StyleSheet, View,Dimensions,Linking, SafeAreaView, ScrollView, Text, ActivityIndicator } from 'react-native';
import { Table, TableWrapper, Row,  Col, Cell} from 'react-native-table-component';
import { Block,theme} from "galio-framework";

 
import { Button } from "../components";
import { argonTheme } from '../constants';

const { width, height } = Dimensions.get("screen");
const racine = 'https://tracking.socecepme.com/api/';
export default class Rapports extends Component {
  constructor(props) {
    super(props);
    this.state = {
      myArray: [],
      header:[],
      body:[],
      footer:[],
      myArraymonth:[],
      url:'',
      isLoading:true,
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
  componentDidMount(){
    const state = this.state;
    const { navigation, route } = this.props;
    const { params } = route.params;
    
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };

    fetch(racine + `rapport/${params.groupe}/${params.entreprise}/${params.categorie}/${params.service_prdt}/${params.user_id}/${params.user_type}/${params.contact}/${params.startDate}/${params.endDate}`, requestOptions)
    .then(response => response.text())
    .then(result => {
      console.log(result);
      console.log(JSON.stringify(result, null, 4));
      var rslt = JSON.parse(result);
      let header = rslt['header'];
      let body = rslt['body'];
      let footer = ['footer'];
      this.setState({header, body, footer, isLoading:false});
      console.log(JSON.stringify(rslt['body']));
    })
    .catch(error => {
      console.log(error);
      alert("erreur de chargement des donnees");
    });

    fetch(racine + `exportrapport/${params.groupe}/${params.entreprise}/${params.categorie}/${params.service_prdt}/${params.user_id}/${params.user_type}/${params.contact}/${params.startDate}/${params.endDate}`, requestOptions)
    .then(response => response.text())
    .then(result => {
      console.log(result);
      console.log(JSON.stringify(result, null, 4));
      var rslt = JSON.parse(result);
      let url = rslt['url'];
      this.setState({url});
      console.log(rslt['url']);
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
    const {isLoading} = this.state;
    
    let widthArr=[];
    
    for(let i=0; i<state.header.length; i++){
      widthArr.push(180);
    }
    //Rapport de vente de tous les produits d'une entreprise et par categorie
    if(params.service_prdt === "toutprod" && params.user_type>=2 && params.user_type<=8)
    {
      //par categorie
      if(params.categorie !== null)  
        return (
          <View style={styles.container}>
            <Block  right>
              <Button center color="default"
                onPress={() => Linking.openURL(state.url)}
                style={styles.optionsButtone}> 
                EXPORTER
              </Button>
            </Block> 
            <ScrollView horizontal={true} >
              <View>
                <Block>
                  <Text  h1
                    style={styles.caption}
                  >
                      Rapport des ventes de: {params.entreprise} {params.categorie} du {params.startDate} au {params.endDate}
                  </Text>
                </Block> 
                <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                  <Row data={state.header} style={styles.header}  widthArr={widthArr} textStyle={styles.titleText}/>
                </Table>
                <ScrollView >
                  <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                    {state.body.map((rowData,index)=>  
                      <Row
                        data={rowData}
                        key={index}
                        widthArr={widthArr}
                        style={[styles.row,index%2 && {backgroundColor: '#F7F6E7'}]}
                        textStyle={styles.text}
                      />
                    )}
                    {state.footer.map((rowData,index)=>  
                      <Row
                        data={rowData}
                        key={index}
                        widthArr={widthArr}
                        style={styles.header}
                        textStyle={styles.titleText}
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
        )
      else 
        return (
          <View style={styles.container}>
            <Block  right>
              <Button center color="default"
                onPress={() => Linking.openURL(state.url)}
                style={styles.optionsButtone}> 
                EXPORTER
              </Button>
            </Block> 
            <ScrollView horizontal={true} >
              <View>
                <Block>
                  <Text  h1
                    style={styles.caption}
                  >
                    Rapport des ventes de: {params.entreprise} du {params.startDate} au {params.endDate}
                  </Text>
                </Block> 
                <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                  <Row data={state.header} style={styles.header}  widthArr={widthArr} textStyle={styles.titleText}/>
                </Table>
                <ScrollView >
                  <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                    {state.body.map((rowData,index)=>  
                      <Row
                        data={rowData}
                        key={index}
                        widthArr={widthArr}
                        style={[styles.row,index%2 && {backgroundColor: '#F7F6E7'}]}
                        textStyle={styles.text}
                      />
                    )}
                    {state.footer.map((rowData,index)=>  
                      <Row
                        data={rowData}
                        key={index}
                        widthArr={widthArr}
                        style={styles.header}
                        textStyle={styles.titleText}
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
        )
    }

    //Rapport de vente de toutes les entreprises d'un groupe
    else if(params.entreprise=="toutentr" && params.user_type>=2 && params.user_type<=8)
    {       
      
      return (
        <View style={styles.container}>
          <Block  right>
            <Button center color="default"
              onPress={() => Linking.openURL(state.url)}
              style={styles.optionsButtone}> 
              EXPORTER
            </Button>
          </Block> 
          <ScrollView horizontal={true} >
            <View>
            <Block>
                <Text  h1
                  style={styles.caption}
                >
                  Rapport des ventes de: {params.groupe} du {params.startDate} au {params.endDate}
                </Text>
              </Block> 
              <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                    <Row data={state.header} style={styles.header}  widthArr={widthArr} textStyle={styles.titleText}/>
              </Table>
              <ScrollView >
                <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                  {state.body.map((rowData,index)=>  
                    <Row
                      data={rowData}
                      key={index}
                      widthArr={widthArr}
                      style={[styles.row,index%2 && {backgroundColor: '#F7F6E7'}]}
                      textStyle={styles.text}
                    />
                  )}
                  {state.footer.map((rowData,index)=>  
                    <Row
                      data={rowData}
                      key={index}
                      widthArr={widthArr}
                      style={styles.header}
                      textStyle={styles.titleText}
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
      );
    }

    //Rapport de vente de tous les groupes de la holding
    else if(params.groupe=="toutgrpe" && params.user_type>=2 && params.user_type<=8)
    {
      
      return (
        <View style={styles.container}>
          <Block  right>
            <Button center color="default"
              onPress={() => Linking.openURL(state.url)}
              style={styles.optionsButtone}> 
              EXPORTER
            </Button>
          </Block> 
          <ScrollView horizontal={true} >
            <View>
            <Block>
                <Text  h1
                  style={styles.caption}
                >
                    Rapport des ventes Holding du {params.startDate} au {params.endDate}
                </Text>
              </Block> 
              <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                    <Row data={state.header} style={styles.header}  widthArr={widthArr} textStyle={styles.titleText}/>
              </Table>
              <ScrollView >
                <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                  {state.body.map((rowData,index)=>  
                    <Row
                      data={rowData}
                      key={index}
                      widthArr={widthArr}
                      style={[styles.row,index%2 && {backgroundColor: '#F7F6E7'}]}
                      textStyle={styles.text}
                    />
                  )}
                  {state.footer.map((rowData,index)=>  
                    <Row
                      data={rowData}
                      key={index}
                      widthArr={widthArr}
                      style={styles.header}
                      textStyle={styles.titleText}
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
      );      
    }
  }
}
 
const styles = StyleSheet.create({
  globale_container:{
       flex:1,
  },
  container: { 
    //width:width,
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
    width: 100, 
    height: 30, 
    backgroundColor: "#848482", 
    paddingHorizontal: theme.SIZES.BASE,
    borderRadius: 2,
    marginHorizontal:theme.SIZES.BASE,
    marginLeft:40, 
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
    height: 30,
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
    position:"absolute",
    
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
    marginRight:"50%"

  }
});
