import React, { useEffect, useState } from 'react';
import { Button, Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { CommonActions, StackActions, useNavigation, useRoute } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from "../Utils/Types";
import { NavigationProp } from '@react-navigation/native';
import { ActivityIndicator, TextInput } from 'react-native-paper';
import axios from 'axios';
import { getItem, setItem, storeData } from '../Utils/AsyncStorage';
import { saveToken } from '../Fetures/Login/LoginSlice';
import { saveAuthToken } from '../Utils/ConstFunc';
import { useDispatch } from 'react-redux';
import messaging from '@react-native-firebase/messaging';
import LinearGradient from 'react-native-linear-gradient';

type OTPScreenRouteProp = RouteProp<RootStackParamList, 'OtpPage'>;
type OTPScreenNavigationProp = NavigationProp<RootStackParamList, 'HomeScreen'>;
function OTPScreen() {
  const navigation = useNavigation<OTPScreenNavigationProp>();
  const route = useRoute<OTPScreenRouteProp>();
  const [errorMessage, setErrorMessage] = useState('');
  const [isloading, setIsLoading] = useState(false);
  const [fcmTokens, setFcmToken] = useState('');
  const dispatch = useDispatch();
  const { phoneNumber, otpS, countryCode } = route.params;
  const otpR = `${otpS}`
  const [otp, setOtp] = useState('');


  useEffect(() => {
    const getFCMToken = async () => {
      const fcmToken = await messaging().getToken();
      setFcmToken(fcmToken)
      //console.log(' FCM token', fcmToken);
      if (fcmToken) {
      } else {
        console.log('Failed to get FCM token');
      }
    };
    getFCMToken();
    const unsubscribe = messaging().onTokenRefresh((token) => {
      console.log('Refreshed FCM Token:', token);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  console.log('============', fcmTokens)


  const handleVerifyOTP = () => {
    setIsLoading(true);
    setErrorMessage('');

    if (otpR.length < 4) {
      setErrorMessage("Please Enter A Valid Otp");
      setIsLoading(false);
      return;
    }

    axios.post(`https://themilan.org/api/verifyOTP?mobile=${parseInt(phoneNumber)}&otp=${parseInt(otpR)}&device_token=${fcmTokens}&countryCode=${parseInt(countryCode)}`)

      .then((response) => {
        const data = response.data;
        console.log("API Payload:", data);
        if (data.isSuccess) {
          console.log('OTP verification successful');
          if (data.code === 102) {
            navigation.navigate('RegisterPage', { phoneNumber: phoneNumber, countryCode: countryCode });
            setIsLoading(false);
            console.log(data);
          }
          else if (data.code === 201) {
            const token = data.token; // Assuming data.Token is the token string
            if (token) {
              storeData("Token", token).then(() => {
                console.log("Token saved:", token);
                // dispatch(saveToken(token));
                navigation.dispatch(StackActions.replace('LoginPage', { key: Math.random() }));
              }).catch((error) => {
                console.error("Error saving token:", error);
              });
            } else {
              console.log("Token not found in data");
            }



            // navigation.dispatch(
            //      CommonActions.reset({
            //       index: 0,
            //       routes: [
            //         { name: 'LocationPage' },
            //       ],
            //     })
            //   );
            // navigation.dispatch(StackActions.replace('LocationPage'));

          } else {

          }
          // Proceed with your logic for successful OTP verification
        } else {
          console.log('OTP verification failed:', data.message);
          setErrorMessage(data.message);
          // Handle the case where OTP verification failed
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        // Handle errors here
      });
    setIsLoading(false);
    // Call your verify OTP API here with phoneNumber and otp
    // If OTP verification is successful, navigate to the next screen

  };

  return (
    <View style={styles.container}>
      <View >
        <Image
          source={require('../Asset/Images/Banner1.png')} // replace with your image url
          style={[styles.image]}
        />
      </View>
      <View style={styles.form}>
        <Text style={[styles.text, { fontSize: 17, fontWeight: '700', color: '#bc69f0', fontFamily:'georgia' }]}>
          Verification code Successfully sent to your Number:
          <Text style={styles.link} >
            {" " + phoneNumber}
          </Text>
        </Text>

        <View style={styles.inputContainer}>

          <TextInput
            label="Enter Otp"
            value={otpR}
            keyboardType='numeric'
            // onChangeText={setOtp} 

            theme={theme}
            textColor='black'
            style={styles.input}
            maxLength={4}
            left={<TextInput.Icon color={'#bc69f0'} icon={'account'} />}
          />
        </View>
        {errorMessage.length !== 0 ? <Text style={{ fontSize: 15, color: '#bc69f0', fontWeight: 'bold', paddingHorizontal: '5%',fontFamily:'georgia' }}> {errorMessage}</Text> : null}

        <TouchableOpacity onPress={handleVerifyOTP}>
          <LinearGradient style={[styles.button]}
            colors={['#ebac4e', '#ba7b1d']}
          >
            {!isloading ? <Text style={{ fontSize: 17, color: 'white', fontWeight: '800', fontFamily:'georgia' }}>Verify Otp</Text> : <ActivityIndicator size={'small'} />}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  },
  socialIconsView: {
    marginBottom: 20,
    alignItems: 'center'
  },
  image: {
    height: 225,
    width: '120%',
    resizeMode: 'cover'
  },
  form: {
    paddingHorizontal: "4%",
    paddingVertical: "6%",
    marginTop: -30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: '#F0F6F6',
    flex: 1,
  },
  mainY: {
    marginHorizontal: 10,
    zIndex: 2,
    borderRadius: 10,
    backgroundColor: 'black',
    height: 'auto'
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 8,
    marginHorizontal: 15,
  },
  input: {
    flex: 1,
    marginTop: 5,
    backgroundColor: '#F0F6F6',

  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
  },
  button: {
    marginVertical: 16,
    paddingHorizontal: 15,
    width: 120,
    alignSelf: 'center',
    backgroundColor: '#ff4d6d',
    alignItems: 'center',
    padding: 9,
    borderRadius: 15,
  },
  text: {
    textAlign: 'center',
    color: '#ff6699',

  },
  link: {
    color: '#42BFDD',
    fontSize: 16,
    margin: 5,
    textDecorationLine: 'underline',
  },
});

const theme = {
  colors: {
    primary: '#ff6699', // This will change the border color
    text: '#ff6699', // This will change the text color
  },
};

export default OTPScreen;
