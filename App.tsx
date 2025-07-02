/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import {
  StatusBar,
  StyleSheet,
  useColorScheme,
  Platform,
  Alert,
  KeyboardAvoidingView
} from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import MainNavigator from './Navigation/MainNavigator';
import { Provider } from 'react-redux';
import { store } from './Utils/Store';
import { AppProvider } from './Navigation/PlansApi';
import { StripeProvider } from '@stripe/stripe-react-native';
import { PaperProvider } from 'react-native-paper';
import SplashScreen from 'react-native-splash-screen';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import messaging from '@react-native-firebase/messaging';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

function App(): React.JSX.Element {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const isDarkMode = useColorScheme() === 'dark';

  // Hide splash screen and initialize notifications
  useEffect(() => {
    SplashScreen.hide();
    setupNotifications();
  }, []);

  // Load custom fonts
  useEffect(() => {
    const loadFonts = async () => {
      await Promise.all([
        Icon.loadFont(),
        MaterialCommunityIcons.loadFont(),
        FontAwesome.loadFont()
      ]);
      setFontsLoaded(true);
    };
    loadFonts();
  }, []);

  const setupNotifications = async () => {
    try {
      if (Platform.OS === 'ios') {
        await PushNotificationIOS.requestPermissions({
          alert: true,
          badge: true,
          sound: true,
        });
      }

      const token = await messaging().getToken();
      console.log('FCM Token:', token);

      messaging().onTokenRefresh(newToken => {
        console.log('Refreshed FCM Token:', newToken);
      });

      messaging().onMessage(async remoteMessage => {
        console.log('Foreground notification:', remoteMessage);
        showHeadsUpNotification(
          remoteMessage.notification?.title,
          remoteMessage.notification?.body
        );
      });

      messaging().setBackgroundMessageHandler(async remoteMessage => {
        console.log('Background notification:', remoteMessage);
      });

    } catch (error) {
      console.error('Notification setup error:', error);
    }
  };

  const showHeadsUpNotification = (title, body) => {
    if (Platform.OS === 'ios') {
      PushNotificationIOS.addNotificationRequest({
        id: Date.now().toString(),
        title: title || 'New Message',
        body: body,
        sound: 'default',
      });
    } else {
      // For foreground, we'll use an alert
      Alert.alert(title || 'New Message', body);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}style={{ flex: 1 }}>
    <SafeAreaProvider>
      <Provider store={store}>
        <AppProvider>
          <StripeProvider
            publishableKey="pk_test_51PV5rL054PH7AMe0SoAOnBdmIvQIdaLjoLNQ8hZNJRDKoXPD0c3bQXrScXiBCXK6ajBhDMlPULfSowVmwkcQZGCP00bgyXbgAUpi_3PV6BD054PH7AMe01HMZCBZi_secret_qT15lHMHkIrhrL4WkvUajq6FK"
            urlScheme="your-url-scheme"
            merchantIdentifier="merchant.com.{{Milan}}"
          >
            <PaperProvider>
              <SafeAreaView style={styles.fullScreen}>
                <StatusBar
                  barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                  backgroundColor="transparent"
                  translucent
                />
                {fontsLoaded && <MainNavigator />}
              </SafeAreaView>
            </PaperProvider>
          </StripeProvider>
        </AppProvider>
      </Provider>
    </SafeAreaProvider>
    </KeyboardAvoidingView>
  ); 
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default App;