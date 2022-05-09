import React from "react";
import { Easing, Animated, Dimensions } from "react-native";

import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Button } from "../components";

import { Block } from "galio-framework";

// screens
import Home from "../screens/Home";
import Onboarding from "../screens/Onboarding";
import Pro from "../screens/Pro";
import Profile from "../screens/Profile";
import Register from "../screens/Register";
import Elements from "../screens/Elements";
import Articles from "../screens/Articles";
import Choix_service_consulter from "../screens/Choix_service_consulter";
import Choix_service_renseigner from "../screens/Choix_service_renseigner";
import Calendrier from "../screens/Calendrier";
import Modif_par_reference from "../screens/Modif_par _reference";
import Validation_tracking from "../screens/Validation_tracking";
import Modif_par_commercial from "../screens/Modif_par_commercial";
import Plage_date_consulter from "../screens/Plage_date_consulter";
import Consulter_les_revenus from "../screens/Consulter_les_revenus";
import Reset_passord from "../screens/Reset_passord";
import Notifications from "../screens/Notifications";
import Commissions from "../screens/Commissions";
import Modif_tracking_service from "../screens/Modif_tracking_service";
import Mes_parametres from "../screens/Mes_parametres";


// drawer
import CustomDrawerContent from "./Menu";

// header for screens
import { Icon, Header } from "../components";
import { argonTheme, tabs } from "../constants";
import Renseigner_service from "../screens/Renseigner_service";
//import Commissions from "../screens/Commissions";


const { width } = Dimensions.get("screen");

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

function ElementsStack(props) {
  return (
    <Stack.Navigator mode="card" headerMode="screen">
      <Stack.Screen
        name="Elements"
        component={Elements}
        options={{
          header: ({ navigation, scene }) => (
            <Header title="Elements" navigation={navigation} scene={scene} />
          ),
          cardStyle: { backgroundColor: "#F8F9FE" }
        }}
      />
      <Stack.Screen
        name="Pro"
        component={Pro}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              title=""
              back
              white
              transparent
              navigation={navigation}
              scene={scene}
            />
          ),
          headerTransparent: true
        }}
      />
    </Stack.Navigator>
  );
}

function ArticlesStack(props) {
  return (
    <Stack.Navigator mode="card" headerMode="screen">
      <Stack.Screen
        name="Articles"
        component={Articles}
        options={{
          header: ({ navigation, scene }) => (
            <Header title="Articles" navigation={navigation} scene={scene} />
          ),
          cardStyle: { backgroundColor: "#F8F9FE" }
        }}
      />
            <Stack.Screen
        name="Pro"
        component={Pro}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              title=""
              back
              white
              transparent
              navigation={navigation}
              scene={scene}
            />
          ),
          headerTransparent: true
        }}
      />
    </Stack.Navigator>
  );
}

function ProfileStack(props) {
  return (
    <Stack.Navigator initialRouteName="Profile" mode="card" headerMode="screen">
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              transparent
              white
              title="Profile"
              navigation={navigation}
              scene={scene}
            />
          ),
          cardStyle: { backgroundColor: "#FFFFFF" },
          headerTransparent: true
        }}
      />
      <Stack.Screen
        name="Pro"
        component={Pro}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              title=""
              back
              white
              transparent
              navigation={navigation}
              scene={scene}
            />
          ),
          headerTransparent: true
        }}
      />
    </Stack.Navigator>
  );
}

function Home_consulterStack({props, route}) {
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
              //style={{backgroundColor:"transparent"}}
            />
          ),
          cardStyle: { backgroundColor: "#F8F9FE" }
        }}
      />
      <Stack.Screen
        name="choix_service_consulter"
        component={Choix_service_consulter}
        options={{
          header: ({ navigation, scene, previous }) => (
            <Header
              title="choisir le service"
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

function ParametreStack(props) {
  return (
    <Stack.Navigator mode="card" headerMode="screen">
      <Stack.Screen
        name="Mes parametres"
        component={Mes_parametres}
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

function Choix_consulterStack(props){
  return(
    <Stack.Navigator mode="card" headerMode="screen">
      <Stack.Screen
      name="choix_service_consulter"
      component={Choix_service_consulter}
      options={{
        header: ({ navigation, scenbacke }) => (
          <Header
            title="choisir le service"
            
            navigation={navigation}
            scene={scene}
          />
        ),
        cardStyle: { backgroundColor: "#F8F9FE" }
      }}
    />

    <Stack.Screen
        name="Plage_date_consulter"
        component={Plage_date_consulter}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              title="Plage date pour consulter"
              back
              navigation={navigation}
              scene={scene}
            />
          ),
          cardStyle: { backgroundColor: "#F8F9FE" }
        }}
      />
  </Stack.Navigator>
  );
}

function Plage_dateStack(props){
  return(
    <Stack.Navigator mode="card" headerMode="screen">
    <Stack.Screen
    name="Plage_date_consulter"
    component={Plage_date_consulter}
    options={{
      header: ({ navigation, scene }) => (
        <Header
          title="Plage_date_consulter"
          navigation={navigation}
          scene={scene}
        />
      ),
      cardStyle: { backgroundColor: "#F8F9FE" }
    }}
  />

<Stack.Screen
        name="Consulter_les_revenus"
        component={Consulter_les_revenus}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              title="Consulter_les_revenus"
              navigation={navigation}
              scene={scene}
            />
          ),
          cardStyle: { backgroundColor: "#F8F9FE" }
        }}
      />
  </Stack.Navigator>
  );
}

