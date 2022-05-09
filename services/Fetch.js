const racine = 'https://tracking.socecepme.com/api/'
//const racine = 'http://172.17.224.1/Tracking/public/api/';
const URI = racine + 'choixentreprise';
const URL = racine + 'choixgroupe';
const URL1 = racine + 'choixproduit';
//const URL1 = 'http://192.168.43.54/Tracking/public/api/choixproduit';
const URL2 = racine + 'calculprix';
const URL3 = racine + 'showVenteCommercial';
const URL4 = racine + 'showVenteReference';
const URL5 = racine + 'choixcommercial';
const URL6 = racine + 'ventes';
const URL7 = racine + 'ventes';
const URL8 = racine + 'sauvegarder';
const URL9 = racine + 'fetchreference';
const URL10 = racine + 'notifications';
const URL11 = racine + 'fournisseurs';
const URL12 = racine + 'choixventescml';
const URL13 = racine + 'produits_services';

export default {
    async fetchEntreprises(groupe) {
        try {
                let response = await fetch(URI+'/'+groupe);
                let responseJsonData = await response.json();
                console.log('response'+ JSON.stringify(responseJsonData))
                return (responseJsonData);
            }
        catch(e) {
            alert("erreur de chargement des donnees")
        }
    },
    async fetchGroupes(nom,contact) {
        try {
                let response = await fetch(URL+'/'+nom+'/'+contact);
                let responseJsonData = await response.json();
                return (responseJsonData);
            }
        catch(e) {
            alert("erreur de chargement des donnees")
        }
    },
    async fetchProduits(entreprise) {
        try {
                let response = await fetch(URL1+'/'+entreprise);
                let responseJsonData = await response.json();
                return (responseJsonData);
            }
        catch(e) {
            alert("erreur de chargement des donnees")
        }
    },
    async fetchcalculprix(produit) {
        try {
                let response = await fetch(URL2+'/'+produit);
                let responseJsonData = await response.json();
                return (responseJsonData);
            }
        catch(e) {
            alert("erreur de chargement des donnees")
        }
    },
    async fetchshowVenteCommercial(commercial, date, entreprise, produit) {

        try {
            let response = await fetch(URL3+'/'+commercial+'/'+date+'/'+entreprise+'/'+produit);
            let responseJsonData = await response.json();
            return (responseJsonData);
        }
        catch(e) {
            alert("erreur de chargement des donnees")
        }
    },
    async fetchshowVenteReference(entreprise, produit) {

        try {
            let response = await fetch(URL4+'/'+entreprise+'/'+produit);
            let responseJsonData = await response.json();
            return (responseJsonData);
        }
        catch(e) {
            alert("erreur de chargement des donnees")
        }
    },
    async fetchchoixcommercial(entreprise) {

        try {
            let response = await fetch(URL5+'/'+entreprise);
            let responseJsonData = await response.json();
            return responseJsonData;
        }
        catch(e) {
            alert("erreur de chargement des donnees")
        }
    },
    async fetchindexventes() {

        try {
            let response = await fetch(URL6);
            let responseJsonData = await response.json();
            return responseJsonData;
        }
        catch(e) {
            alert("erreur de chargement des donnees")
        }
    },
    async fetchshowvente(reference) {

        try {
            let response = await fetch(URL7+'/'+reference);
            let responseJsonData = await response.json();
            return responseJsonData;
        }
        catch(e) {
            alert("erreur de chargement des donnees")
        }
    },
    async fetchsauvegardes(contact) {

        try {
            let response = await fetch(URL8+'/'+contact);
            let responseJsonData = await response.json();
            return responseJsonData;
        }
        catch(e) {
            alert("erreur de chargement des donnees")
        }
    },
    async fetchreference(entreprise, produit) {

        try {
            let response = await fetch(URL9+'/'+entreprise+'/'+produit);
            let responseJsonData = await response.json();
            console.log(responseJsonData);
            return responseJsonData;
        }
        catch(e) {
            alert("erreur de chargement des donnees")
        }
    },
    async notifications(type, contact, entreprise) {
        try {
            let response = await fetch(URL10+'/'+type+'/'+contact+'/'+entreprise);
            let responseJsonData = await response.json();
            console.log(responseJsonData);
            return responseJsonData;
        }
        catch(e) {
            alert("erreur de chargement des donnees")
        }
    },
    async fetchFournisseurs() {

        try {
            let response = await fetch(URL11);
            let responseJsonData = await response.json();
            console.log(responseJsonData);
            return responseJsonData;
        }
        catch(e) {
            alert("erreur de chargement des donnees")
        }
    },
    async fetchchoixvente(nom, contact, entreprise, date){
        try {
            let response = await fetch(URL12+'/'+nom+'/'+contact+'/'+entreprise+'/'+date);
            let responseJsonData = await response.json();
            console.log(responseJsonData);
            return responseJsonData;
        }
        catch(e) {
            alert("erreur de chargement des donnees")
        }
    },
    async rechproduits(){
        try {
            let response = await fetch(URL13);
            let responseJsonData = await response.json();
            console.log(responseJsonData);
            return responseJsonData;
        }
        catch(e) {
            alert("erreur de chargement des donnees")
        }
    }
}