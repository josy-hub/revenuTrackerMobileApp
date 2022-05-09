import React, { Component } from "react";
import {Text, Block} from "galio-framework";
import {StyleSheet,Dimensions} from "react-native";
import { useRoute } from '@react-navigation/native'; 

import entreprise from '../services/Fetch';
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import Renseigner_service from "./Renseigner_service";
import argonTheme from "../constants/Theme";

const { width, height } = Dimensions.get("screen");

/*function Mytest(){
        const route = useRoute()
        const {produits} = route.params.produits
        console.log(produits)
        return <Text>{produits}</Text>;
    }*/
class Calendrier extends React.Component{
    render(){
       // console.log(this.props.navigation.getParam('produits'))
        const { navigation } = this.props;
        return(
            <Block style={styles.globale_container}>
                <Block style={styles.main_container}>
                    <Block card style={styles.service_card}>
                        <Text  h4 
                                color={argonTheme.COLORS.DEFAULT}
                        >
                                Service/produit XXX 
                        </Text>
                    </Block>
                    <Block>
                        <Calendar
                            current={'2020-07-22'}
                            minDate={'2020-01-01'}
                            maxDate={'2020-12-31'}
                            onDayPress={(day) => {navigation.navigate("Renseigner_service")}}
                            onDayLongPress={(day) => {navigation.navigate("Renseigner_service")}}
                            monthFormat={'yyyy MM'}
                            onMonthChange={(month) => {console.log('month changed', month)}}
                            hideArrows={false}
                           // renderArrow={(direction) => (<Arrow/>)}
                            hideExtraDays={true}
                            disableMonthChange={true}
                            firstDay={1}
                            hideDayNames={false}
                            showWeekNumbers={true}
                            onPressArrowLeft={subtractMonth => subtractMonth()}
                            onPressArrowRight={addMonth => addMonth()}
                            disableArrowLeft={false}
                            disableArrowRight={false}
                            disableAllTouchEventsForDisabledDays={true}
                            //disableHeader={false}
                            renderHeader={(date) => {/*Return JSX*/}}
                            markedDates={{
                                'today': {selected: true, dotColor: 'red', marked: true, selectedColor: 'blue'}
                            }}
                            //markingType={'custom'}

                            style={{
                                borderWidth: 1,
                                borderColor: 'blue',
                                height: 380
                              }}
                            theme={{
                                calendarBackground: 'black',
                                selectedDayBackgroundColor: '#00adf5',
                                dayTextColor: 'white',
                                todayTextColor: 'orange',
                                textDisabledColor: 'grey',
                                textDayFontSize: 20,
                                textMonthFontSize: 16,
                                

                            }}
                        />
                    </Block>
                </Block>
                <Block style={styles.footer}>

                </Block>
            </Block>
        );
    }

}

const styles=StyleSheet.create({

    globale_container:{
        flex:1

    },
    main_container:{
        width:width,
        height:height-70
    },
    service_card:{
        width: 350, 
        height:50,
        backgroundColor:argonTheme.COLORS.SWITCH_OFF,
        marginHorizontal:30,
        marginTop:40,
        marginBottom:30,
        alignItems:"center",
        justifyContent:"center",
    },
    footer:{
        width:width,
        height:70,
        backgroundColor:"green"
    }

})
export default Calendrier;