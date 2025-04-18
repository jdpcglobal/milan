import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, ActivityIndicator, Text, ImageBackground } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import CountryCodeDropdownPicker from 'react-native-dropdown-country-picker';
import SocialIcons from '../Components/SocialIcons';
import PageLoading from '../Components/PageLoading';
import { getItem } from '../Utils/AsyncStorage';
import { saveToken } from '../Fetures/Login/LoginSlice';
import AnimatedButton from './AnimatedButton';
import LoaderKit from 'react-native-loader-kit';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '@gorhom/bottom-sheet';

type ScreenNavigationProp = NavigationProp<RootStackParamList, 'OtpPage'>;

const LoginScreen = () => {
  const navigation = useNavigation<ScreenNavigationProp>();
  const dispatch = useDispatch();
  const [mNumber, setMNumber] = useState('');
  const [isloading, setIsLoading] = useState(false);
  const [indicatorColor, setIndicatorColor] = useState('blue');
  const [errorMessage, setErrorMessage] = useState('');
  const [isPageLoading, setIsPageLoading] = useState(true);

  
  const [selected, setSelected] = useState('+1 '); // Default dial code
  const [country, setCountry] = useState('');
  const [phone, setPhone] = useState('');

  const colors = ['blue', 'green', 'red', 'white'];

  // console.log('selected country', selected, country);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const authToken = await getItem('Token');
        if (authToken) {
          dispatch(saveToken(authToken));
          navigation.navigate('LocationPage');

          console.log('+++++++++++',authToken)
        } else {
          setIsPageLoading(false);
        }
      } catch (error) {
        console.error("Error getting token:", error);
        setIsPageLoading(false);
      }
    };

    checkLogin();
  }, []);

  const handleLogin = () => {
    if (phone.length < 10) {
      setErrorMessage("Please enter a 10-digit mobile number.");
      return;
    }

    setErrorMessage('');
    setIsLoading(true);

    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * colors.length);
      setIndicatorColor(colors[randomIndex]);
    }, 1000);

    setTimeout(() => clearInterval(interval), 5000);

    LoginApi();
  };

  const LoginApi = () => {
    fetch('https://themilan.org/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobile: phone, countryCode: selected }),
    })
      .then(response => response.json())
      .then(data => {
        navigation.navigate('OtpPage', { phoneNumber: phone, otpS: data.otp, countryCode: selected });
        setIsLoading(false);
      })
      .catch(error => {
        console.error(error);
        setIsLoading(false);
      });
  };

  const handleRegister = () => {
    // Registration logic (if any)
  };

  const setLimitedPhone = (input) => {
    const sanitizedInput = input.replace(/[^0-9]/g, '');
    if (sanitizedInput.length <= 10) {
      setPhone(sanitizedInput);
    }
  };

  return (
    !isPageLoading ? (
      <View style={styles.container}>
        {/* <View style={{height:SCREEN_HEIGHT/2.5, justifyContent:'center'}}>
          <Image
            source={require('../Asset/Images/icon.png')}
            style={styles.image}
           resizeMode='contain'
          />
        </View> */}

        <Image source={require('../Asset/Images/Milan1.png')}
          resizeMode='contain'
          style={{ height: SCREEN_HEIGHT / 2.5, marginTop: 50, width: SCREEN_WIDTH / 1.5, alignSelf: 'center', transform: [{ rotate: '-0deg' }] }}
        >
        </Image>
        <View style={styles.form}>

        <CountryCodeDropdownPicker
        selected={selected}
        setSelected={setSelected}
        setCountryDetails={setCountry} // Pass the entire country object
        phone={phone}
        setPhone={setLimitedPhone}
        countryCodeTextStyles={{ fontSize: 13 }}
        phoneStyles={{
          backgroundColor: 'white',
          borderWidth: 0.5,
          borderColor: '#989898',
          borderRadius: 7,
          color: 'black',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 3,
          elevation: 3,
        }}
      />
          {errorMessage.length !== 0 && (
            <Text style={{ fontSize: 15, color: 'red', fontWeight: 'bold', paddingHorizontal: '5%', fontFamily: 'georgia', textAlign: 'right' }}>
              {errorMessage}
            </Text>
          )}

          <View style={{ width: 150, alignSelf: 'center', marginVertical: 20 }}>
            {!isloading ? (
              <AnimatedButton
                title="Login"
                onPress={handleLogin}
              />
            ) : (
              <LinearGradient style={styles.button} colors={['#f52d70', '#fe765f']}>
                <LoaderKit
                  style={{ width: 40, height: 40, }}
                  name={'BallClipRotateMultiple'}
                  color={'white'}
                />
              </LinearGradient>
            )}
          </View>

        </View>
      </View>
    ) : (
      <PageLoading />
    )
  );
};

export default LoginScreen;

// Styles remain unchanged
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  socialIconsView: {
    marginBottom: 20,
    alignItems: 'center'
  },
  image: {
    height: 200,
    // marginBottom:50,
    width: '100%',
    resizeMode: 'cover'
  },
  form: {
    // paddingHorizontal: "4%",
    // paddingVertical: "6%",
    // marginTop: 30,
    // borderTopLeftRadius: 30,
    // borderTopRightRadius: 30,
    // flex: 1,
    backgroundColor: 'rgba(225,225,225, 0.0)',
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
    marginVertical: 20,
    // paddingHorizontal: 15,
    width: 150,
    alignSelf: 'center',
    alignItems: 'center',
    // padding: 9,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#F6F6F6',
  },
  text: {
    textAlign: 'center',
    color: '#ff6699'
  },
  link: {
    color: '#42BFDD',
    textDecorationLine: 'underline',
  },
});

const theme = {
  colors: {
    primary: '#ff6699', // This will change the border color
    text: '#ff6699', // This will change the text color
  },
};
