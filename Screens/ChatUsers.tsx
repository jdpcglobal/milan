import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, ScrollView, TouchableOpacity, Modal, TextInput } from "react-native";
import { useSelector } from 'react-redux';
import { LoginState } from '../Utils/Types.ts';
import { useNavigation, NavigationProp, useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '../Utils/Types';
import messaging from '@react-native-firebase/messaging';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LoaderKit from 'react-native-loader-kit';
import LinearGradient from 'react-native-linear-gradient';
import { format } from 'date-fns';
import AnimatedButton from './AnimatedButton.tsx';

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
    const [searchQuery, setSearchQuery] = useState(''); // State to store search query


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
        // console.log('====================', payload);
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

            setUserMessage(Array.isArray(data.chat) ? data.chat : []);
            setShowLoader(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setShowLoader(false);
        }
    };

    const filteredUsers = (userMessage || []).filter((user) =>
        user.user.Name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleImagePress = (imageUri) => {
        setSelectedImage(imageUri);
        toggleModal();
    };

    const handlePress = (user) => {
        const userName = user.user.Name;
        setNotifications(prevNotifications => prevNotifications.filter(name => name !== userName));
        navigation.navigate('UserChatScreen', { LikedProfileName: user });
    };

    //******************* Date formate start *******************//
    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        const formatDate = (date) => {
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        };

        if (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        ) {
            return date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
            }); 
        }

        if (
            date.getDate() === yesterday.getDate() &&
            date.getMonth() === yesterday.getMonth() &&
            date.getFullYear() === yesterday.getFullYear()
        ) {
            return 'Yesterday'; 
        }
        return formatDate(date);
    };
    //******************* Date formate start *******************//

    return (
        <ScrollView stickyHeaderIndices={[0]} style={{ backgroundColor: 'white', marginBottom: 20 }}>
            {/* <LinearGradient
            colors={['rgba(213,147,255,1)', 'rgba(160,32,240,255)']}
            style={{height:screenHeight}}
        > */}

            <View style={styles.searchContainer}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name="search" size={20} color="#000" style={styles.iconStyle} />
                    <TextInput
                        style={styles.searchBox}
                        placeholder="Search users..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </View>
            {failMessage.code !== 106 ? (
                <View>
                    {userMessage && userMessage.length > 0 ? (
                        <View style={{ paddingHorizontal: 15, paddingBottom: 30 }}>
                            {filteredUsers && filteredUsers.length > 0 ? (
                                <View style={{ paddingBottom: 30 }}>
                                    {filteredUsers.map((user, index) => (
                                        <TouchableOpacity key={index} onPress={() => handlePress(user)}>
                                            <View key={index} style={[styles.card]}>
                                                <TouchableOpacity key={index} onPress={() => navigation.navigate('AboutProfile', { UserData: user.id })}>
                                                    <View style={styles.imageContainer}>
                                                        {/* <Image style={styles.image} source={require('../Asset/Images/avatar-girl.png')} /> */}

                                                        {user.imageUrl === 110 && user.user.Gender === 0 || user.user.gender === 2 ? (
                                                            <Image style={styles.image} source={require('../Asset/Images/avatar-boy.png')} />
                                                        ) : user.imageUrl === 110 && user.user.Gender === 1 ? (
                                                            <Image style={styles.image} source={require('../Asset/Images/avatar-girl.png')} />
                                                        ) : (
                                                            <Image source={{ uri: user.imageUrl }} style={styles.image} />
                                                        )}
                                                    </View>
                                                </TouchableOpacity>
                                                <View style={styles.infoContainer}>
                                                    <View>
                                                        <Text style={[styles.nameText, notifications.includes(user.user.Name) && { fontSize: 18 }]}>
                                                            {user.user.Name}
                                                        </Text> 
                                                        <Text style={[styles.infoText, notifications.includes(user.user.Name) && { fontSize: 14, marginTop:-3 }]}>
                                                             {user.lastMessage.length > 30 ? user.lastMessage.substring(0, 29) + '...' : user.lastMessage}
                                                        </Text>
                                                    </View>
                                                    <Text style={[styles.infoText, notifications.includes(user.user.Name) && { fontSize: 14 }]}>
                                                        {formatDateTime(user.created_at)}
                                                    </Text>

                                                </View>
                                                {notifications.includes(user.user.Name) &&
                                                    <Text style={{ color: 'green', fontSize: 30, fontWeight: '800' }}>●</Text>
                                                }
                                            </View>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            ) : (
                                <View style={{ alignSelf: 'center', height: 150, justifyContent: 'flex-end' }}>
                                    <Text style={{ fontSize: 20, fontFamily: 'georgia', color: '#656565', fontWeight: '700' }}>No users found</Text>
                                </View>
                            )}

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
                                    style={{ width: 150, height: 150, marginTop: screenHeight / 3 }}
                                    name={'BallClipRotateMultiple'}
                                    color={'#656565'}
                                />
                            ) : (
                                <View style={{ height: screenHeight/1.3, justifyContent: 'center', paddingBottom: 10}}>
                                    <Image source={require('../Asset/Images/message-gif.gif')} resizeMode='contain' style={{ width: 300, height: screenHeight/5, alignSelf: 'center' }} />
                                    <Text style={styles.noLikesText}>
                                        Great connections take time—your first message could be just around the corner! 🌟 Keep shining, someone special is waiting. 💌
                                    </Text>
                                </View>
                            )}
                        </View>
                    )}

                </View>

            ) :
                <View style={[styles.notSubscribed,{height:screenHeight/1.2}]}>
                    <View>
                        <Image source={require('../Asset/Images/message-gif.gif')} resizeMode='contain' style={{ width: screenHeight/5, height: screenHeight/5, alignSelf: 'center' }} />
                        <Text style={{ fontSize: 18, fontWeight: '800', textAlign: 'center', color: '#525252', fontFamily: 'georgia' }}>Unlock the full story—subscribe now for exclusive details! ✨🔓</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
                            {/* <LinearGradient style={[{ borderRadius: 5, width: 150, marginTop: 30 }, styles.planButton]}
                                colors={['#f52d70', '#fe765f']}
                            >
                                <TouchableOpacity onPress={() => navigation.navigate('Plans')} >
                                    <Text style={{ textAlign: 'center', padding: 5, fontSize: 20, fontWeight: '800', color: '#F6F6F6', fontFamily: 'georgia', }}>View Plans</Text>
                                </TouchableOpacity>
                            </LinearGradient> */}

                            <View style={{ marginTop: 30 }}>
                                <AnimatedButton
                                    title="View Plans"
                                    onPress={() => navigation.navigate('Plans')}
                                />
                            </View>
                        </View>
                    </View>
                </View>
            }
            {/* </LinearGradient> */}
        </ScrollView>
    );
};

