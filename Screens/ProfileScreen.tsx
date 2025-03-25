import React, { useContext, useEffect, useState } from 'react'
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
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

const ProfileScreen = () => {
  const [bIndex, setbIndex] = useState(-1);
  const [customComponent, setCustomComponent] = useState<React.ReactNode | null>(null);
  type OTPScreenNavigationProp = NavigationProp<RootStackParamList, 'LoginPage'>;
  const dispatch = useDispatch();
  const navigation = useNavigation<OTPScreenNavigationProp>();
  const { callAllApi } = useContext(AppContext);


  const CustomComponent1 = () => (
    <View style={{ backgroundColor: '#DCDCDC', marginHorizontal: 10, borderRadius: 8, marginTop: 20, paddingVertical: 20 }}>
      <Text style={{ textAlign: 'center', fontSize: 20, color: 'black', fontWeight: '700', fontFamily: 'georgia', }}>Your Preferences</Text>
      <View>
        <View style={styles.OptionsView}>
          <TouchableOpacity style={styles.touchabale} onPress={toggleSlide7}>
            <View style={styles.tochableView}>
              <Icon name={'location'} size={25} style={styles.icon} />
              <Text style={styles.innerText}> Distance </Text>
              <Icon name={'chevron-forward-outline'} size={20} color={'white'} style={styles.icons} />
            </View>
          </TouchableOpacity>

          {showSlide7 && (
            <View style={styles.slideBackground}>
              <Text style={styles.slideHeader}>{/* <Icon style={{ marginTop: 10 }} name={'trail-sign'} size={25} /> */}Distance ?</Text>
              <View style={{ width: 'auto', paddingHorizontal: 15, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly' }}>
                <TextInput
                  style={{ width: '100%' }}
                  label="Enter Distance"
                  mode="outlined"
                  textColor='black'
                  value={distance}
                  onChangeText={text => setDistance(text)}
                />
              </View>
            </View>
          )}
        </View>
      </View>


      <View>
        <View style={styles.OptionsView}>
          <TouchableOpacity style={styles.touchabale} onPress={toggleSlide8}>
            <View style={styles.tochableView}>
              <Icon name={'navigate'} size={25} style={styles.icon} />
              <Text style={styles.innerText}> Distance in  </Text>
              <Icon name={'chevron-forward-outline'} size={20} color={'white'} style={styles.icons} />
            </View>
          </TouchableOpacity>

          {showSlide8 && (
            <View style={styles.slideBackground}>
              <Text style={styles.slideHeader}>{/* <Icon style={{ marginTop: 10 }} name={'trail-sign'} size={25} /> */}Your Distance ?</Text>
              <View style={{ width: 'auto', paddingHorizontal: 15, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly' }}>
                <TouchableOpacity onPress={() => handleTextClick4('Km')}>
                  <Text style={[styles.slideText, focusedText4 === 'Km' && styles.focusedText]}> Km </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handleTextClick4('Mi')}>
                  <Text style={[styles.slideText, focusedText4 === 'Mi' && styles.focusedText]}> Mi </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>

      <View>
        <View style={styles.OptionsView}>
          <TouchableOpacity style={styles.touchabale} onPress={toggleSlide9}>
            <View style={styles.tochableView}>
              <Icon name={'male-female'} size={25} style={styles.icon} />
              <Text style={styles.innerText}> Show Me  </Text>
              <Icon name={'chevron-forward-outline'} size={20} color={'white'} style={styles.icons} />
            </View>
          </TouchableOpacity>

          {showSlide9 && (
            <View style={styles.slideBackground}>
              <Text style={styles.slideHeader}>{/* <Icon style={{ marginTop: 10 }} name={'trail-sign'} size={25} /> */}Your Distance ?</Text>
              <View style={{ width: 'auto', paddingHorizontal: 15, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly' }}>
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
          )}
        </View>
      </View>

      <View style={styles.OptionsView}>
        <TouchableOpacity style={styles.touchabale} onPress={AgeRangePrefComp2}>
          <View style={styles.tochableView}>
            <Icon name={'person'} size={25} style={styles.icon} />
            <Text style={styles.innerText}> Height Preferences</Text>
            <Icon name={'chevron-forward-outline'} size={20} color={'white'} style={styles.icons} />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.OptionsView}>
        <TouchableOpacity style={styles.touchabale} onPress={AgeRangePrefComp}>
          <View style={styles.tochableView}>
            <Icon name={'person'} size={25} style={styles.icon} />
            <Text style={styles.innerText}> Age Preference </Text>
            <Icon name={'chevron-forward-outline'} size={20} color={'white'} style={styles.icons} />
          </View>
        </TouchableOpacity>
      </View>

    </View>

  );
  const [data, setData] = useState<string[]>(['ram', 'shayam', 'rekha', 'suresh', 'ganesh']);
  const [userSelectedOption, setUserSelectedOption] = useState(['rekha', 'ram']);


  const CustomComponent2 = () => (
    <View>
      <Text style={styles.slideHeader}> <Icon style={{ marginTop: 10 }} name={'briefcase'} size={25} />  What is your Job Title ?</Text>
      <View style={{ width: 'auto', paddingHorizontal: 15, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly' }}>
        <TextInput
          style={[{ width: '100%', marginTop: 50, backgroundColor: 'white' }, styles.inputs]}
          label="Enter your job"
          mode="outlined"
          textColor='black'
          maxLength={10}
          left={<TextInput.Icon icon={'briefcase'} />}
        />
      </View>
    </View>
  );

  const CustomComponent3 = () => (
    <View>
      <Text style={styles.slideHeader}> <Icon style={{ marginTop: 10 }} name={'trail-sign'} size={25} /> Your Address ?</Text>
      <View style={{ width: 'auto', paddingHorizontal: 15, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly' }}>
        <TextInput
          style={{ width: '100%', marginTop: 50, backgroundColor: 'white' }}
          label="Enter your Address"
          mode="outlined"
          textColor='black'
          maxLength={10}
        />
      </View>
    </View>
  );

  const CustomComponent4 = () => (
    <View>
      <Text style={styles.slideHeader}> <Icon style={{ marginTop: 10 }} name={'male-female'} size={25} />  Select your Sexual Orientation ?</Text>
      <View style={{ width: 'auto', paddingHorizontal: 15, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly' }}>
        <TouchableOpacity >
          <Text style={styles.slideText}> Straight </Text>
        </TouchableOpacity>

        <TouchableOpacity >
          <Text style={styles.slideText}> Gay </Text>
        </TouchableOpacity>

        <TouchableOpacity >
          <Text style={styles.slideText}> Lesbian </Text>
        </TouchableOpacity>

        <TouchableOpacity >
          <Text style={styles.slideText}> Bisexual </Text>
        </TouchableOpacity>

        <TouchableOpacity >
          <Text style={styles.slideText}> Asexual </Text>
        </TouchableOpacity>

        <TouchableOpacity >
          <Text style={styles.slideText}> Demisexual </Text>
        </TouchableOpacity>

        <TouchableOpacity >
          <Text style={styles.slideText}> Queer  </Text>
        </TouchableOpacity>

        <TouchableOpacity >
          <Text style={styles.slideText}> Bicurious </Text>
        </TouchableOpacity>

        <TouchableOpacity >
          <Text style={styles.slideText}> Aromantic </Text>
        </TouchableOpacity>

        <TouchableOpacity >
          <Text style={styles.slideText}> PanSexual </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const CustomComponent5 = () => (
    <View>
      <Text style={styles.slideHeader}> <Icon style={{ marginTop: 10 }} name={'heart'} size={25} />  What is your Relationship Goals ?</Text>
      <View style={{ width: 'auto', paddingHorizontal: 15, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly' }}>
        <TouchableOpacity >
          <Text style={styles.slideText}> Long-term Partner </Text>
        </TouchableOpacity >

        <TouchableOpacity >
          <Text style={styles.slideText}> Long-term but short-term </Text>
        </TouchableOpacity>

        <TouchableOpacity >
          <Text style={styles.slideText}> Shoer-term but long-term OK </Text>
        </TouchableOpacity>

        <TouchableOpacity >
          <Text style={styles.slideText}> Shoer-term fun </Text>
        </TouchableOpacity>

        <TouchableOpacity >
          <Text style={styles.slideText}> New friends </Text>
        </TouchableOpacity>

        <TouchableOpacity >
          <Text style={styles.slideText}> Still figuring it out  </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const CustomComponent6 = () => (
    <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
      <ScrollView style={styles.slideShow}>
        <View style={styles.slide}>
          <Text style={styles.slideText}>Slide 2</Text>
        </View>
      </ScrollView>
    </View>
  );

  const LogoutComp = () => {
    setCustomComponent(<Logout />);
    setbIndex(0);
  }
  const AgeRangePrefComp = () => {
    setCustomComponent(<AgeRangePicker />);
    setbIndex(0);
  }
  const AgeRangePrefComp2 = () => {
    setCustomComponent(<HeightRangePicker />);
    setbIndex(0);
  }
  const ProfileDetails1 = () => {
    setCustomComponent(CustomComponent1);
    setbIndex(0);
  }
  const ProfileDetails2 = () => {
    setCustomComponent(CustomComponent2);
    setbIndex(0);
  }
  const ProfileDetails3 = () => {
    setCustomComponent(CustomComponent3);
    setbIndex(0);
  }
  const ProfileDetails4 = () => {
    setCustomComponent(CustomComponent4);
    setbIndex(0);
  }
  const ProfileDetails5 = () => {
    setCustomComponent(CustomComponent5);
    setbIndex(0);
  }
  const ProfileDetails6 = () => {
    setCustomComponent(CustomComponent6);
    setbIndex(0);
  }

  const CallApi = () => {
    // Function to handle option selection
    // const handleOptionSelect = (option : string) => { 
    //   // Here you can perform any action, such as calling an API
    //   console.log('Option selected:', option);
    // };
    console.warn('hii');

    // const newComponent =  (<CreateOptions options={data} isSearch={true} userSelected={userSelectedOption} onOptionSelect={handleOptionSelect}/>);

  };

  //  useEffect(() => {
  //   const newComponent =  (<CreateOptions options={data} isSearch={true} userSelected={userSelectedOption} onOptionSelect={handleOptionSelect}/>);
  //    setCustomComponent(newComponent);
  //   // Initially set the custom component
  //   }, [userSelectedOption]);
  const handleOptionSelect = (option: string) => {
    // Here you can perform any action, such as calling an API
    setUserSelectedOption([option])
    console.warn('Option selected:', option);
  };

  const createOption = (data: any) => {
    return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {
        data.map((option: any, index: number) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleOptionSelect(option)}
            style={{ marginVertical: 5, padding: 10, backgroundColor: 'lightgray', borderRadius: 5 }}
          >
            <Text>{option}</Text>
          </TouchableOpacity>
        ))
      }
    </View>
  };

  //*********************************************************************************//

  //*********************************************************************************//
  const [showSlide1, setShowSlide1] = useState(false);
  const [showSlide2, setShowSlide2] = useState(false);
  const [showSlide3, setShowSlide3] = useState(false);
  const [showSlide4, setShowSlide4] = useState(false);
  const [showSlide5, setShowSlide5] = useState(false);
  const [showSlide6, setShowSlide6] = useState(false);
  const [showSlide7, setShowSlide7] = useState(false);
  const [showSlide8, setShowSlide8] = useState(false);
  const [showSlide9, setShowSlide9] = useState(false);
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

  const toggleSlide1 = () => {
    setShowSlide1(!showSlide1);
    setShowSlide2(false);
    setShowSlide3(false);
    setShowSlide4(false);
    setShowSlide5(false);
    setShowSlide6(false);
    setShowSlide7(false);
    setShowSlide8(false);
    setShowSlide9(false);
  };
  const toggleSlide2 = () => {
    setShowSlide2(!showSlide2);
    setShowSlide1(false);
    setShowSlide3(false);
    setShowSlide4(false);
    setShowSlide5(false);
    setShowSlide6(false);
    setShowSlide7(false);
    setShowSlide8(false);
    setShowSlide9(false);
  };
  const toggleSlide3 = () => {
    setShowSlide3(!showSlide3);
    setShowSlide2(false);
    setShowSlide1(false);
    setShowSlide4(false);
    setShowSlide5(false);
    setShowSlide6(false);
    setShowSlide7(false);
    setShowSlide8(false);
    setShowSlide9(false);
  };
  const toggleSlide4 = () => {
    setShowSlide4(!showSlide4);
    setShowSlide2(false);
    setShowSlide3(false);
    setShowSlide1(false);
    setShowSlide5(false);
    setShowSlide6(false);
    setShowSlide7(false);
    setShowSlide8(false);
    setShowSlide9(false);
  };
  const toggleSlide5 = () => {
    setShowSlide5(!showSlide5);
    setShowSlide2(false);
    setShowSlide3(false);
    setShowSlide4(false);
    setShowSlide1(false);
    setShowSlide6(false);
    setShowSlide7(false);
    setShowSlide8(false);
    setShowSlide9(false);
  };
  const toggleSlide6 = () => {
    setShowSlide6(!showSlide6);
    setShowSlide2(false);
    setShowSlide3(false);
    setShowSlide4(false);
    setShowSlide5(false);
    setShowSlide1(false);
    setShowSlide7(false);
    setShowSlide8(false);
    setShowSlide9(false);
  };

  const toggleSlide7 = () => {
    setShowSlide7(!showSlide7);
    setShowSlide2(false);
    setShowSlide3(false);
    setShowSlide4(false);
    setShowSlide5(false);
    setShowSlide1(false);
    setShowSlide8(false);
    setShowSlide9(false);
  };

  const toggleSlide8 = () => {
    setShowSlide8(!showSlide8);
    setShowSlide2(false);
    setShowSlide3(false);
    setShowSlide4(false);
    setShowSlide5(false);
    setShowSlide1(false);
    setShowSlide7(false);
    setShowSlide9(false);
  };

  const toggleSlide9 = () => {
    setShowSlide9(!showSlide9);
    setShowSlide2(false);
    setShowSlide3(false);
    setShowSlide4(false);
    setShowSlide5(false);
    setShowSlide1(false);
    setShowSlide7(false);
    setShowSlide8(false);
  };

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

  //****** EditProfile Api started ******//

  // const payload =  { 
  //   token: token,
  //   relationshipGoals: parseFloat(focusedText).toFixed(0),
  //   education: parseFloat(focusedText2).toFixed(0),
  //   sexualOrientation: parseFloat(focusedText3).toFixed(0),
  //   jobTitle: jobTitle,
  //   living: address,
  //   height: height,
  // }

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
    console.log('EditProfile Payload ====', payload);
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
      console.log('EditProfile api =======', data);
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

        <View style={{ backgroundColor: 'white', paddingVertical: 15, borderRadius: 20 }}>



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
                <Text style={styles.slideHeader}> {/*<Icon style={{ marginTop: 10 }} name={'school'} size={25} />*/}  What is your education Levels ?</Text>
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
                <Text style={styles.slideHeader}> {/*<Icon style={{ marginTop: 10 }} name={'male-female'} size={25} /> */} Select your Sexual Orientation ?</Text>
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
                <Text style={styles.slideHeader}>{/* <Icon style={{ marginTop: 10 }} name={'heart'} size={25} /> */} What is your Relationship Goals ?</Text>
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
                <Text style={styles.slideHeader}> {/*<Icon style={{ marginTop: 10 }} name={'briefcase'} size={25} /> */} What is your Job Title ?</Text>
                <View style={{ width: 'auto', flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: 15 }}>
                  <TextInput
                    style={{ width: '100%' }}
                    label="Enter your job"
                    mode="outlined"
                    textColor='black'
                    left={<TextInput.Icon icon={'briefcase'} />}
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
                <Text style={styles.slideHeader}> {/*<Icon style={{ marginTop: 10 }} name={'trail-sign'} size={25} /> */}Your Address ?</Text>
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
                <Text style={styles.slideHeader}>{/* <Icon style={{ marginTop: 10 }} name={'trail-sign'} size={25} /> */}Your Height ?</Text>
                <View style={{ width: 'auto', flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: 15 }}>
                  <TextInput
                    style={{ width: '100%', backgroundColor: 'white' }}
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
            elevation: 6,
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
                  <Text style={styles.slideHeader}>{/* <Icon style={{ marginTop: 10 }} name={'trail-sign'} size={25} /> */}Show Me</Text>
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
                  <Text style={styles.slideHeader}>{/* <Icon style={{ marginTop: 10 }} name={'trail-sign'} size={25} /> */}Distance ?</Text>
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
                  <Text style={styles.slideHeader}>{/* <Icon style={{ marginTop: 10 }} name={'trail-sign'} size={25} /> */}Your Distance ?</Text>
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
              <LinearGradient style={[{ alignItems: 'center', margin: 20, borderRadius: 30, width: SCREEN_WIDTH / 1.2, padding: 10, }, styles.submit]}
                colors={['#ebac4e', '#ba7b1d']}
              >
                {isLoading ? (
                  // Display loader here 
                  <LoaderKit style={{ width: 30, height: 30 }} name={'BallPulse'} color={'white'} />
                ) : (
                  <Text style={{ color: 'white', fontWeight: '700', fontSize: 20, fontFamily: 'georgia', }}> Submit </Text>
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
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 5,
    margin: 10, borderWidth: 1,
    borderColor: '#A19C96',
    borderStyle: 'solid',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
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
    backgroundColor: '#bd69f0',
    color: 'white',
    fontSize: 20,
    fontWeight: '800',
    borderWidth: 0.5,
    borderColor: 'white',
    borderStyle: 'solid',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
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
    borderColor: 'white',
    borderStyle: 'solid',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
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