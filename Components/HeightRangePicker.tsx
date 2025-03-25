import React, { useState } from "react";
import { ActivityIndicator, StyleSheet, Text } from "react-native";
import { View, TouchableOpacity } from "react-native";
import RangeSliderFor from "./RangeSlider"; 


const HeightRangePicker = () => {
    const [ageFrom, setAgeFrom] = useState(18);
    const [ageTo, setAgeTo] = useState(80);
    const [Loading, setLoading] = useState(false);
     const ChangeAge = () => { 
        setLoading(false);
     }

    return(
        <View style={styles.container12}>
        <Text style={styles.title}>Set Your Height Preference</Text>
        <View style={styles.sliderContainer}>
            <RangeSliderFor low={ageFrom} high={ageTo} setLow={setAgeFrom} setHigh={setAgeTo} /> 
        </View> 
        <View style={{justifyContent:'center', alignItems:'center',}}>
         <TouchableOpacity style={{backgroundColor:'tomato', borderRadius:30, width:90, alignItems:'center', padding:10, }} onPress={ChangeAge}>
           {!Loading ? <Text style={{fontSize:17, color:'white'}}>Done</Text> : <ActivityIndicator color={'white'}/> }
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
        color:'black',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 40,
      },
      sliderContainer: {
        width: '80%',
        // marginBottom: 20,
      },
   })
   export default HeightRangePicker;