export default ChatUsers

const styles = StyleSheet.create({

    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        // borderWidth: 1,
        // borderColor: '#BDBDBD',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginHorizontal: 10,
        marginTop: 5,
        backgroundColor: '#EFEFEF'

    },
    iconStyle: {
        marginRight: 10,
    },
    searchBox: {
        flex: 1,  // This ensures the TextInput takes up remaining space
        padding: 10,
    },

    card: {
        flexDirection: 'row',
        alignItems: 'center',
        // borderRadius: 8,
        padding: 10,
        borderBottomColor: '#DCDCDC',
        borderTopColor: 'white',
        borderLeftColor: 'white',
        borderRightColor: 'white',
        borderWidth: 0.5,
        marginTop: 5
    },
    imageContainer: {
        marginRight: 10,
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 45,
    },
    infoContainer: {
        flex: 1,
        marginLeft: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    nameText: {
        fontSize: 15,
        color: '#525252',
        fontWeight: '800',
        fontFamily: 'georgia',
    },
    infoText: {
        color: '#7C7C7C',
        fontWeight: '700',
        fontSize: 12,
        fontFamily: 'georgia',
        marginTop: 5,
        maxWidth:210
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
        fontSize: 17,
        color: '#4A4744',
        textAlign: 'center',
        fontWeight: '700',
        fontFamily: 'georgia',
    },

    notSubscribed: {
        // marginTop: 30,
        // marginBottom: 300,
        justifyContent: 'center',
        alignSelf:'center',
        height: '100%',
        //   backgroundColor: 'red',
        paddingBottom: 40
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
