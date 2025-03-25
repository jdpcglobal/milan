import React from 'react'
import { ActivityIndicator, Text, View } from 'react-native'; 
import MediaProfile from '../Components/MediaProfile';

const PageViewScreen = () => {
    return(
     <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
           <View>
            <View key= "1">
                <Text style={{color:'black', fontSize:30,}}>Page 1</Text>
            <MediaProfile/>
            </View>
            <View key= "2">
                <Text style={{color:'black', fontSize:30,}}>Page 2</Text>
            <MediaProfile/>
            </View>  
           </View>
     </View>
    );
}
export default  PageViewScreen;
