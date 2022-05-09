import React, { Component } from "react";
import { Button,Dimensions } from "react-native";
import DatePicker from "react-native-date-ranges";
import { Block, Text, theme } from "galio-framework";

const { width, height } = Dimensions.get("screen");
//customButton usage...
export default class NewPicker extends Component {

  customButton = (onConfirm) => (
    <Button
      onPress={onConfirm}
      style={{
        container: { width: "80%", marginHorizontal: "3%" },
        title: { fontSize: 20 },
      }}
      primary
      title="OK"
      color="#2ECC71"
    />
  );

  render() {
    const { ...rest } = this.props;
    if(this.props.Value=='objectifs'){
      return (
        <Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
          <Text>choisir la plage de date</Text>
          <Block center style={{ marginTop: 10 }}>
            <DatePicker
              ref={(ref) => (this.picker = ref)}
              {...rest}
              style={{
                width: width-theme.SIZES.BASE *6, 
                height: "auto",
                backgroundColor:"#2ECC71",
                borderRadius: 6, 
                borderColor:"#2ECC71" }}
              customStyles={{
                placeholderText: {
                  fontSize: 15,
                  color: "white",
                  fontFamily: "sans-serif",
                }, // placeHolder style
                headerStyle: {}, // title container style
                headerMarkTitle: {}, // title mark style
                headerDateTitle: {}, // title Date style
                contentInput: {}, //content text container style
                contentText: {color: "white", padding:6}, //after selected text Style
              }} // optional
              centerAlign // optional text will align center or not
              markText="Plage date"
              returnFormat="YYYY-MM-DD"
              selectedBgColor="#2ECC71"
              allowFontScaling={false} // optional
              placeholder={"PLAGE DATE"}
              mode={"range"}
              customButton={this.customButton}
              onConfirm={this.props.onRangeDateChange}
            />
          </Block>
        </Block>
      );
    }if(this.props.Value=='rapport'){
      return(
        <Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
          <Text>choisir la plage de date</Text>
          <Block center style={{ marginTop: 10 }}>
            <DatePicker
              ref={(ref) => (this.picker = ref)}
              {...rest}
              style={{
                width: width-theme.SIZES.BASE *6, 
                height: "auto",
                backgroundColor:"#2ECC71",
                borderRadius: 6, 
                borderColor:"#2ECC71" }}
              customStyles={{
                placeholderText: {
                  fontSize: 15,
                  color: "white",
                  fontFamily: "sans-serif",
                }, // placeHolder style
                headerStyle: {}, // title container style
                headerMarkTitle: {}, // title mark style
                headerDateTitle: {}, // title Date style
                contentInput: {}, //content text container style
                contentText: {color: "white", padding:6}, //after selected text Style
              }} // optional
              centerAlign // optional text will align center or not
              markText="Plage date"
              returnFormat="YYYY-MM-DD"
              selectedBgColor="#2ECC71"
              allowFontScaling={false} // optional
              placeholder={"PLAGE DATE"}
              mode={"range"}
              customButton={this.customButton}
              onConfirm={this.props.onRangeDateChangeRapport}
            />
          </Block>
        </Block>
      );
    }
    else{
      return (
        <Block>
          <Text>choisir la plage de date</Text>
          <Block center style={{ marginTop: 10 }}>
            <DatePicker
              ref={(ref) => (this.picker = ref)}
              {...rest}
              style={{
                width: width-theme.SIZES.BASE *6, 
                height: "auto",
                backgroundColor:"#2ECC71",
                borderRadius: 6, 
                borderColor:"#2ECC71" }}
              customStyles={{
                placeholderText: {
                  fontSize: 15,
                  color: "white",
                  fontFamily: "sans-serif",
                }, // placeHolder style
                headerStyle: {}, // title container style
                headerMarkTitle: {}, // title mark style
                headerDateTitle: {}, // title Date style
                contentInput: {}, //content text container style
                contentText: {color: "white", padding:6}, //after selected text Style
              }} // optional
              centerAlign // optional text will align center or not
              markText="Plage date"
              returnFormat="YYYY-MM-DD"
              blockAfter="today"
              //blockBefore='yesterday'
              selectedBgColor="#2ECC71"
              allowFontScaling={false} // optional
              placeholder={"PLAGE DATE"}
              mode={"range"}
              customButton={this.customButton}
              onConfirm={this.props.onRangeDateChange}
            />
          </Block>
        </Block>
      );
    }
    
  }
}
