import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, BackHandler } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useFocusEffect } from '@react-navigation/native';
import BottomSheetComponent from './BottomSheet';
import { TouchableOpacity } from 'react-native-gesture-handler';

const Drawer2 = (props:any) => {
  // set initial snap point
   const [bIndex,setbIndex] = useState(1);
   const [customComponent, setCustomComponent] = useState<React.ReactNode | null>(null);
   const CustomComponent1 = () => (
    <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
      <Text>This is custom component 1</Text>
    </View>
  );
  const [data, setData] = useState(['ram', 'shayam', 'rekha', 'suresh','ganesh']);
  
  const CustomComponent2 = () => (
    <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
      <Text>This is custom component 2</Text>
    </View>
  );
  const CallApi = () => { 
    // Function to handle option selection
    // const handleOptionSelect = (option : string) => {
    //   // Here you can perform any action, such as calling an API
    //   console.log('Option selected:', option);
    // };
    const newComponent = createOptions(data);
    setCustomComponent(newComponent);
    // Function to create selectable components from the data
     setbIndex(1);
  };

   const handleOptionSelect = (option : string) => {
      // Here you can perform any action, such as calling an API
      console.warn('Option selected:', option);
    };

  const createOptions = (data:any) => {
   return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
     {
     data.map((option:any, index:number) => (
      <TouchableOpacity
        key={index}
        onPress={() => handleOptionSelect(option)}
        style={{ marginVertical: 5, padding: 10, backgroundColor: 'lightgray', borderRadius: 5 }}
      >
        <Text>{option}</Text>
      </TouchableOpacity>
    ))
    }
    </View>
     };

  useEffect(() => {
    // Initially set the custom component
    setCustomComponent( <CustomComponent2 /> );
  }, []);

  // Function to toggle between custom components
  const toggleCustomComponent = () => {
    setCustomComponent( <CustomComponent1 /> );
  };

  return (  <View style={{flex:1}}>
    <View>
        <TouchableOpacity onPress={ () => { 
            setbIndex(0)}} style={{margin:10, backgroundColor:'black', width:50}}><Text>OpenModal</Text></TouchableOpacity>
    <View> 
        <TouchableOpacity
          onPress={() => {
             CallApi();
          }}
          style={{ margin: 10, backgroundColor: 'blue', width: 150, padding: 10, borderRadius: 5 }}
        >
          <Text style={{ color: 'white', textAlign: 'center' }}>Toggle Custom Component</Text>
        </TouchableOpacity>
      </View>
    </View>
      <BottomSheetComponent bIndex={bIndex} setbIndex={setbIndex} >
      <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1,}}>
          {customComponent}
      </View>
      </BottomSheetComponent> 
    </View>
  );
 
};
export default Drawer2; 
 
