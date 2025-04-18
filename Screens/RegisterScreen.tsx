import React, { createRef, useEffect, useRef, useState } from 'react';
import { Alert, BackHandler, Dimensions, Image, KeyboardAvoidingView, ScrollView, StyleSheet, Text, Touchable, View } from 'react-native';
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
import AnimatedButton from './AnimatedButton';
import CustomTextInput from './CustomTextInput';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '@gorhom/bottom-sheet';
import Ionicons from 'react-native-vector-icons/Ionicons';
// Define the theme colors
type RegisterScreenRouteProp = RouteProp<RootStackParamList, 'RegisterPage'>;
type OTPScreenNavigationProp = NavigationProp<RootStackParamList, 'HomeScreen'>;
const theme = {
  colors: {
    primary: '#83beff',
    background: '#F8EDEB',
    surface: 'white',
    text: '#ee3573',
    placeholder: '#A8DADC',
  },
  roundness: 10
};

const RegisterScreen = () => {
  const route = useRoute<RegisterScreenRouteProp>();
  const navigation = useNavigation<OTPScreenNavigationProp>();
  const { phoneNumber, countryCode } = route.params;
  const [name, setName] = useState('');
  const [isEnable, setIsEnable] = useState(false);
  const [age, setAge] = useState('');
  const [gender, setGender] = useState(3);
  const [job, setJob] = useState('');
  const [surname, setSurname] = useState('');
  const [pageNo, setPageNo] = useState(0);
  const [religion, setRelegion] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const pagerRef = useRef<PagerView>(null);
  const dispatch = useDispatch();
  const [fcmTokens, setFcmToken] = useState('');
  const progressWidth = Math.floor((pageNo / 7) * Dimensions.get('window').width);

  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [ageError, setAgeError] = useState('');
  const [professionError, setProfessionError] = useState('');
  const [religionError, setReligionError] = useState('');
  const [genderError, setGenderError] = useState('');
  const [interests, setInterests] = useState([]);
  const [bioError, setBioError] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [selectedItemsError, setSelectedItemsError] = useState('');
  const [selectedGender, setSelectedGender] = useState(null);
  const [apiError, setApiError] = useState(false);
  const [showBackBtn, setShowBackBtn] = useState(false);

  const handleBioChange = (text) => {
    const words = text.split(/\s+/).filter((word) => word.length > 0);
    if (words.length <= 150) {
      setBio(text);
      setWordCount(words.length);
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
      // console.log('Refreshed FCM Token:', token);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleRegister = () => {
    const url = 'https://themilan.org/api/register';
    const params = {
      mobile: phoneNumber,
      name: name,
      age: age,
      gender: gender,
      job: job,
      cast: 'Doe',
      religion: religion,
      email: email,
      device_token: fcmTokens,
      countryCode: countryCode,
      interest: selectedItems,
      bio: bio
    };
    //  console.log('//////////', params)

    axios.post(url, params)
      .then(response => {
        console.log("000000000000", response);
        if (response.data.isSuccess) {
          let token = response.data.token;
          console.log('register');
          if (token != null) {
            storeData("Token", token).then(() => {
              console.log("Token saved:", token);
              navigation.dispatch(StackActions.replace('LoginPage', { key: Math.random() }));
              setApiError(false);
            }).catch((error) => {
              console.error("Error saving token:", error);
            });
          }
          // console.log(response.data.message + response.data.token);

        } else {
          console.log('register dataaaaaaaaaa', response.data);
          // navigation.navigate('LoginPage');
        }
        console.log('register dataaaaaaaaaa', response.data);
      })
      .catch(error => {
        console.error("❌ Axios Error:", error);

        // Log error response details
        if (error.response) {
          console.error("📌 Server responded with:", error.response.data.errors.email);
          setApiError(true);
        }
      });
  };

  useEffect(() => {
    InterestApi();
  }, [])

  const InterestApi = async () => {
    const payload = {
      token: 'token'
    };
    try {
      const response = await fetch(
        'https://themilan.org/api/getInterest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error('Create Order Error')
      }
      const data = await response.json()
      if (data.isSuccess == true) {
        setInterests(data.interests);
      }
    } catch (error) {
      console.error('Create UserData Error Last')
    }
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

  const VerifyFields = () => {
    if (name.trim() === '') {
      setNameError('Name is Required');
      return;
    } else {
      setNameError('');
    }

    if (email.trim() === '' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Invalid Email Address');
      return;
    } else {
      setEmailError('');
    }

    if (age.trim() === '' || parseInt(age) < 18) {
      setAgeError('Age must be at least 18');
      return;
    } else {
      setAgeError('');
    }

    if (job.trim() === '') {
      setProfessionError('Profession is Required');
      return;
    } else {
      setProfessionError('');
    }

    if (religion.trim() === '') {
      setReligionError('Please Enter Religion');
      return;
    } else {
      setReligionError('');
    }

    if (gender === 3) {
      setGenderError('Please select Gender');
      return;
    } else {
      setGenderError('');
    }
    setShowBackBtn(true);
    nextPage();
  };

  const VerifyFields2 = () => {

    if (selectedItems.length == 0) {
      setSelectedItemsError('Please select your interests');
      return;
    } else {
      setSelectedItemsError('');
    }

    if (bio.trim() === '') {
      setBioError('Please Enter Bio');
      return;
    } else {
      setBioError('');
    }
    // If all validations pass, proceed to the next page
    handleRegister();
  };

  const genderOptions = (index: number,) => {
    setSelectedGender(index);
    setGender(index);
    setGenderError('');
    //VerifyField('gender');
    // nextPage();
  }

  const nextPage = () => {
    setPageNo(pageNo + 1);
    if (pagerRef.current) {
      pagerRef.current.setPage(pageNo + 1);
    }
  };

  // const previousPage = () => {
  //   setPageNo(pageNo - 1);
  //   if (pagerRef.current) {
  //     pagerRef.current.setPage(pageNo - 1);
  //   }
  // };

  const prevPage = () => {
    if (pageNo > 0) {
      setPageNo(pageNo - 1);
      if (pagerRef.current) {
        pagerRef.current.setPage(pageNo - 1);
      }
    }
    setShowBackBtn(false);
  };

  const fields = [1, 1, 1, 1, 1, 1]
  const [index, setIndex] = useState(3);


  useEffect(() => {
    // console.log('Selected Data:', selectedItems);
  }, [selectedItems]); // Log whenever selectedItems changes

  const toggleSelection = (item) => {
    setSelectedItems((prevSelectedItems) => {
      if (prevSelectedItems.includes(item)) {
        return prevSelectedItems.filter((i) => i !== item);
      } else {
        return [...prevSelectedItems, item];
      }
    });
  };


  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>

      {showBackBtn ? (
        <TouchableOpacity onPress={prevPage} style={{ marginLeft: 5, marginTop:5 }}>
          <Ionicons name='arrow-back' size={35} color="#4A4744" />
        </TouchableOpacity>
      ) : (
        <Text >
         
        </Text>
      )}
      {/* <TouchableOpacity onPress={prevPage} style={{ marginLeft: 5 }}>
        <Ionicons name='arrow-back' size={30} color="#4A4744" />
      </TouchableOpacity> */}

      {/* <View style={{ height: 4, backgroundColor: 'rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        <View style={{ height: '100%', backgroundColor: 'red', width: progressWidth }} />
      </View> */}
      <PagerView style={styles.viewPager} initialPage={0} pageMargin={10} scrollEnabled={false} ref={pagerRef}>


        <KeyboardAvoidingView style={[{}]} key="1">
          <View style={{ position: 'absolute', width: '100%', height: '100%', }}>
            <Image
              source={require('../Asset/Images/icon.png')}
              resizeMode="contain"
              style={{
                position: 'absolute',
                top: '25%',
                left: '25%',
                width: SCREEN_WIDTH * 0.6,
                height: SCREEN_HEIGHT * 0.3,
                transform: [{ rotate: '-15deg' }],
                opacity: 0.4,
              }}
            />
          </View>
          <ScrollView style={{ paddingBottom: 60, flex: 1, }}>
            {/* Name Field */}
            <View style={{ marginTop: 60 }}>
              <View style={styles.headers}>
                <Text style={styles.headersText}>Enter Your Name </Text>
              </View>

              <View style={styles.container}>
                <CustomTextInput
                  label="Set Your Name"
                  value={name}
                  onChangeText={(text) => setName(text)}
                />
                {nameError.length !== 0 && (
                  <Text style={{ color: 'red', fontSize: 16, fontWeight: 'bold', paddingStart: 5, padding: 5, fontFamily: 'georgia' }}>
                    {nameError}
                  </Text>
                )}
              </View>

              <View style={[styles.headers, {}]}>
                <Text style={[styles.headersText, { width: 350, fontSize: 23 }]}>Enter Your Email Address</Text>
              </View>
              <View style={[styles.container, {}]}>
                <CustomTextInput
                  label="Set Your Email"
                  value={email}
                  onChangeText={(text) => setEmail(text)}
                />
                {emailError.length !== 0 && (
                  <Text style={styles.errorMessage}>{emailError}</Text>
                )}
              </View>

              <View style={[styles.headers, {}]}>
                <Text style={styles.headersText}>Enter Your Age </Text>
              </View>
              <View style={styles.container}>
                <CustomTextInput
                  label="Set Your Age"
                  value={age}
                  onChangeText={(text) => setAge(text)}
                />
                {ageError.length !== 0 && (
                  <Text style={styles.errorMessage}>{ageError}</Text>
                )}
              </View>

              <View style={styles.headers}>
                <Text style={[styles.headersText, { width: 230 }]}>Enter your Profession</Text></View>
              <View style={styles.container}>
                <CustomTextInput
                  label="Set Your Job"
                  value={job}
                  onChangeText={(text) => setJob(text)}
                />
                {professionError.length !== 0 && (
                  <Text style={{ color: 'red', fontSize: 16, fontWeight: 'bold', paddingStart: 5, padding: 5, fontFamily: 'georgia' }}>
                    {professionError}
                  </Text>
                )}
              </View>

              <View style={styles.headers}>
                <Text style={[styles.headersText, { width: 200 }]}>Enter your Religion</Text></View>
              <View style={styles.container}>
                <CustomTextInput
                  label="Set You Religion"
                  value={religion}
                  onChangeText={(text) => setRelegion(text)}
                />
                {religionError.length !== 0 && (
                  <Text style={{ color: 'red', fontSize: 16, fontWeight: 'bold', paddingStart: 5, padding: 5, fontFamily: 'georgia' }}>
                    {religionError}
                  </Text>
                )}

              </View>

              <View style={{ marginTop: -30 }} key="4">
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    elevation: 20,
                    marginHorizontal: 30,
                    marginTop: 50,
                  }}
                >
                  <View key="male">
                    <TouchableOpacity onPress={() => genderOptions(0)}>
                      <Text
                        style={[
                          styles.slideText,
                          selectedGender === 0 && styles.focusedText,
                        ]}
                      >
                        Male
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View key="female">
                    <TouchableOpacity onPress={() => genderOptions(1)}>
                      <Text
                        style={[
                          styles.slideText,
                          selectedGender === 1 && styles.focusedText,
                        ]}
                      >
                        Female
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View key="others">
                    <TouchableOpacity onPress={() => genderOptions(2)}>
                      <Text
                        style={[
                          styles.slideText,
                          selectedGender === 2 && styles.focusedText,
                        ]}
                      >
                        Other
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {genderError.length !== 0 && (
                <Text style={{ color: 'red', fontSize: 16, fontWeight: 'bold', paddingStart: 5, padding: 5, fontFamily: 'georgia', marginLeft: 35 }}>
                  {genderError}
                </Text>
              )}

              <View style={[styles.buttonContainer, {}]}>
                <AnimatedButton
                  title="Continue"
                  onPress={VerifyFields}
                />
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        <View style={[styles.page,]} key="5">
          <KeyboardAvoidingView
            style={{ flex: 1, }}
            behavior="padding"
            keyboardVerticalOffset={100}
          >

            <View style={{ position: 'absolute', width: '100%', height: '100%' }}>
              <Image
                source={require('../Asset/Images/icon.png')}
                resizeMode="contain"
                style={{
                  position: 'absolute',
                  top: '25%',
                  left: '25%',
                  width: SCREEN_WIDTH * 0.6,
                  height: SCREEN_HEIGHT * 0.3,
                  transform: [{ rotate: '-15deg' }],
                  opacity: 0.4,
                }}
              />
            </View>
            <ScrollView style={{ height: '100%', marginTop: 50, }}
              contentContainerStyle={{ paddingBottom: 20 }}
              ref={(ref) => (scrollViewRef = ref)} >
              <View style={styles.inteestBox}>

                <View style={[styles.hearders, { marginBottom: 40 }]}>
                  <Text style={[styles.headersText, { width: 300, marginLeft: 10 }]}>Select your interests</Text>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5, justifyContent: 'center', flexWrap: 'wrap', }}>
                  {interests.map((data, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => {
                        toggleSelection(data.id);
                      }}
                    >
                      <Text style={[
                        styles.slideText,
                        selectedItems.includes(data.id) && styles.focusedText,
                      ]}>{data.Name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {selectedItemsError.length !== 0 && (
                  <Text style={{ color: 'red', fontSize: 16, fontWeight: 'bold', paddingStart: 5, padding: 5, fontFamily: 'georgia', marginLeft: 20 }}>
                    {selectedItemsError}
                  </Text>
                )}
              </View>

              <View style={[styles.interestBox, { marginHorizontal: 20 }]}>
                <View style={[styles.headers, { marginBottom: 40 }]}>
                  <Text style={[styles.headersText, { width: 300, marginLeft: -20 }]}>Bio</Text>
                </View>

                <CustomTextInput
                  label="Write something about yourself..."
                  value={bio}
                  onChangeText={(text) => handleBioChange(text)}
                  onFocus={() => {
                    scrollViewRef.scrollToEnd({ animated: true });
                  }}
                />
                <Text style={styles.wordCount}>{wordCount} / 150 words</Text>

                {bio.length == 0 && (
                  <Text style={{ color: 'red', fontSize: 16, fontWeight: 'bold', paddingStart: 5, padding: 5, fontFamily: 'georgia', marginLeft: 20 }}>
                    {bioError}
                  </Text>
                )}

                {apiError && (
                  <Text style={{ color: 'red', fontSize: 16, fontWeight: 'bold', paddingStart: 5, padding: 5, fontFamily: 'georgia', marginLeft: 0 }}>
                    The email has already taken. Please enter a unique email.
                  </Text>
                )}
              </View>

              <View style={[styles.buttonContainer, { marginBottom: 10 }]}>
                <AnimatedButton
                  title="Continue"
                  onPress={VerifyFields2}
                />
              </View>

              {/* <View style={{ width: 100, marginTop: 10, marginLeft: 10 }}>
                <AnimatedButton
                  title="Back"
                  onPress={prevPage}
                />
              </View> */}
            </ScrollView>
          </KeyboardAvoidingView>
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
    marginBottom: 10
  },
  welcome: { fontSize: 25, color: '#4A4744', marginBottom: 10, marginHorizontal: 25, fontWeight: '700', fontFamily: 'georgia' },
  errorMessage: { color: 'red', fontSize: 16, fontWeight: 'bold', paddingStart: 5, padding: 5, fontFamily: 'georgia' },
  headersText: { fontSize: 23, color: '#5A5552', letterSpacing: 0, marginBottom: -30, fontWeight: '700', width: 300, },
  container: {
    flex: 1,
    marginTop: 30,
    marginBottom: 25,
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
    marginBottom: 10,
    marginTop: 50
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: -20,
    borderWidth: 1,
    borderColor: '#F6F6F6'
  },
  buttonText: {
    color: '#F6F6F6',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'georgia'
  },
  page: { backgroundColor: 'White', justifyContent: 'center', marginVertical: '23%' },
  text: {
    fontSize: 20,
  },
  input: {
    backgroundColor: '#f7f7f7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    // marginBottom:50,

  },


  slideText: {
    fontSize: 16,
    color: '#4A4744',
    fontFamily: 'georgia',
    fontWeight: '700',
    backgroundColor: 'white',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 3,
    margin: 10, borderWidth: 1,
    borderColor: '#E5E4E2',
    borderStyle: 'solid',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },

  focusedText: {
    backgroundColor: '#E5E4E2',
    color: '#5A5552',
    fontSize: 20,
    fontWeight: '800',
    borderWidth: 0.5,
    borderColor: 'white',
    borderStyle: 'solid',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
    borderRadius: 5
  },

  interestBox: {
    marginTop: 20,
    // marginHorizontal:20
  },


  inputBio: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: '#333',
    height: 100,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
    marginHorizontal: 25
  },
  wordCount: {
    fontSize: 14,
    color: '#666',
    textAlign: 'right',
    marginHorizontal: 25
  },
});

export default RegisterScreen;


