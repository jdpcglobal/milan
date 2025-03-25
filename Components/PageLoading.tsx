import React from 'react'
import { ActivityIndicator, View } from 'react-native';

const PageLoading = () => {
    return(
     <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
           <ActivityIndicator size={'large'} color={'red'}/>
     </View>
    );
}
export default PageLoading;
