import { ActivityIndicator, Dimensions, Image, StyleSheet, Text, View } from 'react-native'
import React, { Component, useEffect, useState } from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/Ionicons';
import Ionicons2 from 'react-native-vector-icons/FontAwesome';
import { SCREEN_HEIGHT, SCREEN_WIDTH, TouchableOpacity } from '@gorhom/bottom-sheet';
import { useDispatch, useSelector } from 'react-redux';
import { LoginState } from '../Utils/Types';
import { useNavigation, NavigationProp, useFocusEffect, CommonActions } from '@react-navigation/native';
type ScreenNavigationProp = NavigationProp<RootStackParamList, 'ProfileScreen'>;
import { RootStackParamList } from '../Utils/Types';
import Logout from '../Components/Logout';
import BottomSheetComponent from '../Components/BottomSheet.tsx';
import { Alert, Modal, Pressable } from 'react-native';
import LoaderKit from 'react-native-loader-kit';
import LinearGradient from 'react-native-linear-gradient';
import { Circle, Triangle, Oval } from 'react-native-shape';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AnimatedButton from './AnimatedButton.tsx';

const MainProfile = () => {
    const token = useSelector((state: LoginState) => state.logins.auth_token);
    const [userDataDetail, setUserData] = useState([])
    const navigation = useNavigation<ScreenNavigationProp>();
    const [bIndex, setbIndex] = useState(-1);
    const [customComponent, setCustomComponent] = useState<React.ReactNode | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    // const [modalVisible2, setModalVisible2] = useState(false);
    const [modalVisible3, setModalVisible3] = useState(false);
    const [modalVisible4, setModalVisible4] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [showMessage, setShowMessage] = useState(false);
    const [showLoader, setShowLoader] = useState(false);

    const screenWidth = Dimensions.get('window').width;
    const screenHeight = Dimensions.get('window').height;
    const AboutPicWidth = screenWidth / 1.1;
    const AboutPicHeight = screenHeight / 1.5;

    // console.log('2222222222',userDataDetail);




    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };

    const toggleModal3 = () => {
        setModalVisible3(!modalVisible3);
    };

    const LogoutComp = () => {
        //  setShowLoader(true);
        setCustomComponent(<Logout />);
        setbIndex(0);
    }

    useEffect(() => {
        userData()
    }, [])

    useFocusEffect(
        React.useCallback(() => {
            userData();
        }, [])
    );

    const userData = async () => {
        const payload = {
            token: token,
        };
        //console.log('userData Payload ===', payload);
        try {
            setIsLoading(true);
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

            //   console.log('userData api =====', data.data);

            if (
                [
                    data.data.height === 0 || data.data.height === null || data.data.height === undefined,
                    data.data.distanceaway === null || data.data.distanceaway === undefined,
                    data.data.education === 0 || data.data.education === null || data.data.education === undefined,
                    data.data.relationshipGoals === 0 || data.data.relationshipGoals === null || data.data.relationshipGoals === undefined,
                    data.data.sexualOrientation === 0 || data.data.sexualOrientation === null || data.data.sexualOrientation === undefined
                ].filter(condition => condition).length >= 3
            ) {
                setShowMessage(true);
                // console.log('if true', userDataDetail.height, userDataDetail.distanceaway, userDataDetail.education, userDataDetail.relationshipGoals, userDataDetail.sexualOrientation);
            } else {
                setShowMessage(false);
                // console.log('if false', userDataDetail.height, userDataDetail.distanceaway, userDataDetail.education, userDataDetail.relationshipGoals, userDataDetail.sexualOrientation);
            }
            setUserData(data.data);
            //  console.log('////////////////', data.data);
            setIsLoading(false);


        } catch (error) {
            console.error('userData Error Last');
            setIsLoading(false);
        }
    }



    const dispatch = useDispatch();
    //   const navigation = useNavigation<OTPScreenNavigationProp>();
    const toggleModal4 = () => {
        setModalVisible4(!modalVisible4);
    };
    const LogoutAction = () => {
        AsyncStorage.removeItem("Token");
        // console.log("hii");
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [
                    { name: 'LoginPage' },
                ],
            })
        );

    }

    const DeleteAccountApi = async () => {
        const payload = {
            token: token,
        };
        // console.log('DeleteAccountApi Payload ====', payload);
        try {
            const response = await fetch(
                'https://themilan.org/api/deleteAccount', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
            if (!response.ok) {
                throw new Error('Create DeleteAccountApi api error');
            }
            const data = await response.json();
            ('DeleteAccountApi api =======', data.isSuccess);
            if (data.isSuccess === true) {
                LogoutAction();
            }
        } catch (error) {
            console.error('DeleteAccountApi Error Last');
        }
    }

    return (
        <ScrollView style={{ backgroundColor: 'white' }}>
            <View style={styles.userback}>
                <TouchableOpacity onPress={toggleModal}>
                    {userDataDetail.images === 110 && userDataDetail.gender === 0 || userDataDetail.gender === 2 ? (
                        <Image style={styles.userImage} source={require('../Asset/Images/avatar-boy.png')} />
                    ) : userDataDetail.images === 110 && userDataDetail.gender === 1 ? (
                        <Image style={styles.userImage} source={require('../Asset/Images/avatar-girl.png')} />
                    ) : (
                        <Image style={styles.userImage} source={{ uri: userDataDetail.images }} />
                    )}
                </TouchableOpacity>
                <Text style={{ top: -120, left: 50 }}>
                    <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('ProfileScreens')}>
                        <Ionicons name="pencil" size={21} color="#0E103D" style={{}} />
                    </TouchableOpacity>
                </Text>
                <Text style={styles.userText}>{userDataDetail.name}, {userDataDetail.age}</Text>
            </View>

            {/* {showLoader &&
                <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)', position: 'absolute', height: screenHeight, width: screenWidth, }}>
                   
                </View>
            } */}

            {/* <View style={{ alignSelf: 'center', position: 'absolute', top: -100 }}>
                <Oval color="white" scale={15} />
            </View> */}

            <View style={styles.userDetail}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ color: '#5A5552', fontSize: 17, fontWeight: '800', marginVertical: 15, fontFamily: 'georgia', }}>Account Settings</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('ProfileScreens')}>
                        <Text style={{ color: '#5A5552', fontSize: 15, fontWeight: '600', marginVertical: 15, fontFamily: 'georgia', }}>Edit</Text>
                    </TouchableOpacity>
                </View>
                {isLoading ? (
                    // Display loader here 
                    <View style={{ alignSelf: 'center' }}>
                        <LoaderKit style={{ width: 150, height: 150 }} name={'BallClipRotateMultiple'} color={'#4A4744'} />
                    </View>
                ) : (
                    <View style={{}}>
                        {userDataDetail.name ? (
                            <View style={[styles.slideText]}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                                    <Icon2 name="account" size={23} color="#5A5552" style={{ marginTop: 2 }} /><Text style={styles.newText}> Name</Text>
                                </View>
                                <Text style={styles.newText2}>{userDataDetail.name}</Text>
                            </View>
                            // <Text style={[styles.slideText,]}><Icon2 name="account" size={27} color="#5A5552" style={{}} /> {userDataDetail.name}</Text>
                        ) : null}

                        {userDataDetail.age ? (

                            <View style={[styles.slideText]}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                                    <Icon2 name="cake" size={23} color="#5A5552" style={{ marginTop: 2 }} /><Text style={styles.newText}> Age</Text>
                                </View>
                                <Text style={styles.newText2}>{userDataDetail.age}</Text>
                            </View>
                            // <Text style={[styles.slideText,]}> <Icon2 name="cake" size={27} color="#5A5552" style={{}} /> Age: {userDataDetail.age} </Text>
                        ) : null}

                        {/* {userDataDetail.education ? ( */}
                        <View style={[styles.slideText]}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                                <Ionicons2 name="graduation-cap" size={23} color="#5A5552" style={{ marginTop: 2 }} /><Text style={styles.newText}> Education</Text>
                            </View>
                            <Text style={styles.newText2}>{userDataDetail.education == '1' ? "Bachelor Degree" : userDataDetail.education == '2' ? "At uni" : userDataDetail.education == '3' ? "High School" : userDataDetail.education == '4' ? 'PHD' : userDataDetail.education == '5' ? 'On Graduate programme' : userDataDetail.education == '6' ? 'Master Degree' : userDataDetail.education == '7' ? 'Trade school' : ` `}</Text>
                        </View>
                        {/* ) : null} */}

                        {/* {userDataDetail.relationshipGoals ? ( */}
                        <View style={[styles.slideText]}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                                <Ionicons2 name="eye" size={27} color="#5A5552" style={{}} /><Text style={styles.newText}> Goals</Text>
                            </View>
                            <Text style={styles.newText2}>{userDataDetail.relationshipGoals == '1' ? "Long-term Partner" : userDataDetail.relationshipGoals == '2' ? "long-term but short-term" : userDataDetail.relationshipGoals == '3' ? "Short-term but long-term ok" : userDataDetail.relationshipGoals == '4' ? 'Short-term fun' : userDataDetail.relationshipGoals == '5' ? 'New friends' : userDataDetail.relationshipGoals == "6" ? 'Still figuring out' : ` `}</Text>
                        </View>
                        {/* ) : null} */}

                        {/* {userDataDetail.height ? ( */}
                        <View style={styles.slideText}>
                            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 5 }}>
                                <Icon2
                                    name="human-male-height-variant"
                                    size={23}
                                    color="#5A5552"
                                    style={{ marginTop: 2 }}
                                />
                                <Text style={styles.newText}> Height</Text>
                            </View>
                            <Text style={styles.newText2}>
                                {userDataDetail?.height
                                    ? userDataDetail.height > 20
                                        ? `${userDataDetail.height} cm`
                                        : `${userDataDetail.height} feet`
                                    : " "}
                            </Text>
                        </View>
                        {/* ) : null} */}

                        {/* {userDataDetail.distanceaway ? ( */}
                            <View style={[styles.slideText]}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                                    <Icon2 name="google-maps" size={23} color="#5A5552" style={{ marginTop: 2 }} /><Text style={styles.newText}> Distance</Text>
                                </View>
                                <Text style={styles.newText2}>{userDataDetail.distanceaway}</Text>
                            </View>
                        {/* ) : null} */}

                        {/* {userDataDetail.jobTitle ? ( */}
                            <View style={[styles.slideText]}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                                    <Ionicons name="briefcase" size={23} color="#5A5552" style={{ marginTop: 2 }} /><Text style={styles.newText}> Job Title</Text>
                                </View>
                                <Text style={styles.newText2}>{userDataDetail.jobTitle && userDataDetail.jobTitle !== "null" ? userDataDetail.jobTitle : ""}</Text>
                            </View>
                        {/* ) : null} */}

                        {/* {userDataDetail.sexualOrientation ? ( */}
                            <View style={[styles.slideText]}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                                    <Image source={require('../Asset/Images/orientation2.png')} style={{ height: 20, width: 20 }} /><Text style={styles.newText}> SexualOrientation</Text>
                                </View>
                                <Text style={styles.newText2}>{userDataDetail.sexualOrientation == '1' ? "Straight" : userDataDetail.sexualOrientation == '2' ? "Gay" : userDataDetail.sexualOrientation == '3' ? "Lesbian" : userDataDetail.sexualOrientation == '4' ? 'Bisexual' : userDataDetail.sexualOrientation == '5' ? 'Asexual' : userDataDetail.sexualOrientation == '6' ? 'Demisexual' : userDataDetail.sexualOrientation == '7' ? 'Queer' : userDataDetail.sexualOrientation == '8' ? 'Bicurious' : userDataDetail.sexualOrientation == '9' ? 'Aromantic' : ` `}</Text>
                            </View>
                        {/* ) : null} */}

                        {showMessage ? (
                            <View style={{ height: 150, justifyContent: 'center', }}><Text style={{ backgroundColor: 'white', color: '#464646', textAlign: 'center', fontWeight: '700', fontSize: 15, paddingTop: 10, paddingBottom: 10, fontFamily: 'georgia', marginHorizontal: 10, borderRadius: 5, marginTop: -50 }}>Show the real you! ✨ Add a few more details to make your profile truly stand out. Your perfect match is curious! 💕</Text></View>
                        ) : null}
                    </View>
                )}
            </View>



            <View style={{ flex: 1, alignItems: 'center', marginBottom: 150, }}>
                {/* <TouchableOpacity onPress={toggleModal3}>
                    <LinearGradient style={[{ alignItems: 'center', margin: 20, borderRadius: 5, width: 250, padding: 5, }, styles.logout]}
                        colors={['#f52d70', '#fe765f']}
                    >
                        <Text style={{ color: '#F6F6F6', fontWeight: '700', fontSize: 23, fontFamily: 'georgia', }}> Logout </Text>
                    </LinearGradient>
                </TouchableOpacity> */}

                <AnimatedButton
                    title="Logout"
                    onPress={toggleModal3}
                />
            </View>


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
                        {/* <Image source={{ uri: userDataDetail.images }} style={[{ height: AboutPicHeight, width: AboutPicWidth, borderRadius: 10, marginTop: 35 }, styles.img]} /> */}

                        {userDataDetail.images === 110 && userDataDetail.gender === 0 || userDataDetail.gender === 2 ? (
                            <Image style={[{ height: AboutPicHeight, width: AboutPicWidth, borderRadius: 10, marginTop: 35 }, styles.img]} source={require('../Asset/Images/avatar-boy.png')} />
                        ) : userDataDetail.images === 110 && userDataDetail.gender === 1 ? (
                            <Image style={[{ height: AboutPicHeight, width: AboutPicWidth, borderRadius: 10, marginTop: 35 }, styles.img]} source={require('../Asset/Images/avatar-girl.png')} />
                        ) : (
                            <Image source={{ uri: userDataDetail.images }} style={[{ height: AboutPicHeight, width: AboutPicWidth, borderRadius: 10, marginTop: 35 }, styles.img]} />
                        )}
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
                <View style={styles.centeredView2}>
                    <View style={styles.modalView2}>
                        <Ionicons onPress={toggleModal3} name="close-circle" size={45} color="red" style={{ marginRight: 10, position: 'absolute', right: -10, top: 1 }} />

                        <View>
                            <View style={styles.container}>
                                <Text style={styles.confirmationText}>Are you sure you want to logout?</Text>
                                {/* <TouchableOpacity onPress={LogoutAction}> */}
                                {/* <LinearGradient style={styles.button}
                                    colors={['#f52d70', '#fe765f']}
                                >
                                    <Text onPress={LogoutAction} style={styles.buttonText}>Logout</Text>
                                </LinearGradient> */}

                                <AnimatedButton
                                    title='Logout'
                                    onPress={LogoutAction}
                                />
                                {/* </TouchableOpacity> */}
                            </View>

                            {/* <TouchableOpacity onPress={toggleModal2} > */}
                            {/* <LinearGradient style={[{ width: 170, borderRadius: 5, paddingVertical: 7 }, styles.delete]}
                                colors={['#f52d70', '#fe765f']}
                            >
                                <Text onPress={toggleModal4} style={{ textAlign: 'center', color: '#F6F6F6', fontSize: 20, fontWeight: '700', fontFamily: 'georgia', }}>Delete Account</Text>
                            </LinearGradient> */}
                            {/* </TouchableOpacity> */}
                            <View style={[{ width: 205, borderRadius: 5, paddingVertical: 7 }, styles.delete]}>
                                <AnimatedButton
                                    title='Delete Account'
                                    onPress={toggleModal4}
                                />
                            </View>
                            <Modal
                                animationType="slide"
                                transparent={true}
                                visible={modalVisible4}
                                onRequestClose={() => {
                                    setModalVisible4(!modalVisible4);
                                }}>
                                <View style={styles.centeredView}>
                                    <View style={styles.modalView}>
                                        <Icon onPress={toggleModal4} name="close-circle" size={45} color="red" style={{ marginRight: 10, position: 'absolute', right: -20, top: -12 }} />
                                        <Text style={{ fontSize: 20, fontWeight: '700', color: '#5A5552', textAlign: 'center', fontFamily: 'georgia', }}>Are you sure you want to Delete your Account</Text>

                                        <View style={{ flexDirection: 'row', marginTop: 50, width: 200, justifyContent: 'space-between' }}>
                                            {/* <Text onPress={toggleModal4}>
                                                <LinearGradient style={styles.button}
                                                    colors={['#f52d70', '#fe765f']}
                                                >
                                                    <Text style={styles.buttonText}>No</Text>
                                                </LinearGradient>
                                            </Text> */}

                                            <AnimatedButton
                                                title='No'
                                                onPress={toggleModal4}
                                            />

                                            {/* <Text onPress={DeleteAccountApi}>
                                                <LinearGradient style={styles.button}
                                                    colors={['#f52d70', '#fe765f']}
                                                >
                                                    <Text style={styles.buttonText}>Yes</Text>
                                                </LinearGradient>
                                            </Text> */}

                                            <AnimatedButton
                                                title='Yes'
                                                onPress={DeleteAccountApi}
                                            />
                                        </View>

                                    </View>
                                </View>
                            </Modal>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* <View style={StyleSheet.absoluteFillObject}>
                <BottomSheetComponent bIndex={bIndex} setbIndex={setbIndex} >
                    <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1, }}>
                        {customComponent}
                    </View>
                </BottomSheetComponent>
            </View> */}
        </ScrollView>
    )
}
export default MainProfile


