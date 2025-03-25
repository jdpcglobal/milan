import react, { useEffect, useState } from 'react'
import { View, ScrollView, Text } from 'react-native';
import ProfileImagesCard from './ProfileImagesCard';
import { useSelector } from 'react-redux';
import { LoginState, userImage } from '../Utils/Types';
import axios from 'axios';

const MediaProfile = () => {
  const [imageData, setImageDate] = useState<userImage[]>([]);
  const token = useSelector((state: LoginState) => state.logins.auth_token);

  const fetchImages = async () => {
    try {
      const response = await axios.post('https://themilan.org/api/getUserImages', { token });
      if (response.data.isSuccess) {
          setImageDate(response.data.userImages);
        //console.log("fetch images =======", response.data.userImages)

      } else {
        // console.log('hii0009');

      }
    } catch (error) {

    }
  };

  useEffect(() => {
    fetchImages()
  }, []);

  const rData: userImage[] = [
    {
      id: 1,
      url: 'https://beingselfish.in/wp-content/uploads/2023/07/cute-girl-dp181.jpg',
    },
  ];

  const renderComponents = () => {
    let displayData = imageData.length > 9 ? imageData.slice(0, 9) : [...imageData];

    while (displayData.length < 9) {
      displayData.push({ id: null, url: null });
    }

    return displayData.map((item, index) => (
      <ProfileImagesCard key={item.id || `null-${index}`} id={item.id} uri={item.url} />
    ));
  };





  return (
    <View style={{ flex: 1, }}>
      <Text style={{ fontSize: 20, color: 'black', fontWeight: 'bold', margin: 10, marginStart: 20 }}>Media</Text>
      <View style={{
        flex: 1, flexDirection: 'row',
        flexWrap: 'wrap', elevation: 10, marginBottom: 20,
      }}>
        {renderComponents()}
      </View>
    </View>

  );

}

export default MediaProfile;