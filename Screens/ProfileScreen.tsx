import React, { useContext, useEffect, useState } from 'react'
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import SwiperCard from '../Components/Swiper.tsx';
import ProfileImagesCard from '../Components/ProfileImagesCard.tsx';
import MediaProfile from '../Components/MediaProfile.tsx';
import BottomSheetComponent from '../Components/BottomSheet.tsx';
import Icon from 'react-native-vector-icons/Ionicons';
import CreateOptions from '../Components/CreateOptions.tsx';
import { removeItem } from '../Utils/AsyncStorage.ts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions, NavigationProp, useNavigation } from '@react-navigation/native';
import { LoginState, RootStackParamList } from '../Utils/Types.ts';
import { useDispatch, useSelector } from 'react-redux';
import RangeSliderFor from '../Components/RangeSlider.tsx';
import AgeRangePicker from '../Components/AgeRangePicker.tsx';
import Logout from '../Components/Logout.tsx';
import HeightRangePicker from '../Components/HeightRangePicker.tsx';
import { Text, TextInput } from 'react-native-paper';
import { Alert, Modal, Pressable } from 'react-native';
import LoaderKit from 'react-native-loader-kit';
import { AppContext } from '../Navigation/PlansApi';
import LinearGradient from 'react-native-linear-gradient';
import { SCREEN_WIDTH } from '@gorhom/bottom-sheet';
import HeightRabgeSlider from '../Components/HeightRabgeSlider.tsx';
import Ionicons2 from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/MaterialCommunityIcons';