function ConsulterStack(props){
  return(
    <Stack.Navigator mode="card" headerMode="screen">
    <Stack.Screen
    name="Consulter_les_revenus"
    component={Consulter_les_revenus}
    options={{
      header: ({ navigation, scene }) => (
        <Header
          title="tracking des revenus"
          back
          navigation={navigation}
          scene={scene}
        />
      ),
      cardStyle: { backgroundColor: "#F8F9FE" }
    }}
  />

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
          cardStyle: { backgroundColor: "#F8F9FE" }
        }}
      />
  </Stack.Navigator>
  );
}

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
          cardStyle: { backgroundColor: "#F8F9FE" }
        }}
      />
      <Stack.Screen
        name="Choix_service_renseigner"
        component={Choix_service_renseigner}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              title="Choisir le service"                            
              navigation={navigation}
              scene={scene}
            />
          ),
          cardStyle: { backgroundColor: "#F8F9FE" }
        }}
      />
      <Stack.Screen
        name="Calendrier"
        component={Calendrier}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              title="Choisir le jour"                            
              navigation={navigation}
              scene={scene}
            />
          ),
          cardStyle: { backgroundColor: "#F8F9FE" }
        }}
      />
      <Stack.Screen
        name="Renseigner_service"
        component={Renseigner_service}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              title="Renseigner les services"                            
              navigation={navigation}
              scene={scene}
            />
          ),
          cardStyle: { backgroundColor: "#F8F9FE" }
        }}
      />

    </Stack.Navigator>
  );
}  

function Choixservice_renseignerStack(props) {
  return (
    <Stack.Navigator mode="card" headerMode="screen">
      <Stack.Screen
        name="Choix_service_renseigner"
        component={Choix_service_renseigner}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              title="Choisir le service" 
              back                           
              navigation={navigation}
              scene={scene}
            />
          ),
          cardStyle: { backgroundColor: "#F8F9FE" }
        }}
      />
      <Stack.Screen
        name="Calendrier"
        component={Calendrier}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              title="Choisir le jour" 
              back                           
              navigation={navigation}
              scene={scene}
            />
          ),
          cardStyle: { backgroundColor: "#F8F9FE" }
        }}
      />
    </Stack.Navigator>
  );
}  

function CalendrierStack(props) {
  return (
    <Stack.Navigator mode="card" headerMode="screen">
    <Stack.Screen
          name="Calendrier"
          component={Calendrier}
          options={{
            header: ({ navigation, scene }) => (
              <Header
                title="Choisir le jour"                            
                navigation={navigation}
                scene={scene}
              />
            ),
            cardStyle: { backgroundColor: "#F8F9FE" }
          }}
      />
      <Stack.Screen
        name="Renseigner_tracking"
        component={Renseigner_service}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              title="Renseigner le tracking"                            
              navigation={navigation}
              scene={scene}
            />
          ),
          cardStyle: { backgroundColor: "#F8F9FE" }
        }}
      />
    </Stack.Navigator>
  );
}  

function RenseignerStack(props) {
  return (
    <Stack.Navigator mode="card" headerMode="screen">
      <Stack.Screen
        name="Renseigner_service"
        component={Renseigner_service}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              title="Renseigner les services" 
              back                           
              navigation={navigation}
              scene={scene}
            />
          ),
          cardStyle: { backgroundColor: "#F8F9FE" }
        }}
      />
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
          cardStyle: { backgroundColor: "#F8F9FE" }
        }}
      />
    </Stack.Navigator>
  );
} 

function Home_modifierStack(props) {
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
          cardStyle: { backgroundColor: "#F8F9FE" }
        }}
      />
      <Stack.Screen
        name="Modif_par_reference"
        component={Modif_par_reference}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              title="Modif_par_reference"                            
              navigation={navigation}
              scene={scene}
            />
          ),
          cardStyle: { backgroundColor: "#F8F9FE" }
        }}
      />
    </Stack.Navigator>
  );
}  

