import React, { useEffect, useState } from 'react';
import { Button, Image, StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
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
import Ionicons from 'react-native-vector-icons/MaterialCommunityIcons';
import LoaderKit from 'react-native-loader-kit';
import AnimatedButton from './AnimatedButton';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '@gorhom/bottom-sheet';

type OTPScreenRouteProp = RouteProp<RootStackParamList, 'OtpPage'>;
type OTPScreenNavigationProp = NavigationProp<RootStackParamList, 'HomeScreen'>;
function OTPScreen() {
  const navigation = useNavigation<OTPScreenNavigationProp>();
  const route = useRoute<OTPScreenRouteProp>();
  const [isloading, setIsLoading] = useState(false);
  const [fcmTokens, setFcmToken] = useState('');
  const dispatch = useDispatch();
  const { phoneNumber, otpS, countryCode } = route.params;
  const otpR = `${otpS}`
  const [resendOtp, setResendOtp] = useState('');
  const [otp, setOtp] = useState(new Array(4).fill(''));
  // const [otp, setOtp] = useState('');
  const [getOtp, setGetOtp] = useState();
  const [resendBtn, setResendBtn] = useState(true);
  const [verifyBtn, setVerifyBtn] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

   console.log('//////////////////', otpR);

  const handleOTPChange = (text, index) => {
    let newOtp = [...otp];
    newOtp[index] = text;

    setOtp(newOtp);

    if (text && index < 3) {
      let nextInput = `otpInput${index + 1}`;
      this[nextInput].focus();
    }

    if (text === '' && index > 0) {
      let prevInput = `otpInput${index - 1}`;
      this[prevInput].focus();
    }
  };


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


  const ResendOtp = () => {
    setResendBtn(false);
    fetch('https://themilan.org/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobile: phoneNumber, countryCode: countryCode }),
    })
      .then(response => response.json())
      .then(data => {
        // console.log('Received API Response:', data);
        setResendBtn(true);
      })
      .catch(error => {
        console.error('Resend OTP Error:', error);
        setIsLoading(false);
        setResendBtn(true);

      });
  };

  const handleVerifyOTP = () => {
    setVerifyBtn(false);
    // Convert OTP array to a numeric string
    const otpString = otp.join('');

    if (otpString.length < 4) {
      Alert.alert("Invalid OTP", "Please enter a valid 4-digit OTP.");
      setVerifyBtn(true);
      setIsLoading(false);
      return;
    }
    axios.post(`https://themilan.org/api/verifyOTP?mobile=${parseInt(phoneNumber)}&otp=${otpString}&device_token=${fcmTokens}&countryCode=${parseInt(countryCode)}`)
      .then((response) => {
        const data = response.data;
        if (data.isSuccess) {
          if (data.code === 102) {
            setVerifyBtn(true);
            navigation.navigate('RegisterPage', { phoneNumber, countryCode });
            setIsLoading(false);
          } else if (data.code === 201) {
            const token = data.token;
            if (token) {
              storeData("Token", token).then(() => {
                console.log("Token saved:", token);
                setVerifyBtn(true);
                navigation.dispatch(StackActions.replace('LoginPage', { key: Math.random() }));
              }).catch((error) => {
                console.error("Error saving token:", error);
              });
            }
          }
        } else {
          setVerifyBtn(true);
          setErrorMessage(data.message);
        }
      })
      .catch((error) => {
        setVerifyBtn(true);
        console.error('Error:', `https://themilan.org/api/verifyOTP?mobile=${parseInt(phoneNumber)}&otp=${otpString}&device_token=${fcmTokens}&countryCode=${parseInt(countryCode)}`);
      });
  };



  return (
    <View style={styles.container}>
      {/* <View style={{height:SCREEN_HEIGHT/2.5, justifyContent:'center'}}>
        <Image 
          source={require('../Asset/Images/icon.png')} // replace with your image url
          style={[styles.image]}
          resizeMode='contain'
        />
      </View> */}

      <Image source={require('../Asset/Images/icon.png')}
        resizeMode='contain'
        style={{ height: SCREEN_HEIGHT / 3, marginTop: SCREEN_HEIGHT / 3.8, width: SCREEN_WIDTH / 2, alignSelf: 'center', transform: [{ rotate: '-15deg' }] }}
      >
      </Image>
      <View style={styles.form}>
        <Text style={{ fontFamily: 'georgia', fontSize: 20, fontWeight: '700', marginLeft: 20, color: "#656565", textAlign: 'center' }}>Enter Otp</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: -20 }}>
          <Ionicons name="account" size={40} color="#5A5552" style={{ marginTop: 20 }} />
          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={input => this[`otpInput${index}`] = input}
                style={styles.otpInput}
                keyboardType="numeric"
                maxLength={1}
                value={digit}
                onChangeText={(text) => handleOTPChange(text, index)}
              />
            ))}
          </View>
        </View>
        <TouchableOpacity style={{ width: 120, marginTop: -10, alignItems: 'center', alignSelf: 'flex-end', }}>

          {resendBtn ? (
            <Text onPress={ResendOtp} style={{ fontSize: 15, fontWeight: '700', fontFamily: 'georgia', color: '#525252' }}>Resend OTP</Text>
          ) : (
            <LoaderKit style={{ width: 40, height: 40 }} name="BallClipRotateMultiple" color="#525252" />
          )}

        </TouchableOpacity>

        <Text style={{ fontSize: 20, color: 'red', fontFamily: 'georgia', fontWeight: '700', marginHorizontal: 20, textAlign: 'center', marginTop: 20 }}>{errorMessage}</Text>
        <View style={[styles.button]}>
          {verifyBtn ? (
            <AnimatedButton
              title="Verify Otp"
              onPress={handleVerifyOTP}
            />) : (
            <LinearGradient style={{ width: 160, alignItems: 'center', borderRadius: 5, }} colors={['#f52d70', '#fe765f']}
            >
              <LoaderKit style={{ width: 40, height: 40 }} name="BallClipRotateMultiple" color="white" />
            </LinearGradient>
          )}
        </View>
      </View>
    </View>
  );
}
export default OTPScreen;

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
    height: 300,
    width: 200,
    alignSelf: 'center',

    // width: '100%',
    // resizeMode: 'cover',
  },
  form: {
    // paddingHorizontal: "4%",
    // paddingVertical: "6%",
    // marginTop: -30,
    // borderTopLeftRadius: 30,
    // borderTopRightRadius: 30,
    // backgroundColor: '#F0F6F6',
    // flex: 1,


    backgroundColor: 'rgba(225,225,225, 0.9)',
    position: 'absolute',
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: 10,
    height: SCREEN_HEIGHT,
    justifyContent: 'center'
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
    width: 200,
    alignSelf: 'center',
    alignItems: 'center',
    padding: 9,
    borderRadius: 5,
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

  otpInput: {
    width: 40,
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
    fontSize: 18,
    color: 'red',
    marginHorizontal: 10,
    fontFamily: 'georgia',
    backgroundColor: 'transparent'
  },


  otpContainer: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 20,
  },

});


const theme = {
  colors: {
    primary: '#ff6699', // This will change the border color
    text: '#ff6699', // This will change the text color
  },
};


