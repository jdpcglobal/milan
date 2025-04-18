import React, { Component } from 'react'
import { StyleSheet, Text, View, Image } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import AnimatedButton from './AnimatedButton';

const PaymentSuccess = ({ route }) => {
    const { clientSecret } = route.params;
    const createdDate = new Date(clientSecret.created * 1000);
    const formattedDate = createdDate.toLocaleDateString();
    const formattedTime = createdDate.toLocaleTimeString();
    const navigation = useNavigation();

    return (
        <View>
            <View style={styles.header}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
                    <Image style={styles.img} source={require('../Asset/Images/icon.png')} />
                    <Text style={{ fontSize: 20, color: 'black', marginLeft: 10, fontWeight: '700' }}>Milan</Text>
                </View>
            </View>
            <View style={{ backgroundColor: '#fbfbfb', display: 'flex', alignItems: 'center', marginTop: '10%', paddingTop: '5%', paddingBottom: '10%', borderRadius: 5, marginHorizontal: 10 }}>
                <Text style={{ textAlign: 'center' }}>
                    <Icon name="checkmark-circle-outline" size={90} color="green" style={{}} />
                </Text>
                <Text style={styles.success}>Payment Successful</Text>

                <View style={styles.detailBox}>
                    <Text style={styles.success}>Payment Summary</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                        <View>
                            <Text style={styles.textDe}>Amount:</Text>
                            <Text style={styles.textDe}>Date:</Text>
                            <Text style={styles.textDe}>Time:</Text>
                        </View>

                        <View>
                            <Text style={styles.textDe2}>${clientSecret.amount / 100}</Text>
                            <Text style={styles.textDe2}>{formattedDate}</Text>
                            <Text style={styles.textDe2}>{formattedTime}</Text>
                        </View>

                    </View>
                    {/* <TouchableOpacity onPress={() => navigation.navigate('Home')} >
                        <LinearGradient style={styles.button}
                            colors={['#f52d70', '#fe765f']}
                        >
                            <Text style={{ color: '#F6F6F6', fontSize: 25, fontWeight: '700', padding: 10, fontFamily: 'georgia', textAlign: 'center' }}>Back</Text>
                        </LinearGradient>
                    </TouchableOpacity> */}

                    <View style={styles.button}>
                        <AnimatedButton
                            title='Back'
                            onPress={() => navigation.navigate('Home')}
                        />
                    </View>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    success: {
        textAlign: 'center',
        color: '#5A5552',
        fontSize: 25,
        fontWeight: '700',
        fontFamily: 'georgia',
    },
    textDe: {
        fontSize: 20,
        fontWeight: '700',
        padding: 5,
        fontFamily: 'georgia',
    },
    textDe2: {
        fontSize: 20,
        color: '#5A5552',
        fontWeight: '700',
        padding: 5,
        fontFamily: 'georgia',
    },
    detailBox: {
        backgroundColor: '#F6F6F6',
        width: '85%',
        borderRadius: 10,
        paddingTop: 25,
        paddingBottom: 25,
    },
    button: {
        backgroundColor: '#E5E4E2',
        width: 250,
        borderRadius: 12,
        display: 'flex',
        alignSelf: 'center',
        marginTop: 25,
    },

    header: {
        backgroundColor: '#DCDCDC',
        height: 60,
        // marginHorizontal: 4,
        // borderRadius: 10,
        // marginTop: 2,
        justifyContent: 'center'
    },

    img: {
        height: 45,
        width: 45
    }
});

export default PaymentSuccess
