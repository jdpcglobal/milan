import React, { createRef, useEffect, useRef, useState } from 'react';
import { Alert, BackHandler, Dimensions, StyleSheet, Text, Touchable, View } from 'react-native';
import PagerView from 'react-native-pager-view';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { TextInput } from 'react-native-paper';
import { TouchableOpacity } from 'react-native-gesture-handler';
import axios from 'axios';
import { NavigationProp, RouteProp, StackActions, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../Utils/Types';
import { storeData } from '../Utils/AsyncStorage';
import { useDispatch } from 'react-redux';
import { saveToken } from '../Fetures/Login/LoginSlice';
import messaging from '@react-native-firebase/messaging';
import LinearGradient from 'react-native-linear-gradient';
// Define the theme colors
type RegisterScreenRouteProp = RouteProp<RootStackParamList, 'RegisterPage'>;
type OTPScreenNavigationProp = NavigationProp<RootStackParamList, 'HomeScreen'>;
const theme = {
  colors: {
    primary: '#ee3573', // Cherry Red for primary elements and accents
    background: '#F8EDEB', // Creamy White for page background
    surface: 'white', // Soft Pink for input field backgrounds
    text: '#ee3573', // Midnight Blue for text
    placeholder: '#A8DADC', // Sage Green for placeholders
  },
};

const RegisterScreen = () => {
  const route = useRoute<RegisterScreenRouteProp>();
  const navigation = useNavigation<OTPScreenNavigationProp>();
  const { phoneNumber, countryCode } = route.params;
  const [name, setName] = useState('');
  const [isEnable, setIsEnable] = useState(false);
  const [age, setAge] = useState('');
  const [gender, setGender] = useState(0);
  const [job, setJob] = useState('');
  const [surname, setSurname] = useState('');
  const [pageNo, setPageNo] = useState(0);
  const [religion, setRelegion] = useState('');
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const pagerRef = useRef<PagerView>(null);
  const dispatch = useDispatch();
  const [fcmTokens, setFcmToken] = useState('');
  const progressWidth = Math.floor((pageNo / 7) * Dimensions.get('window').width);

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


  console.log('2222222222222', countryCode);

  const handleRegister = () => {
    const url = 'https://themilan.org/api/register';
    const params = {
      mobile: phoneNumber,
      name: name,
      age: age,
      gender: gender,
      job: job,
      cast: surname,
      religion: religion,
      email: email,
      device_token: fcmTokens,
      countryCode:countryCode,
    };



    axios.post(url, params)
      .then(response => {
        console.log(response);
        if (response.data.isSuccess) {
          let token = response.data.token;
          if (token != null) {
            storeData("Token", token).then(() => {
              console.log("Token saved:", token);
              navigation.dispatch(StackActions.replace('LoginPage', { key: Math.random() }));
            }).catch((error) => {
              console.error("Error saving token:", error);
            });
          }
          console.log(response.data.message + response.data.token);

        } else {
          console.log(response.data);
          navigation.navigate('LoginPage');
        }
        // Handle response here
      })
      .catch(error => {
        console.error(error);
        navigation.navigate('LoginPage');
        // Handle error here
      });
  };

  useEffect(() => {
    const backAction = () => {
      Alert.alert(
        'Hold on!',
        'Are you sure you want to go back? Your progress will be lost.',
        [
          {
            text: 'Cancel',
            onPress: () => null,
            style: 'cancel',
          },
          { text: 'YES', onPress: () => navigation.navigate('LoginPage') },
        ]
      );
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, []);

  const VerifyField = (fieldName: string) => {
    setErrorMessage('');

    switch (fieldName) {
      case 'name':
        if (name.trim() !== '') {
          nextPage();
        } else {
          setErrorMessage('Name is Required');
        }
        break;
      case 'age':
        if (parseInt(age) >= 18) {
          nextPage();
        } else {
          setErrorMessage('Age must be at least 18');
        }
        break;
      case 'gender':
        if (gender <= 0) {
          nextPage();
        } else {
          setErrorMessage('Gender is Required');
        }
        break;
      case 'job':
        if (job.trim() !== '') {
          nextPage();
        } else {
          setErrorMessage('Job is Required');
        }
        break;
      case 'caste':
        if (surname.trim() !== '') {
          nextPage();
        } else {
          setErrorMessage('Caste is Required');
        }
        break;
      case 'religion':
        if (religion.trim() !== '') {
          setIsEnable(true);
          handleRegister();
        } else {
          setErrorMessage('Religion is Required');
        }
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(email)) {
          nextPage();
        } else {
          setErrorMessage('Invalid Email Address');
        }
        break;
      default:
        break;
    }
  };

  const genderOptions = (index: number) => {
    setGender(index);
    //VerifyField('gender');
    nextPage();
  }

  const nextPage = () => {
    setPageNo(pageNo + 1);
    if (pagerRef.current) {
      pagerRef.current.setPage(pageNo + 1);
    }
  };

  const fields = [1, 1, 1, 1, 1, 1]
  const [index, setIndex] = useState(3);
  return (
    <View style={{ flex: 1 }}>
      <View style={{ height: 4, backgroundColor: 'rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        <View style={{ height: '100%', backgroundColor: 'red', width: progressWidth }} />
      </View>
      <PagerView style={styles.viewPager} initialPage={0} pageMargin={10} scrollEnabled={false} ref={pagerRef}>
        <View style={styles.page} key="1">
          <View style={styles.headers}><Text style={styles.headersText}>My Name Is </Text></View>
          <View style={styles.container}>
            <TextInput
              label="Set Your Name"
              placeholder='eg: john Doe'
              value={name}
              onChangeText={setName}
              mode='flat'
              textColor='black'
              // left = {<TextInput.Icon   icon={'lock'}  />}
              theme={theme}
              style={styles.input}
              onSubmitEditing={() => VerifyField('name')}
            />
            {errorMessage.length !== 0 ? <Text style={{ color: 'red', fontSize: 16, fontWeight: 'bold', paddingStart: 5, padding: 5, fontFamily: 'georgia' }}>{errorMessage}</Text> : null}


          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={() => VerifyField('name')}>
              <LinearGradient style={styles.button}
                colors={['#ebac4e', '#ba7b1d']}
              >
                <Text style={styles.buttonText}>Continue</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.page} key="7">
          <Text style={styles.welcome}> Welcome ! {name}</Text>
          <View style={styles.headers}>

            <Text style={[styles.headersText, { fontSize: 25 }]}>My Surname Is.</Text></View>
          <View style={styles.container}>
            <TextInput
              label="Surname"
              value={surname}
              placeholder='eg : Saini'
              onChangeText={setSurname}
              mode='flat'
              textColor='black'
              theme={theme}
              style={styles.input}
              onSubmitEditing={() => VerifyField('caste')}
            />
            {errorMessage.length !== 0 ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}

          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={() => VerifyField('caste')}>
              <LinearGradient style={styles.button}
                colors={['#ebac4e', '#ba7b1d']}
              >
                <Text style={styles.buttonText}>Continue</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.page} key="2">
          <Text style={styles.welcome}> Welcome ! {name}</Text>
          <View style={styles.headers}>

            <Text style={[styles.headersText, { width: 280 }]}>My Email Address Is. </Text></View>
          <View style={styles.container}>
            <TextInput
              label="Email"
              placeholder='eg : JohnDoe@gmail.com'
              keyboardType='email-address'
              value={email}
              onChangeText={setEmail}
              mode='flat'
              textColor='black'
              theme={theme}
              style={styles.input}
              onSubmitEditing={() => VerifyField('email')}
            />
            {errorMessage.length !== 0 ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}


          </View>
          <View style={[styles.buttonContainer, { marginBottom: -30 }]}>
            <TouchableOpacity onPress={() => VerifyField('email')}>
              <LinearGradient style={styles.button}
                colors={['#ebac4e', '#ba7b1d']}
              >
                <Text style={styles.buttonText}>Continue</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.page} key="3">
          <Text style={styles.welcome}> Welcome ! {name}</Text>
          <View style={styles.headers}>

            <Text style={styles.headersText}>My Age Is. </Text></View>
          <View style={styles.container}>
            <TextInput
              label="What Is Your age"
              value={age}
              maxLength={2}
              keyboardType='numeric'
              onChangeText={setAge}
              mode='flat'
              textColor='black'
              theme={theme}
              style={styles.input}
              onSubmitEditing={() => VerifyField('age')}
            />
            {errorMessage.length !== 0 ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}


          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={() => VerifyField('age')}>
              <LinearGradient style={styles.button}
                colors={['#ebac4e', '#ba7b1d']}
              >
                <Text style={styles.buttonText}>Continue</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ marginTop: '30%' }} key="4">
          <Text style={styles.welcome}> Welcome ! {name}</Text>
          <View style={styles.headers}>
            <Text style={[styles.headersText, { width: 190 }]}>My Gender Is. </Text></View>
          <View style={[{ flexDirection: 'row', justifyContent: 'space-around', elevation: 20, marginHorizontal: 30, marginTop: 50, }]}>
            <TouchableOpacity key="male" onPress={() => { genderOptions(0) }}>
              <LinearGradient style={styles.button}
                colors={['#ebac4e', '#ba7b1d']}
              >
                <Text style={styles.buttonText}>Male</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity key="female" onPress={() => { genderOptions(1) }}>
              <LinearGradient style={styles.button}
                colors={['#ebac4e', '#ba7b1d']}
              >
                <Text style={styles.buttonText}>Female</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity key="others" onPress={() => { genderOptions(2) }}>
              <LinearGradient style={styles.button}
                colors={['#ebac4e', '#ba7b1d']}
              >
                <Text style={styles.buttonText}>Other</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.page} key="5">
          <Text style={styles.welcome}> Welcome ! {name}</Text>
          <View style={styles.headers}>

            <Text style={[styles.headersText, { width: 230 }]}>My Profession is </Text></View>
          <View style={styles.container}>
            <TextInput
              label="Profession"
              placeholder='eg: software engineer'
              value={job}
              onChangeText={setJob}
              mode='flat'
              textColor='black'
              theme={theme}
              style={styles.input}
              onSubmitEditing={() => VerifyField('job')}

            />
            {errorMessage.length !== 0 ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}


          </View>
          <View style={[styles.buttonContainer, { marginBottom: -50 }]}>
            <TouchableOpacity onPress={() => VerifyField('job')}>
              <LinearGradient style={styles.button}
                colors={['#ebac4e', '#ba7b1d']}
              >
                <Text style={styles.buttonText}>Continue</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.page} key="6">
          <Text style={styles.welcome}> Welcome ! {name}</Text>
          <View style={styles.headers}>

            <Text style={[styles.headersText, { width: 200 }]}>My Religion Is. </Text></View>
          <View style={styles.container}>
            <TextInput
              label="Religion"
              value={religion}
              placeholder='eg : Hindu, Sikh,'
              onChangeText={setRelegion}
              mode='flat'
              textColor='black'
              theme={theme}
              style={styles.input}
              onSubmitEditing={() => VerifyField('religion')}
            />
            {errorMessage.length !== 0 ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}

          </View>
          <View style={[styles.buttonContainer, { marginBottom: -50 }]}>
            <TouchableOpacity  disabled={isEnable} onPress={() => VerifyField('religion')}>
              <LinearGradient style={styles.button}
                colors={['#ebac4e', '#ba7b1d']}
              >
                <Text style={styles.buttonText}>Continue</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

      </PagerView>
    </View>
  );
};
const styles = StyleSheet.create({
  viewPager: {
    flex: 1,
  },
  headers: {
    marginHorizontal: 35, width: 180,
  },
  welcome: { fontSize: 20, color: '#4A4744', marginBottom: 10, marginHorizontal: 25, fontWeight: '700', fontFamily: 'georgia' },
  errorMessage: { color: 'red', fontSize: 16, fontWeight: 'bold', paddingStart: 5, padding: 5, fontFamily: 'georgia' },
  headersText: { fontSize: 26, color: '#4A4744', letterSpacing: 0, marginBottom: -30, fontFamily: 'georgia', fontWeight: '700', width: 300, },
  container: {
    flex: 1,
    marginTop: 50,
    marginHorizontal: 30,

  },
  paginationTop: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  paginationLine: {
    height: 3,
    borderRadius: 30,
    marginHorizontal: 2,
  },
  buttonContainer: {
    position: 'relative',
    bottom: 0,
    width: '100%',
    alignItems: 'center',
    marginBottom: -12, // Optional margin from the bottom
  },
  button: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20, // Make the border radius round
    marginBottom: -20
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'georgia'
  },
  page: { backgroundColor: 'White', justifyContent: 'center', marginVertical: '23%' },
  text: {
    fontSize: 20,
  },
  input: {
    backgroundColor: theme.colors.surface,
    // marginBottom:50,

  }
});

export default RegisterScreen;


