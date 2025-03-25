import { ActivityIndicator, Dimensions, Image, StyleSheet, Text, View } from 'react-native'
import React, { Component, useEffect, useState } from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { TouchableOpacity } from '@gorhom/bottom-sheet';
import { useSelector } from 'react-redux';
import { LoginState } from '../Utils/Types';
import { useNavigation, NavigationProp, useFocusEffect } from '@react-navigation/native';
type ScreenNavigationProp = NavigationProp<RootStackParamList, 'ProfileScreen'>;
import { RootStackParamList } from '../Utils/Types';
import Logout from '../Components/Logout';
import BottomSheetComponent from '../Components/BottomSheet.tsx';
import { Alert, Modal, Pressable } from 'react-native';
import LoaderKit from 'react-native-loader-kit';
import LinearGradient from 'react-native-linear-gradient';
import { Circle, Triangle, Oval } from 'react-native-shape';

const MainProfile = () => {
    const token = useSelector((state: LoginState) => state.logins.auth_token);
    const [userDataDetail, setUserData] = useState([])
    const navigation = useNavigation<ScreenNavigationProp>();
    const [bIndex, setbIndex] = useState(-1);
    const [customComponent, setCustomComponent] = useState<React.ReactNode | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const screenWidth = Dimensions.get('window').width;
    const screenHeight = Dimensions.get('window').height;

    const AboutPicWidth = screenWidth / 1.1;
    const AboutPicHeight = screenHeight / 1.5;

    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };

    const LogoutComp = () => {
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
            //console.log('userData api =====', data.data);
            setUserData(data.data);
            setIsLoading(false);

        } catch (error) {
            console.error('userData Error Last');
            setIsLoading(false);
        }
    }

    //console.log('====', token);

    return (
        <ScrollView style={{ backgroundColor: '#F6F6F6' }}>
            <View style={styles.userback}>
                <TouchableOpacity onPress={toggleModal}>
                    <Image style={styles.userImage} source={{ uri: userDataDetail.images }} />
                </TouchableOpacity>
                <Text style={{ position: 'absolute', top: 30, right: 120 }}>
                    <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('ProfileScreen')}>
                        <Ionicons name="pencil" size={27} color="#0E103D" style={{}} />
                    </TouchableOpacity>
                </Text>
                <Text style={styles.userText}>{userDataDetail.name}, {userDataDetail.age}</Text>


            </View>

            <View style={{ alignSelf: 'center', position: 'absolute', top: -70 }}>
                <Oval color="#bd69f0" scale={15} />
            </View>

            <View style={styles.userDetail}>
                <Text style={{ textAlign: 'center', color: 'black', fontSize: 23, fontWeight: '800', marginVertical: 15, fontFamily: 'georgia', }}>About Me</Text>
                {isLoading ? (
                    // Display loader here 
                    <LoaderKit style={{ width: 150, height: 150 }} name={'BallClipRotateMultiple'} color={'#bd69f0'} />
                ) : (
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                        {userDataDetail.name ? (

                            <Text style={[styles.slideText,]}> {userDataDetail.name} {userDataDetail.surname} </Text>

                        ) : null}

                        {userDataDetail.age ? (
                            <Text style={[styles.slideText,]}> Age: {userDataDetail.age} </Text>
                        ) : null}

                        {userDataDetail.height ? (
                            <Text style={[styles.slideText,]}> Height: {userDataDetail.height} Cm</Text>
                        ) : null}

                        {userDataDetail.living !== 'null' && userDataDetail.living ? (
                            <Text style={styles.slideText}>Address: {userDataDetail.living}</Text>
                        ) : null}

                        {userDataDetail.religion ? (
                            <Text style={[styles.slideText,]}> Religion: {userDataDetail.religion} </Text>
                        ) : null}

                        {userDataDetail.gender ? (
                            <Text style={[styles.slideText,]}> Gender: {userDataDetail.gender == '1' ? 'Female' : 'Male'} </Text>
                        ) : null}

                        {userDataDetail.distanceaway ? (
                            <Text style={[styles.slideText,]}>Distance: {userDataDetail.distanceaway}</Text>
                        ) : null}

                        {userDataDetail.education ? (
                            <Text style={[styles.slideText,]}>Eduction: {userDataDetail.education == '1' ? "Bachelor Degree" : userDataDetail.education == '2' ? "At uni" : userDataDetail.education == '3' ? "High School" : userDataDetail.education == '4' ? 'PHD' : userDataDetail.education == '5' ? 'On Graduate programme' : userDataDetail.education == '6' ? 'Master Degree' : userDataDetail.education == '7' ? 'Trade school' : `Didn't Mention`}</Text>
                        ) : null}

                        {userDataDetail.sexualOrientation ? (
                            <Text style={[styles.slideText,]}>SexualOrientation: {userDataDetail.sexualOrientation == '1' ? "Straight" : userDataDetail.sexualOrientation == '2' ? "Gay" : userDataDetail.sexualOrientation == '3' ? "Lesbian" : userDataDetail.sexualOrientation == '4' ? 'Bisexual' : userDataDetail.sexualOrientation == '5' ? 'Asexual' : userDataDetail.sexualOrientation == '6' ? 'Demisexual' : userDataDetail.sexualOrientation == '7' ? 'Queer' : userDataDetail.sexualOrientation == '8' ? 'Bicurious' : userDataDetail.sexualOrientation == '9' ? 'Aromantic' : `Didn't Mention`}</Text>
                        ) : null}

                        {userDataDetail.relationshipGoals ? (
                            <Text style={[styles.slideText,]}>Relationship Goals: {userDataDetail.relationshipGoals == '1' ? "Long-term Partner" : userDataDetail.relationshipGoals == '2' ? "long-term but short-term" : userDataDetail.relationshipGoals == '3' ? "Short-term but long-term ok" : userDataDetail.relationshipGoals == '4' ? 'Short-term fun' : userDataDetail.relationshipGoals == '5' ? 'New friends' : userDataDetail.relationshipGoals == "6" ? 'Still figuring out' : `Didn't Mention`}</Text>
                        ) : null}
                    </View>
                )}
            </View>

            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginBottom: 70 }}>
                <TouchableOpacity onPress={LogoutComp}>
                    <LinearGradient style={[{ alignItems: 'center', margin: 20, borderRadius: 30, width: 250, padding: 10, backgroundColor: '#bc55fa' }, styles.logout]}
                        colors={['#ebac4e', '#ba7b1d']}
                    >

                        <Text style={{ color: 'white', fontWeight: '700', fontSize: 20, fontFamily: 'georgia', }}> Logout </Text>
                    </LinearGradient>
                </TouchableOpacity>
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
                        <Ionicons onPress={toggleModal} name="close-circle" size={45} color="#0E103D" style={{ marginRight: 10, position: 'absolute', right: 25, top: 20 }} />
                        {/* <Text style={styles.modalText}>Hello World!</Text> */}


                        <Image source={{ uri: userDataDetail.images }} style={[{ height: AboutPicHeight, width: AboutPicWidth, borderRadius: 10, marginTop: 35 }, styles.img]} />


                        {/* <Text onPress={toggleModal} style={styles.textStyle}>Hide Modal</Text> */}
                    </View>
                </View>
            </Modal>

            <View style={StyleSheet.absoluteFillObject}>
                <BottomSheetComponent bIndex={bIndex} setbIndex={setbIndex} >
                    <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1, }}>
                        {customComponent}
                    </View>
                </BottomSheetComponent>
            </View>
        </ScrollView>
    )

}

