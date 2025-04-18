import React, { useContext, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Dimensions, Alert, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AppContext } from '../Navigation/PlansApi';
import axios from 'axios';
import { StripeProvider } from '@stripe/stripe-react-native';
import PaymentError from './PaymentError';
import { useNavigation } from '@react-navigation/native';
import PaymentScreen from './PaymentScreen';
import LoaderKit from 'react-native-loader-kit';
import { SCREEN_WIDTH } from '@gorhom/bottom-sheet';
import AnimatedButton from './AnimatedButton';

const stripePublicKey = 'pk_test_51PV5rL054PH7AMe0SoAOnBdmIvQIdaLjoLNQ8hZNJRDKoXPD0c3bQXrScXiBCXK6ajBhDMlPULfSowVmwkcQZGCP00bgyXbgAU';

const Plans = () => {
    const { plans, allUserData, plans2 } = useContext(AppContext);
    const maxFeatures = Math.max(...plans.map(plan => plan.features.length));
    const [clientSecret, setClientSecret] = useState('');
    const [clientSecret2, setClientSecret2] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedPlanIndex, setSelectedPlanIndex] = useState(0);
    const [orderId, setOrderId] = useState('');
    const [duration, setDuration] = useState('');
    const [prize, setPrize] = useState('');
    const screenWidth = Dimensions.get('window').width;
    const navigation = useNavigation();
    const screenHeight = Dimensions.get('window').height;
    const [showLoader, setShowLoader] = useState(false);
    const [showLoader2, setShowLoader2] = useState(false);

    const HideLair = () => {
        setShowLoader2(false);
        setClientSecret2('');
        setClientSecret('');
    }

    const fetchPaymentIntent = async (amount, id, Duration) => {
        try {
            const response = await axios.post('https://themilan.org/api/create-payment-intent', {
                currency: 'USD',
                amount,
                id,
                Duration,
            });
            setClientSecret(response.data);
            // console.log('1211221')
            setShowLoader(false);
            setShowLoader2(true);
        } catch (error) {
            console.error('Error fetching payment intent:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchPaymentIntentClientSecret = async (amount, id, Duration) => {
        try {
            const response = await axios.post('https://themilan.org/api/create-payment-intent', {
                currency: 'USD',
                amount,
                id,
                Duration
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            setClientSecret2(response.data.clientSecret);
        } catch (error) {
            console.error('Error fetching payment intent:', error);
            Alert.alert('Error', 'Failed to fetch payment intent.');
        }
    };

    const handlePress = (index, discountPrice, id, Duration) => {
        setSelectedPlanIndex(index);
        setOrderId(id);
        setDuration(Duration);
        setPrize(clientSecret);
        fetchPaymentIntent(discountPrice, id, Duration);
        fetchPaymentIntentClientSecret(discountPrice, id, Duration);
        setShowLoader(true);
    };

    const isButtonDisabled = (planName) => {
        if (plans2.plan === 1 && planName === 'Spark') return true;
        if (plans2.plan === 2 && (planName === 'Spark' || planName === 'Flame')) return true;
        if (plans2.plan === 3 && (planName === 'Spark' || planName === 'Flame' || planName === 'Blaze')) return true;
        return false;
    };

    const handleScrollEnd = (event) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        const newIndex = Math.round(offsetX / (screenWidth / 1.15));
        setSelectedPlanIndex(newIndex);
    };

    const isContinueButtonDisabled = isButtonDisabled(plans[selectedPlanIndex].Name);

    const selectedPlan = plans[selectedPlanIndex]?.Name;

    const gradientColors = (() => {
        switch (selectedPlan) {
            case 'Silver':
                return ['#a8a8a8', '#f3f3f3', '#878786'];
            case 'Gold':
                return ['#fdea91', '#c2873e'];
            case 'Platinum':
            default:
                return ['rgba(213,147,255,1)', 'rgba(160,32,240,255)'];
        }
    })();



    return (
        <ScrollView style={{ height: screenHeight, width: screenWidth, marginTop: -10, }}>
            {/* <LinearGradient
                style={{ minHeight: screenHeight, paddingTop: 50 }}
                colors={['white', 'white']}
            // colors={gradientColors}
            > */}

            {showLoader &&
                <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', position: 'absolute', height: screenHeight, width: screenWidth, zIndex: 100, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <LoaderKit style={{ width: 150, height: 150, }} name={'BallClipRotateMultiple'} color={'white'} />
                </View>
            }

            <ScrollView style={{}}>
                {/* <TouchableOpacity style={{ marginTop: 10, marginBottom: -10 }} onPress={() => navigation.goBack()} >
                        <Ionicons name='arrow-back-circle-outline' size={40} color="#4A4744" />
                    </TouchableOpacity> */}

                {showLoader2 &&
                    <TouchableOpacity onPress={HideLair} style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.5)', position: 'absolute', height: '100%', width: screenWidth, zIndex: 100, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderBottomLeftRadius: 10, borderBottomRightRadius: 10,
                        shadowColor: 'black',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.25,
                        shadowRadius: 4,
                        elevation: 5,
                    }}>
                        <View >
                        </View>
                    </TouchableOpacity>
                }

                <View style={styles.PlansTab}>
                    <ScrollView
                        horizontal={true}
                        contentContainerStyle={styles.scrollViewContent}
                        onMomentumScrollEnd={handleScrollEnd}
                        pagingEnabled
                    >
                        {plans.map((plan, index) => {
                            let gradientColors = ['white', 'white', 'white'];
                            let slideWidth = screenWidth / 1.04;
                            let marginL = 10;
                            let marginR = 5;
                            let customText1 = 'Unlock exclusive access! Get personalized insights of the person who liked you and start chatting with your perfect match today!';
                            let planImg = require('../Asset/Images/plan-spark.png');
                            let planName = 'Spark'
                            const buttonDisabled = isButtonDisabled(plan.Name);

                            if (plan.Name === 'Flame') {
                                gradientColors = ['white', 'white', 'white'];
                                slideWidth = screenWidth / 1.04;
                                marginL = 11;
                                marginR = 5;
                                customText1 = 'Get ready for unlimited likes and rewinds! Swipe freely and never miss a connection—rewind, relive, and match with confidence!'
                                planImg = require('../Asset/Images/plan-flame.png');
                            } else if (plan.Name === 'Blaze') {
                                gradientColors = ['white', 'white', 'white'];
                                slideWidth = screenWidth / 1.04;
                                marginL = 1;
                                //  marginR = 5;
                                customText1 = 'Explore the world with our passport feature—connect globally and see who is interested in you before you decide!'
                                planImg = require('../Asset/Images/plan-blaze.png');
                            }

                            return (
                                <LinearGradient
                                    key={index}
                                    colors={gradientColors}
                                    // colors={['#f1f1f1', '#f1f1f1']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={[styles.gradient, { width: slideWidth, marginLeft: marginL, marginRight: marginR }]}
                                >
                                    <View style={styles.plansBox}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

                                            <LinearGradient
                                                colors={isContinueButtonDisabled ? ['#f52d70', '#fe765f'] : ['#f52d70', '#fe765f']}
                                                style={{ height: 40, paddingHorizontal: 10, justifyContent: 'center', alignItems: 'center', borderRadius: 10 }}
                                            >

                                                <Text style={styles.plansHead}>{plan.Name}</Text>

                                            </LinearGradient>
                                            <Image style={{ height: 60, width: 60 }} source={planImg} resizeMode='contain'></Image>
                                        </View>

                                        <Text style={{ color: '#3D3D3D', fontWeight: '700', fontSize: 15, fontFamily: 'georgia', marginTop: 20 }}>{customText1}</Text>

                                        <View style={{ flexDirection: 'row', alignItems: 'flex-end', marginTop: 10 }}>
                                            <Text style={styles.HeadPrize}>${plan.DiscountPrice}</Text>
                                            <Text style={styles.HeadDuration}> per {plan.Duration}month.</Text>
                                        </View>
                                    </View>


                                    <View style={{ marginTop: -70, }}>
                                        <View style={{ marginHorizontal: 15, marginVertical: 20, paddingHorizontal: 10, paddingVertical: 10, borderRadius: 5 }}>
                                            <View style={styles.planDetail}>
                                                <Text style={{ fontSize: 20, color: '#464646', fontWeight: '700', fontFamily: 'georgia', }}>What you get:</Text>
                                                <View style={styles.ticks}>
                                                    <Text style={{ fontSize: 20, color: '#464646', fontWeight: '700', marginRight: 10, fontFamily: 'georgia', }}>
                                                        {plans[selectedPlanIndex].Name}
                                                    </Text>
                                                </View>
                                            </View>

                                            <View style={styles.planDetail}>
                                                <View>
                                                    {['Get like user detail.', 'Chat with your match.', 'Unlimited Likes.', 'Unlimited Rewinds.', 'Passport to any location.', 'See who likes you.'].map((feature, idx) => (
                                                        <Text key={idx} style={styles.youGet}>{feature}</Text>
                                                    ))}
                                                </View>
                                                <View style={styles.ticks}>
                                                    {plans.map((plan, index) => (
                                                        <View key={index} style={{ display: selectedPlanIndex === index ? 'flex' : 'none', marginRight: plans[selectedPlanIndex].Name == 'Platinum' ? 25 : 8 }}>
                                                            {Array.from({ length: maxFeatures }).map((_, featureIndex) => (
                                                                <Text key={featureIndex} style={styles.Pre}>
                                                                    <Ionicons name={plan.features[featureIndex] ? "checkmark" : "close"} size={28} color="#656565" />
                                                                </Text>
                                                            ))}
                                                        </View>
                                                    ))}
                                                </View>
                                            </View>
                                        </View>
                                        {/* <Image style={{ height: screenHeight/2.6, width: screenWidth, position: 'absolute', borderRadius:20 }} source={require('../Asset/Images/birdBg.jpg')} />
                        
                        <View style={{ height: screenHeight/2.6, width: screenWidth, position: 'absolute', backgroundColor: 'rgba(225, 225, 225, 0.6)',  borderRadius:20}}>
                        </View> */}
                                    </View>


                                    {/* <TouchableOpacity
                                        onPress={() => handlePress(selectedPlanIndex, plans[selectedPlanIndex].DiscountPrice, plans[selectedPlanIndex].id, plans[selectedPlanIndex].Duration)}
                                        disabled={isContinueButtonDisabled}
                                    >
                                        <LinearGradient
                                            colors={isContinueButtonDisabled ? ['#f52d70', '#fe765f'] : ['#f52d70', '#fe765f']}
                                            style={[
                                                styles.continueBtn,
                                                isContinueButtonDisabled && styles.disabledButton
                                            ]}
                                        >

                                            <Text style={{ color: '#F6F6F6', fontSize: 20, fontWeight: '700' }}>
                                                Continue with {plan.Name} @&nbsp;
                                                <Text style={{ color: '#F6F6F6', fontSize: 13, fontWeight: '600', textDecorationLine: 'line-through' }}>
                                                    ${plans[selectedPlanIndex].Price}
                                                    ${plan.Price}&nbsp;&nbsp;
                                                </Text>
                                                ${plans[selectedPlanIndex].DiscountPrice}
                                                ${plan.DiscountPrice}
                                            </Text>

                                        </LinearGradient>
                                    </TouchableOpacity> */}

                                    <View  style={{marginHorizontal:10}}>
                                        <AnimatedButton
                                            title={`Continue with ${plan.Name} at $${plan.DiscountPrice}`}
                                            onPress={() => handlePress(selectedPlanIndex, plans[selectedPlanIndex].DiscountPrice, plans[selectedPlanIndex].id, plans[selectedPlanIndex].Duration)}
                                            disabled={isContinueButtonDisabled}
                                        />
                                    </View>
                                </LinearGradient>
                            );
                        })}
                    </ScrollView>
                </View>

                <View style={styles.dotContainer}>
                    {plans.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.dot,
                                { backgroundColor: index === selectedPlanIndex ? '#f52d70' : '#ccc' }
                            ]}
                        />
                    ))}
                </View>

                <View style={{ height: 27}}></View>

                {/* <LinearGradient
                        style={[styles.planDetailTab, { width: screenWidth / 1.05, alignSelf: 'center' }]}
                        // colors={gradientColors}
                        colors={['#F6F6F6', '#F6F6F6']}
                    > */}

                {/* </LinearGradient> */}

            </ScrollView>
            {/* </LinearGradient> */}
            <View style={{ marginTop: -35 }}>
                <StripeProvider publishableKey={stripePublicKey}>
                    <View>
                        {clientSecret && <PaymentError clientSecret={clientSecret} orderId={orderId} duration={duration} />}
                    </View>
                </StripeProvider>

                <StripeProvider publishableKey={stripePublicKey}>
                    <View>
                        {clientSecret2 && <PaymentScreen clientSecret2={clientSecret2} />}
                    </View>
                </StripeProvider>
            </View>
        </ScrollView>
    );
};

