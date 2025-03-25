import React, { useEffect, useState } from 'react';
import { Image, View, StyleSheet, Text, TouchableOpacity, Animated, Dimensions, TouchableWithoutFeedback, Alert, Modal, Pressable, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import ActionButtons from './ActionButtons';
import LinearGradient from 'react-native-linear-gradient';
import { LoginState, UserProfile } from '../Utils/Types';
import { Button } from 'react-native-paper';
import BottomSheetComponent from './BottomSheet';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';

type ScreenNavigationProp = NavigationProp<RootStackParamList, 'UserChatScreen'>;
import { RootStackParamList } from '../Utils/Types';

type CardProps = {
  data: UserProfile;
};

const Card = (props: CardProps) => {
  const { data } = props;
  const { images, name, age, distanceaway, religion, surname, id } = data;
  const [imageIndex, setImageIndex] = useState(0);
  const translateX = new Animated.Value(0);
  const navigation = useNavigation<ScreenNavigationProp>();
  const [bIndex, setbIndex] = useState(-1);
  const [customComponent, setCustomComponent] = useState<React.ReactNode | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [profileData, setProfileData] = useState({});
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const token = useSelector((state: LoginState) => state.logins.auth_token);

  const AboutPicWidth = screenWidth / 1.2;
  const AboutPicHeight = screenWidth / 1;
  const toggleModal = (id) => {
    setModalVisible(!modalVisible);
    AboutProfile(id);
  };

  const closeBtn = () => {
    setModalVisible(false);
  };

  const CustomComponent1 = () => (
    <View>
      <Text></Text>
    </View>
  );

  const ProfileDetails1 = () => {
    setCustomComponent(CustomComponent1);
    setbIndex(0);
  };

  const AboutProfile = async (id) => {
    const payload = {
      user_id: id,
      token: token,
    };
    try {
      const response = await fetch('https://themilan.org/api/usersProfileView', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error('Create Order Error');
      }
      const data = await response.json();
      if (data.isSuccess === true) {
        setProfileData(data.user);
      }
    } catch (error) {
      console.error('Create Order Error Last');
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.overlays}>
        <View style={styles.paginationTop}>
          {images.map((img, i) => (
            <View
              key={i}
              style={[
                styles.paginationLine,
                {
                  width: wp(80) / images.length,
                  backgroundColor: i === imageIndex ? 'white' : 'rgba(255, 255, 255, 0.5)',
                },
              ]}
            />
          ))}
        </View>
      </View>
      <Animated.View
        style={[
          styles.imageContainer,
          {
            transform: [
              {
                translateX: translateX.interpolate({
                  inputRange: [-1, 0, 1],
                  outputRange: [wp('40%'), 0, -wp('40%')],
                }),
              },
            ],
          },
        ]}
      >
        <Image source={{ uri: images[imageIndex].url }} style={styles.image} />
      </Animated.View>

      <LinearGradient
        colors={['rgba(0,0,0,0.0)', 'rgba(0,0,0,0.9)']}
        style={styles.overlay}
      >
        <View style={[styles.overlayTextView, { marginBottom: screenHeight / 7 }]}>
          <View>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.age}>{age} years</Text>
            <Text style={styles.age}>{distanceaway}</Text>
          </View>
          <View>
            {/* <TouchableOpacity style={{ marginRight: 50, marginTop: 20 }} onPress={() => toggleModal(id)}>
              <Ionicons name="arrow-up-circle" size={50} color="#D6D4D2" style={{ marginRight: 10 }} />
            </TouchableOpacity> */}

            <TouchableOpacity style={{ marginRight: 50, marginTop: 20, backgroundColor:'rgba(0,0,0,0.3)', borderWidth:0.6, borderColor:'white', borderRadius:25, height:40,width:40, display:'flex', justifyContent:'center', alignItems:'center' }} onPress={() => navigation.navigate('AboutProfile',{ UserData: id })}>
              <Ionicons name="arrow-up" size={30} color="#D6D4D2" style={{  }} />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      <View style={StyleSheet.absoluteFillObject}>
        <BottomSheetComponent bIndex={bIndex} setbIndex={setbIndex}>
          <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
            {customComponent}
          </View>
        </BottomSheetComponent>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.centeredView}>
            <TouchableWithoutFeedback>
              <View style={[styles.modalView, { width: AboutPicWidth * 1.2 }]}>
                <TouchableOpacity onPress={closeBtn} style={{ marginRight: 10, marginBottom: -20, marginLeft: screenWidth / 1.2 }}>
                  <Ionicons name="close-circle" size={45} color="red" />
                </TouchableOpacity>
                <ScrollView>
                  <View style={styles.container}>
                    <View style={{ alignItems: 'center' }}>
                      <Image
                        source={{ uri: profileData.images }}
                        style={{ width: AboutPicWidth * 0.8, height: AboutPicHeight, marginTop: 20, borderRadius: 10 }}
                      />
                    </View>
                    <View style={{ width: AboutPicWidth * 1.2, marginTop: 15, backgroundColor: '#F6F6F6', paddingHorizontal: 12, paddingTop: 15, borderRadius: 10, marginBottom: 20, paddingBottom: 5, flexDirection: 'row', flexWrap: 'wrap' }}>
                      <Text style={{ textAlign: 'center', color: '#5A5552', fontSize: 20, fontWeight: '700', marginBottom: 10, width: '100%', fontFamily: 'georgia' }}>
                        About Profile
                      </Text>
                      {profileData.name ? (
                        <View style={styles.AboutData}>
                          <Text style={styles.AboutText}>Name: {profileData.name} </Text>
                        </View>
                      ) : null}
                      {profileData.mobile ? (
                        <View style={styles.AboutData}>
                          <Text style={styles.AboutText}>Mobile: {profileData.mobile}</Text>
                        </View>
                      ) : null}
                      {profileData.age ? (
                        <View style={styles.AboutData}>
                          <Text style={styles.AboutText}>Age: {profileData.age}</Text>
                        </View>
                      ) : null}
                      {profileData.height ? (
                        <View style={styles.AboutData}>
                          <Text style={styles.AboutText}>Height: {profileData.height}</Text>
                        </View>
                      ) : null}
                      {profileData.living ? (
                        <View style={styles.AboutData}>
                          <Text style={styles.AboutText}>Address: {profileData.living === '' ? 'Did not mention yet' : profileData.living}</Text>
                        </View>
                      ) : null}
                      {profileData.religion ? (
                        <View style={styles.AboutData}>
                          <Text style={styles.AboutText}>Religion: {profileData.religion}</Text>
                        </View>
                      ) : null}
                      {profileData.gender ? (
                        <View style={styles.AboutData}>
                          <Text style={styles.AboutText}>Gender: {profileData.gender === '1' ? 'Female' : 'Male'}</Text>
                        </View>
                      ) : null}
                      {profileData.distanceaway ? (
                        <View style={styles.AboutData}>
                          <Text style={styles.AboutText}>Distance: {profileData.distanceaway}</Text>
                        </View>
                      ) : null}
                      {profileData.education ? (
                        <View style={styles.AboutData}>
                          <Text style={styles.AboutText}>Education: {profileData.education === '1' ? 'Bachelor Degree' : profileData.education === '2' ? 'At uni' : profileData.education === '3' ? 'High School' : profileData.education === '4' ? 'PHD' : profileData.education === '5' ? 'On Graduate programme' : profileData.education === '6' ? 'Master Degree' : profileData.education === '7' ? 'Trade school' : "Didn't Mention"}</Text>
                        </View>
                      ) : null}
                      {profileData.sexualOrientation ? (
                        <View style={styles.AboutData}>
                          <Text style={styles.AboutText}>Sexual Orientation: {profileData.sexualOrientation === '1' ? 'Straight' : profileData.sexualOrientation === '2' ? 'Gay' : profileData.sexualOrientation === '3' ? 'Lesbian' : profileData.sexualOrientation === '4' ? 'Bisexual' : profileData.sexualOrientation === '5' ? 'Asexual' : profileData.sexualOrientation === '6' ? 'Demisexual' : profileData.sexualOrientation === '7' ? 'Queer' : profileData.sexualOrientation === '8' ? 'Bicurious' : profileData.sexualOrientation === '9' ? 'Aromantic' : "Didn't Mention"}</Text>
                        </View>
                      ) : null}
                      {profileData.relationshipGoals ? (
                        <View style={styles.AboutData}>
                          <Text style={styles.AboutText}>Relationship Goals: {profileData.relationshipGoals === '1' ? 'Long-term Partner' : profileData.relationshipGoals === '2' ? 'long-term but short-term' : profileData.relationshipGoals === '3' ? 'Short-term but long-term ok' : profileData.relationshipGoals === '4' ? 'Short-term fun' : profileData.relationshipGoals === '5' ? 'New friends' : profileData.relationshipGoals === '6' ? 'Still figuring out' : "Didn't Mention"}</Text>
                        </View>
                      ) : null}
                    </View>
                  </View>
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};
const LikeButton = (s: string) => {

}
const styles = StyleSheet.create({
  card: {
    marginHorizontal: 5,
    marginVertical: 5,
    // flex: .80, 
    width: '98%',
    height: '87%',
    borderRadius: 20,
    //  borderTopRightRadius: 20,
    //  borderBottomLeftRadius:20,
    // borderWidth: 0,
    // borderColor: 'transparent',
    justifyContent: 'center',
    backgroundColor: '#D3D3D3',
    shadowColor: 'transparent',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,

  },

  paginationTop: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  paginationLine: {
    height: 3,
    borderRadius: 30,
    marginHorizontal: 2,
  },

  imageContainer: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
    overflow: 'hidden',

  },
  leftButton: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: wp('20%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightButton: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    width: wp('20%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    borderRadius:20
    // backgroundColor: 'rgba(0,0,0,0.0)',
  },
  overlayTextView: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  overlays: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: 16,
    zIndex: 2,
    backgroundColor: 'rgba(0,0,0,0.0)',
  },
  name: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#F6F6F6',
    fontFamily: 'georgia'
  },
  age: {
    fontSize: 18,
    color: 'white',
    marginTop: 5,
    fontFamily: 'georgia'
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  image: {
    flex: 1,
    height: null,
    width: null,
    resizeMode: 'stretch',
    // borderTopRightRadius: 30,
    // borderTopLeftRadius: 30,
    // borderBottomRightRadius:
    borderRadius: 20,
  },

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 2,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },

  container: {
    flex: 1,
    alignItems: 'center',
  },

  contentContainer: {
    padding: 16,
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
  userImage: {
    height: 700,
    width: 420,
    borderRadius: 10
  },

  userBk: {
    marginTop: 15,
    backgroundColor: '#F6F6F6',
  },

  AboutData: {
    backgroundColor: '#DE3163',
    paddingVertical: 7,
    borderRadius: 5,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 6,
    paddingHorizontal: 8,
    marginHorizontal: 5
  },

  AboutText: {
    color: '#E5E4E2',
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'georgia',
  },


});

export default Card;