const styles = StyleSheet.create({
    userImage: {
        height: 150,
        width: 150,
        borderRadius: 100,
        borderColor: 'white',
        borderWidth: 1,
        borderStyle: 'solid',
        marginBottom: -40
    },

    userImage2: {
        height: 200,
        width: 200,
        borderRadius: 100,
        borderColor: 'red',
        borderWidth: 1,
        borderStyle: 'solid',
        textAlign: "center",
        fontSize: 20,
        fontWeight: '800',
        color: 'black',
        paddingTop: 60
    },

    userback: {
        backgroundColor: 'white',
        height: 270,
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 20,
        // zIndex: 100
    },
    userText: {
        color: '#5A5552',
        fontSize: 20,
        fontWeight: '700',
        textAlign: 'center',
        borderRadius: 10,
        paddingHorizontal: 20,
        marginLeft: 10,
        marginTop: 10,
        fontFamily: 'georgia',
        borderColor: '#E5E4E2'
    },
    editButton: {
        padding: 10,
        borderRadius: 50,
        borderColor: 'white',
        borderWidth: 2,
        borderStyle: 'solid',
        backgroundColor: 'rgba(255, 240, 255, 0.6)'
        // position:'absolute',
    },
    userDetail: {
        // backgroundColor: '#F6F6F6',
        marginTop: 10,
        marginHorizontal: 10,
        borderRadius: 5,
        minHeight: 300,
        display: 'flex',
        // alignItems: 'center',
        paddingBottom: 20,
        paddingHorizontal: 10
    },
    userDetailText: {
        color: 'black',
        fontSize: 20,
        fontWeight: '700',
    },

    userDetailTextBk: {
        backgroundColor: '#E5E4E2',
        borderRadius: 5,
        paddingVertical: 8,
        marginBottom: 15,
        marginHorizontal: 20,
        paddingHorizontal: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 6,
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

    modalView2: {
        // margin: 20,
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        // padding: 35,
        height: SCREEN_HEIGHT / 2.5,
        width: SCREEN_WIDTH,
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
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    centeredView2: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        // backgroundColor: 'red',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },

    focusedText: {
        backgroundColor: '#DE3163',
        color: 'white',
        fontSize: 20,
        fontWeight: '800',
    },

    slideText: {
        fontSize: 20,
        color: '#5A5552',
        fontFamily: 'georgia',
        fontWeight: '700',
        backgroundColor: 'white',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginHorizontal: 5,
        marginVertical: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 0.5,
        borderColor: '#989898',
        borderStyle: 'solid',
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 50,
        alignItems: 'center',

    },

    logout: {
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.25,
        // shadowRadius: 4,
        // elevation: 2,
        borderWidth: 0.5,
        borderColor: 'white',
        borderStyle: 'solid'
    },
    gradient: {
        flex: 1,
    },

    img: {
        borderWidth: 1,
        // borderColor: 'red',
        borderStyle: 'solid',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },

    newText: {
        color: '#464646',
        fontSize: 16,
        fontWeight: '700',
        fontFamily: 'georgia'
    },

    newText2: {
        color: '#656565',
        fontSize: 16,
        fontWeight: '500',
        fontFamily: 'georgia',
        textAlign: 'center',
        minWidth: 100,
    },






    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor:'red'
    },
    confirmationText: {
        marginTop: 50,
        fontSize: 21,
        marginBottom: 20,
        textAlign: 'center',
        color: '#5A5552',
        fontWeight: '800',
        fontFamily: 'georgia',
    },
    button: {
        paddingVertical: 7,
        paddingHorizontal: 15,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#D6D4D2',
        borderStyle: 'solid',
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.25,
        // shadowRadius: 4,
        // elevation: 3,
    },
    buttonText: {
        color: '#F6F6F6',
        fontSize: 20,
        fontWeight: '800',
        fontFamily: 'georgia',
    },
    // modalView2: {
    //     margin: 20,
    //     backgroundColor: '#F6F6F6',
    //     borderRadius: 5,
    //     padding: 35,
    //     alignItems: 'center',
    //     justifyContent: 'center',
    //     shadowColor: '#000',
    //     height: 300,
    //     shadowOffset: {
    //         width: 0,
    //         height: 2,
    //     },
    //     shadowOpacity: 0.25,
    //     shadowRadius: 4,
    //     elevation: 5,
    // },
    // centeredView2: {
    //     flex: 1,
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     marginTop: 22,

    // },

    delete: {
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.25,
        // shadowRadius: 4,
        // elevation: 3,
        marginBottom: 10,
    }
});