const styles = StyleSheet.create({
    userImage: {
        height: 200,
        width: 200,
        borderRadius: 100,
        borderColor: 'white',
        borderWidth: 1,
        borderStyle: 'solid',
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
        backgroundColor: '#bd69f0',
        height: 300,
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 50,
        zIndex: 100
    },
    userText: {
        color: '#4A4744',
        fontSize: 20,
        fontWeight: '700',
        textAlign: 'center',
        backgroundColor: '#E5E4E2',
        borderRadius: 10,
        borderWidth: 1,
        paddingHorizontal: 20,
        marginLeft: 10,
        marginTop: -20,
        fontFamily: 'georgia',
    },
    editButton: {
        padding: 10,
        borderRadius: 50,
        borderColor: 'white',
        borderWidth: 2,
        borderStyle: 'solid',
        backgroundColor: 'rgba(255, 255, 255, 0.6)'
        // position:'absolute',
    },
    userDetail: {
        backgroundColor: '#F6F6F6',
        marginTop: 30,
        marginHorizontal: 10,
        borderRadius: 20,
        minHeight: 350,
        display: 'flex',
        alignItems: 'center',
        paddingBottom: 20
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
        shadowColor: "#000",
        marginBottom: 15,
        marginHorizontal: 20,
        paddingHorizontal: 10,
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
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },

    focusedText: {
        backgroundColor: '#DE3163',
        color: 'white',
        fontSize: 20,
        fontWeight: '800',
    },

    slideText: {
        fontSize: 20,
        color: '#F6F6F6',
        fontFamily: 'georgia',
        fontWeight: '700',
        backgroundColor: '#bd69f0',
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginHorizontal: 5,
        marginVertical: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        borderWidth: 0.5,
        borderColor: 'white',
        borderStyle: 'solid'
    },

    logout: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        borderWidth: 0.5,
        borderColor: 'white',
        borderStyle: 'solid'
    },
    gradient: {
        flex: 1,
    },

    img: {
        borderWidth: 1,
        borderColor: 'red',
        borderStyle: 'solid',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    }
});

export default MainProfile