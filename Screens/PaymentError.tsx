import React, { useContext, useState } from 'react';
import { Text, View, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { CardField, useConfirmPayment } from '@stripe/stripe-react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useSelector } from "react-redux";
import { LoginState } from '../Utils/Types.ts';
import { AppContext } from '../Navigation/PlansApi.tsx';
import LinearGradient from 'react-native-linear-gradient';

const PaymentError = ({ clientSecret, orderId, duration }) => {
  const { confirmPayment, loading } = useConfirmPayment();
  const [message, setMessage] = useState(null);
  const navigation = useNavigation();
  const token = useSelector((state: LoginState) => state.logins.auth_token);
  const { fetchPlans } = useContext(AppContext);

  const handleSubmit = async () => {
    if (!clientSecret.clientSecret) {
      setMessage('Client secret is missing');
      return;
    }

    const { error } = await confirmPayment(clientSecret.clientSecret, {
      paymentMethodType: 'Card',
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Payment succeeded!');
      navigation.navigate('PaymentSuccess', { clientSecret: clientSecret });
      UserMessage();
    }
  };

  //*************** subscribe api start ****************//

  const date = new Date(clientSecret.created * 1000);

  // Format the date to 'yyyy-mm-dd'
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(date.getDate()).padStart(2, '0');

  const formattedDate = `${year}-${month}-${day}`;

  const UserMessage = async () => {
    const payload = {
      planId: orderId,
      duration: duration,
      amount: clientSecret.amount / 100,
      date: formattedDate,
      token: token,
      transactionId: clientSecret.transactionId
    };
    try {
      const response = await fetch(
        'https://themilan.org/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      // console.log('2222222222222', response);
      // console.log('22222444444444', payload);
      if (!response.ok) {
        throw new Error('UserMessage api =====')
      }
      const data = await response.json();
      fetchPlans();
    } catch (error) {
      console.error('Subscribe Error Last');
    }
  }
  //*************** subscribe api End ****************//

  // console.log('2222222222222',duration);
  return (
    <View style={styles.container}>
      <CardField
        postalCodeEnabled={true}
        placeholder={{ number: '4242 4242 4242 4242' }}
        cardStyle={styles.card}
        style={styles.cardContainer}
      />

      <LinearGradient
        colors={['#ebac4e', '#ba7b1d']}
        style={styles.button}
      >
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={loading}
          // style={styles.button}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Pay now</Text>
          )}
        </TouchableOpacity>
      </LinearGradient>
      {message && <Text style={styles.message}>{message}!</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  cardContainer: {
    height: 50,
    marginVertical: 30,
  },
  card: {
    backgroundColor: '#F6F6F6',
  },
  button: {
    // backgroundColor: '#DE3163',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#BCBAB5',
    borderStyle: "solid",
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 6,
  },
  buttonText: {
    color: '#4A4744',
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'georgia',
  },
  message: {
    marginTop: 20,
    color: 'red',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700'
  },
});

export default PaymentError;