const ProfileScreen = () => {
  const [bIndex, setbIndex] = useState(-1);
  const [customComponent, setCustomComponent] = useState<React.ReactNode | null>(null);
  type OTPScreenNavigationProp = NavigationProp<RootStackParamList, 'LoginPage'>;
  const dispatch = useDispatch();
  const navigation = useNavigation<OTPScreenNavigationProp>();
  const { callAllApi } = useContext(AppContext);



  //*********************************************************************************//

  //*********************************************************************************//
  const [focusedText, setFocusedText] = useState(null);
  const [focusedText2, setFocusedText2] = useState(null);
  const [focusedText3, setFocusedText3] = useState(null);
  const [focusedText4, setFocusedText4] = useState(null);
  const [focusedText5, setFocusedText5] = useState(null);
  const token = useSelector((state: LoginState) => state.logins.auth_token);
  const [jobTitle, setJobTitle] = useState('');
  const [address, setAddress] = useState('');
  const [height, setHeight] = useState('');
  const [distance, setDistance] = useState('');
  const [distanceSI, setDistanceSI] = useState('');
  const [showMe, setShowMe] = useState('');
  const [profileData1, setProfileData] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [ageFrom, setAgeFrom] = useState('');
  const [ageTo, setAgeTo] = useState('');
  const [heightFrom, setHeightFrom] = useState(150);
  const [heightTo, setHeightTo] = useState(200);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  }





  // useEffect(() => {
  //   setFocusedText(profileData1.relationshipGoals);
  // }, []);

  // console.log('123456789', profileData1.relationshipGoals);  

  const handleTextClick = (text) => {
    setFocusedText(text);
  };
  const handleTextClick2 = (text) => {
    setFocusedText2(text);
  };
  const handleTextClick3 = (text) => {
    setFocusedText3(text);
  };
  const handleTextClick4 = (text) => {
    setFocusedText4(text);
  };
  const handleTextClick5 = (text) => {
    setFocusedText5(text);

  };


  const EditProfileApi = async () => {
    setIsLoading(true);
    const payload = {
      token: token,
      relationshipGoals: focusedText,
      education: focusedText2,
      sexualOrientation: focusedText3,
      jobTitle: jobTitle,
      living: address,
      height: height,
      discoveLocation: distance,
      distanceSI: focusedText4,
      showme: focusedText5,
      ageto: ageTo,
      agefrom: ageFrom,
      // heightto: heightTo,
      // heightfrom: heigtFrom
    }
    // console.log('EditProfile Payload ====', payload);
    try {

      const response = await fetch(
        'https://themilan.org/api/editprofile', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      //console.log('EditProfile Payloadddd =======',)
      if (!response.ok) {
        throw new Error(' EditProfile api error');
      }
      const data = await response.json();
      // console.log('EditProfile api =======', data);
      profileData();
      toggleModal();
      setIsLoading(false);
      callAllApi();

    } catch (error) {
      console.error(' EditProfile Error Lasttttt');
      setIsLoading(false);
    }
  }
  //****** Edit Profile Api Ended ******//

  //******  profileData api Started ******/

  useEffect(() => {
    profileData()
  }, [])

  const profileData = async () => {
    const payload = {
      token: token,
    };
    //console.log('profileData Payload ====', payload);
    try {
      const response = await fetch(
        'https://themilan.org/api/user', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error('Create EditProfileApi api error');
      }
      const data = await response.json();
      //console.log('profileData api =======', data.data);
      setProfileData(data.data);
      setFocusedText2(`${data.data.education ? data.data.education : 0}`);
      setHeight(`${data.data.height ? data.data.height : 0}`);
      setDistance(`${data.data.discoveLocation}`);
      setFocusedText4(`${data.data.distanceSI}`);
      setFocusedText5(`${data.data.showMe}`);
      setShowMe(`${data.data.showMe}`);
      setFocusedText(`${data.data.relationshipGoals ? data.data.relationshipGoals : 0}`);
      setFocusedText3(`${data.data.sexualOrientation ? data.data.sexualOrientation : 0}`);
      //setFocusedText3(data.data.sexualOrientation);
      setAddress(`${data.data.living}`);
      setJobTitle(`${data.data.jobTitle}`);
      // setAgeTo(`${data.data.ageTo}`);
      // setAgeFrom(`${data.data.ageFrom}`);
      // setHeightTo(`${data.data.heightTo}`);
      // setHeightFrom(`${data.data.heightFrom}`);

    } catch (error) {
      console.error('profileData Error Lasttttttttttt');
    }
  }


  return (
    <View style={styles.Container}>
      <ScrollView>
        <View style={styles.DpImagesView}>
          {/* <TouchableOpacity onPress={() => navigation.navigate('MainProfile')} style={{flexDirection:'row', alignItems:'center',marginVertical:15, marginLeft:5}}>
            <Icon name="arrow-back-circle" size={35} color="#0E103D"  /><Text style={{ fontSize: 17, fontWeight: "800" }}>Back</Text>
          </TouchableOpacity> */}
          <MediaProfile />
        </View>

        <View style={{ backgroundColor: '#fafafa', paddingVertical: 15, borderRadius: 10 }}>



          <View>
            <View style={styles.OptionsView}>
              {/* <TouchableOpacity style={styles.touchabale} onPress={toggleSlide1}>
                <View style={styles.tochableView}>
                  <Icon name={'book'} size={25} style={styles.icon} />
                  <Text style={styles.innerText}> Education </Text>
                  <Icon name={'chevron-forward-outline'} size={20} color={'white'} style={styles.icons} />
                </View>
              </TouchableOpacity> */}
              {/* {showSlide1 && ( */}
              <View >
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                  <Icon style={{ marginTop: 15 }} name={'school'} size={23} color={'#4A4744'} /><Text style={styles.slideHeader}>   What is your education Levels ?</Text>
                </View>
                <View style={{ width: 'auto', flexDirection: 'row', flexWrap: 'wrap', marginLeft: 20 }}>
                  <TouchableOpacity onPress={() => { handleTextClick2('1'); }}>
                    <Text style={[styles.slideText, focusedText2 === '1' && styles.focusedText]}>Bachelor Degree</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleTextClick2('2')}>
                    <Text style={[styles.slideText, focusedText2 === '2' && styles.focusedText]}>At uni</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleTextClick2('4')}>
                    <Text style={[styles.slideText, focusedText2 === '4' && styles.focusedText]}>PHD</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleTextClick2('3')}>
                    <Text style={[styles.slideText, focusedText2 === '3' && styles.focusedText]}>High School</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleTextClick2('5')}>
                    <Text style={[styles.slideText, focusedText2 === '5' && styles.focusedText]}>On Graduate programme</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleTextClick2('6')}>
                    <Text style={[styles.slideText, focusedText2 === '6' && styles.focusedText]}>Master Degree</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleTextClick2('7')}>
                    <Text style={[styles.slideText, focusedText2 === '7' && styles.focusedText]}>Trade school</Text>
                  </TouchableOpacity>
                </View>
              </View>
              {/* )} */}
            </View>
          </View>

          <View>
            <View style={styles.OptionsView}>
              {/* <TouchableOpacity style={styles.touchabale} onPress={toggleSlide4}>
                <View style={styles.tochableView}>
                  <Icon name={'male-female'} size={25} style={styles.icon} />
                  <Text style={styles.innerText}> Sexual Orientation </Text>
                  <Icon name={'chevron-forward-outline'} size={20} color={'white'} style={styles.icons} />
                </View>
              </TouchableOpacity> */}
              {/* {showSlide4 && ( */}
              <View >
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                  <Icon style={{ marginTop: 15 }} name={'male-female'} size={25} color={'#4A4744'} /><Text style={styles.slideHeader}> Select your Sexual Orientation ?</Text>
                </View>

                <View style={{ width: 'auto', flexDirection: 'row', flexWrap: 'wrap', marginLeft: 20 }}>

                  <TouchableOpacity onPress={() => handleTextClick3('1')}>
                    <Text style={[styles.slideText, focusedText3 === '1' && styles.focusedText]}> Straight </Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => handleTextClick3('2')}>
                    <Text style={[styles.slideText, focusedText3 === '2' && styles.focusedText]}> Gay </Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => handleTextClick3('3')}>
                    <Text style={[styles.slideText, focusedText3 === '3' && styles.focusedText]}> Lesbian </Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => handleTextClick3('4')}>
                    <Text style={[styles.slideText, focusedText3 === '4' && styles.focusedText]}> Bisexual </Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => handleTextClick3('5')}>
                    <Text style={[styles.slideText, focusedText3 === '5' && styles.focusedText]}> Asexual </Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => handleTextClick3('6')}>
                    <Text style={[styles.slideText, focusedText3 === '6' && styles.focusedText]}> Demisexual </Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => handleTextClick3('7')}>
                    <Text style={[styles.slideText, focusedText3 === '7' && styles.focusedText]}> Queer  </Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => handleTextClick3('8')}>
                    <Text style={[styles.slideText, focusedText3 === '8' && styles.focusedText]}> Bicurious </Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => handleTextClick3('9')}>
                    <Text style={[styles.slideText, focusedText3 === '9' && styles.focusedText]}> Aromantic </Text>
                  </TouchableOpacity>

                  {/* <TouchableOpacity onPress={() => handleTextClick3('10PanSexual')}>
                    <Text style={[styles.slideText, focusedText3 === '10PanSexual' && styles.focusedText]}> PanSexual </Text>
                  </TouchableOpacity> */}
                </View>
              </View>

              {/* )} */}
            </View>
          </View>

          <View>
            <View style={styles.OptionsView}>
              {/* <TouchableOpacity style={styles.touchabale} onPress={toggleSlide5}>
                <View style={styles.tochableView}>
                  <Icon name={'heart-half'} size={25} style={styles.icon} />
                  <Text style={styles.innerText}> Relationship Goals </Text>
                  <Icon name={'chevron-forward-outline'} size={20} color={'white'} style={styles.icons} />
                </View>
              </TouchableOpacity> */}

              {/* {showSlide5 && ( */}
              <View >
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                  <Ionicons2 name="eye" size={27} color="#5A5552" style={{ marginTop: 15 }} /><Text style={styles.slideHeader}>  What is your Relationship Goals ?</Text>
                </View>
                <View style={{ width: 'auto', flexDirection: 'row', flexWrap: 'wrap', marginLeft: 20 }}>
                  <TouchableOpacity onPress={() => handleTextClick('4')}>
                    <Text style={[styles.slideText, focusedText === '4' && styles.focusedText]}> Short-term fun </Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => handleTextClick('5')}>
                    <Text style={[styles.slideText, focusedText === '5' && styles.focusedText]}> New friends </Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => handleTextClick('1')}>
                    <Text style={[styles.slideText, focusedText === '1' && styles.focusedText]}> Long-term Partner </Text>
                  </TouchableOpacity>


                  <TouchableOpacity onPress={() => handleTextClick('2')}>
                    <Text style={[styles.slideText, focusedText === '2' && styles.focusedText]}> Long-term but short-term </Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => handleTextClick('3')}>
                    <Text style={[styles.slideText, focusedText === '3' && styles.focusedText]}> Short-term but long-term OK </Text>
                  </TouchableOpacity>



                  <TouchableOpacity onPress={() => handleTextClick('6')}>
                    <Text style={[styles.slideText, focusedText === '6' && styles.focusedText]}> Still figuring it out </Text>
                  </TouchableOpacity>
                </View>
              </View>
              {/* )} */}
            </View>

          </View>

          <View>
            <View style={styles.OptionsView}>
              {/* <TouchableOpacity style={styles.touchabale} onPress={toggleSlide2}>
                <View style={styles.tochableView}>
                  <Icon name={'briefcase'} size={25} style={styles.icon} />
                  <Text style={styles.innerText}> Job Title </Text>
                  <Icon name={'chevron-forward-outline'} size={20} color={'white'} style={styles.icons} />
                </View>
              </TouchableOpacity> */}
              {/* {showSlide2 && ( */}
              <View >
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                  <Icon style={{ marginTop: 15 }} name={'briefcase'} size={23} color={'#4A4744'} /><Text style={styles.slideHeader}>  What is your Job Title ?</Text>
                </View>

                <View style={{ width: 'auto', flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: 15 }}>
                  <TextInput
                    style={{ width: '100%' }}
                    label="Enter your job"
                    mode="outlined"
                    textColor='black'
                    value={jobTitle}
                    onChangeText={text => setJobTitle(text)}
                  />
                </View>
              </View>
              {/* )} */}
            </View>
          </View>

          <View>
            <View style={styles.OptionsView}>
              {/* <TouchableOpacity style={styles.touchabale} onPress={toggleSlide3}>
                <View style={styles.tochableView}>
                  <Icon name={'trail-sign'} size={25} style={styles.icon} />
                  <Text style={styles.innerText}> Living </Text>
                  <Icon name={'chevron-forward-outline'} size={20} color={'white'} style={styles.icons} />
                </View>
              </TouchableOpacity> */}

              {/* {showSlide3 && ( */}
              <View >
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                  <Icon style={{ marginTop: 15 }} name={'trail-sign'} size={23} color={'#4A4744'} /><Text style={styles.slideHeader}>  Your Address ?</Text>
                </View>

                <View style={{ width: 'auto', flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: 15 }}>
                  <TextInput
                    style={{ width: '100%' }}
                    label="Enter your Address"
                    mode="outlined"
                    textColor='black'
                    value={address}
                    onChangeText={text => setAddress(text)}
                  />
                </View>
              </View>
              {/* )} */}
            </View>
          </View>


          <View>
            <View style={styles.OptionsView}>
              {/* <TouchableOpacity style={styles.touchabale} onPress={toggleSlide6}>
                <View style={styles.tochableView}>
                  <Icon name={'accessibility'} size={25} style={styles.icon} />
                  <Text style={styles.innerText}> Height </Text>
                  <Icon name={'chevron-forward-outline'} size={20} color={'white'} style={styles.icons} />
                </View>
              </TouchableOpacity> */}

              {/* {showSlide6 && ( */}
              <View >
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                  <Ionicons name="human-male-height-variant" size={23} color="#5A5552" style={{ marginTop: 15 }} /><Text style={styles.slideHeader}>  Your Height ?</Text>
                </View>
                <View style={{ width: 'auto', flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: 15 }}>
                  <TextInput
                    style={{ width: '100%', backgroundColor: 'white', }}
                    label="Enter your Height"
                    mode="outlined"
                    textColor='black'
                    value={height}
                    onChangeText={text => setHeight(text)}
                  />
                </View>
              </View>
              {/* )} */}
            </View>
          </View>


          <View style={{
            backgroundColor: '#F6F6F6', marginHorizontal: 10, borderRadius: 8, marginTop: 20, paddingVertical: 20, shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: 0.30,
            shadowRadius: 4.65,
            elevation: 3,
            shadowColor: "#000",
          }}>
            <Text style={{ textAlign: 'center', fontSize: 20, color: '#4A4744', fontWeight: '700', fontFamily: 'georgia', }}>Your Preferences</Text>


            <View>
              <View style={styles.OptionsView}>
                {/* <TouchableOpacity style={styles.touchabale} onPress={toggleSlide9}>
                  <View style={styles.tochableView}>
                    <Icon name={'male-female'} size={25} style={styles.icon} />
                    <Text style={styles.innerText}> Show Me  </Text>
                    <Icon name={'chevron-forward-outline'} size={20} color={'white'} style={styles.icons} />
                  </View>
                </TouchableOpacity> */}

                {/* {showSlide9 && ( */}
                <View>

                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                    <Icon style={{ marginTop: 15 }} name={'male-female'} size={23} color={'#4A4744'} /><Text style={styles.slideHeader}> Show Me </Text>
                  </View>

                  <View style={{ width: 'auto', flexDirection: 'row', flexWrap: 'wrap', marginLeft: 20 }}>
                    <TouchableOpacity onPress={() => handleTextClick5('0')}>
                      <Text style={[styles.slideText, focusedText5 === '0' && styles.focusedText]}> Male </Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => handleTextClick5('1')}>
                      <Text style={[styles.slideText, focusedText5 === '1' && styles.focusedText]}> Female </Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => handleTextClick5('2')}>
                      <Text style={[styles.slideText, focusedText5 === '2' && styles.focusedText]}> Others </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                {/* )} */}
              </View>
            </View>

            <View>
              <View style={styles.OptionsView}>
                {/* <TouchableOpacity style={styles.touchabale} onPress={toggleSlide7}>
                  <View style={styles.tochableView}>
                    <Icon name={'location'} size={25} style={styles.icon} />
                    <Text style={styles.innerText}> Distance </Text>
                    <Icon name={'chevron-forward-outline'} size={20} color={'white'} style={styles.icons} />
                  </View>
                </TouchableOpacity> */}

                {/* {showSlide7 && ( */}
                <View >
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                    <Ionicons style={{ marginTop: 15 }} name={'google-maps'} size={23} color={'#4A4744'} /><Text style={styles.slideHeader}> Distance ?</Text>
                  </View>
                  <View style={{ width: 'auto', flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: 15 }}>
                    <TextInput
                      style={{ width: '100%', backgroundColor: 'white' }}
                      label="Enter Distance"
                      mode="outlined"
                      textColor='black'
                      value={distance}
                      onChangeText={text => setDistance(text)}
                    />
                  </View>
                </View>
                {/* )} */}
              </View>
            </View>


            <View>
              <View style={styles.OptionsView}>
                {/* <TouchableOpacity style={styles.touchabale} onPress={toggleSlide8}>
                  <View style={styles.tochableView}>
                    <Icon name={'navigate'} size={25} style={styles.icon} />
                    <Text style={styles.innerText}> Distance in  </Text>
                    <Icon name={'chevron-forward-outline'} size={20} color={'white'} style={styles.icons} />
                  </View>
                </TouchableOpacity> */}

                {/* {showSlide8 && ( */}
                <View >
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                    <Ionicons style={{ marginTop: 15 }} name={'google-maps'} size={23} color={'#4A4744'} /><Text style={styles.slideHeader}> Your Distance in ?</Text>
                  </View>
                  
                  <View style={{ width: 'auto', flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: 15 }}>
                    <TouchableOpacity onPress={() => handleTextClick4('km')}>
                      <Text style={[styles.slideText, focusedText4 === 'km' && styles.focusedText]}> Km </Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => handleTextClick4('mi')}>
                      <Text style={[styles.slideText, focusedText4 === 'mi' && styles.focusedText]}> Mi </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                {/* )} */}
              </View>
            </View>

            {/* <View style={styles.OptionsView}>
              <TouchableOpacity style={styles.touchabale} onPress={AgeRangePrefComp2}>
                <View style={styles.tochableView}>
                  <Icon name={'person'} size={25} style={styles.icon} />
                  <Text style={styles.innerText}> Height Preferences</Text>
                  <Icon name={'chevron-forward-outline'} size={20} color={'white'} style={styles.icons} />
                </View>
              </TouchableOpacity>
            </View> */}

            {/* <View style={styles.OptionsView}>
              <TouchableOpacity style={styles.touchabale} onPress={AgeRangePrefComp}>
                <View style={styles.tochableView}>
                  <Icon name={'person'} size={25} style={styles.icon} />
                  <Text style={styles.innerText}> Age Preference </Text>
                  <Icon name={'chevron-forward-outline'} size={20} color={'white'} style={styles.icons} />
                </View>
              </TouchableOpacity>
            </View> */}

            <View >
              <Text style={[styles.slideHeader, { marginLeft: 10, marginBottom: 20 }]}>Select age preference </Text>
              <View style={{ marginTop: 2 }}>
                <RangeSliderFor low={ageFrom} high={ageTo} setLow={setAgeFrom} setHigh={setAgeTo} />
              </View>
            </View>

            <View >
              <Text style={[styles.slideHeader, { marginLeft: 10, marginBottom: 20 }]}>Select age preference </Text>
              <View style={{ marginTop: 2 }}>
                <HeightRabgeSlider low={heightFrom} high={heightTo} setLow={setHeightFrom} setHigh={setHeightTo} />
              </View>
            </View>

          </View>

          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', width: '100%' }}>
            <TouchableOpacity onPress={EditProfileApi}>
              <LinearGradient style={[{ alignItems: 'center', margin: 20, borderRadius: 5, width: SCREEN_WIDTH / 1.3, padding: 5, }, styles.submit]}
                colors={['#f52d70', '#fe765f']}
              >
                {isLoading ? (
                  // Display loader here 
                  <LoaderKit style={{ width: 30, height: 30 }} name={'BallPulse'} color={'white'} />
                ) : (
                  <Text style={{ color: '#F6F6F6', fontWeight: '700', fontSize: 25, fontFamily: 'georgia', }}> Submit </Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
        {/* <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <TouchableOpacity style={{ alignItems: 'center', margin: 20, borderRadius: 30, width: '30%', padding: 10, backgroundColor: 'red' }} onPress={LogoutComp}>
            <Text style={{ color: 'white', fontWeight: '700', fontSize: 20 }}> Logout </Text>
          </TouchableOpacity>
        </View> */}

        <View style={{ marginBottom: 30 }}></View>
      </ScrollView>
      <View style={StyleSheet.absoluteFillObject}>
        <BottomSheetComponent bIndex={bIndex} setbIndex={setbIndex} >
          <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1, }}>
            {customComponent}
          </View>
        </BottomSheetComponent>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
      >
        <View style={[styles.centeredView,]}>
          <View style={[styles.modalView,]} >
            <TouchableOpacity onPress={toggleModal} style={{ position: 'absolute', top: -12, right: -12, backgroundColor: '#fd5c63', borderRadius: 50, }}>
              <Icon name={'close'} color={'white'} size={35} />
            </TouchableOpacity>
            <Text style={{ fontSize: 20, fontWeight: '800' }}>Profile Updated Successfully!</Text>
          </View>
        </View>
      </Modal>
    </View>
  );

}

