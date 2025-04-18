import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Alert, Image, Text, View } from "react-native";
import HomeScreen from "../Screens/HomeScreen";
import ProfileScreen from "../Screens/ProfileScreen";
import UserLikesScreen from "../Screens/UserLikesScreen";
import ChatUsers from "../Screens/ChatUsers";
import MainProfile from "../Screens/MainProfile";
import messaging from '@react-native-firebase/messaging';
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation, CommonActions, NavigationProp, useFocusEffect } from '@react-navigation/native';
type ScreenNavigationProp = NavigationProp<RootStackParamList, 'NotificationScreen'>;
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSelector } from "react-redux";
import { LoginState } from "../Utils/Types";


const Tab = createBottomTabNavigator();
const TabNavigator = () => {

  const [showStar, setShowStar] = useState(false);
  const [showStar1, setShowStar1] = useState(false);
  const [showStar2, setShowStar2] = useState(false);
  const [showStar4, setShowStar4] = useState(false);
  const [isTabFocused, setIsTabFocused] = useState(false);
  const [isTabFocused2, setIsTabFocused2] = useState(false);
  const [isTabFocused3, setIsTabFocused3] = useState(false);
  const navigation = useNavigation<ScreenNavigationProp>();
  const token = useSelector((state: LoginState) => state.logins.auth_token);


  const Verify = async () => {
    const payload = {
      token: token,
    };
    //console.log('Verify Payload ====', payload);
    try {
      const response = await fetch(
        'https://themilan.org/api/verifyToken', {
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
      //console.log('Verify api =======', data.isSuccess);
      if (data.isSuccess === true) {
        LogoutAction();
        // console.log('Verify api =======');
      }
    } catch (error) {
      console.error('Verify Error Last');
    }
  }

  //*********Logout Action *********//
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
  //*********Logout Action *********//

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      const Body = remoteMessage.notification.title;
      //console.log('Message handled in the background!', remoteMessage);
      if (Body === 'Message' && !isTabFocused3) {
        setShowStar(true);
      }
      if (Body === 'Match' && !isTabFocused) {
        setShowStar1(true);
      }
      if (Body === 'Like' && !isTabFocused2) {
        setShowStar2(true);
      }
      if (Body === 'notification') {
        setShowStar4(true);
      }
    });
    return unsubscribe;
  }, [isTabFocused, isTabFocused2,]);

  messaging().setBackgroundMessageHandler(async remoteMessage => {
    const Body = remoteMessage.notification.title;
    if (Body === 'notification' || Body === 'Like' || Body === 'Match') {
      setShowStar4(true);
    };
  });

  const HandleClick = () => {
    setShowStar4(false);
    // navigation.navigate('Plans');
    navigation.navigate('NotificationScreen');
  };

  const HandleClick2 = () => {
    setShowStar4(false);
    navigation.navigate('Plans');
    // navigation.navigate('NotificationScreen');
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: {
          height: 60,
          position: 'absolute',
          bottom: 0,
          right: 0,
          left: 0,
          borderRadius: 0,
          padding: 10,
          elevation: 10,
          backgroundColor: '#F6F6F6',
          // borderTopLeftRadius:40,
          // borderTopRightRadius:40,
          // marginHorizontal:5
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string = "";

          // if(route.name === 'Chat'){
          //   iconName = focused ? handleClick() : null;
          // }

          if (route.name === 'Home') {
            iconName = focused
              ? "home"
              : "home-outline";
          } else if (route.name === 'Chat') {
            iconName = focused ? "chatbubbles" : 'chatbubbles-outline';
          } else if (route.name === 'Search') {
            iconName = focused ? "search-circle" : "search-circle";
          } else if (route.name === 'Likes') {
            iconName = focused ? "heart" : "heart-outline";
          } else if (route.name === 'Profile') {
            iconName = focused ? "person" : "person-outline";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#f42871',
        tabBarInactiveTintColor: '#fd755e',
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: true,
          headerTitle: "",
          headerTitleStyle: { color: '#5A5552', marginLeft: -12, },
          headerStyle: { shadowColor: '#000',shadowOffset: { width: 0, height: 2 },shadowOpacity: 0.3,shadowRadius: 3,elevation: 5,},
          headerRight: () => (
            <View style={{ flexDirection: 'row', marginRight: 10, }}>

              <TouchableOpacity onPress={HandleClick} style={{ marginRight: 10 }}>
                <Ionicons name="notifications-outline" size={30} color="#4A4744" />
                {showStar4 &&
                  <Text style={{ color: 'red', position: 'absolute', top: -10, right: -2, fontSize: 13, fontWeight: '700', }}>🔴</Text>
                }
              </TouchableOpacity>

              <TouchableOpacity onPress={HandleClick2}>
                <Ionicons name="information-circle-outline" size={30} color="#4A4744" />
              </TouchableOpacity>
            </View> 
          ),
          headerLeft: () => (
            <View>
              <Image source={require('../Asset/Images/jpg.png')} style={{ width: 110, height: 40, resizeMode: 'cover',  marginLeft: 5 }} />
            </View>
          ),
          tabBarLabel: ({ focused }) => (
            <View>
              <Text style={{ fontSize: focused ? 15 : 13, fontWeight: focused ? '800' : '600', color: focused ? '#f42871' : '#fd755e', fontFamily: 'georgia' }}>Home</Text>
              {showStar1 &&
                <Text style={{ color: 'red', position: 'absolute', top: -38, right: -2, fontSize: 12, fontWeight: '700', }}>🔴</Text>
              }
            </View>
          ),
        }}

        listeners={{
          focus: () => { setIsTabFocused(true), Verify() },
          blur: () => setIsTabFocused(false),
          tabPress: () => setShowStar1(false),

        }}
      />
      <Tab.Screen
        name="Likes"
        component={UserLikesScreen}
        options={{
          headerTitle: "",
          headerStyle: { shadowColor: '#000',shadowOffset: { width: 0, height: 2 },shadowOpacity: 0.3,shadowRadius: 3,elevation: 5,},
          headerShown: true,
          headerRight: () => (
            <View style={{ flexDirection: 'row', marginRight: 10, }}>

              <TouchableOpacity onPress={HandleClick} style={{ marginRight: 10 }}>
                <Ionicons name="notifications-outline" size={30} color="#4A4744" />
                {showStar4 &&
                  <Text style={{ color: 'red', position: 'absolute', top: -10, right: -2, fontSize: 13, fontWeight: '700', }}>🔴</Text>
                }
              </TouchableOpacity>

              <TouchableOpacity onPress={HandleClick2}>
                <Ionicons name="information-circle-outline" size={30} color="#4A4744" />
              </TouchableOpacity>
            </View>
          ),
          headerLeft: () => (
            <View>
              <Image source={require('../Asset/Images/jpg.png')} style={{ width: 110, height: 40, resizeMode: 'cover',  marginLeft: 5 }} />
            </View>
          ),
          tabBarLabel: ({ focused }) => (
            <View>
              <Text style={{ fontSize: focused ? 15 : 13, fontWeight: focused ? '800' : '600', color: focused ? '#f42871' : '#fd755e', fontFamily: 'georgia' }}>Likes</Text>
              {showStar2 &&
                <Text style={{ color: 'red', position: 'absolute', top: -38, right: -8, fontSize: 12, fontWeight: '700', }}>🔴</Text>
              }
            </View>
          ),
        }}
        listeners={{
          focus: () => { setIsTabFocused2(true), Verify() },
          blur: () => setIsTabFocused2(false),
          tabPress: () => setShowStar2(false),
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatUsers}
        options={{
          headerTitle: "",
          headerShown: true,
          headerStyle: { shadowColor: '#000',shadowOffset: { width: 0, height: 2 },shadowOpacity: 0.3,shadowRadius: 3,elevation: 3,},
          headerRight: () => (
            <View style={{ flexDirection: 'row', marginRight: 10, }}>

              <TouchableOpacity onPress={HandleClick} style={{ marginRight: 10 }}>
                <Ionicons name="notifications-outline" size={30} color="#4A4744" />
                {showStar4 &&
                  <Text style={{ color: 'red', position: 'absolute', top: -10, right: -2, fontSize: 13, fontWeight: '700', }}>🔴</Text>
                }
              </TouchableOpacity>

              <TouchableOpacity onPress={HandleClick2}>
                <Ionicons name="information-circle-outline" size={30} color="#4A4744" />
              </TouchableOpacity>
            </View>
          ),
          headerLeft: () => (
            <View>
              <Image source={require('../Asset/Images/jpg.png')} style={{ width: 110, height: 40, resizeMode: 'cover',  marginLeft: 5 }} />
            </View>
          ),
          tabBarLabel: ({ focused }) => (
            <View >
              <Text style={{ fontSize: focused ? 15 : 13, fontWeight: focused ? '800' : '600', color: focused ? '#f42871' : '#fd755e', fontFamily: 'georgia' }}>Chat</Text>
              {showStar &&
                <Text style={{ color: 'red', position: 'absolute', top: -38, right: -8, fontSize: 12, fontWeight: '700', }}>🔴</Text>
              }
            </View>
          ),
        }}
        listeners={{
          focus: () => { setIsTabFocused3(true), Verify() },
          blur: () => setIsTabFocused3(false),
          tabPress: () => setShowStar(false),
        }}
      />
      <Tab.Screen
        name="Profile"
        //component={ProfileScreen}
        component={MainProfile}
        options={{
          headerTitle: "",
          headerStyle: { shadowColor: '#000',shadowOffset: { width: 0, height: 2 },shadowOpacity: 0.3,shadowRadius: 3,elevation: 5,},
          headerShown: true,
          headerRight: () => (
            <View style={{ flexDirection: 'row', marginRight: 10, }}>

              <TouchableOpacity onPress={HandleClick} style={{ marginRight: 10 }}>
                <Ionicons name="notifications-outline" size={30} color="#4A4744" />
                {showStar4 &&
                  <Text style={{ color: 'red', position: 'absolute', top: -10, right: -2, fontSize: 13, fontWeight: '700', }}>🔴</Text>
                }
              </TouchableOpacity>

              <TouchableOpacity onPress={HandleClick2}>
                <Ionicons name="information-circle-outline" size={30} color="#4A4744" />
              </TouchableOpacity>
            </View>
          ),
          headerLeft: () => (
            <View>
              <Image source={require('../Asset/Images/jpg.png')} style={{ width: 110, height: 40, resizeMode: 'cover',  marginLeft: 5 }} />
            </View>
          ),
          tabBarLabel: ({ focused }) => (
            <Text style={{ fontSize: focused ? 15 : 13, fontWeight: focused ? '800' : '600', color: focused ? '#f42871' : '#fd755e', fontFamily: 'georgia' }}>Profile</Text>
          ),
        }}
        listeners={{
          focus: () => Verify(),

        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
