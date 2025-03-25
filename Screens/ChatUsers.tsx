import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, ScrollView, TouchableOpacity, Alert, Modal, Pressable } from "react-native";
import { useSelector } from 'react-redux';
import { LoginState } from '../Utils/Types.ts';
import { useNavigation, NavigationProp, useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '../Utils/Types';
import messaging from '@react-native-firebase/messaging';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LoaderKit from 'react-native-loader-kit'
import LinearGradient from 'react-native-linear-gradient';

const ChatUsers = () => {
    const { width } = Dimensions.get('screen');
    const averageMobileWidth = 360;
    type ScreenNavigationProp = NavigationProp<RootStackParamList, 'UserChatScreen'>;
    const maxWidth = Math.min(width, averageMobileWidth * 2);
    const cardWidth = width > averageMobileWidth ? averageMobileWidth : maxWidth;
    const navigation = useNavigation<ScreenNavigationProp>();
    const token = useSelector((state: LoginState) => state.logins.auth_token);
    const [userMessage, setUserMessage] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const screenWidth = Dimensions.get('window').width;
    const screenHeight = Dimensions.get('window').height;
    const [failMessage, setFailMessage] = useState({});
    const AboutPicWidth = screenWidth / 1.1;
    const AboutPicHeight = screenHeight / 1.5;
    const [notifications, setNotifications] = useState([]);
    const [showLoader, setShowLoader] = useState(false);

    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };

    useFocusEffect(
        React.useCallback(() => {
            MessageUsers();
        }, [])
    );

    useEffect(() => {
        const unsubscribe = messaging().onMessage(async remoteMessage => {
            const Body = remoteMessage.notification.body;
            const name = Body.split(' ')[0];
            //console.log('sasasa========', name);
            setNotifications(prevNotifications => [...prevNotifications, name]);
            MessageUsers();
        });
        return unsubscribe;
    }, []);

    useEffect(() => {
        MessageUsers();
    }, []);

    const MessageUsers = async () => {
        const payload = {
            token: token,
            featureId: '2'
        };
        try {
            setShowLoader(true);
            const response = await fetch(
                'https://themilan.org/api/getAllMessage', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
            const data = await response.json();
            setFailMessage(data);
            if (!response.ok) {
                throw new Error('API error');
            }
            setUserMessage(data.chat);
            setShowLoader(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setShowLoader(false);
        }
    }

    const handleImagePress = (imageUri) => {
        setSelectedImage(imageUri);
        toggleModal();
    };

    const handlePress = (user) => {
        const userName = user.user.Name;
        setNotifications(prevNotifications => prevNotifications.filter(name => name !== userName));
        navigation.navigate('UserChatScreen', { LikedProfileName: user });
    };

    return (
        <ScrollView style={{ backgroundColor: 'white', marginBottom: 20 }}>
            {/* <LinearGradient
                colors={['rgba(213,147,255,1)', 'rgba(160,32,240,255)']}
                style={{height:screenHeight}}
            > */}
            {failMessage.code !== 106 ? (
                <View>
                    {userMessage && userMessage.length > 0 ? (
                        <View style={{ paddingHorizontal: 15, paddingBottom: 30 }}>
                            {userMessage && userMessage.map((user, index) => (
                                <TouchableOpacity key={index} onPress={() => handlePress(user)}>
                                    <View key={index} style={[styles.card]}>
                                        <TouchableOpacity key={index}
                                            onPress={() => handleImagePress(user.imageUrl)}>
                                            <View style={styles.imageContainer}>
                                                <Image source={{ uri: user.imageUrl }} style={styles.image} />
                                            </View>
                                        </TouchableOpacity>
                                        <View style={styles.infoContainer}>
                                            <Text style={[styles.nameText, notifications.includes(user.user.Name) && { fontSize: 25 }]}>
                                                {user.user.Name}
                                            </Text>
                                            <Text style={[styles.infoText, notifications.includes(user.user.Name) && { fontSize: 20 }]}>
                                                {user.lastMessage}
                                            </Text>
                                        </View>
                                        {notifications.includes(user.user.Name) &&
                                            <Text style={{ color: '#1CAC78', fontSize: 30, fontWeight: '800' }}>●</Text>
                                        }
                                    </View>
                                </TouchableOpacity>
                            ))}

                            <Modal
                                animationType="slide"
                                transparent={true}
                                visible={modalVisible}
                                onRequestClose={() => {
                                    setModalVisible(!modalVisible);
                                }}>
                                <View style={styles.centeredView}>
                                    <View style={styles.modalView}>
                                        <Ionicons onPress={toggleModal} name="close-circle" size={45} color="red" style={{ marginRight: 10, position: 'absolute', right: 25, top: 20 }} />
                                        {selectedImage &&
                                            <Image resizeMode='contain' source={{ uri: selectedImage }} style={{ height: AboutPicHeight, width: AboutPicWidth, borderRadius: 10, marginTop: 35 }} />
                                        }
                                    </View>
                                </View>
                            </Modal>
                        </View>
                    ) : (
                        <View style={styles.noLikesContainer}>

                            {showLoader ? (
                                <LoaderKit
                                    style={{ width: 150, height: 150, marginTop:screenHeight/3 }}
                                    name={'BallClipRotateMultiple'}
                                    color={'#bd69f0'}
                                />
                            ) : (
                                <View style={{marginTop:100}}>
                                    <Image source={require('../Asset/Images/manBg.jpg')} style={{ width: 350, height: 300, alignSelf: 'center' }} />
                                    <Text style={styles.noLikesText}>
                                        There are no people you are chatting with currently.
                                    </Text>
                                </View>
                            )}
                        </View>
                    )}

                </View>

            ) :
                <View style={styles.notSubscribed}>
                    <Image source={require('../Asset/Images/manBg.jpg')} style={{ width: 350, height: 300, alignSelf: 'center' }} />
                    <Text style={{ fontSize: 25, fontWeight: '800', textAlign: 'center', color: '#4A4744', fontFamily: 'georgia' }}>{failMessage.message}</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
                        <TouchableOpacity onPress={() => navigation.navigate('Plans')} >
                            <LinearGradient style={[{ backgroundColor: '#DE3163', borderRadius: 20, width: 150 }, styles.planButton]}
                                colors={['#ebac4e', '#ba7b1d']}
                            >
                                <Text style={[{ textAlign: 'center', padding: 5, fontSize: 20, fontWeight: '800', color: 'white', fontFamily: 'georgia' },]}>View Plans</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>
            }
            {/* </LinearGradient> */}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 8,
        padding: 10,
        borderBottomColor: '#DCDCDC',
        borderTopColor: 'white',
        borderLeftColor: 'white',
        borderRightColor: 'white',
        borderWidth: 1,
        marginTop: 5
    },
    imageContainer: {
        marginRight: 10,
    },
    image: {
        width: 90,
        height: 90,
        borderRadius: 45,
    },
    infoContainer: {
        flex: 1,
        marginLeft: 20
    },
    nameText: {
        fontSize: 22,
        color: '#4A4744',
        fontWeight: '800',
        fontFamily: 'georgia',
    },
    infoText: {
        color: '#4A4744',
        fontWeight: '700',
        fontSize: 15,
        fontFamily: 'georgia',
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
    noLikesContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    noLikesGif: {
        width: 250,
        height: 250,
    },

    noLikesText: {
        marginTop: '10%',
        fontSize: 20,
        color: '#4A4744',
        textAlign: 'center',
        fontWeight: '700',
        fontFamily: 'georgia',
    },

    notSubscribed: {
        marginTop: 150,
        marginBottom: 300,
    },

    planButton: {
        borderWidth: 1,
        borderColor: 'white',
        borderStyle: 'solid',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    }

});

export default ChatUsers