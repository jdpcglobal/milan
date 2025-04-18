import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, BackHandler } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useFocusEffect } from '@react-navigation/native';
import Icons from 'react-native-vector-icons/Ionicons'
import { TouchableOpacity } from 'react-native-gesture-handler';
interface Props {
  bIndex: number;
  setbIndex: React.Dispatch<React.SetStateAction<number>>;
  children: React.ReactNode;
}

const BottomSheetComponent: React.FC<Props> = (props) => {
  // set initial snap point
  const snapPoints = ['50%', '100%'];
  const bottomSheetRef =  useRef<BottomSheet>(null);
 // const [bIndex,setBIndex] = useState(props.bIndex);
 const handleBackPress =  () => {
    if (props.bIndex !== -1 && bottomSheetRef.current) {
      bottomSheetRef.current.close();
      props.setbIndex(-1);
      return true; // indicate that the back action is handled
    }
    return false; // allow default back button action
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress); 
    return () => backHandler.remove();
  }, [handleBackPress]); 

  return ( 
    <View style={[StyleSheet.absoluteFillObject]}>
      <BottomSheet 
        snapPoints={snapPoints}
        index={props.bIndex}
        ref={bottomSheetRef} 
      >
        <BottomSheetScrollView style={{backgroundColor:'#ffffff', zIndex:100}}>
         <View style={{height:30}}>
          <TouchableOpacity style={styles.touchable} onPress={handleBackPress}>
            <Icons name={'close-circle-outline'} size={30} color={'black'} />
          </TouchableOpacity>
         </View>
            {props.children}
        </BottomSheetScrollView>
      </BottomSheet>
    </View>
  );  
};
 

const styles = StyleSheet.create({
  container: { 
    alignItems: 'center',
    justifyContent: 'center',
  },
  background: {
    backgroundColor: 'black',
  },
  content: {
    fontSize: 18,
    padding: 16,
  },
  touchable:{width:30,height:30, alignSelf:'flex-end',  marginEnd:10,},
});

export default BottomSheetComponent;
