import { PlatformPay, PlatformPayButton, usePlatformPay } from '@stripe/stripe-react-native';
import React from 'react';
import { Alert, View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import axios from 'axios';


function PaymentScreen({ clientSecret2}) {
    // console.log('33333335', clientSecret2)
    const {
        isPlatformPaySupported,
        confirmPlatformPayPayment,
    } = usePlatformPay();

    React.useEffect(() => {
        (async function () {
            const isSupported = await isPlatformPaySupported({ googlePay: { testEnv: true } });
            if (!isSupported) {
                Alert.alert('Google Pay is not supported.');
                return;
            }
        })();
    }, []);
 
    const pay = async () => {
        //  const clientSecret = await fetchPaymentIntentClientSecret();
        if (!clientSecret2) return; // Ensure the clientSecret is valid

        const { error } = await confirmPlatformPayPayment(
            clientSecret2,
            {
                googlePay: {
                    testEnv: true,
                    merchantName: 'Milan',
                    merchantCountryCode: 'US',
                    currencyCode: 'USD',
                    billingAddressConfig: {
                        format: PlatformPay.BillingAddressFormat.Full, 
                        isPhoneNumberRequired: true,
                        isRequired: true,
                    },
                },
            }
        );

        if (error) {
            Alert.alert(error.code, error.message);
            // Update UI to prompt user to retry payment (and possibly another payment method)
            return;
        }
        Alert.alert('Success', 'The payment was confirmed successfully.');
    };

    return (
        <View style={styles.container}>
            <PlatformPayButton
                type={PlatformPay.ButtonType.Pay}
                onPress={pay}
                style={styles.payButton}
            />
        </View>
    );
}

export default PaymentScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    payButton: {
        width: '93%',
        height: 50,
    },
});