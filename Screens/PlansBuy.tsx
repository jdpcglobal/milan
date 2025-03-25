import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { StripeProvider } from '@stripe/stripe-react-native';
import PaymentError from './PaymentError';

const stripePublicKey = 'pk_test_51PV5rL054PH7AMe0SoAOnBdmIvQIdaLjoLNQ8hZNJRDKoXPD0c3bQXrScXiBCXK6ajBhDMlPULfSowVmwkcQZGCP00bgyXbgAU';

const PlansBuy = () => {
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   fetchPaymentIntent();
  // }, []);

  const fetchPaymentIntent = async () => {
    try {
      const response = await axios.post('http://themilan.org/api/create-payment-intent', {
        currency: 'USD',
        amount: 100,
      });
      const data = response.data;
      setClientSecret(data.clientSecret);
    } catch (error) {
      console.error('Error fetching payment intent:', error);
    } finally {
      setLoading(false);
    }
  };

  // if (loading) {
  //   return (
  //     <View style={styles.loadingContainer}>
  //       <Text onPress={fetchPaymentIntent}>ghyj</Text>
  //     </View>
  //   );
  // }

  return (
    <StripeProvider publishableKey={stripePublicKey}>
      {/* <Text onPress={fetchPaymentIntent}>ghyjffffffffffffffffffff</Text> */}
      <View style={styles.container}>
        {clientSecret && <PaymentError clientSecret={clientSecret} />}
      </View>
    </StripeProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PlansBuy;
