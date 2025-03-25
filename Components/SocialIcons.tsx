import React, {  } from 'react'
import { Image, Linking, StyleSheet, TouchableOpacity, View } from 'react-native'; 
import Icon from 'react-native-vector-icons/Ionicons';
type Vprops = {
    name : string,
    url : string,
    color: string
}

const getIconSource = (name: string) => {
  switch (name) { 
    case 'indeed':
      return require('../Asset/Images/indeed.png');
    case 'yelp':
      return require('../Asset/Images/yelp.png');
    default:
      return null;
  }
};

const SocialIcons = (props:Vprops) => { 
    const styles = StyleSheet.create({
        icon: {
          marginHorizontal: 10,
        },

        imageIcon: {
          width: 30,
          height: 30,
          marginHorizontal: 10,
        },
      });

      const iconSource = getIconSource(props.name);

      return (
        
        <TouchableOpacity onPress={() => Linking.openURL(props.url)}>
        {props.name == 'indeed' || props.name == 'yelp' ? (
          <Image source={iconSource} style={styles.imageIcon} />
        ) : (
          <Icon name={`logo-${props.name}`} size={30} color={props.color} style={styles.icon} />
        )}
      </TouchableOpacity>
        // <View style={{ flexDirection: 'row' }}>
        //   <Icon name="logo-facebook" size={30} color="#3b5998" style={styles.icon} />
        //   <Icon name="logo-twitter" size={30} color="#1da1f2" style={styles.icon} />
        //   <Icon name="logo-instagram" size={30} color="#8a3ab9" style={styles.icon} />
        //   <Icon name="logo-youtube" size={30} color="#ff0000" style={styles.icon} />
        // </View>
      );
 
}

export default SocialIcons