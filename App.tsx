/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import type { PropsWithChildren } from 'react';
import { PaperProvider } from 'react-native-paper';
import {
  Button,
  FlatList,
  SafeAreaView,
  ScrollView,
  SectionList,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  Touchable,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import MainNavigator from './Navigation/MainNavigator';
import { Provider } from 'react-redux';
import { store } from './Utils/Store';
import { AppProvider } from './Navigation/PlansApi';
import { StripeProvider } from '@stripe/stripe-react-native';
// import { Provider as PaperProvider, MD3LightTheme as DefaultTheme } from 'react-native-paper';
import SplashScreen from 'react-native-splash-screen'

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: '#3498db', // Change the background color to your preference
    padding: 0,
    borderRadius: 20,
    margin: 0,
    alignItems: 'baseline',
    shadowColor: 'blue',

  },
  buttonText: {
    color: '#ffffff', // Change the text color to your preference
    fontSize: 16,
    fontWeight: 'bold',
  },
});


function App(): React.JSX.Element {
useEffect(() => {
  SplashScreen.hide();

  
}, [])


  const isDarkMode = useColorScheme() === 'dark';
  const [count, setCount] = useState(0);
  const [texts, setTexts] = useState('');
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  // const theme = {
  //   ...DefaultTheme,
  //   colors: {
  //     ...DefaultTheme.colors,
  //     primary: '#3498db',
  //     accent: '#f1c40f',
  //   },
  // };

  return (
    <Provider store={store}>
      <View style={{ flex: 1, }}>
        <AppProvider>
          <StripeProvider
            publishableKey="pk_test_51PV5rL054PH7AMe0SoAOnBdmIvQIdaLjoLNQ8hZNJRDKoXPD0c3bQXrScXiBCXK6ajBhDMlPULfSowVmwkcQZGCP00bgyXbgAUpi_3PV6BD054PH7AMe01HMZCBZi_secret_qT15lHMHkIrhrL4WkvUajq6FK"
            urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
            merchantIdentifier="merchant.com.{{Milan}}" // required for Apple Pay
          >
            <PaperProvider>
              <MainNavigator />
            </PaperProvider>
          </StripeProvider>
        </AppProvider>
      </View>
    </Provider>
  );
}



export default App;
