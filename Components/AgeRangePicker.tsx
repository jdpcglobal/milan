import React, { useState } from "react";
import { ActivityIndicator, StyleSheet, Text } from "react-native";
import { View, TouchableOpacity } from "react-native";
import RangeSliderFor from "./RangeSlider";
import { useSelector } from "react-redux";
import { LoginState } from "../Utils/Types";


const AgeRangePicker = () => {
  const [ageFrom, setAgeFrom] = useState(18);
  const [ageTo, setAgeTo] = useState(80);
  const [Loading, setLoading] = useState(false);
  const token = useSelector((state: LoginState) => state.logins.auth_token);


  const ChangeAge = () => {
    setLoading(false);
  }

  //******  Age range api Started ******/
  const AgeRangeApi = async () => {
    const payload = {
      token: token,
      ageto: ageTo,
      agefrom: ageFrom
    };

    // console.log('AgeRangeApi Payload ====', payload);

    try {
      setLoading(true);
      const response = await fetch(
        'https://themilan.org/api/editprofile', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error('Create AgeRangeApi api error');
      }
      const data = await response.json();
      console.log('AgeRangeApi api =======', data);
      setLoading(false);

    } catch (error) {
      console.error('Create order Error List');
      setLoading(false);
    }
  }
  //******  Age range api Ended ******/

  return (
    <View style={styles.container12}>
      <Text style={styles.title}>Set Your Age Preference</Text>
      <View style={styles.sliderContainer}>
        <RangeSliderFor low={ageFrom} high={ageTo} setLow={setAgeFrom} setHigh={setAgeTo} />
      </View>
      <View style={{ justifyContent: 'center', alignItems: 'center', }}>
        <TouchableOpacity style={{ backgroundColor: '#DE3163', borderRadius: 30, width: 90, alignItems: 'center', padding: 10, marginTop:20 }} onPress={AgeRangeApi}>
          {!Loading ? <Text style={{ fontSize: 20, color: 'white', fontWeight:'600', }}>Done</Text> : <ActivityIndicator color={'white'} />}
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container12: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: 'black',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  sliderContainer: {
    width: '80%',
    // marginBottom: 20,
  },
})
export default AgeRangePicker;