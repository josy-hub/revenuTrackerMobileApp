import Autocomplete from 'react-native-autocomplete-input'; // 3.3.1
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Block, theme, Icon } from "galio-framework";

const API = 'https://tracking.socecepme.com/api';
//const ROMAN = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];

class AutocompleteExample extends Component {
  static renderClient(client) {
    const { nom_client } = client;
    return (
      <View>
        <Text style={styles.titleText}>{nom_client}</Text>
      </View>
    );
  }

  constructor(props) {
    super(props);
    this.state = {
      clients: [],
      query: '',
      hide:false
    };
  }

  componentDidMount() {
    fetch(`${API}/clients`).then(res => res.json()).then((json) => {
      const {clients } = json;
      this.setState({ clients });
    });
  }

  findClient(query) {
    if (query === '') {
      return [];
    }

    const { clients } = this.state;
    const regex = new RegExp(`${query.trim()}`, 'i');
    let result=clients.filter(client => client.nom_client.search(regex) >= 0);
    let Noms=result.map((item)=>(item.nom_client+'_'+item.email+'_'+item.contact+'_'+item.localisation));
    let Nomssandou=[...new Set(Noms)];
    let Nomf=Nomssandou.map((item)=>({nom_client:item.split('_')[0], email:item.split('_')[1], contact:item.split('_')[2], localisation:item.split('_')[3]}));
    console.log(Noms,Nomssandou, Nomf);
    return Nomf;
  }

  render() {
    const { query } = this.state;
    const clients = this.findClient(query);
    const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();
    //console.log(AutocompleteExample.renderClient(this.state.clients));
    console.log(this.state.hide);
    return (
      <View style={styles.container}>
        <Autocomplete
          autoCapitalize="none"
          autoCorrect={false}
          listContainerStyle={styles.listcontainer}
          containerStyle={styles.autocompleteContainer}
          inputContainerStyle={styles.inputcontainerstyle}
          hideResults={this.state.hide}
          //data={clients.length === 1 && comp(query, clients[0].nom_client) ? [] : clients.nom_client}
          data={clients}
          defaultValue={query}
          onChangeText={text => this.setState({ query: text })}
          placeholder="Nom du client"
          renderItem={({ item, i }) => (
            <TouchableOpacity onPress={() => this.setState({ query: item.nom_client, hide:true})} 
              style={{
                height: 50,
                flex: 1,
                justifyContent: 'center',
                borderRadius: 8,
                borderBottomWidth:1,
                borderColor:"#2ECC71",
                backgroundColor: "#F5FCFF",
                paddingHorizontal: theme.SIZES.BASE/2,
              }}
            >
              <Text adjustsFontSizeToFit>{item.nom_client+':\t'+item.localisation+':\t'+item.contact+':\t'+item.email}</Text>
            </TouchableOpacity>
          )}  
        />
        {/* <View style={styles.descriptionContainer}>
          {clients.length > 0 ? (
             //AutocompleteExample.renderClient(clients[0]) 
            <TouchableOpacity onPress={() => this.setState({ query: clients[0].nom_client})}>
              <Text style={styles.titleText}>{clients[0].nom_client}</Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.infoText}>
              Nom du client
            </Text>
          )}
        </View> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5FCFF',
    flex: 1,
    paddingTop: 25
  },
  autocompleteContainer: {
    marginLeft: 10,
    marginRight: 10,
    
  },
  inputcontainerstyle:{
    borderColor: theme.COLORS.SUCCESS,
    borderRadius: 4,
    backgroundColor: "#fff",
    //paddingHorizontal: theme.SIZES.BASE
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
    // `backgroundColor` needs to be set otherwise the
    // autocomplete input will disappear on text input.
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
});

export default AutocompleteExample;