import React from "react";
import { Dimensions } from "react-native";
import { Header } from "../components";

import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";

import Register from "../screens/Register";
import ChoixServiceConsulter from "../screens/Choix_service_consulter";
import ConsulterRevenus from "../screens/Consulter_les_revenus";
import RenseignerService from "../screens/Renseigner_service";
import ModifParReference from "../screens/Modif_par _reference";
import ModifParCommercial from "../screens/Modif_par_commercial";
import Home from "../screens/Home";
import ChoixServiceRenseigner from "../screens/Choix_service_renseigner";
import ResetPassword from "../screens/Reset_passord";
import Notifications from "../screens/Notifications";
import Commissions from "../screens/Commissions";
import MesParametres from "../screens/Mes_parametres";
import ValidationTracking from "../screens/Validation_tracking";
import InfoClient from "../screens/Info_client";
import Apropos from "../screens/Apropos";
import Rapports from "../screens/Rapports";
import Sauvegardes from "../screens/Sauvegardes";
import Editer from "../screens/Editer";
import EditerPrixRef from "../screens/Editer_prix_ref_Produit";
import Date from "../screens/Plage_date_consulter";

import CustomDrawerContent from "./Menu";
import RenseignerObjectifs from "../screens/RenseignerObjectifs";

const { width } = Dimensions.get("screen");

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function HomeStack(props) {
  return (
    <Stack.Navigator mode="card" headerMode="screen">
      <Stack.Screen
        name="Home"
        component={Home}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              title="Home"
              navigation={navigation}
              scene={scene}              
            />
          ),
          cardStyle: { backgroundColor: "#F8F9FE" },
          headerTransparent: true
        }}
      />
      <Stack.Screen
        name="ChoixServiceConsulter"
        component={ChoixServiceConsulter}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              back
              title="Choisir Service"
              navigation={navigation}
              scene={scene}              
            />
          ),
          cardStyle: { backgroundColor: "#F8F9FE" },
        }}
      />
      <Stack.Screen
        name="PlageDate"
        component={Date}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              back
              title="Plage Date"
              navigation={navigation}
              scene={scene}              
            />
          ),
          cardStyle: { backgroundColor: "#F8F9FE" },
        }}
      />
      <Stack.Screen
        name="ChoixServiceRenseigner"
        component={ChoixServiceRenseigner}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              back
              title="Choisir Service"
              navigation={navigation}
              scene={scene}              
            />
          ),
          cardStyle: { backgroundColor: "#F8F9FE" },
        }}
      />
      <Stack.Screen
        name="ConsulterRevenus"
        component={ConsulterRevenus}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              back
              title="Consulter les revenus"
              navigation={navigation}
              scene={scene}              
            />
          ),
          cardStyle: { backgroundColor: "#F8F9FE" },
        }}
      />
      <Stack.Screen
        name="RenseignerService"
        component={RenseignerService}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              back
              title="Renseigner les revenus"
              navigation={navigation}
              scene={scene}              
            />
          ),
          cardStyle: { backgroundColor: "#F8F9FE" },
        }}
      />
      <Stack.Screen
        name="Editer"
        component={Editer}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              back
              title="Editer"
              navigation={navigation}
              scene={scene}              
            />
          ),
          cardStyle: { backgroundColor: "#F8F9FE" },
        }}
      />
      <Stack.Screen
        name="EditerProduit"
        component={EditerPrixRef}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              back
              title="Editer Produit"
              navigation={navigation}
              scene={scene}              
            />
          ),
          cardStyle: { backgroundColor: "#F8F9FE" },
        }}
      />
      <Stack.Screen
        name="RenseignerObjectifs"
        component={RenseignerObjectifs}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              back
              title="Renseigner les Objectifs"
              navigation={navigation}
              scene={scene}              
            />
          ),
          cardStyle: { backgroundColor: "#F8F9FE" },
        }}
      />
      <Stack.Screen
        name="ModifParReference"
        component={ModifParReference}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              back
              title="Modification des revenus"
              navigation={navigation}
              scene={scene}              
            />
          ),
          cardStyle: { backgroundColor: "#F8F9FE" },
        }}
      />
      <Stack.Screen
        name="ModifParCommercial"
        component={ModifParCommercial}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              back
              title="Modification des revenus"
              navigation={navigation}
              scene={scene}              
            />
          ),
          cardStyle: { backgroundColor: "#F8F9FE" },
        }}
      />
      <Stack.Screen
        name="Rapports"
        component={Rapports}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              back
              title="Rapport des ventes"
              navigation={navigation}
              scene={scene}              
            />
          ),
          cardStyle: { backgroundColor: "#F8F9FE" },
        }}
      />
      <Stack.Screen
        name="ValidationTracking"
        component={ValidationTracking}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              back
              title="Validation des revenus"
              navigation={navigation}
              scene={scene}              
            />
          ),
          cardStyle: { backgroundColor: "#F8F9FE" },
        }}
      />
      <Stack.Screen
        name="InfoClient"
        component={InfoClient}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              back
              title="Informations sur le client"
              navigation={navigation}
              scene={scene}              
            />
          ),
          cardStyle: { backgroundColor: "#F8F9FE" },
        }}
      />
      <Stack.Screen
        name="Sauvegardes"
        component={Sauvegardes}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              back
              title="Sauvegardes"
              navigation={navigation}
              scene={scene}              
            />
          ),
          cardStyle: { backgroundColor: "#F8F9FE" },
        }}
      />
    </Stack.Navigator>
  );
}
//******donne sans et avec ca*******
/*function ConnexionStack(props){
  return(
  <Stack.Navigator mode="card" headerMode="none">
    <Stack.Screen
      name="Connexion"
      component={Register}
      options={{
        header: ({ navigation, scene }) => (
          <Header
            title=""
            navigation={navigation}
            scene={scene}              
          />
        ),
        cardStyle: { backgroundColor: "#F8F9FE" },
        headerTransparent: true
      }}
    />
  </Stack.Navigator>
  );
}*/
function ParametreStack(props) {
  return (
    <Stack.Navigator mode="card" headerMode="screen">
      <Stack.Screen
        name="Mes parametres"
        component={MesParametres}
        options={{
          header: ({ navigation, scene, previous }) => (
            <Header
              title="Mes parametres"
              navigation={navigation}
              scene={scene}
            />
          ),
          cardStyle: { backgroundColor: "#F8F9FE" },
        }}
        
      />
    </Stack.Navigator>
    
  );
}

