import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { TextInput } from "react-native-paper"; // Import TextInput from React Native Paper

type Props = {
  options: string[];
  userSelected: string[] | null;
  isSearch: boolean;
  onOptionSelect: (option: string) => void;
};

const CreateOptions: React.FC<Props> = ({ options, userSelected=['ram'], isSearch, onOptionSelect }) => {
   
 const onOptionPress = (option:string) => {
    
 }

  return ( 
    <View style={styles.container}>
      {/* {isSearch && (
        <TextInput
          label="Search"
          mode="outlined"
          style={styles.searchInput}
          onChangeText={(text) => {
            // Handle search input changes here
            // You can filter options based on user input
            // and update the displayed options accordingly
          }}
        />
      )} */}
      <View style={styles.optionsContainer}> 
        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.selectTouchable,
              { backgroundColor: userSelected !== null && userSelected.includes(option) ? "tomato" : "transparent" },
            ]}
            onPress={() => onOptionSelect(option)}
          >
            <Text  style={[
               styles.touchableText,
              {color: userSelected !== null && userSelected.includes(option) ? "white" : "black" },
            ]}>{option}</Text>
             
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 10,
  },
  searchInput: {
    marginBottom: 10,
  },
  optionsContainer: {
    flexDirection: "row", // Set flex direction to row
    flexWrap: "wrap", // Allow options to wrap
    alignItems:'center',
    justifyContent:'center'
  },
  selectTouchable: {
    padding: 10,
    margin: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "gray",
  },
  touchableText: {
     
  },
});

export default CreateOptions;
