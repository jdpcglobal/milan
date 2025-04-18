import React, { useState, useEffect, useRef } from "react";
import { TextInput, View, Animated, TouchableOpacity, Platform } from "react-native";
import  Ionicons  from "react-native-vector-icons/Ionicons"; // Icons for Clear & Eye button

const CustomTextInput = ({ label, value, onChangeText, secureTextEntry = false }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [text, setText] = useState(value || "");
  const [showPassword, setShowPassword] = useState(false);

  const animatedLabel = useRef(new Animated.Value(text ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animatedLabel, {
      toValue: isFocused || text ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused, text]);

  const labelPosition = animatedLabel.interpolate({
    inputRange: [0, 1],
    outputRange: [12, -8], // Moves label up when focused
  });

  const labelFontSize = animatedLabel.interpolate({
    inputRange: [0, 1],
    outputRange: [16, 12], // Reduces font size when focused
  });

  return (
    <View style={{ marginBottom: 0 }}>
      <View
        style={{
          position: "relative",
          borderWidth: .5,
          borderColor: isFocused ? "#007AFF" : "#989898",
          borderRadius: 7,
          paddingHorizontal: 12,
          backgroundColor: "#fff",
          height: 50,
          justifyContent: "center",
          elevation: isFocused ? 6 : 6, // Shadow for Android
          shadowColor: isFocused ? '#007AFF' : "#000", // Shadow for iOS
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.5,
          shadowRadius: 4,
        }}
      >
        {/* Floating Label */}
        <Animated.Text
          style={{
            position: "absolute",
            left: 14,
            top: labelPosition,
            fontSize: labelFontSize,
            color: isFocused ? "#007AFF" : "#525252",
            backgroundColor: "#fff",
            paddingHorizontal: 4,
          }}
        >
          {label}
        </Animated.Text>

        {/* Text Input */}
        <TextInput
          style={{
            flex: 1,
            fontSize: 16,
            color: "#333",
            paddingTop: text || isFocused ? 15 : 0, // Prevents overlap
          }}
          placeholder={isFocused ? label : ""} // Show placeholder only when focused
          placeholderTextColor="#999"
          value={text}
          onChangeText={(text) => {
            setText(text);
            onChangeText && onChangeText(text);
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={secureTextEntry && !showPassword}
        />

        {/* Clear Text Button */}
        {text.length > 0 && !secureTextEntry && (
          <TouchableOpacity
            onPress={() => setText("")}
            style={{ position: "absolute", right: 40, top: 14 }}
          >
            <Ionicons name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        )}

        {/* Show/Hide Password Button */}
        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={{ position: "absolute", right: 10, top: 14 }}
          >
            <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default CustomTextInput;
