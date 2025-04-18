import React, { useEffect, useState } from 'react'
import { Dimensions, Image, ImageBackground, ScrollView, StyleSheet, Text, View } from 'react-native'
import { useSelector } from 'react-redux';
import { LoginState, UserProfile } from '../Utils/Types';
import Ionicons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons2 from 'react-native-vector-icons/FontAwesome';

const AboutProfile = ({ route }) => {
  const { UserData } = route.params;
  const [profileData, setProfileData] = useState({});
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const token = useSelector((state: LoginState) => state.logins.auth_token);

  const AboutPicWidth = screenWidth / 1.07;
  const AboutPicHeight = screenHeight / 1.5;

  useEffect(() => {
    AboutProfile();
  }, [])

  const AboutProfile = async () => {
    const payload = {
      user_id: UserData,
      token: token
    };
    // console.log('AboutProfile::::::::::::', payload);
    try {
      const response = await fetch(
        'https://themilan.org/api/usersProfileView', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error('Create Order Error')
      }
      const data = await response.json()
      //console.log('AboutProfile ::::::::::::', data)
      if (data.isSuccess == true) {
        setProfileData(data.user);
      }
    } catch (error) {
      console.error('Create UserData Error Last')
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        {/* <View style={styles.userBk}>
          <Image
            source={require('../Asset/Images/userImage.jpg')}
            style={styles.userImage}
          ></Image>
        </View> */}

        <View >
          {/* <Image
            source={{ uri: profileData.images }}
            style={{ width: AboutPicWidth, height: AboutPicHeight, marginTop: 20, borderRadius: 10, }}
          ></Image> */}

          {profileData.images === 110 && profileData.gender === 0 || profileData.gender === 2 ? (
            <Image  style={{ width: AboutPicWidth, height: AboutPicHeight, marginTop: 20, borderRadius: 10, }} source={require('../Asset/Images/avatar-boy.png')} />
          ) : profileData.images === 110 && profileData.gender === 1 ? (
            <Image  style={{ width: AboutPicWidth, height: AboutPicHeight, marginTop: 20, borderRadius: 10, }} source={require('../Asset/Images/avatar-girl.png')} />
          ) : (
            <Image
            source={{ uri: profileData.images }}
            style={{ width: AboutPicWidth, height: AboutPicHeight, marginTop: 20, borderRadius: 10, }}
          ></Image>
          )}
        </View>

        <View style={{ marginTop: 15, backgroundColor: 'white', paddingHorizontal: 12, paddingTop: 15, borderRadius: 5, marginBottom: 20, paddingBottom: 5, flexDirection: 'row', flexWrap: 'wrap' }}>

          <Text style={{ textAlign: 'center', color: '#6C6662', fontSize: 25, fontWeight: '700', marginBottom: 10, width: '100%', fontFamily: 'georgia', }}>
            {profileData.name}
          </Text>

          {/* {profileData.name ? (
            <View style={styles.AboutData}>
              <Text style={styles.AboutText}>Name: {profileData.name}</Text>
            </View>
          ) : null} */}

          {profileData.age ? (
            <View style={styles.AboutData}>
              <Text style={styles.AboutText}><Ionicons name="cake" size={27} color="#5A5552" style={{}} />: {profileData.age}</Text>
            </View>
          ) : null}

          {profileData.mobile ? (
            <View style={styles.AboutData}>
              <Text style={styles.AboutText}>mobile: {profileData.mobile}</Text>
            </View>
          ) : null}

          {profileData.height ? (
            <View style={styles.AboutData}>
              <Text style={styles.AboutText}><Ionicons name="human-male-height-variant" size={27} color="#5A5552" style={{}} />: {profileData.height}</Text>
            </View>
          ) : null}

          {/* {profileData.living !== 'null' && profileData.living ?  (
            <View style={styles.AboutData}>
              <Text style={styles.AboutText}>Address: {profileData.living == '' ? 'Did not mention yet' : profileData.living}</Text>
            </View>
          ) : null} */}

          {/* {profileData.religion ? (
            <View style={styles.AboutData}>
              <Text style={styles.AboutText}>Religion: {profileData.religion}</Text>
            </View>
          ) : null} */}

          {profileData.gender ? (
            <View style={styles.AboutData}>
              <Text style={styles.AboutText}><Ionicons name="account" size={27} color="#5A5552" style={{}} />: {profileData.gender == '1' ? 'Female' : 'Male'}</Text>
            </View>
          ) : null}

          {profileData.distanceaway ? (
            <View style={styles.AboutData}>
              <Text style={styles.AboutText}><Ionicons2 name="map-marker" size={27} color="#5A5552" style={{}} />: {profileData.distanceaway}</Text>
            </View>
          ) : null}

          {profileData.education ? (
            <View style={styles.AboutData}>
              <Text style={styles.AboutText}><Ionicons2 name="graduation-cap" size={27} color="#5A5552" style={{}} />: {profileData.education == '1' ? "Bachelor Degree" : profileData.education == '2' ? "At uni" : profileData.education == '3' ? "High School" : profileData.education == '4' ? 'PHD' : profileData.education == '5' ? 'On Graduate programme' : profileData.education == '6' ? 'Master Degree' : profileData.education == '7' ? 'Trade school' : `Didn't Mention`}</Text>
            </View>
          ) : null}

          {profileData.sexualOrientation ? (
            <View style={styles.AboutData}>
              <Text style={styles.AboutText}><Image source={require('../Asset/Images/orientation2.png')} style={{ height: 25, width: 25 }} /> {profileData.sexualOrientation == '1' ? "Straight" : profileData.sexualOrientation == '2' ? "Gay" : profileData.sexualOrientation == '3' ? "Lesbian" : profileData.sexualOrientation == '4' ? 'Bisexual' : profileData.sexualOrientation == '5' ? 'Asexual' : profileData.sexualOrientation == '6' ? 'Demisexual' : profileData.sexualOrientation == '7' ? 'Queer' : profileData.sexualOrientation == '8' ? 'Bicurious' : profileData.sexualOrientation == '9' ? 'Aromantic' : `Didn't Mention`}</Text>
            </View>
          ) : null}

          {profileData.relationshipGoals !== '0' && profileData.relationshipGoals ? (
            <View style={styles.AboutData}>
              <Text style={styles.AboutText}><Ionicons2 name="eye" size={27} color="#5A5552" style={{}} />: {profileData.relationshipGoals == '1' ? "Long-term Partner" : profileData.relationshipGoals == '2' ? "long-term but short-term" : profileData.relationshipGoals == '3' ? "Short-term but long-term ok" : profileData.relationshipGoals == '4' ? 'Short-term fun' : profileData.relationshipGoals == '5' ? 'New friends' : profileData.relationshipGoals == "6" ? 'Still figuring out' : `Didn't Mention`}</Text>
            </View>
          ) : null}

        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    paddingHorizontal: 15
  },
  contentContainer: {
    padding: 16,
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
  userImage: {
    height: 700,
    width: 420,
    borderRadius: 10
  },

  userBk: {
    marginTop: 15,
    backgroundColor: '#F6F6F6',
  },

  AboutData: {
    backgroundColor: 'white',
    paddingVertical: 7,
    borderRadius: 5,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 2,
    paddingHorizontal: 8,
    marginHorizontal: 5
  },

  AboutText: {
    color: '#5A5552',
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'georgia',
  },
})

export default AboutProfile