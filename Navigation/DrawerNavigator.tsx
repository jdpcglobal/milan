import React, {useEffect, useState} from "react";  
 import Ionicons from 'react-native-vector-icons/Ionicons';
import { Image, Text, View } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from "../Screens/HomeScreen";
import ProfileImagesCard from "../Components/ProfileImagesCard";
import MediaProfile from "../Components/MediaProfile";
import NewDrawer1 from "../Components/BottomSheet";
import Drawer2 from "../Components/UserProfileSettings";
 

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
 
    return (   
         <Drawer.Navigator>
            <Drawer.Screen name="Feeds" component={Drawer2} />
          
            {/* <Drawer.Screen name="Article" component={MediaProfile} /> */}
         </Drawer.Navigator> 
    );
};

export default DrawerNavigator