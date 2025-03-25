import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import TabNavigator from "./TabNavigator";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../Screens/LoginScreen";
import OTPScreen from "../Screens/OtpScreen";
import { RootStackParamList } from "../Utils/Types";
import LocationScreen from "../Screens/LocationScreen";
import RegisterScreen from "../Screens/RegisterScreen";
import UserChatScreen from "../Screens/UserChatScreen";
import AboutProfile from "../Components/AboutProfile";
import { Image, View } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import ProfileScreen from "../Screens/ProfileScreen";
import MainProfile from "../Screens/MainProfile";
import NotificationScreen from "../Screens/NotificationScreen";
import Plans from "../Screens/Plans";
import PlansBuy from "../Screens/PlansBuy";
import PaymentSuccess from "../Screens/PaymentSuccess";
import PaymentError from "../Screens/PaymentError";
import DetailOfPlans from '../Screens/DetailOfPlans';
import UserLikesScreen from '../Screens/UserLikesScreen'
import ChatUsers from "../Screens/ChatUsers";
import { TouchableOpacity } from "react-native-gesture-handler";


const Tab = createBottomTabNavigator();

const Stack = createStackNavigator<RootStackParamList>()

const MainNavigator = () => {

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName='LoginPage'
      >
        <Stack.Screen
          name="LoginPage"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="OtpPage"
          component={OTPScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="RegisterPage"
          component={RegisterScreen}
          //component={OnBoarding}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="LocationPage"
          component={LocationScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="HomeScreen"
          component={TabNavigator}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="DetailOfPlans"
          component={DetailOfPlans}

          options={{
            headerShown: false,
            // headerTitle: "Milan",

            // headerLeft: () => (
            //   <View>
            //     <Image source={require('../Asset/Images/LogoMinal.png')} style={{ width: 40, height: 40, resizeMode: 'cover', borderRadius: 20, marginLeft: 10 }} />
            //   </View>
            // ),
          }}
        />

        <Stack.Screen
          name="UserLikesScreen"
          component={UserLikesScreen}
          options={{
            headerShown: true,
            headerTitle: "Milan",
            headerLeft: () => (
              <View>
                <Image source={require('../Asset/Images/LogoMinal.png')} style={{ width: 40, height: 40, resizeMode: 'cover', borderRadius: 20, marginLeft: 10 }} />
              </View>
            ),
          }}
        />

        <Stack.Screen
          name="ChatUsers"
          component={ChatUsers}
          options={{
            headerShown: true,
            headerTitle: "Milan",
            headerLeft: () => (
              <View>
                <Image source={require('../Asset/Images/LogoMinal.png')} style={{ width: 40, height: 40, resizeMode: 'cover', borderRadius: 20, marginLeft: 10 }} />
              </View>
            ),
          }}
        />

        <Stack.Screen
          name="UserChatScreen"
          component={UserChatScreen}

          options={{ headerShown: false }}
        />

        {/* <Stack.Screen
          name="PlansBuy"
          component={PlansBuy}
         
          options={{ headerShown: false }}
        /> */}

        <Stack.Screen
          name="AboutProfile"
          component={AboutProfile}

          options={{
            headerShown: true,
            headerTitle: "Milan",

          }}
        />

        <Stack.Screen
          name="PlansBuy"
          component={PlansBuy}

          options={{
            headerShown: true,
            headerTitle: "Milan",
          }}
        />

        <Stack.Screen
          name="PaymentSuccess"
          component={PaymentSuccess}

          options={{
            headerShown: false,
            headerTitle: "Milan",
          }}
        />

        <Stack.Screen
          name="PaymentError"
          component={PaymentError}

          options={{
            headerShown: true,
            headerTitle: "Milan",
          }}
        />

        <Stack.Screen
          name="ProfileScreen"
          component={ProfileScreen}

          options={{
            headerShown: true,
            headerTitle: "Milan",
            // headerRight: () => (
            //   <View style={{ flexDirection: 'row', marginRight: 10, }}>
            //     <Ionicons name="notifications" size={25} color="#0E103D" style={{ marginRight: 10 }} />
            //     <Ionicons name="options" size={25} color="#0E103D" style={{ marginRight: 10 }} />
            //   </View>
            // ),
            headerLeft: () => (
              <View>
                <Image source={require('../Asset/Images/LogoMinal.png')} style={{ width: 40, height: 40, resizeMode: 'cover', borderRadius: 20, marginLeft: 10 }} />
              </View>
            ),
          }}
        />

        <Stack.Screen
          name="Plans"
          component={Plans}

          options={{
            headerShown: true,
            headerTitle: "Milan",
            headerStyle: {
              backgroundColor: '#F6F6F6',
              borderBottomLeftRadius: 20,
              borderBottomRightRadius: 20
            },
            // headerLeft: () => (
            //   <View style={{flexDirection:'row', alignItems:'center'}}>
            //     <TouchableOpacity style={{}}  >
            //       <Ionicons name='arrow-back' size={30} color="black" />
            //     </TouchableOpacity>
            //     <Image source={require('../Asset/Images/LogoMinal.png')} style={{ width: 40, height: 40, resizeMode: 'cover', borderRadius: 20, marginLeft: 10 }} />
            //   </View>
            // ),
          }}
        />

        <Stack.Screen
          name="MainProfile"
          component={MainProfile}
          options={{
          }}
        />

        <Stack.Screen
          name="NotificationScreen"
          component={NotificationScreen}
          options={{
            headerStyle: { backgroundColor: '#f4f4f4' }
          }}
        />

        {/* <Stack.Screen name="Profile" component={HomeScreen} />
        <Stack.Screen name="DrawerNavigator" component={HomeScreen} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainNavigator;