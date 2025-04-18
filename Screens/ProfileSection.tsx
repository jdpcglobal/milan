import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const ProfileSection = () => {
  const [otp, setOtp] = useState(['', '', '', '']); // Only 4 inputs
  
  const handleOtpChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Automatically move to the next input if a digit is entered
    if (text && index < otp.length - 1) {
      const nextInput = `otpInput${index + 1}`;
      this[nextInput]?.focus();
    }
  };

  const handleKeyPress = (event, index) => {
    if (event.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      const previousInput = `otpInput${index - 1}`;
      this[previousInput]?.focus();
      const newOtp = [...otp];
      newOtp[index - 1] = ''; // Clear the previous input
      setOtp(newOtp);
    }
  };

  return (
    <View style={styles.container}>
      {/* Gradient Header */}
      <LinearGradient
        colors={["#e96443", "#904e95"]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}>
        <Text style={styles.headerText}>Verification</Text>
      </LinearGradient>

      {/* Account Verification Text */}
      <View style={styles.verificationContainer}>
        <Text style={styles.title}>Account Verification</Text>
        <Text style={styles.subtitle}>Enter the code that we have sent to</Text>
        <Text style={styles.phoneNumber}>+62 81234567890</Text>
      </View>

      {/* OTP Input Fields */}
      <View style={styles.otpContainer}>
        {otp.map((value, index) => (
          <TextInput
            key={index}
            style={styles.otpInput}
            maxLength={1}
            keyboardType="number-pad"
            value={value}
            onChangeText={(text) => handleOtpChange(text, index)}
            onKeyPress={(event) => handleKeyPress(event, index)}
            ref={(input) => (this[`otpInput${index}`] = input)}
          />
        ))}
      </View>

      {/* Resend OTP */}
      <TouchableOpacity>
        <Text style={styles.resendText}>Re-send OTP</Text>
      </TouchableOpacity>

      {/* Verify Button */}
      <TouchableOpacity style={styles.verifyButton}>
        <Text style={styles.verifyButtonText}>Verify</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    paddingTop: 50,
  },
  header: {
    width: '90%',
    height: 120,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  headerText: {
    fontSize: 28,
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'Recursive',
  },
  verificationContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#777',
  },
  phoneNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 5,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  otpInput: {
    width: 50,
    height: 50,
    marginHorizontal: 5,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    elevation: 3,
  },
  resendText: {
    fontSize: 14,
    color: '#d6336c',
    textDecorationLine: 'underline',
    marginBottom: 20,
  },
  verifyButton: {
    width: '90%',
    height: 50,
    backgroundColor: '#d6336c',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  verifyButtonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ProfileSection;
