import { Dimensions, Image, ScrollView, Text, View } from 'react-native'
import React, { Component, useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { LoginState } from '../Utils/Types';
import { StyleSheet } from 'react-native';
import { Alert, Modal, Pressable } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import messaging from '@react-native-firebase/messaging';
import { useFocusEffect } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons2 from 'react-native-vector-icons/FontAwesome';
import { useNavigation, NavigationProp } from '@react-navigation/native';
type ScreenNavigationProp = NavigationProp<RootStackParamList, 'UserChatScreen'>;
import { RootStackParamList } from '../Utils/Types';

const NotificationScreen = () => {

    const token = useSelector((state: LoginState) => state.logins.auth_token);
    const [notificationData, setNotificationData] = useState([]);
    const [profileData, setProfileData] = useState({});
    const [modalVisible, setModalVisible] = useState(false);
    const screenWidth = Dimensions.get('window').width;
    const [errorMessage, setErrorMessage] = useState('');
    const navigation = useNavigation<ScreenNavigationProp>();

    const AboutPicWidth = screenWidth / 1.2;
    const AboutPicHeight = screenWidth / 0.7;

    const toggleModal = (id) => {
        setModalVisible(!modalVisible);
        AboutProfile(id);
    }

    useFocusEffect(
        React.useCallback(() => {
            const unsubscribe = messaging().onMessage(async remoteMessage => {
                const Body = remoteMessage.notification.title;
                if (Body == 'notification') {
                    NotificationApi();
                }
            });
            return unsubscribe;
        }, [])
    );

    //*********** NotificationApi Api ***********//
    useEffect(() => {
        NotificationApi();
    }, [])
    const NotificationApi = async () => {
        const payload = {
            token: token
        };
        //  console.log('NotificationScreen====', payload)
        try {
            const response = await fetch(
                'https://themilan.org/api/notification', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (data.isSuccess) {
                setNotificationData(data.data);
                setErrorMessage('');
                //console.log('NotificationScreen====', data)
            } else {
                setErrorMessage(data.message || "Something went wrong");
            }
        } catch (error) {
            console.error('NotificationScreen Error:', error);
            setErrorMessage("Failed to fetch notifications.");
        }
    }
    //*********** NotificationApi Api ***********//

    //*********** UserProfile Api ***********//
    const AboutProfile = async (id) => {
        const payload = {
            user_id: id,
            token: token
        };
        // console.log('AboutProfile::::::::::::', payload);
        try {
            const response = await fetch(
                'https://themilan.org/api/usersProfileView', {
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
                setProfileData(data.user);
            }
            //console.log('AboutProfile ::::::::::::', data.user)
        } catch (error) {
            console.error('Create Order Error Last')
        }
    };
    //*********** UserProfile Api ***********//

    return (
        <ScrollView style={{ paddingTop: 15, backgroundColor: 'white' }}>

            {errorMessage ? (
                <View style={styles.errorContainer}>
                    <Image source={require('../Asset/Images/manBg.jpg')} style={{ height: 250, width: 260 }}></Image>
                    <Text style={styles.errorText}>Looks like it’s quiet for now! 🤫, but love works in mysterious ways. 💌 Check back soon—your next connection could be closer than you think! 🌟.</Text>
                </View>
            ) : (
                notificationData && notificationData.map((notification, index) => (
                    <TouchableOpacity key={index} onPress={() => navigation.navigate('AboutProfile', { UserData: notification.UserId })}>
                        <View key={index} style={[styles.card, { width: 'auto', justifyContent: 'center', marginHorizontal: 10 }]}>
                            <View style={styles.imageContainer}>
                                {/* <Image style={styles.image} source={require('../Asset/Images/avatar-boy.png')} /> */}

                                {notification.image === 110 && notification.gender === 0 || notification.gender === 2 ? (
                                    <Image style={styles.image} source={require('../Asset/Images/avatar-boy.png')} />
                                ) : notification.image === 110 && notification.gender === 1 ? (
                                    <Image style={styles.image} source={require('../Asset/Images/avatar-girl.png')} />
                                ) : (
                                    <Image source={{ uri: notification.image }} style={styles.image} />
                                )}
                            </View>
                            <View style={styles.infoContainer}>
                                <Text style={styles.nameText}>{notification.name}</Text>
                                <Text style={styles.infoText}>{notification.alertMessage}.</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))
            )}

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>
                <View style={styles.centeredView}>
                    <View style={[styles.modalView, { width: AboutPicWidth * 1.2 }]}>
                        {/* <Ionicons onPress={toggleModal} name="close-circle" size={45} color="#0E103D" style={{  position: 'absolute', right: 25, top: 10 }} /> */}
                        <ScrollView>
                            <View style={styles.container}>
                                <View style={{ alignItems: 'center', backgroundColor: "white" }} >
                                    {/* <Image resizeMode='contain'
                                        source={{ uri: profileData.images }}
                                        style={{ width: AboutPicWidth * 1.2, height: AboutPicHeight, marginTop: 20, borderRadius: 10, }}
                                    ></Image> */}
                                    {profileData.images === 110 && profileData.gender === 0 || profileData.gender === 2 ? (
                                        <Image style={{ width: AboutPicWidth * 1.2, height: AboutPicHeight, marginTop: 20, borderRadius: 10, }} source={require('../Asset/Images/avatar-boy.png')} />
                                    ) : profileData.images === 110 && profileData.gender === 1 ? (
                                        <Image style={{ width: AboutPicWidth * 1.2, height: AboutPicHeight, marginTop: 20, borderRadius: 10, }} source={require('../Asset/Images/avatar-girl.png')} />
                                    ) : (
                                        <Image resizeMode='contain'
                                            source={{ uri: profileData.images }}
                                            style={{ width: AboutPicWidth * 1.2, height: AboutPicHeight, marginTop: 20, borderRadius: 10, }}
                                        ></Image>
                                    )}
                                </View>

                                <View style={{ backgroundColor: 'white', paddingHorizontal: 12, paddingTop: 15, borderRadius: 10, marginBottom: 20, paddingBottom: 5, flexDirection: 'row', flexWrap: 'wrap' }}>

                                    <Text style={{ textAlign: 'center', color: '#464646', fontSize: 25, fontWeight: '700', marginBottom: 10, width: '100%', fontFamily: 'georgia', }}>
                                        {profileData.name}
                                    </Text>

                                    {/* {profileData.name ? (
                                        <View style={styles.AboutData}>
                                            <Text style={styles.AboutText}>Name: {profileData.name} </Text>
                                        </View>
                                    ) : null} */}

                                    {profileData.age ? (
                                        <View style={styles.AboutData}>
                                            <Text style={styles.AboutText}><Ionicons name="cake" size={27} color="#5A5552" style={{}} />: {profileData.age}</Text>
                                        </View>
                                    ) : null}

                                    {profileData.height ? (
                                        <View style={styles.AboutData}>
                                            <Text style={styles.AboutText}><Ionicons name="human-male-height-variant" size={27} color="#5A5552" style={{}} />: {profileData.height}</Text>
                                        </View>
                                    ) : null}

                                    {/* {profileData.living ? (
                                        <View style={styles.AboutData}>
                                            <Text style={styles.AboutText}>Address: {profileData.living == '' ? 'Did not mention yet' : profileData.living}</Text>
                                        </View>
                                    ) : null} */}

                                    {/* {profileData.religion ? (
                                        <View style={styles.AboutData}>
                                            <Text style={styles.AboutText}>Religion: {profileData.religion}</Text>
                                        </View>
                                    ) : null} */}

                                    {profileData.gender ? (
                                        <View style={styles.AboutData}>
                                            <Text style={styles.AboutText}><Ionicons name="account" size={27} color="#5A5552" style={{}} />: {profileData.gender == '1' ? 'Female' : 'Male'}</Text>
                                        </View>
                                    ) : null}

                                    {profileData.distanceaway ? (
                                        <View style={styles.AboutData}>
                                            <Text style={styles.AboutText}><Ionicons2 name="map-marker" size={27} color="#5A5552" style={{}} />: {profileData.distanceaway}</Text>
                                        </View>
                                    ) : null}

                                    {profileData.education ? (
                                        <View style={styles.AboutData}>
                                            <Text style={styles.AboutText}><Ionicons2 name="graduation-cap" size={27} color="#5A5552" style={{}} />: {profileData.education == '1' ? "Bachelor Degree" : profileData.education == '2' ? "At uni" : profileData.education == '3' ? "High School" : profileData.education == '4' ? 'PHD' : profileData.education == '5' ? 'On Graduate programme' : profileData.education == '6' ? 'Master Degree' : profileData.education == '7' ? 'Trade school' : `Didn't Mention`}</Text>
                                        </View>
                                    ) : null}

                                    {profileData.sexualOrientation ? (
                                        <View style={styles.AboutData}>
                                            <Text style={styles.AboutText}><Image source={require('../Asset/Images/orientation2.png')} style={{ height: 25, width: 25 }} />: {profileData.sexualOrientation == '1' ? "Straight" : profileData.sexualOrientation == '2' ? "Gay" : profileData.sexualOrientation == '3' ? "Lesbian" : profileData.sexualOrientation == '4' ? 'Bisexual' : profileData.sexualOrientation == '5' ? 'Asexual' : profileData.sexualOrientation == '6' ? 'Demisexual' : profileData.sexualOrientation == '7' ? 'Queer' : profileData.sexualOrientation == '8' ? 'Bicurious' : profileData.sexualOrientation == '9' ? 'Aromantic' : `Didn't Mention`}</Text>
                                        </View>
                                    ) : null}

                                    {profileData.relationshipGoals !== '0' && profileData.relationshipGoals ? (
                                        <View style={styles.AboutData}>
                                            <Text style={styles.AboutText}><Ionicons2 name="eye" size={27} color="#5A5552" style={{}} />: {profileData.relationshipGoals == '1' ? "Long-term Partner" : profileData.relationshipGoals == '2' ? "long-term but short-term" : profileData.relationshipGoals == '3' ? "Short-term but long-term ok" : profileData.relationshipGoals == '4' ? 'Short-term fun' : profileData.relationshipGoals == '5' ? 'New friends' : profileData.relationshipGoals == "6" ? 'Still figuring out' : `Didn't Mention`}</Text>
                                        </View>
                                    ) : null}

                                </View>
                            </View>
                        </ScrollView>
                        {/* <Text onPress={toggleModal} style={styles.textStyle}>Hide Modal</Text> */}
                    </View>
                </View>
            </Modal>

        </ScrollView>
    )
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        // borderRadius: 8,
        padding: 10,
        marginBottom: 10,
        borderBottomColor: '#DCDCDC',
        borderTopColor: 'transparent',
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderWidth: 1
        // elevation: 2, // for shadow on Android
        // shadowColor: '#000', // for shadow on iOS
        // shadowOffset: { width: 0, height: 2 }, // for shadow on iOS
        // shadowOpacity: 0.25, // for shadow on iOS
        // shadowRadius: 3.84, // for shadow on iOS
    },
    imageContainer: {
        marginRight: 10,
    },
    image: {
        width: 70,
        height: 70,
        borderRadius: 50,
    },
    infoContainer: {
        flex: 1,
        //backgroundColor:'pink',
        paddingLeft: 30
    },
    nameText: {
        fontSize: 16,
        color: '#656565',
        fontWeight: 'bold',
        fontFamily: 'georgia'
    },
    infoText: {
        color: '#7C7C7C',
        fontSize: 12,
        fontWeight: '500',
        fontFamily: 'georgia'
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
        shadowColor: '#000',

        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    AboutData: {
        backgroundColor: 'white',
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
        elevation: 4,
        paddingHorizontal: 8,
        marginHorizontal: 5
    },

    AboutText: {
        color: '#5A5552',
        fontSize: 20,
        fontWeight: '700',
        fontFamily: 'georgia'
    },

    errorContainer: {
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 100
    },
    errorText: {
        color: '#525252',
        fontSize: 18,
        textAlign: 'center',
        fontWeight: '700',
        fontFamily: 'georgia'
    },
});

export default NotificationScreen