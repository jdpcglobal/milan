import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, CommonActions, NavigationProp } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { LoginState, RootStackParamList } from "../Utils/Types";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useState } from "react";
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from "react-native-linear-gradient";
const Logout = () => {
  type OTPScreenNavigationProp = NavigationProp<RootStackParamList, 'LoginPage'>;
  const dispatch = useDispatch();
  const navigation = useNavigation<OTPScreenNavigationProp>();
  const [modalVisible, setModalVisible] = useState(false);
  const token = useSelector((state: LoginState) => state.logins.auth_token);
  const toggleModal2 = () => {
    setModalVisible(!modalVisible);
  };
  const LogoutAction = () => {
    AsyncStorage.removeItem("Token");
    // console.log("hii");
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          { name: 'LoginPage' },
        ],
      })
    );

  }

  const DeleteAccountApi = async () => {
    const payload = {
      token: token,
    };
    // console.log('DeleteAccountApi Payload ====', payload);
    try {
      const response = await fetch(
        'https://themilan.org/api/deleteAccount', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error('Create DeleteAccountApi api error');
      }
      const data = await response.json();
      // console.log('DeleteAccountApi api =======', data.isSuccess);
      if (data.isSuccess === true) {
        LogoutAction();
      }
    } catch (error) {
      console.error('DeleteAccountApi Error Last');
    }
  }
  return (
    <View>
      <View style={styles.container}>
        <Text style={styles.confirmationText}>Are you sure you want to logout?</Text>
        <TouchableOpacity onPress={LogoutAction}>
          <LinearGradient style={styles.button}
            colors={['#f52d70', '#fe765f']}
          >
            <Text style={styles.buttonText}>Logout</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={toggleModal2} >
        <LinearGradient style={[{ width: 170, marginTop: 60, borderRadius: 5, paddingVertical: 7 }, styles.delete]}
          colors={['#f52d70', '#fe765f']}
        >
          <Text style={{ textAlign: 'center', color: '#F6F6F6', fontSize: 20, fontWeight: '700', fontFamily: 'georgia', }}>Delete Account</Text>
        </LinearGradient>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Icon onPress={toggleModal2} name="close-circle" size={45} color="red" style={{ marginRight: 10, position: 'absolute', right: -25, top: -15 }} />
            <Text style={{ fontSize: 20, fontWeight: '700', color: '#5A5552', textAlign: 'center', fontFamily: 'georgia', }}>Are you sure you want to Delete your Account</Text>

            <View style={{ flexDirection: 'row', marginTop: 50, width: 200, justifyContent: 'space-between' }}>
              <TouchableOpacity onPress={toggleModal2}>
                <LinearGradient style={styles.button}
                  colors={['#f52d70', '#fe765f']}
                >
                  <Text style={styles.buttonText}>No</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity onPress={DeleteAccountApi}>
                <LinearGradient style={styles.button}
                  colors={['#f52d70', '#fe765f']}
                >
                  <Text style={styles.buttonText}>Yes</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmationText: {
    marginTop: 50,
    fontSize: 21,
    marginBottom: 20,
    textAlign: 'center',
    color: '#5A5552',
    fontWeight: '800',
    fontFamily: 'georgia',
  },
  button: {
    paddingVertical: 7,
    paddingHorizontal: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#D6D4D2',
    borderStyle: 'solid',
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.25,
    // shadowRadius: 4,
    // elevation: 3,
  },
  buttonText: {
    color: '#F6F6F6',
    fontSize: 20,
    fontWeight: '800',
    fontFamily: 'georgia',
  },
  modalView: {
    margin: 20,
    backgroundColor: '#F6F6F6',
    borderRadius: 5,
    padding: 35,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    height: 300,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    
  },

  delete: {
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.25,
    // shadowRadius: 4,
    // elevation: 3,
    marginBottom: 10,
  }
});
export default Logout;