import React, { useContext, useEffect, useRef, useState } from "react";
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import LikeUsersCard from "../Components/LikeUsersCard";
import { LikeUsers, LoginState } from "../Utils/Types";
import axios from "axios";
import { ScrollView } from "react-native-gesture-handler";
import { useSelector } from "react-redux";
import { Button, TextInput } from "react-native-paper";
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, NavigationProp, useFocusEffect } from '@react-navigation/native';
type ScreenNavigationProp = NavigationProp<RootStackParamList, 'UserChatScreen'>;
import { RootStackParamList } from '../Utils/Types';
import messaging from '@react-native-firebase/messaging';
import { Modal } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AppContext } from '../Navigation/PlansApi';
import LoaderKit from 'react-native-loader-kit'
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "@gorhom/bottom-sheet";
import LinearGradient from "react-native-linear-gradient";
import AnimatedButton from "./AnimatedButton";


const UserLikesScreen = () => {
    const [profiles, setProfiles] = useState<LikeUsers[]>([]);
    const token = useSelector((state: LoginState) => state.logins.auth_token);
    const [name, setName] = useState('dummyUser');
    const [chats, setChats] = useState([{ name: 'user2', message: 'message1' }]);
    const [msg, setMsg] = useState('');
    const messageContainerRef = useRef<ScrollView>(null);
    const navigation = useNavigation<ScreenNavigationProp>();
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisible2, setModalVisible2] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [failMessage, setFailMessage] = useState({});
    const { plans } = useContext(AppContext);
    const [showLoader, setShowLoader] = useState(false);

    // console.log('2222222222',plans);

    useEffect(() => {
        const unsubscribe = messaging().onMessage(async remoteMessage => {
            console.log('Received in foreground:', remoteMessage);
        });
        return unsubscribe;
    }, []);

    

    


    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };

    const toggleModal2 = () => {
        setModalVisible2(!modalVisible2);
    }

    const getToken = async () => {
        const token = await messaging().getToken();

        console.log('token========', token);
    }

    useEffect(() => {
        //requestUserPermission();
        getToken()
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            const unsubscribe = messaging().onMessage(async remoteMessage => {
                const notificationData = remoteMessage.notification;
                setNotifications(notificationData);
                //console.log('121212121', notificationData.title);
                if (notificationData.title === 'Like') {
                    setModalVisible(true);
                }
                fetchProfiles();

            });
            return unsubscribe;
        }, [])
    );


    const fetchProfiles = async () => {
        setShowLoader(true);
        try {
            const response = await axios.post('https://themilan.org/api/getLikesUsersDetail', { token, page: 1, items: 100, featureId: '1' });
            const data = response.data;
            //console.log('1111111112', data)
            setShowLoader(false);
            setFailMessage(data);
            if (data.isSuccess) {
                setProfiles(data.users_details);
                // console.log('2222222222', data.users_details);
            } else {
                //  console.error('getLikesUsersDetail Error:', data);
                if (data.code == 106) {
                    setModalVisible2(true);
                }
            }
        } catch (error) {
            console.error('getLikesUsersDetail error:', error);
            setShowLoader(false);
        }
    };

    useEffect(() => {
        fetchProfiles();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            fetchProfiles();
        }, [])
    );

    const sendChat = () => {
        const updatedChats = [...chats, { name, message: msg }];
        setChats(updatedChats);
        setMsg('');

        setTimeout(() => {
            messageContainerRef.current?.scrollToEnd({ animated: true });
        }, 100);
    };


    return (
        <ScrollView stickyHeaderIndices={[0]} style={{ backgroundColor: 'white' }}>
            <View>
                <Text style={{ backgroundColor: 'white', color: '#464646', textAlign: 'center', fontWeight: '700', fontSize: 15, paddingTop: 10, paddingBottom: 10, fontFamily: 'georgia', marginHorizontal: 10, borderRadius: 5, marginBottom: 10, borderColor: 'white', borderWidth: 0.5 }}>Your perfect match might just be a swipe away!</Text>
            </View>
            <View style={styles.container}>
                {
                    failMessage.code !== 106 && failMessage.code !== 109 ? (
                        <View>
                            {profiles && profiles.length > 0 ? (
                                profiles.map((profile, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        onPress={() =>
                                            navigation.navigate('UserChatScreen', { LikedProfileName: profile })
                                        }
                                    >
                                        <LikeUsersCard data={profile} />
                                    </TouchableOpacity>
                                ))
                            ) : (
                                <View style={styles.noLikesContainer}>
                                    {showLoader ? (
                                        <LoaderKit
                                            style={{ width: 150, height: 150, marginTop: 150 }}
                                            name={'BallClipRotateMultiple'}
                                            color={'#4A4744'}
                                        />
                                    ) : (
                                        <View style={styles.notSubscribed}>
                                            <Image
                                                source={require('../Asset/Images/likes-icon.png')}
                                                resizeMode="contain"
                                                style={{ width: SCREEN_WIDTH/1.2, height: 320, alignSelf: 'center' }}
                                            />
                                            <Text style={styles.noLikesText}>
                                                Don't worry, the right likes are on their way!
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            )}
                        </View>
                    ) : failMessage.code === 106 ? (
                        <View style={styles.notSubscribed}>
                            <View>
                                <Image
                                    source={require('../Asset/Images/likes-icon.png')}
                                    resizeMode="contain"
                                    style={{ width: SCREEN_WIDTH/1.2, height: 320, alignSelf: 'center' }}
                                />
                                <Text
                                    style={{
                                        fontSize: 16,
                                        fontWeight: '800',
                                        textAlign: 'center',
                                        color: '#525252',
                                        fontFamily: 'georgia',
                                    }}
                                >
                                    Your profile is out there, making waves! 🌊 Subscribe now to boost
                                    your visibility and see who’s ready to make the first move
                                </Text>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        marginTop: -10,
                                        marginBottom: 10
                                    }}
                                >
                                    <View
                                        style={[{ borderRadius: 5, width: 250, marginTop: 30 },]}

                                    >
                                        <AnimatedButton
                                            title="View Plans"
                                            onPress={() => navigation.navigate('Plans')}
                                        />
                                    </View>
                                </View>
                            </View>
                        </View>


                    ) : (
                        <View style={styles.notSubscribed}>
                            <View>
                                <Image
                                    source={require('../Asset/Images/likes-icon.png')}
                                    resizeMode="contain"
                                    style={{ width: SCREEN_WIDTH/1.2, height: 320, alignSelf: 'center' }}
                                />
                                <Text
                                    style={{
                                        fontSize: 16,
                                        fontWeight: '800',
                                        textAlign: 'center',
                                        color: '#525252',
                                        fontFamily: 'georgia',
                                    }}
                                >
                                    You've got a like waiting for you. Subscribe now to uncover who's interested and keep the spark alive!
                                </Text>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        marginTop: -10,
                                        marginBottom: -10
                                    }}
                                >
                                    <View
                                        style={[{ borderRadius: 5, width: 250, marginTop: 30 },]}

                                    >
                                        <AnimatedButton
                                            title="View Plans"
                                            onPress={() => navigation.navigate('Plans')}
                                        />
                                    </View>
                                </View>
                            </View>
                        </View>
                    )
                }


                {/* <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible2}
                    >
                        <View style={[styles.centeredView,]}>
                            <View style={[styles.modalView,]} >
                                <TouchableOpacity onPress={toggleModal2} style={{ position: 'absolute', top: -12, right: -12, backgroundColor: '#fd5c63', borderRadius: 50, }}>
                                    <Icon name={'close'} color={'white'} size={35} />
                                </TouchableOpacity>
                                <Text style={{ fontSize: 20, fontWeight: '800' }}>{failMessage.message}</Text>
                            </View>
                        </View>
                    </Modal> */}


                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        setModalVisible(!modalVisible);
                    }}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Ionicons onPress={toggleModal} name="close-circle" size={45} color="red" style={{ marginRight: 10, position: 'absolute', right: -25, top: -20 }} />

                            <Text style={{ fontSize: 20, fontWeight: '700', color: 'black' }}>{notifications.body}</Text>
                            <Image source={require('../Asset/Images/LikeIt.gif')} style={{ width: 150, height: 150, resizeMode: 'contain', position: 'absolute', top: -50 }} />
                        </View>
                    </View>
                </Modal>

            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingBottom: 60, 
        minHeight: SCREEN_HEIGHT / 1.2,
    },

    mainContainer: {
        // height: '94%',
        // backgroundColor: 'rgba(255,255,255,1)',
    },

    messageContainer: {
        height: '83%',
        paddingHorizontal: 10,
    },

    chatBox: {
        borderRadius: 5,
        marginVertical: 5,
        padding: 10,
        backgroundColor: '#ebeae5',
        color: 'black',
        fontSize: 17,
        fontWeight: '700'

    },

    header: {
        position: 'sticky',
        top: 0,
        backgroundColor: '#d5c0ee',
        borderRadius: 5,
        padding: 5,
    },

    button: {
        marginTop: 10
    },

    btm: {
        flexDirection: 'row',
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    input: {
        width: '87%',
    },

    me: {
        flexDirection: 'row-reverse',
    },

    container2: {
        flexDirection: 'row',
    },

    chatContainer: {

    },

    sendButton: {
        borderWidth: 2,
        borderColor: '#d5c0ee',
        borderStyle: 'solid',
        padding: 10,
        borderRadius: 50,
        marginLeft: 8,
        backgroundColor: '#d5c0ee',
        textAlign: 'center'
    },
    noLikesContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        // marginTop: SCREEN_HEIGHT / 7.5
    },
    noLikesGif: {
        width: 250,
        height: 250,
    },
    noLikesText: {
        fontSize: 20,
        color: '#555',
        textAlign: 'center',
        fontFamily: 'georgia',
        fontWeight: '700'
    },
    modalView: {
        margin: 20,
        backgroundColor: '#F6F6F6',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        height: 200,
        shadowOffset: {
            width: 0,
            height: 2,
        },
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

    notSubscribed: {
        height: '92%',
        // backgroundColor: 'red',
        justifyContent: 'center'
        // marginTop: 70,
        // marginBottom: 300,
    },

    planButton: {
        borderWidth: 1,
        borderColor: '#E5E4E2',
        borderStyle: 'solid',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 3,
    }
});

export default UserLikesScreen;
