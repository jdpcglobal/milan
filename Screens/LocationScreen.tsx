import React, { useEffect, useRef, useState } from 'react';
import { View, Text, ActivityIndicator,Linking, Platform, Alert, Touchable, StyleSheet } from 'react-native';
// import Geolocation,{GeoCoordinates}from 'react-native-geolocation-service';
import Geolocation from '@react-native-community/geolocation';  
import { check, PERMISSIONS, RESULTS, request } from 'react-native-permissions';
import { UseSelector, useSelector } from 'react-redux';
import { RootState } from '@reduxjs/toolkit/query';
import { LoginState, RootStackParamList } from '../Utils/Types';
import { getAuthToken } from '../Utils/ConstFunc';
import axios from 'axios';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { CommonActions, NavigationProp, StackActions, useNavigation } from '@react-navigation/native';
import { removeItem } from '../Utils/AsyncStorage';

import Animated, { Easing, interpolate, useAnimatedStyle, useSharedValue, withRepeat, withSpring, withTiming } from 'react-native-reanimated';
import  Icon  from 'react-native-vector-icons/Ionicons';
type ScreenNavigationProp = NavigationProp<RootStackParamList, 'HomeScreen'>;
const LocationScreen = () => { 
  const navigation =   useNavigation<ScreenNavigationProp>(); 

  const [fetching, setFetching] = useState(true);
  const [grantPerm, setGrantPerm] = useState(false);
  const [location, setLocation] = useState<any|null>(null); 
  const token = useSelector((state : LoginState) => state.logins.auth_token);
  
   const ripples = Array.from({ length: 5 }, ( ) => ({
    value: useSharedValue(0),
  }));

  const generateRipple = (index:number) => {
  const ripple = ripples[index];
  ripple.value.value = 0; // Reset radius
  ripple.value.value = withTiming(1, { duration: 3000, easing: Easing.out(Easing.ease) }, () => {
    ripple.value.value = 0; // Reset after animation completes
  });
};

 useEffect(() => {
  let index = 0;
  const intervalId = setInterval(() => {
    generateRipple(index);
    index = (index + 1) % ripples.length; // Cycle through ripples
  }, 400); // Generate a new ripple every second

  return () => clearInterval(intervalId); // Clear interval when component unmounts
}, []);

   const animatedStyles = ripples.map((ripple, index) =>
    useAnimatedStyle(() => {
      return {
        opacity: interpolate(ripple.value.value, [0, 1], [1, 0]),
        transform: [{ scale: interpolate(ripple.value.value, [0, 1], [0, 1]) }],
       // zIndex: ripples.length + index, // Set the zIndex based on the ripple index
      };
    })
  );

  const [isPermitted, setIsPermited] = useState(true);
  const openLocationSettings = () => {
    
      Alert.alert(
        'Location Services Required',
        'Please enable location services in your device settings to use this feature.',
        [
          { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
          { text: 'Settings', onPress: () => {Linking.sendIntent('android.settings.LOCATION_SOURCE_SETTINGS'); setIsPermited(true);} },
        ],
        { cancelable: false }
      );
      setFetching(false);
     
  };
     
  const askLocationPer = async() => {
    const requestResult = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      if(requestResult === RESULTS.GRANTED){
        setGrantPerm(true);
        setFetching(true);
      }
  }
  const getLocationPermission = async () => {
    const result = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);

    if (result === RESULTS.GRANTED) {
      setFetching(true);
      return true;
    }

    const requestResult = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      if(requestResult === RESULTS.DENIED){
        setFetching(false);
      }
    return requestResult === RESULTS.GRANTED;
  };

  const callApi = (longitude :number,latitude :number) => {
  
     const url = `https://themilan.org/api/saveLocation?token=${token}&longitude=${longitude}&latitude=${latitude}`;
    fetch(`https://themilan.org/api/saveLocation?token=${token}&longitude=${longitude}&latitude=${latitude}`, {
      method: 'POST'
    })
    .then(response => response.json())
    .then(data => {
      console.log("api called successfully 1111");
      if (data.isSuccess) { 
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              { name: 'HomeScreen' },
            ],
          })
        );
        // navigation.dispatch(StackActions.replace('HomeScreen'));
      } else {
        removeItem('Token'); 
        // Handle unsuccessful response
      }
      console.log(data.message);
      console.log(url);
    })
    .catch(error => {
      // Handle API error if needed
      console.log(error);
    });
    
  }
  const fetchLocation = () => { 
     //let locations = Geolocation.getCurrentPosition(info => info.coords && callApi(info.coords.longitude,info.coords.latitude));
     let locations = Geolocation.getCurrentPosition( position  => callApi(position.coords.longitude,position.coords.latitude),
      error => setIsPermited(false) 
     ); 
  };

  useEffect(() => {
    getLocationPermission().then((hasPermission) => {
      if (hasPermission) { 
        fetchLocation();
        console.log("permitted");
      } else {
        console.log("not permitted");
        setFetching(false); 
      }
    });
  }, [grantPerm]);

  return (
     isPermitted ?  
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {fetching ? (
    //    <View style={styles.abccontainer}>
    //    {/* Your icon or content here */}
    //    <View style={styles.iconContainer}>
    //      <Icon name= {'person'} size={30} color={'black'} />
    //    </View>
 
    //    {/* Render the ripples */}
    //    <Animated.View style={rippleStyle} />
    //  </View>
    <View style={styles.container}>
      {animatedStyles.map((style, index) => (
        <Animated.View key={index} style={[styles.circle, style]} />
      ))}
       {/* <Animated.View style={[styles.circle, animatedStyles]} />  */}
       <Icon name={'location-outline'} color={'white'} size={30}/>
    </View>
      ) : (
      <TouchableOpacity style={{ borderRadius:15, backgroundColor:'red', padding:15, }} onPress={askLocationPer}>
       <Text style={{fontSize: 16, fontWeight: 'bold', color: 'white'}}>
         Grant Location Permission To App 
       </Text>
     </TouchableOpacity>
      )}
    </View> : 
    <View style={{flex:1, justifyContent:'center', backgroundColor:'#000', alignItems:'center'}} >
      <TouchableOpacity style={{ borderRadius:15, backgroundColor:'red', padding:15, }} onPress={openLocationSettings}>
       <Text style={{fontSize: 16, fontWeight: 'bold', color: 'white'}}>
         Enable Location From Settings
       </Text>
     </TouchableOpacity>
    </View>

  );
};

const styles = StyleSheet.create({
  abccontainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
     
  },
  
  iconContainer: {
    // Style your icon container here
  },
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000', // Assuming a dark background
  },
  circle: {
    position: 'absolute',
    width: 400,
    height: 400,
    borderRadius: 200,
    borderColor : 'rgba(255,255,255,0.9)',
    backgroundColor:  'transparent',
    borderWidth:5, 
  },
   
})
export default LocationScreen;
