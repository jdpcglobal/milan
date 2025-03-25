import React, { useEffect, useRef, useState } from "react";
import { Alert, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Button, TextInput } from "react-native-paper";
import Icon from 'react-native-vector-icons/Ionicons';
import { LoginState } from '../Utils/Types.ts';
import { useSelector } from "react-redux";
import messaging from '@react-native-firebase/messaging';
import { useFocusEffect } from "@react-navigation/native";
import { format, isToday, isYesterday, parseISO } from 'date-fns';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const UserChatScreen = ({ route }) => {
    const { LikedProfileName } = route.params;
    const [name, setName] = useState(`${LikedProfileName.name}`);
    const token = useSelector((state: LoginState) => state.logins.auth_token);
    const [message, setMessage] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const scrollViewRef = useRef();
    const [notificationsMessage, setNotificationsMessage] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        const unsubscribe = messaging().onMessage(async remoteMessage => {
            const Body = remoteMessage.notification.body;
            setNotificationsMessage(Body);
            UserMessage();
        });
        return unsubscribe;
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            UserMessage();
        }, [])
    );

    useEffect(() => {
        UserMessage();
    }, []);

    const UserMessage = async () => {
        const payload = {
            token: token,
            userId: LikedProfileName.id
        };
        try {
            const response = await fetch(
                'https://themilan.org/api/getUserMessages', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
            if (!response.ok) {
                throw new Error('UserMessage api =====')
            }
            const data = await response.json();
            setMessage(data.message);
        } catch (error) {
            console.error('profileData Error Last');
        }
    }

    const UserSendMessage = async () => {
        const payload = {
            sender_id: token,
            receiver_id: LikedProfileName.id,
            message: newMessage,
        };
        try {
            const response = await fetch(
                'https://themilan.org/api/sendMessage', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
            if (!response.ok) {
                throw new Error('UserMessage api =====')
            }
            const data = await response.json();
            console.log('12566545415', data);
        } catch (error) {
            console.error('UserSendMessage Error Last');
        }
    }

    const sendMessage = () => {
        setMessage([...message, { Receiver_Id: `${LikedProfileName.id}`, Message: newMessage, created_at: new Date().toISOString() }]);
        setNewMessage('');
        scrollViewRef.current.scrollToEnd({ animated: true });
        UserSendMessage();
    };

    const formatTime = (time) => {
        return format(new Date(time), 'p'); // 'p' is the format for time with AM/PM
    };

    const groupMessagesByDate = (messages) => {
        const groupedMessages = {};
        messages.forEach(msg => {
            const date = parseISO(msg.created_at);
            let key = '';
            if (isToday(date)) {
                key = 'Today';
            } else if (isYesterday(date)) {
                key = 'Yesterday';
            } else {
                key = format(date, 'MMMM dd, yyyy');
            }
            if (!groupedMessages[key]) {
                groupedMessages[key] = [];
            }
            groupedMessages[key].push(msg);
        });
        return groupedMessages;
    };

    const groupedMessages = groupMessagesByDate(message);

    return (
        <>
            <ImageBackground source={require('../Asset/Images/chatBackground2.png')} style={{ height: '100%' }}>
                <View style={styles.mainContainer}>
                    <View style={styles.messageContainer}>
                        <View style={styles.header}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Image style={{ height: 55, width: 55, borderRadius: 50, overflow: 'hidden', borderWidth: 1, borderColor: '#E5E4E2', }} source={{ uri: LikedProfileName.imageUrl }}  ></Image>
                                <Text style={{ color: '#5A5552', fontSize: 23, fontWeight: '800', padding: 5, fontFamily: 'georgia', }}> {name}</Text>
                            </View>
                        </View>
                        <ScrollView
                            ref={scrollViewRef}
                            contentContainerStyle={styles.chatContainer}
                            onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
                        >
                            <TouchableOpacity  onPress={() => navigation.goBack()} >
                                <Ionicons name='arrow-back-circle-outline' size={40} color="#7C7C7C" />
                            </TouchableOpacity>
                            {Object.keys(groupedMessages).map(date => (
                                <View key={date}>
                                    <Text style={styles.dateHeader}>{date}</Text>
                                    {groupedMessages[date].map((user, index) => (
                                        <View key={index} style={[styles.container2, user.Receiver_Id == `${LikedProfileName.id}` ? styles.me : null]}>
                                            <View style={styles.chatBox}>
                                                <Text style={styles.chatBox2}>{user.Message}  </Text>
                                                <Text style={styles.messageTime}>{formatTime(user.created_at)}</Text>
                                            </View>
                                        </View>
                                    ))}
                                </View>
                            ))}


                        </ScrollView>
                    </View>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            value={newMessage}
                            onChangeText={text => setNewMessage(text)}
                            placeholder="Type a message..."
                            multiline
                        />
                        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
                            <Text style={{ color: 'white' }} ><Icon name={'send'} size={30} color={'#5A5552'} /></Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ImageBackground>
        </>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        height: '100%',
        paddingTop: 20
    },
    messageContainer: {
        height: '88%',
        paddingHorizontal: 10,
    },
    chatBox: {
        borderRadius: 5,
        marginVertical: 5,
        backgroundColor: 'rgba(225,225,225, 0.5)',
        color: '#E5E4E2',
        fontSize: 20,
        fontWeight: '800',
        paddingRight: 15,
        paddingLeft: 15,
        paddingTop: 5,
        paddingBottom: 5,
        maxWidth: '80%'
    },

    chatBox2: {
        //backgroundColor: 'rgba(255, 255, 255, 0.2)',
        color: '#5A5552',
        fontSize: 20,
        fontWeight: '800',
        fontFamily: 'georgia',
    },
    header: {
        position: 'sticky',
        top: 0,
        backgroundColor: '#E5E4E2',
        borderRadius: 5,
        padding: 5,
        marginBottom: 20
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
    me: {
        flexDirection: 'row-reverse',
        marginLeft: 8
    },
    container2: {
        flexDirection: 'row',
    },
    chatContainer: {

    },
    sendButton: {
        borderWidth: 1,
        borderColor: '#5A5552',
        borderStyle: 'solid',
        padding: 10,
        borderRadius: 50,
        marginLeft: 8,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        textAlign: 'center'
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 20,
        paddingHorizontal: 15,
        marginRight: 10,
        color: 'white',
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        fontSize: 22,
        fontWeight: '800',
        marginTop: 10
    },
    messageTime: {
        color: '#5A5552',
        fontSize: 9,
        textAlign: 'right',
        marginRight: -10,
        marginLeft: 10
    },
    dateHeader: {
        color: '#656565',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 10,
    }
});

export default UserChatScreen;