const styles = StyleSheet.create({
  Container: {
    flex: .95,
    backgroundColor: 'white'
  },
  icon: {
    color: 'black'
  },
  OptionsView: {
    margin: 10,
    backgroundColor: 'transparent',
  },
  tochableView: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'transparent', margin: 10
  },
  innerText: {
    color: '#4A4744',
    fontSize: 17,
    fontWeight: '700',
    marginLeft: 8,
    fontFamily: 'georgia',
  },
  icons: {
    position: 'absolute', end: 3, color: 'black'
  },
  touchabale: { backgroundColor: '#FFFAFA', marginHorizontal: 10, borderRadius: 5, },

  OptionText: {
    marginStart: 7,
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold'
  },
  DpImagesView: {
    flex: 1,
    backgroundColor: 'white'
  },
  OptionsTextInput: {
    elevation: 20,
  },


  slideShow: {
    marginTop: 10,
    maxHeight: 200,
  },
  slide: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    marginBottom: 10,
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

  slideHeader: {
    fontSize: 18,
    fontWeight: '700',
    alignContent: 'center',
    marginTop: 15,
    fontFamily: 'georgia',
    color: '#4A4744'
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

  slideBackground: {
    backgroundColor: '#D6D4D2',
    marginHorizontal: 10,
    marginTop: 10,
    borderRadius: 15,
  },

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    height: 200,
    width: 300,

    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },

  submit: {
    borderWidth: 0.5,
    borderColor: '#E5E4E2',
    borderStyle: 'solid',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  inputs: {
    // borderWidth: 1,
    // borderColor: 'white',
    // borderStyle: 'solid',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  }
});

export default ProfileScreen;