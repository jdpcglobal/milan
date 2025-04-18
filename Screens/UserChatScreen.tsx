import React, { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Dimensions, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View, KeyboardAvoidingView, Platform, TextInput } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
// import { Button, TextInput } from "react-native-paper";
import { LoginState } from '../Utils/Types.ts';
import { useSelector } from "react-redux";
import messaging from '@react-native-firebase/messaging';
import { useFocusEffect } from "@react-navigation/native";
import { format, isToday, isYesterday, parseISO } from 'date-fns';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import LoaderKit from 'react-native-loader-kit';
import { Modal } from 'react-native';
import AnimatedButton from "./AnimatedButton.tsx";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "@gorhom/bottom-sheet";
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-toast-message';
import ToastConfig from "./ToastConfig .tsx";
import Popover from 'react-native-popover-view';

const UserChatScreen = ({ route }) => {
    const { LikedProfileName } = route.params;
    const [name, setName] = useState(`${LikedProfileName.name}`);
    const token = useSelector((state: LoginState) => state.logins.auth_token);
    const [message, setMessage] = useState([]);
    const [showImage, setShowImage] = useState(true);
    const [newMessage, setNewMessage] = useState('');
    const scrollViewRef = useRef();
    const [notificationsMessage, setNotificationsMessage] = useState([]);
    const navigation = useNavigation();
    const screenHeight = Dimensions.get('window').height;
    const [showLoader, setShowLoader] = useState(true);
    const [showLoader2, setShowLoader2] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisible2, setModalVisible2] = useState(false);
    const [modalVisible3, setModalVisible3] = useState(false);
    const [modalVisible4, setModalVisible4] = useState(false);
    const [showBlockScreen, setShowBlockScreen] = useState(false);
    const [focusedText2, setFocusedText2] = useState(null);
    const [blockBox, setBlockBox] = useState(null);
    const [visible, setVisible] = useState(false);
    const [visible2, setVisible2] = useState(false);

    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };

    const toggleModal2 = () => {
        setVisible(false);
        setModalVisible(false);
        setModalVisible2(!modalVisible2);
    };

    const toggleModal3 = () => {
        setModalVisible(false);
        setModalVisible3(!modalVisible3);
    };

    const toggleModal4 = () => {
        setModalVisible4(!modalVisible4);
    };

    const BlockFunction = (text) => {
        setVisible(false);
        console.log('>>>>>>>>>>>>', text);
        setBlockBox(text);
        setModalVisible(false);
        setModalVisible4(false);
        setModalVisible3(!modalVisible3);
    }

    const BlockFunction2 = (text) => {
        console.log('<<<<<<<<<<<<', text);

        setBlockBox(text);
        setVisible2(true)
    }


    const handleTextClick2 = (text) => {
        setFocusedText2(text);
        // console.log('11111111',focusedText2);
    };

    /*********************** Report Api start **********************/
    const ReportApi = async () => {
        setShowLoader2(true);
        const payload = {
            from: token,
            to: LikedProfileName.id,
            reportType: focusedText2,
        };

        try {
            const response = await fetch('https://themilan.org/api/report', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
            const data = await response.json();
            setModalVisible2(false);
            // console.log('API Response:', data);
            if (response.status !== 200) {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: data.message || 'Please Select a reason before Report.',
                });
            } else {
                Toast.show({
                    type: 'success',
                    text1: 'Report Submitted',
                    text2: data.message || 'Your report has been submitted successfully.',
                });
            }
        } catch (error) {
            console.error('ReportApi Error:', error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Something went wrong. Please try again.',
            });
        } finally {
            setShowLoader2(false);
        }
    };
    /*********************** Report Api end ************************/


    /*********************** Report Api start **********************/
    const BlockApi = async () => {
        // setShowLoader2(true);
        const payload = {
            from: token,
            // from: 'token',
            to: LikedProfileName.id,
            action: blockBox,
        };
        console.log('BlockApi payload:', payload);
        try {
            const response = await fetch('https://themilan.org/api/blockAccount ', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
            const data = await response.json();
            setModalVisible3(false);
            setModalVisible4(false);
            setVisible2(false);
            console.log('BlockApi Responsewwww:', data);

            if (data.code === 114) {
                setShowBlockScreen(true);
            } else {
                setShowBlockScreen(false);
            }
            if (response.status !== 200) {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: data.message || 'Please Select a reason before Report.',
                });
            } else {
                Toast.show({
                    type: 'success',
                    text1: 'Block Status',
                    text2: data.message || 'Your report has been submitted successfully.',
                });
            }
        } catch (error) {
            console.error('ReportApi Error:', error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Something went wrong. Please try again.',
            });
        } finally {
            // setShowLoader2(false);
        }
    };
    /*********************** Report Api end ************************/


    useEffect(() => {
        if (message.length === 0) {
            setShowImage(false);
        } else {
            setShowImage(true);
        }
    }, [message]);

    useEffect(() => {
        const unsubscribe = messaging().onMessage(async remoteMessage => {
            const Body = remoteMessage.notification.body;
            setNotificationsMessage(Body);
            // console.log('111111111111111',Body);
            UserMessage();
        });
        return unsubscribe;
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            UserMessage();
        }, [])
    );

    useFocusEffect(
        useCallback(() => {
            setShowBlockScreen(LikedProfileName.block === false);
        }, [LikedProfileName.block])
    );

    useEffect(() => {
        UserMessage();
        //  console.log('............',LikedProfileName );
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
                throw new Error('UserMessage api =====');
            }
            const data = await response.json();
            setMessage(data.message);
            // console.log('00000000000000', data);
            setShowLoader(false);
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
            // console.log('111111111111111111',response);
            // if (!response.ok) {
            //     throw new Error('UserMessage api =====')
            // }
            const data = await response.json();
            console.log('12566545415', data);

            if (data.code === 111) {
                UserMessage();
                Toast.show({
                    type: 'info',
                    text1: 'Block',
                    text2: data.message || 'Please Select a reason before Report.',
                });
            }
        } catch (error) {
            console.error('UserSendMessage Error Last');
        }
    }

    const sendMessage = () => {
        if (newMessage.trim() === '') {
            Alert.alert('Error', 'Message cannot be empty. Please type a message before sending.');
            return;
        }
        setShowImage(false);
        setMessage([...message, { Receiver_Id: `${LikedProfileName.id}`, Message: newMessage, created_at: new Date().toISOString() }]);
        setNewMessage('');
        scrollViewRef.current.scrollToEnd({ animated: true });
        UserSendMessage();
    };

    const formatTime = (time) => {
        return format(new Date(time), 'p');
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
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
            {showLoader ? (
                <View style={{ height: '100%', justifyContent: 'center', alignItems: 'center', }}>
                    <LoaderKit
                        style={{ width: 150, height: 150, }}
                        name={'BallClipRotateMultiple'}
                        color={'#656565'}
                    />
                </View>
            ) : (
                <ImageBackground source={require('../Asset/Images/chat-bg-mediums.png')} resizeMode="repeat" style={{ flex: 1, }}>

                    <View style={{ flex: 1, paddingTop: 20, backgroundColor: 'rgba(255, 255, 255, 0.4)' }}>
                        <View style={styles.header}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                <TouchableOpacity onPress={() => navigation.goBack()} >
                                    <Ionicons name='chevron-back' size={30} color="#5A5552" style={{ marginRight: 5 }} />
                                </TouchableOpacity>

                                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => navigation.navigate('AboutProfile', { UserData: LikedProfileName.id })}>
                                    {/* <Image style={{ height: 55, width: 55, borderRadius: 50, overflow: 'hidden', borderWidth: 1, borderColor: '#E5E4E2', }} source={{ uri: LikedProfileName.imageUrl }}  ></Image> */}
                                    {LikedProfileName.imageUrl === 110 && LikedProfileName.gender === 0 || LikedProfileName.gender === 2 ? (
                                        <Image style={{ height: 55, width: 55, borderRadius: 50, overflow: 'hidden', borderWidth: 1, borderColor: '#E5E4E2', }} source={require('../Asset/Images/avatar-boy.png')} />
                                    ) : LikedProfileName.imageUrl === 110 && LikedProfileName.gender === 1 ? (
                                        <Image style={{ height: 55, width: 55, borderRadius: 50, overflow: 'hidden', borderWidth: 1, borderColor: '#E5E4E2', }} source={require('../Asset/Images/avatar-girl.png')} />
                                    ) : (
                                        <Image style={{ height: 55, width: 55, borderRadius: 50, overflow: 'hidden', borderWidth: 1, borderColor: '#E5E4E2', }} source={{ uri: LikedProfileName.imageUrl }}  ></Image>
                                    )}
                                    <Text style={{ color: '#5A5552', fontSize: 21, fontWeight: '800', padding: 5, fontFamily: 'georgia', }}> {name} </Text>
                                </TouchableOpacity>

                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
                                    {/* <TouchableOpacity onPress={toggleModal}>
                                        <Ionicons name='ellipsis-vertical-sharp' size={30} color="#5A5552" style={{}} />
                                    </TouchableOpacity> */}

                                    <Popover
                                        isVisible={visible}
                                        onRequestClose={() => setVisible(false)}
                                        from={
                                            <TouchableOpacity onPress={() => setVisible(true)}>
                                                <Ionicons name="ellipsis-vertical" size={30} color="black" />
                                            </TouchableOpacity>
                                        }
                                    >
                                        <View style={styles.menuContainer}>
                                            {/* Report Option */}
                                            <TouchableOpacity onPress={toggleModal2} style={styles.menuItem}>
                                                <Ionicons name="flag-outline" size={20} color="black" />
                                                <Text style={styles.menuText}>Report</Text>
                                            </TouchableOpacity>

                                            {/* Block Option */}
                                            <TouchableOpacity onPress={() => BlockFunction(true)} style={styles.menuItem}>
                                                <Ionicons name="ban-outline" size={20} color="red" />
                                                <Text style={[styles.menuText, { color: 'red' }]}>Block</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </Popover>

                                </View>
                            </View>
                        </View>
                        <Toast config={ToastConfig} />
                        {showBlockScreen ? (
                            <>
                                <View style={{ flex: 1, paddingHorizontal: 10 }}>
                                    <ScrollView
                                        ref={scrollViewRef}
                                        contentContainerStyle={styles.chatContainer}
                                        onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
                                    >
                                        {showImage ? (
                                            <View>
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
                                            </View>
                                        ) : (
                                            <View style={styles.container}>
                                                <Image
                                                    source={require('../Asset/Images/bg-no-messages.png')}
                                                    style={styles.image}
                                                />
                                                <Text style={styles.title}>No Messages Yet</Text>
                                                <Text style={styles.subtitle}>
                                                    "Every message is a little bridge to someone's heart. Why not start building?"
                                                </Text>
                                            </View>
                                        )}
                                    </ScrollView>
                                </View>

                                <View style={[styles.inputContainer, { borderColor: isFocused ? "#007AFF" : "#989898", shadowColor: isFocused ? '#007aff' : '#000', }]}>
                                    <TextInput
                                        style={styles.input}
                                        value={newMessage}
                                        onChangeText={text => setNewMessage(text)}
                                        placeholder="Type your message..."
                                        placeholderTextColor="#888888"
                                        underlineColorAndroid="transparent"
                                        onFocus={() => setIsFocused(true)}
                                        onBlur={() => setIsFocused(false)}
                                    />
                                    <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
                                        <Text style={{ color: 'white' }} ><Icon2 name={'send'} size={30} color={isFocused ? "#f42871" : "#fd755e"} /></Text>
                                    </TouchableOpacity>
                                </View>
                            </>

                        ) : (
                            <TouchableOpacity onPress={() => BlockFunction2(false)} style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.7)', marginTop: -20, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontSize: 17, fontFamily: 'georgia', fontWeight: '700', color: '#fff', textAlign: 'center', paddingVertical: 50, }}>You have blocked this account. Tap to unblock.</Text>
                                <Popover
                                    isVisible={visible2}
                                    onRequestClose={() => setVisible2(false)}
                                    from={
                                        <TouchableOpacity onPress={() => setVisible2(true)}>
                                            {/* <Ionicons name="ellipsis-vertical" size={30} color="black" /> */}
                                        </TouchableOpacity>
                                    }
                                >
                                    <View style={{ width: SCREEN_WIDTH / 1.1, padding: 10, }}>
                                        <Text style={{ textAlign: 'center', color: '#464646', fontWeight: '700', fontFamily: 'georgia', fontSize: 16, paddingVertical: 20 }}>Are you sure you want to unblock this User</Text>

                                        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', width: '100%', marginBottom: 20 }}>

                                            <View>
                                                <AnimatedButton
                                                    title="No"
                                                    onPress={() => setVisible2(false)}
                                                />
                                            </View>

                                            <View>
                                                <AnimatedButton
                                                    title="Yes"
                                                    onPress={BlockApi}
                                                />
                                            </View>
                                        </View>
                                    </View>
                                </Popover>
                            </TouchableOpacity>
                        )}


                        {/* <Modal
                            animationType="slide"
                            transparent={true}
                            visible={modalVisible}
                            onRequestClose={() => {
                                setModalVisible(!modalVisible);
                            }}>
                            <View style={styles.centeredView}>
                                <View style={[styles.modalView, { height: 250 }]}>
                                    <Ionicons onPress={toggleModal} name="close-circle" size={45} color="red" style={{ marginRight: 10, position: 'absolute', right: -25, top: -20 }} />

                                    <View style={{ width: 250, height: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

                                        <View>
                                            <AnimatedButton
                                                title="Report"
                                                onPress={toggleModal2}
                                            />
                                        </View>

                                        <View>
                                            <AnimatedButton
                                                title="Block"
                                                // onPress={toggleModal3}
                                                onPress={() => BlockFunction(true)}
                                            />
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </Modal> */}

                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={modalVisible4}
                            onRequestClose={() => {
                                setModalVisible4(!modalVisible4);
                            }}>
                            <View style={styles.centeredView}>
                                <View style={[styles.modalView, { height: 250 }]}>
                                    <Ionicons onPress={toggleModal4} name="close-circle" size={45} color="red" style={{ marginRight: 10, position: 'absolute', right: -25, top: -20 }} />

                                    <View style={{ width: 250, height: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

                                        <View>
                                            <AnimatedButton
                                                title="No"
                                                onPress={toggleModal4}
                                            />
                                        </View>

                                        <View>
                                            <AnimatedButton
                                                title="Yes"
                                                onPress={BlockApi}
                                            />
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </Modal>

                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={modalVisible2}
                            onRequestClose={() => {
                                setModalVisible2(!modalVisible2);
                            }}>
                            <View style={styles.centeredView}>
                                <View style={styles.modalView}>
                                    <Ionicons onPress={toggleModal2} name="close-circle" size={45} color="red" style={{ marginRight: 10, position: 'absolute', right: -25, top: -20 }} />

                                    <View style={{ width: '100%', height: '100%', }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5, marginTop: 20 }}>
                                            <Text style={styles.slideHeader}>     Submit your reason.</Text>
                                        </View>
                                        <View style={{ width: 'auto', flexDirection: 'row', flexWrap: 'wrap', marginLeft: 20 }}>
                                            <TouchableOpacity onPress={() => { handleTextClick2('1'); }}>
                                                <Text style={[styles.slideText, focusedText2 === '1' && styles.focusedText]}>Spam</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => handleTextClick2('2')}>
                                                <Text style={[styles.slideText, focusedText2 === '2' && styles.focusedText]}>Hate Speech</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => handleTextClick2('4')}>
                                                <Text style={[styles.slideText, focusedText2 === '4' && styles.focusedText]}>Scam</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => handleTextClick2('3')}>
                                                <Text style={[styles.slideText, focusedText2 === '3' && styles.focusedText]}>Impersonation</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => handleTextClick2('5')}>
                                                <Text style={[styles.slideText, focusedText2 === '5' && styles.focusedText]}>Harassment</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => handleTextClick2('6')}>
                                                <Text style={[styles.slideText, focusedText2 === '6' && styles.focusedText]}>False Information</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => handleTextClick2('7')}>
                                                <Text style={[styles.slideText, focusedText2 === '7' && styles.focusedText]}>Threats</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{ marginTop: 40, marginHorizontal: 30 }}>


                                            {showLoader2 ? (
                                                <LinearGradient style={[{ borderRadius: 5, padding: 5, alignItems: 'center' }]}
                                                    colors={['#f52d70', '#fe765f']}>
                                                    <LoaderKit style={{ width: 30, height: 30 }} name={'BallPulse'} color={'white'} />

                                                </LinearGradient>
                                            ) : (
                                                <AnimatedButton
                                                    title="Submit"
                                                    onPress={ReportApi}
                                                />
                                            )}
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </Modal>

                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={modalVisible3}
                            onRequestClose={() => {
                                setModalVisible3(!modalVisible3);
                            }}>
                            <View style={styles.centeredView}>
                                <View style={[styles.modalView, { height: 250 }]}>
                                    <Ionicons onPress={toggleModal3} name="close-circle" size={45} color="red" style={{ marginRight: 10, position: 'absolute', right: -25, top: -20 }} />

                                    <View style={{ marginBottom: 50 }}>
                                        <Text style={{ fontSize: 20, fontWeight: '700', fontFamily: 'georgia', color: '#525252', textAlign: 'center' }}>Are you sure you want to block this account?</Text>
                                    </View>

                                    <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', width: '100%' }}>

                                        <View>
                                            <AnimatedButton
                                                title="No"
                                                onPress={toggleModal3}
                                            />
                                        </View>

                                        <View>
                                            <AnimatedButton
                                                title="Yes"
                                                onPress={BlockApi}
                                            />
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </Modal>

                    </View>
                </ImageBackground >
            )}
        </KeyboardAvoidingView >
    );
};
export default UserChatScreen;


