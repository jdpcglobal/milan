import { View, Text, ScrollView, StyleSheet, Dimensions, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const DetailOfPlans = () => {
  const navigation = useNavigation();
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  return (
    <ScrollView>
      <LinearGradient
        colors={['rgba(233,114,236,1)', 'rgba(255,200,110,1)']}
      >
        <Icon onPress={() => navigation.navigate('UserLikesScreen')} name="arrow-back-outline" size={35} color="white" style={{marginTop:10, marginLeft:10, position:'absolute'}} />
        <View style={[styles.container, { height: screenHeight }]}>
          <View>
            <Image style={[styles.image, { width: screenWidth / 1.8, height: screenHeight / 2.2 }]} source={require('../Asset/Images/cartoon-astronaut.png')} />
            {/* <Image style={[styles.cloud, { width: screenWidth / 2.2, height: screenHeight / 6 }]} source={require('../Asset/Images/cloud.png')} /> */}
            <Image style={[styles.cloud, { width: screenWidth / 2.6, height: screenHeight / 6 }]} source={require('../Asset/Images/moon.png')} />
          </View>

          <View>
            <View style={{ marginBottom: 20 }}>
              <Text style={styles.hang}>Hang tight, we're looking for the best possible matches</Text>
              <Text style={styles.meantime}>in the meantime....</Text>
            </View>

            <TouchableOpacity onPress={() => navigation.navigate('UserLikesScreen')} style={styles.touch}>
              <View style={styles.strip}>
                <View style={styles.iconBg}>
                  <Icon name="thumbs-up-outline" size={35} color="rgba(233,118,255,1)" style={{}} />
                </View>
                <Text style={styles.stripText}>See people who liked you!</Text>
                <Icon name="chevron-forward" size={30} color="#989898" style={{ marginLeft: 20 }} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('ChatUsers')} style={styles.touch}>
              <View style={styles.strip}>
                <View style={styles.iconBg}>
                  <Icon name="heart-outline" size={40} color="rgba(233,118,255,1)" style={{}} />
                </View>
                <Text style={styles.stripText}>Chat with your Matches!</Text>
                <Icon name="chevron-forward" size={30} color="#989898" style={{ marginLeft: 20 }} />
              </View>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => navigation.navigate('Plan')} style={styles.touch2}>
            <View style={styles.button}>
              <Text style={[styles.planText,{width:screenWidth/1.2}]}>
                Explore Plans
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </ScrollView>
  )
}
export default DetailOfPlans

const styles = StyleSheet.create({
  container: {
    //backgroundColor: 'rgb(255,159,3)',
    marginVertical: 12,
    borderRadius: 10,
    marginHorizontal: 5
  },
  image: {
    marginLeft: 30
  },
  cloud: {
    position: 'absolute',
    alignSelf: 'flex-end'
  },
  hang: {
    fontSize: 23,
    fontWeight: '700',
    color: 'white',
    textAlign: 'center',
    width: '80%',
    alignSelf: 'center',
    fontFamily: 'georgia'
  },
  meantime: {
    color: 'white',
    textAlign: 'center',
    fontSize: 15,
    fontFamily: 'georgia',
    marginTop: 10
  },
  strip: {
    flexDirection: 'row',
    backgroundColor: '#fadfff',
    height: 70,
    borderRadius: 8,
    borderColor: 'rgba(233,118,255,1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    marginHorizontal: 15,
    alignItems: 'center',
    borderWidth: 1
  },
  stripText: {
    fontSize: 20,
    fontFamily: 'georgia',
    fontWeight: '700',
    color: "rgba(233,118,255,1)"
  },
  iconBg: {
    backgroundColor: 'pink',
    borderRadius: 50,
    height: 60,
    width: 60,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 7,
    borderColor: 'rgba(233,118,255,1)',
    borderWidth: 1
  },

  touch: {
    marginBottom: 15
  },
  button: {
    backgroundColor: '#61b0f8',
    height: 50,
    borderRadius: 25,
    marginHorizontal: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#DCDCDC',
    justifyContent: 'center'
  },

  planText: {
    textAlign: 'center',
    color: '#F5F5F5',
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'georgia',
  },

  touch2: {
    bottom: 50,
    position: 'absolute',
    alignSelf:'center'
  }
})