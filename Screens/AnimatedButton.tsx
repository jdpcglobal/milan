import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const AnimatedButton = ({ title = 'Press Me', onPress, disabled = false }) => {
  const scaleValue = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (!disabled) {
      Animated.timing(scaleValue, {
        toValue: 0.95, // Slight compression
        duration: 50, // Instant feedback
        useNativeDriver: true,
      }).start();
    }
  };

  const handlePressOut = () => {
    if (!disabled) {
      Animated.timing(scaleValue, {
        toValue: 1, // Instant return to original size
        duration: 80, // Very fast reset
        useNativeDriver: true,
      }).start(() => {
        if (onPress) onPress(); // Trigger the onPress function
      });
    }
  };

  return (
    <TouchableWithoutFeedback
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
    >
      <Animated.View
        style={[
          { transform: [{ scale: scaleValue }] },
          disabled && styles.disabledContainer,
        ]}
      >
        <LinearGradient
          style={[styles.button, disabled && styles.disabledButton]}
          colors={disabled ? ['#f52d70', '#fe765f'] : ['#f52d70', '#fe765f']}
        >
          <Text
            style={[
              styles.buttonText,
              disabled && { color: '#F6F6F6' }, // Gray text for disabled
            ]}
          >
            {title}
          </Text>
        </LinearGradient>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 8,
    paddingHorizontal: 25,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#E5E4E2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 4,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 18,
    fontFamily: 'georgia',
  },
  disabledButton: {
    opacity: 0.5,
  },
  disabledContainer: {
    elevation: 0,
    shadowOpacity: 0,
  },
});

export default AnimatedButton;