function ModifrefStack(props) {
  return (
    <Stack.Navigator mode="card" headerMode="screen">
      <Stack.Screen
        name="Modif_par_reference"
        component={Modif_par_reference}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              title="Modif_par_reference"                            
              navigation={navigation}
              scene={scene}
            />
          ),
          cardStyle: { backgroundColor: "#F8F9FE" }
        }}
      />
      <Stack.Screen
        name="Modif_par_commercial"
        component={Modif_par_commercial}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              title="Modif_par_commercial"                            
              navigation={navigation}
              scene={scene}
            />
          ),
          cardStyle: { backgroundColor: "#F8F9FE" }
        }}
      />
    </Stack.Navigator>
  );
}

function ModifcomerStack(props) {
  return (
    <Stack.Navigator mode="card" headerMode="screen">
      <Stack.Screen
        name="Modif_par_commercial"
        component={Modif_par_commercial}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              title="Modif_par_commercial"                            
              navigation={navigation}
              scene={scene}
            />
          ),
          cardStyle: { backgroundColor: "#F8F9FE" }
        }}
      />
         <Stack.Screen
        name="Modif_tracking"
        component={Modif_tracking_service}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              title="Modif_tracking_service"                            
              navigation={navigation}
              scene={scene}
            />
          ),
          cardStyle: { backgroundColor: "#F8F9FE" }
        }}
      />
    </Stack.Navigator>
  );
}

function ModiftrackingStack(props) {
  return (
    <Stack.Navigator mode="card" headerMode="screen">
         <Stack.Screen
        name="Modif_tracking"
        component={Modif_tracking_service}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              title="Modif_tracking_service"                            
              navigation={navigation}
              scene={scene}
            />
          ),
          cardStyle: { backgroundColor: "#F8F9FE" }
        }}
      />
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
          cardStyle: { backgroundColor: "#F8F9FE" }
        }}
      />
    </Stack.Navigator>
  );
}

function ValidationStack(props) {
  return (
    <Stack.Navigator mode="card" headerMode="screen">
      <Stack.Screen
        name="Validation_tracking"
        component={Validation_tracking}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              title="Validation_tracking"                            
              navigation={navigation}
              scene={scene}
            />
          ),
          cardStyle: { backgroundColor: "#F8F9FE" }
        }}
      />
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
          cardStyle: { backgroundColor: "#F8F9FE" }
        }}
      />
    </Stack.Navigator>
  );
}

export default function OnboardingStack(props) {
  return (
    <Stack.Navigator mode="card" headerMode="none">  
      <Stack.Screen name="App" component={AppStack} />
    </Stack.Navigator>
  );
}

function AppStack(props) {
  return (
    <Drawer.Navigator
      style={{ flex: 1 }}
      drawerContent={props => <CustomDrawerContent {...props} />}
      drawerStyle={{
        backgroundColor: "white",
        width: width * 0.8
      }}
      drawerContentOptions={{
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
          overflow: "hidden"
        },
        labelStyle: {
          fontSize: 18,
          marginLeft: 12,
          fontWeight: "normal"
        }
      }}
      initialRouteName="Connexion"
    >
      <Drawer.Screen name="Home" component={Home_consulterStack} />
      <Drawer.Screen name="Profile" component={ProfileStack} />
      <Drawer.Screen name="Connexion" component={Register} />
      <Drawer.Screen name="A propos" component={ElementsStack} />
      <Drawer.Screen name="Articles" component={ArticlesStack} />
      <Drawer.Screen name="Modif_par_reference" component={ModifrefStack} />
      <Drawer.Screen name="Calendrier" component={CalendrierStack} />
      <Drawer.Screen name="Renseigner_service" component={RenseignerStack} />
      <Drawer.Screen name="Modif_par_commercial" component={ModifcomerStack} />
      <Drawer.Screen name="Modif_tracking_service" component={ModiftrackingStack} />
      <Drawer.Screen name="Consulter_les_revenus" component={ConsulterStack} />
      <Drawer.Screen name="Plage_date_consulter" component={Plage_dateStack} />
      <Drawer.Screen name="Validation_tracking" component={ValidationStack} />
      <Drawer.Screen name="Notifications" component={NotificationStack} />
      <Drawer.Screen name="Commissions" component={CommissionStack} />
      <Drawer.Screen name="Reset_passord" component={Reset_passord} />
      <Drawer.Screen name="Choix_service_consulter" component={Choix_consulterStack} />
      <Drawer.Screen name="Choix_service_renseigner" component={Choixservice_renseignerStack} />
      <Drawer.Screen name="Mes paramètres" component={ParametreStack} />
    </Drawer.Navigator>
  );
}