const styles = StyleSheet.create({
    mainContainer: {
        height: '100%',
        paddingTop: 20
    },
    messageContainer: {
        height: '77%',
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
        top: -20,
        backgroundColor: '#EFEFEF',
        padding: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 8,

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
        borderWidth: 0.5,
        borderColor: '#F6F6F6',
        borderStyle: 'solid',
        padding: 10,
        borderRadius: 50,
        marginLeft: 8,
        backgroundColor: '#EFEFEF',
        textAlign: 'center',
        marginTop: 8
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingBottom: 5,
        // backgroundColor: '#F6F6F6',
        backgroundColor: '#EFEFEF',
        borderWidth: 0.5,
        // borderColor: '#DCDCDC',
        // width: '93%',
        marginHorizontal: 10,
        alignSelf: 'center',
        borderRadius: 5,
        marginBottom: 10,
        shadowOffset: { width: 5, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
    },
    // input: {
    //     flex: 1,
    //     // borderWidth: 1,
    //     // borderColor: 'white',
    //     // paddingHorizontal: 15,
    //     // marginRight: 10,
    //     // marginTop: 10,
    //     color: 'white',
    //     backgroundColor: '#EFEFEF',
    //     fontSize: 18,
    //     fontWeight: '600',
    //     fontFamily: 'georgia',
    // },

    input: {
        flex: 1,
        color: 'black',
        backgroundColor: '#EFEFEF',
        fontSize: 18,
        fontWeight: '600',
        fontFamily: 'georgia',
        textAlignVertical: 'bottom',
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
    },

    container: {
        flex: 1,
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 70
    },
    image: {
        width: 270,
        height: 300,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
        fontFamily: 'georgia'
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        color: '#555',
        marginBottom: 20,
        paddingHorizontal: 10,
        fontFamily: 'georgia'
    },
    button2: {
        backgroundColor: '#ff6f61',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },

    modalView: {
        // margin: 20,
        backgroundColor: '#F6F6F6',
        borderRadius: 10,
        padding: 15,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        height: SCREEN_HEIGHT / 2.5,
        width: SCREEN_WIDTH / 1.1,
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
        backgroundColor: 'rgba(0, 0, 0, 0.7)'
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
        fontSize: 20,
        fontWeight: '700',
        alignContent: 'center',
        marginTop: 15,
        fontFamily: 'georgia',
        color: '#4A4744'
    },

    menuContainer: {
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },
    menuText: {
        fontSize: 20,
        marginLeft: 10,
    },
});

