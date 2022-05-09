import React, {useState} from 'react';
import {View, Button, Platform} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';



  export default function   date(props){
    
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
    props.OnDateChange(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };

  let now = new Date();
  let mindate=now-549094194;
  let mindatef=new Date(mindate);

  return (
    <View>
      <View style={{marginTop:10 }}>
        <Button color="#2ECC71" onPress={showDatepicker} title="choisir la date de la vente" />
      </View>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={onChange}
          maximumDate={new Date()}
          //minimumDate={mindatef}
        />
      )}
    </View>
  );
}

