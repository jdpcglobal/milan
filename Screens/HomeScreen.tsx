import React from 'react'
import { View,Text } from 'react-native';  
import Card from '../Components/ProfileCard.tsx';
import SwiperCard from '../Components/Swiper.tsx';
import LoginScreen from './LoginScreen.tsx';
 
import LikeUsersCard from '../Components/LikeUsersCard.tsx';
import { LikeUsers } from '../Utils/Types.ts';
import UserLikesScreen from './UserLikesScreen.tsx';
 
const HomeScreen = () => { 
   
   
    return( 
      
        <SwiperCard/> 
     // <UserLikesScreen/>
     //<LikeUsersCard data={data} />
       // <LoginScreen/>
       // <Card data={profileData} />
    );

}

export default HomeScreen;