export default Plans;

const styles = StyleSheet.create({
    disabledButton: {
        opacity: 0.5,
        // backgroundColor: 'red'
    },
    gradient: {
        flex: 1,
        paddingBottom:25,
        borderRadius: 15,
        padding: 2,
        borderStyle: 'solid',
        shadowColor: 'black',
        marginBottom: 10,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    plansBox: {
        paddingHorizontal: 10,
        paddingVertical: 10,
        height: SCREEN_WIDTH / 1.6
    },
    plansHead: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: '700',
        fontFamily: 'georgia',
    },
    plansButton: {
        fontSize: 20,
        color: 'black',
        fontWeight: 'bold',
        backgroundColor: '#E5E4E2',
        borderRadius: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'black',
        fontFamily: 'georgia',
    },
    PlansTab: { marginTop: 20, flexDirection: 'row' },
    scrollViewContent: { flexDirection: 'row' },
    planDetail: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        // marginHorizontal: 15,
        // marginVertical: 15,
        zIndex: 100,
    },
    ticks: { flexDirection: 'row', justifyContent: 'space-between' },
    planDetailTab: {
        backgroundColor: '#989898',
        marginTop: 20,
        borderRadius: 5,
        // borderWidth: 1,
        // borderColor: '#A19C96',
        borderStyle: 'solid',
        shadowColor: 'white',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        marginBottom: 10
    },
    Pre: {
        fontSize: 18,
        color: 'black',
        fontWeight: '700',
        textAlign: 'center',
        width: 70,
        marginTop: 5,
        height: 40
    },
    youGet: {
        fontSize: 18,
        color: '#656565',
        fontWeight: '400',
        marginTop: 5,
        // fontFamily: 'georgia',
        height: 40
    },
    priceing: {
        textDecorationLine: 'line-through',
        fontSize: 12
    },
    continueBtn: {
        marginTop: -20,
        // backgroundColor: '#F6F6F6',
        marginHorizontal: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: 40,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#D6D4D2',
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.25,
        // shadowRadius: 4,
        // elevation: 3,
        marginBottom: 10
    },
    dotContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 10,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginHorizontal: 5,
    },

    HeadPrize: {
        fontSize: 25,
        fontWeight: '700',
        color: '#292929',
        fontFamily: 'georgia'
    },

    HeadDuration: {
        fontSize: 17,
        fontWeight: '600',
        color: '#464646',
        fontFamily: 'georgia',
        marginBottom: 10
    }
});