function CommissionStack(props) {
  return (
    <Stack.Navigator mode="card" headerMode="screen">
      <Stack.Screen
        name="Commissions"
        component={Commissions}
        options={{
          header: ({ navigation, scene, previous }) => (
            <Header
              title="Commissions"
              navigation={navigation}
              scene={scene}
            />
          ),
          cardStyle: { backgroundColor: "#F8F9FE" },
        }}
        
      />
    </Stack.Navigator>
  );
}

function AproposStack(props) {
  return (
    <Stack.Navigator mode="card" headerMode="screen">
      <Stack.Screen
        name="Apropos"
        component={Apropos}
        options={{
          header: ({ navigation, scene, previous }) => (
            <Header
              title="A propos"
              navigation={navigation}
              scene={scene}
            />
          ),
          cardStyle: { backgroundColor: "#F8F9FE" },
        }}
        
      />
      
    </Stack.Navigator>
    
  );
}

function NotificationStack(props) {
  return (
    <Stack.Navigator mode="card" headerMode="screen">
      <Stack.Screen
        name="Notifications"
        component={Notifications}
        options={{
          header: ({ navigation, scene, previous }) => (
            <Header
              title="Notifications"
              navigation={navigation}
              scene={scene}
            />
          ),
          cardStyle: { backgroundColor: "#F8F9FE" },
        }}
        
      />
    </Stack.Navigator>
    
  );
}


function AppDrawer(props) {
  return (
    <Drawer.Navigator
      style={{ flex: 1 }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      drawerStyle={{
        backgroundColor: "white",
        width: width * 0.8,
      }}
      screenOptions={{
        activeTintcolor: "white",
        inactiveTintColor: "#000",
        activeBackgroundColor: "transparent",
        itemStyle: {
          width: width * 0.75,
          backgroundColor: "transparent",
          paddingVertical: 16,
          paddingHorizonal: 12,
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center",
          overflow: "hidden",
        },
        labelStyle: {
          fontSize: 18,
          marginLeft: 12,
          fontWeight: "normal",
        },
      }}
      initialRouteName="Connexion"
    >
      <Drawer.Screen name="Home" component={HomeStack} />
      <Drawer.Screen name="Notifications" component={NotificationStack} />
      <Drawer.Screen name="Commissions" component={CommissionStack} />
      <Drawer.Screen name="ResetPassword" component={ResetPassword} />
      <Drawer.Screen name="Mes paramètres" component={ParametreStack} />
      <Drawer.Screen name="A propos" component={AproposStack} />
      <Drawer.Screen name="Connexion" component={Register} />
    </Drawer.Navigator>
  );
}

export default function OnboardingStack(props) {
  return (
    <Stack.Navigator mode="card" headerMode="none">      
      <Stack.Screen name="App" component={AppDrawer} />
    </Stack.Navigator>
  );
}