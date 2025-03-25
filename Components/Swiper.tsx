import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, Modal, TouchableOpacity, Animated, ImageBackground, ScrollView } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import Icon from 'react-native-vector-icons/Ionicons';
import Card from './ProfileCard';
import ActionButtons from './ActionButtons';
import messaging from '@react-native-firebase/messaging';
import LoaderKit from 'react-native-loader-kit';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { LoginState, UserProfile } from '../Utils/Types';
import BottomSheetComponent from './BottomSheet';
import { AppContext } from '../Navigation/PlansApi';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

const SwiperCard: React.FC = () => {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [swipeDirection, setSwipeDirection] = useState<string | null>(null);
  const swiperRef = useRef<Swiper<UserProfile>>(null);
  const token = useSelector((state: LoginState) => state.logins.auth_token);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [modalVisible3, setModalVisible3] = useState(false);
  const [modalVisible4, setModalVisible4] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [bIndex, setbIndex] = useState(-1);
  const [customComponent, setCustomComponent] = useState<React.ReactNode | null>(null);
  const navigation = useNavigation();
  const [swipeHistory, setSwipeHistory] = useState<UserProfile[]>([]); // New state variable for swipe history
  const { count, plans2, allUserData } = useContext(AppContext);
  const [matchImage, setMatchImage] = useState({});
  const [profileCode, setProfileCode] = useState('');

  const scaleAnim1 = useRef(new Animated.Value(1)).current;
  const scaleAnim2 = useRef(new Animated.Value(1)).current;
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  // console.log('22222222', allUserData.gender); 


  useEffect(() => {
    // Define the animation sequence
    const animate = (animatedValue) => {
      return Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1.2, // Scale up to 1.2
          duration: 1000, // Duration of the animation
          useNativeDriver: true, // Use native driver for better performance
        }),
        Animated.timing(animatedValue, {
          toValue: 1, // Scale down to 1
          duration: 1000,
          useNativeDriver: true,
        }),
      ]);
    };



    // Create continuous loop animations
    const loopAnimation1 = Animated.loop(animate(scaleAnim1));
    const loopAnimation2 = Animated.loop(animate(scaleAnim2));

    // Start the animations
    loopAnimation1.start();
    loopAnimation2.start();
  }, [scaleAnim1, scaleAnim2]);


  useFocusEffect(
    useCallback(() => {
      const unsubscribe = messaging().onMessage(async remoteMessage => {
        setNotifications(remoteMessage.notification.body);
        if (remoteMessage.notification.title === 'Match') {
          setModalVisible(true);
        }
      });
      return unsubscribe;
    }, [])
  );

  useFocusEffect(
    React.useCallback(() => {
      fetchProfiles();
    }, [])
  );

  const fetchProfiles = async () => {
    setShowLoader(true);
    setShowLoader2(true);
    try {
      const response = await fetch(`https://themilan.org/api/users?token=${token}&page=${1}&perpageitems=${5}`, { method: 'POST' });
      const data = await response.json();
      // console.log('==============', data);
      setProfileCode(data.code);
      // if (data.code == 108) {
      //   navigation.navigate('DetailOfPlans');
      // }
      if (data.isSuccess) {
        setProfiles(data.data);
      } else (
        setProfiles([])
      )

      setLoading(false);
      setShowLoader2(false);
    } catch (error) {
      console.error(error);
      setShowLoader2(false)
    }
  };

  const likedislikeCard = async (id: number, type: number) => {
    try {
      const response = await fetch(`https://themilan.org/api/likeordislike?token=${token}&cardid=${id}&profilelike=${type}`, { method: 'POST' });
      const data = await response.json()
      //console.log('================11111', data);
      setMatchImage(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  //console.log('================11111', matchImage);
  useEffect(() => {
    fetchProfiles();
  }, [count]);

  const onSwipedLeft = (index: number) => {
    const swipedProfile = profiles[index];
    setSwipeHistory(prev => [swipedProfile, ...prev]);
    likedislikeCard(swipedProfile.id, 0);
  };

  const onSwipedRight = (index: number) => {
    const swipedProfile = profiles[index];
    setSwipeHistory(prev => [swipedProfile, ...prev]);
    likedislikeCard(swipedProfile.id, 1);
  };

  const onSwipedAll = () => {
    setProfiles([]);
    setLoading(true);
    fetchProfiles();
  };

  const OnActionPress = (name: string) => {
    if (name === 'like') swiperRef.current?.swipeRight();
    else if (name === 'dislike') swiperRef.current?.swipeLeft();
    else if (name === 'suparlike') swiperRef.current?.swipeTop();
    else if (name === 'bottom') swiperRef.current?.swipeBottom();
    else if (name === 'reload') handleReload();
  };

  const handleReload = () => {
    if (plans2.message == 'You are not subscribed to any plan') {
      setModalVisible3(true);
    } else if (plans2.plan == 1) {
      setModalVisible4(true);
    } else {
      if (swipeHistory.length > 0) {
        const lastSwipedProfile = swipeHistory[0];
        setProfiles(prev => [lastSwipedProfile, ...prev]);
        setSwipeHistory(prev => prev.slice(1));
      } else {
        setModalVisible2(true);
      }
    }

  };

  const CustomComponent1 = () => <View><Text></Text></View>;
  const ProfileDetails1 = () => {
    setCustomComponent(CustomComponent1);
    setbIndex(0);
  };

  const handleNavigation = () => {
    navigation.navigate('Plans');
    setModalVisible3(false);
  }

  const onNavigate = () => {
    navigation.navigate('DetailOfPlans')
  }

  const toggleModal2 = () => setModalVisible(!modalVisible);
  const toggleModal3 = () => setModalVisible2(!modalVisible2);
  const toggleModal4 = () => setModalVisible3(!modalVisible3);
  const toggleModal5 = () => setModalVisible4(!modalVisible4);
  const [showLoader, setShowLoader] = useState(false);
  const [showLoader2, setShowLoader2] = useState(false);
  if (profiles.length === 0) setTimeout(() => setShowLoader(true), 10000);


  const imageSource = allUserData.gender === 0
    ? require('../Asset/Images/Girls.jpg')
    : require('../Asset/Images/Boys.jpg');

  if (!profiles.length) {
    return (
      <View style={{ flex: 1, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' }}>
        {showLoader ? (
          <View>
            {showLoader2 ? (
              <LoaderKit style={{ width: 150, height: 150 }} name={'BallClipRotateMultiple'} color={'white'} />
            ) : (
              <View>
                {profileCode === 108 ? (
                  <LinearGradient
                    style={{ height: screenHeight / 1.07, width: screenWidth, }}
                    colors={['rgba(213,147,255,1)', 'rgba(160,32,240,255)']}
                  >
                    <ScrollView >
                      <View style={{ marginBottom: screenHeight / 7 }}>
                        <View>
                          <Image style={[styles.image2, { width: screenWidth / 1.8, height: screenHeight / 2.2 }]} source={require('../Asset/Images/cartoon-astronaut.png')} />
                          {/* <Image style={[styles.cloud, { width: screenWidth / 2.2, height: screenHeight / 6 }]} source={require('../Asset/Images/cloud.png')} /> */}
                          <Image style={[styles.cloud, { width: screenWidth / 2.6, height: screenHeight / 5.3 }]} source={require('../Asset/Images/moon.png')} />
                        </View>

                        <View>
                          <View style={{ marginBottom: 20, marginTop: -30 }}>
                            <Text style={styles.hang}>Hang tight, we're looking for the best possible matches</Text>
                            <Text style={styles.meantime}>in the meantime....</Text>
                          </View>

                          <TouchableOpacity onPress={() => navigation.navigate('UserLikesScreen')} style={styles.touch}>
                            <View style={styles.strip}>
                              <View style={styles.iconBg}>
                                <Icon name="thumbs-up-outline" size={30} color="#F6F6F6" style={{}} />
                              </View>
                              <Text style={styles.stripText}>See people who liked you!</Text>
                              <Icon name="chevron-forward" size={30} color="rgba(163,42,239,255)" style={{ marginLeft: 0 }} />
                            </View>
                          </TouchableOpacity>

                          <TouchableOpacity onPress={() => navigation.navigate('ChatUsers')} style={styles.touch}>
                            <View style={styles.strip}>
                              <View style={styles.iconBg}>
                                <Icon name="heart-outline" size={40} color="#F6F6F6" style={{}} />
                              </View>
                              <Text style={styles.stripText}>Chat with your Matches!</Text>
                              <Icon name="chevron-forward" size={30} color="rgba(163,42,239,255)" style={{ marginLeft: 0 }} />
                            </View>
                          </TouchableOpacity>
                        </View>

                        <LinearGradient
                        style={styles.button}
                          colors={['#fabb5d', '#bc7d1e']}>
                          <TouchableOpacity onPress={() => navigation.navigate('Plans')} >
                              <Text style={[styles.planText, { width: screenWidth / 1.2 }]}>
                                Explore Plans
                              </Text>
                          </TouchableOpacity>
                        </LinearGradient>

                      </View>
                    </ScrollView>

                  </LinearGradient>
                ) : (
                  <View style={{ backgroundColor: '#D6D4D2', borderRadius: 10 }}>
                    {/* <Image style={{ height: screenHeight/1.7, width: screenWidth/1.09, resizeMode:'contain' }} source={require('../Asset/Images/Girls.jpg')} /> */}
                    <ImageBackground
                      style={{
                        height: screenHeight / 1.5,
                        width: screenWidth / 1.03,
                        borderRadius: 10
                      }}
                      source={imageSource}
                    >
                      <View
                        style={{
                          height: screenHeight / 1.5,
                          width: screenWidth / 1.03,

                          backgroundColor: 'rgba(0, 0, 0, 0.6)'
                        }}
                      >
                        <Image
                          source={require('../Asset/Images/sand.gif')}
                          style={{
                            height: screenHeight / 5,
                            width: screenWidth / 2.5,
                            alignSelf: 'center',
                            marginTop: 50
                          }}
                        />
                        <View>
                          <Text
                            style={{
                              textAlign: 'center',
                              fontSize: 25,
                              fontWeight: '800',
                              fontFamily: 'georgia',
                              color: 'white',
                              marginVertical: 25
                            }}
                          >
                            You're out of likes
                          </Text>
                          <Text
                            style={{
                              textAlign: 'center',
                              fontSize: 16,
                              fontWeight: '600',
                              fontFamily: 'georgia',
                              color: 'white',
                              marginTop: screenWidth / 12
                            }}
                          >
                            Likes refresh every 24 hours. You can wait or get unlimited likes with our subscription
                          </Text>
                        </View>
                        <TouchableOpacity onPress={() => navigation.navigate('Plans')} style={styles.touch2}>
                          <View style={styles.button}>
                            <Text style={[styles.planText, { width: screenWidth / 1.2 }]}>
                              Explore Plans
                            </Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                    </ImageBackground>
                  </View>
                )}
              </View>
            )}
          </View>
        ) : (
          <LoaderKit style={{ width: 150, height: 150 }} name={'BallClipRotateMultiple'} color={'white'} />
        )}

        <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={toggleModal2}>
          <View style={styles.centeredView}>
            <View style={[styles.modalView, { backgroundColor: '#e5e4e2', height: '30%' }]}>
              <Icon onPress={toggleModal2} name="close-circle" size={45} color="red" style={{ position: 'absolute', right: 0, top: 0 }} />
              {/* <Image source={require('../Asset/Images/BirdMatch.gif')} style={{ width: 150, height: 150, resizeMode: 'contain', position: 'absolute', top: -50 }} /> */}

              <View style={{ flexDirection: 'row', position: 'absolute', marginTop: 20 }}>
                <Animated.Image
                  source={{ uri: matchImage.userImage }}
                  style={[
                    styles.image,
                    { transform: [{ scale: scaleAnim1 }], marginRight: 20 },
                  ]}
                />
                <Animated.Image
                  source={{ uri: matchImage.likeUserImage }}
                  style={[
                    styles.image,
                    { transform: [{ scale: scaleAnim2 }] },
                  ]}
                />
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center', position: 'relative', top: 130 }}>
                <Text style={{ fontSize: 20, fontWeight: '700', color: 'black', fontFamily: 'georgia' }}>{notifications} </Text>
                <Image source={require('../Asset/Images/heart.gif')} style={{ width: 50, height: 50 }} />
              </View>
              <Text style={{ fontSize: 20, fontWeight: '700', color: 'black', fontFamily: 'georgia', position: 'relative', top: 120 }}>with {matchImage.likeUserName}</Text>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        {loading ? (
          <Text style={{ fontSize: 40, color: 'black' }}>Loading...</Text>
        ) : (
          <Swiper
            ref={swiperRef}
            cards={profiles}
            renderCard={(profile, index) => <Card data={profile} key={index} />}
            onSwipedLeft={onSwipedLeft}
            onSwipedRight={onSwipedRight}
            disableBottomSwipe
            onSwipedAll={onSwipedAll}
            onSwiping={(x, y) => {
              const swipeThreshold = 50;
              if (Math.abs(x) > Math.abs(y)) {
                setSwipeDirection(x > swipeThreshold ? 'like' : x < -swipeThreshold ? 'dislike' : null);
              } else {
                setSwipeDirection(y > swipeThreshold ? 'suparlike' : y < -swipeThreshold ? 'cancel' : null);
              }
            }}
            animateOverlayLabelsOpacity={false}
            inputOverlayLabelsOpacityRangeY={[-height / 10, -height / 15, 0, height / 15, height / 10]}
            useViewOverflow
            overlayOpacityHorizontalThreshold={width / 32}
            overlayOpacityVerticalThreshold={height / 40}
            secondCardZoom={20}
            stackAnimationFriction={7}
            stackAnimationTension={40}
            stackScale={3}
            outputRotationRange={["-50deg", "0deg", "50deg"]}
            backgroundColor="transparent"
            cardIndex={0}
            stackSize={3}
            outputCardOpacityRangeX={[0.8, 1, 1, 1, 0.8]}
            showSecondCard
            stackSeparation={1}
            cardVerticalMargin={0}  
            cardHorizontalMargin={0}
            swipeAnimationDuration={1200}
            infinite={false}
            animateCardOpacity
            overlayLabels={{
              left: {
                title: 'NOPE',
                style: {
                  label: {
                    backgroundColor: 'transparent',
                    borderColor: 'red',
                    color: 'red',
                    borderWidth: 2,
                  },
                  wrapper: {
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    justifyContent: 'flex-start',
                    marginTop: 30,
                    marginLeft: -30,
                  },
                },
              },
              right: {
                element: <Icon name={'heart'} size={120} color={'green'} />,
                title: 'LIKE',
                style: {
                  label: {
                    backgroundColor: 'transparent',
                    borderColor: 'green',
                    color: 'green',
                    borderWidth: 2,
                  },
                  wrapper: {
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                    marginTop: 30,
                    marginLeft: 30,
                  },
                },
              },
            }}
          />
        )}
        <View style={{ position: 'absolute', bottom: 0, alignSelf: 'center' }}>
          <ActionButtons onActionPress={OnActionPress} swipeDirection={swipeDirection} />
        </View>
        <View style={StyleSheet.absoluteFillObject}>
          <BottomSheetComponent bIndex={bIndex} setbIndex={setbIndex}>
            <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
              {customComponent}
            </View>
          </BottomSheetComponent>
        </View>
      </View>

      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={toggleModal2}>
        <View style={styles.centeredView}>
          <View style={[styles.modalView, { backgroundColor: '#e5e4e2', height: '30%' }]}>
            <Icon onPress={toggleModal2} name="close-circle" size={45} color="red" style={{ position: 'absolute', right: 0, top: 0 }} />
            {/* <Image source={require('../Asset/Images/BirdMatch.gif')} style={{ width: 150, height: 150, resizeMode: 'contain', position: 'absolute', top: -50 }} /> */}

            <View style={{ flexDirection: 'row', position: 'absolute', marginTop: 20 }}>
              <Animated.Image
                source={{ uri: matchImage.userImage }}
                style={[
                  styles.image,
                  { transform: [{ scale: scaleAnim1 }], marginRight: 20 },
                ]}
              />
              <Animated.Image
                source={{ uri: matchImage.likeUserImage }}
                style={[
                  styles.image,
                  { transform: [{ scale: scaleAnim2 }] },
                ]}
              />
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', position: 'relative', top: 130 }}>
              <Text style={{ fontSize: 20, fontWeight: '700', color: 'black', fontFamily: 'georgia' }}>{notifications} </Text>
              <Image source={require('../Asset/Images/heart.gif')} style={{ width: 50, height: 50 }} />
            </View>
            <Text style={{ fontSize: 20, fontWeight: '700', color: 'black', fontFamily: 'georgia', position: 'relative', top: 120 }}>with {matchImage.likeUserName}</Text>
          </View>
        </View>
      </Modal>

      <Modal animationType="slide" transparent={true} visible={modalVisible2} onRequestClose={toggleModal3}>
        <View style={styles.centeredView}>
          <View style={[styles.modalView, { height: '12%' }]}>
            <Icon onPress={toggleModal3} name="close-circle" size={45} color="red" style={{ position: 'absolute', right: -10, top: -10 }} />
            <Text style={{ fontSize: 20, fontWeight: '800', color: 'black', fontFamily: 'georgia', }}>Please Swipe to get Rewinds!</Text>
          </View>
        </View>
      </Modal>

      <Modal animationType="slide" transparent={true} visible={modalVisible3} onRequestClose={toggleModal4}>
        <View style={styles.centeredView}>
          <View style={[styles.modalView, { padding: 0, height: '15%' }]}>
            <Icon onPress={toggleModal4} name="close-circle" size={45} color="red" style={{ position: 'absolute', right: -10, top: -10 }} />
            <Text style={{ fontSize: 21, fontWeight: '800', color: 'black', marginTop: 20 }}>Please Subscribe to get Rewinds!</Text>
            <TouchableOpacity onPress={handleNavigation} style={{ backgroundColor: '#DE3163', borderRadius: 20, width: 150, marginTop: 10 }}>
              <Text style={{ textAlign: 'center', padding: 5, fontSize: 20, fontWeight: '800', color: 'white' }}>View Plans</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal animationType="slide" transparent={true} visible={modalVisible4} onRequestClose={toggleModal5}>
        <View style={styles.centeredView}>
          <View style={[styles.modalView, { padding: 0, height: '15%' }]}>
            <Icon onPress={toggleModal5} name="close-circle" size={45} color="red" style={{ position: 'absolute', right: -10, top: -10 }} />
            <Text style={{ fontSize: 21, fontWeight: '800', color: '#5A5552', marginTop: 40, textAlign: 'center', fontFamily: 'georgia' }}>Please buy atleast gold plan to unlock Rewinds button!</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  image: {
    width: 110,
    height: 110,
    borderRadius: 60,
    margin: 10,
    borderWidth: 1,
    borderColor: '#8E8781',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
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
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%',
    height: '20%'
  },

  clickB: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'white',
    borderStyle: 'solid'
  },
  button: {
    backgroundColor: '#61b0f8',
    height: 50,
    borderRadius: 30,
    marginHorizontal: 60,
    shadowColor: 'white',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 0.5,
    borderColor: '#DCDCDC',
    justifyContent: 'center'
  },

  planText: {
    textAlign: 'center',
    color: '#F5F5F5',
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'georgia',
  },

  touch2: {
    bottom: 50,
    position: 'absolute',
    alignSelf: 'center'
  },



  touch: {
    marginBottom: 15
  },

  cloud: {
    position: 'absolute',
    alignSelf: 'flex-end'
  },
  image2: {
    marginLeft: 30
  },

  hang: {
    fontSize: 23,
    fontWeight: '700',
    color: 'white',
    textAlign: 'center',
    width: '80%',
    alignSelf: 'center',
    fontFamily: 'georgia'
  },
  meantime: {
    color: 'white',
    textAlign: 'center',
    fontSize: 15,
    fontFamily: 'georgia',
    marginTop: 10
  },
  strip: {
    flexDirection: 'row',
    backgroundColor: '#fadfff',
    height: 60,
    borderRadius: 8,
    borderColor: 'rgba(233,118,255,1)',
    shadowColor: 'white',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    marginHorizontal: 15,
    alignItems: 'center',
    borderWidth: 1
  },
  stripText: {
    fontSize: 20,
    fontFamily: 'georgia',
    fontWeight: '700',
    color: "rgba(163,42,239,255)"
  },

  iconBg: {
    backgroundColor: '#c774fc',
    borderRadius: 50,
    height: 50,
    width: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 7,
    borderColor: 'rgba(233,118,255,1)',
    borderWidth: 1
  },
});

export default SwiperCard;
