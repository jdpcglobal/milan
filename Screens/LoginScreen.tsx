import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import CountryCodeDropdownPicker from 'react-native-dropdown-country-picker';
import SocialIcons from '../Components/SocialIcons';
import PageLoading from '../Components/PageLoading';
import { getItem } from '../Utils/AsyncStorage';
import { saveToken } from '../Fetures/Login/LoginSlice';

type ScreenNavigationProp = NavigationProp<RootStackParamList, 'OtpPage'>;

const LoginScreen = () => {
  const navigation = useNavigation<ScreenNavigationProp>();
  const dispatch = useDispatch();

  const [mNumber, setMNumber] = useState('');
  const [isloading, setIsLoading] = useState(false);
  const [indicatorColor, setIndicatorColor] = useState('blue');
  const [errorMessage, setErrorMessage] = useState('');
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [selected, setSelected] = useState('+91');
  const [country, setCountry] = useState('');
  const [phone, setPhone] = useState('');

  const colors = ['blue', 'green', 'red', 'white'];

  //console.log('1111111111111111111',selected);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const authToken = await getItem('Token');
        if (authToken) {
          dispatch(saveToken(authToken));
          navigation.navigate('LocationPage');
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
      body: JSON.stringify({ mobile: phone, countryCode:selected }),
    })
      .then(response => response.json())
      .then(data => {
        navigation.navigate('OtpPage', { phoneNumber: phone, otpS: data.otp, countryCode:selected });
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
        <View>
          <Image
            source={require('../Asset/Images/Banner1.png')}
            style={styles.image}
          />
        </View>
        <View style={styles.form}>
          <CountryCodeDropdownPicker
            selected={selected}
            setSelected={setSelected}
            setCountryDetails={setCountry}
            phone={phone}
            setPhone={setLimitedPhone}
            countryCodeTextStyles={{ fontSize: 13 }}
            phoneStyles={{ backgroundColor: 'white', borderWidth: 1, borderColor: '#bc69f0' }}
          />
          {errorMessage.length !== 0 && (
            <Text style={{ fontSize: 15, color: '#bc69f0', fontWeight: 'bold', paddingHorizontal: '5%', fontFamily: 'georgia' }}>
              {errorMessage}
            </Text>
          )}

          <TouchableOpacity onPress={handleLogin}>
            <LinearGradient style={styles.button} colors={['#ebac4e', '#ba7b1d']}>
              {!isloading ? (
                <Text style={{ fontSize: 17, color: 'white', fontWeight: '800' }}>Login</Text>
              ) : (
                <ActivityIndicator size={'small'} color={indicatorColor} />
              )}
            </LinearGradient>
          </TouchableOpacity>

          <Text style={[styles.text, { fontSize: 17, fontWeight: '700', fontFamily: 'georgia', color: '#bc69f0' }]}>
            When You Tap Continue, Milan Will Send A Text With Verification Code, Message And Data Rates May Apply. The Verified Phone Number Can Be Used To Log In.
            <Text style={styles.link} onPress={handleRegister}>
              Learn What Happens When Your Number Changes
            </Text>
          </Text>

          <View style={styles.socialIconsView}>
            <Text style={{ marginTop: 10, fontSize: 15, fontWeight: 'bold', color: '#333' }}>
              Or Sign in with
            </Text>
            <View style={{ flexDirection: 'row', marginTop: 7 }}>
              <SocialIcons key={"google"} name="google" color='#34A853' url='https://www.facebook.com/littlelovenotesllc/' />
              <SocialIcons key={"facebook"} name="facebook" color='#3b5998' url='https://www.facebook.com/littlelovenotesllc/' />
              <SocialIcons key={"twitter"} name="twitter" color='#1da1f2' url='https://twitter.com/i/flow/login?redirect_after_login=%2Flln_llc' />
            </View>
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
    width: 100,
    alignSelf: 'center',
    backgroundColor: '#ff4d6d',
    alignItems: 'center',
    padding: 9,
    borderRadius: 30,
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
