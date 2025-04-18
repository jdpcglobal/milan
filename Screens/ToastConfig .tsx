import React from 'react';
import { BaseToast, ErrorToast } from 'react-native-toast-message';

const ToastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: 'green',
        paddingVertical: 10,
        zIndex: 9999,
        elevation: 10,
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
      }}
      text2Style={{
        fontSize: 16,
        color: 'green',
        fontFamily:'georgia',
         fontWeight:'600'
      }}
    />
  ),

  error: (props) => (
    <ErrorToast
      {...props}
      style={{
        borderLeftColor: 'red',
        backgroundColor: 'white',
        paddingVertical: 10,
      }}
      text1Style={{
        fontSize: 18,
        fontWeight: 'bold',
        color: 'red',
      }}
      text2Style={{
        fontSize: 16,
        color: 'black',
        fontFamily:'georgia',
        fontWeight:'600'
      }}
    />
  ),

  info: (props) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: 'rgb(255, 235, 59)',
        backgroundColor: '#fff',
        paddingVertical: 10,
      }}
      text1Style={{
        fontSize: 18,
        fontWeight: 'bold',
        color: 'rgb(255, 230, 0)',
      }}
      text2Style={{
        fontSize: 16,
        color: 'black',
        fontFamily:'georgia',
        fontWeight:'600'
      }}
    />
  ),
};

export default ToastConfig;
