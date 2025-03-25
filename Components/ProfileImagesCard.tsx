// Import the libraries
import React, { useState } from 'react';
import { View, Image, ActivityIndicator, StyleSheet, TouchableOpacity, Alert, Platform, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { LoginState } from '../Utils/Types';
import { useSelector } from 'react-redux';
import { Snackbar } from 'react-native-paper';
type Images = {
  uri: string | null,
  id: number | null,
};
// Define the profile images card component
const ProfileImagesCard = (props: Images) => {
  // Initialize the state with an empty image 
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(props.uri);
  const [url, setUrl] = useState('');
  const [imgid, setImgId] = useState(props.id);
  type MediaType = 'photo' | 'video' | 'mixed';
  const type: MediaType = 'photo'
  const token = useSelector((state: LoginState) => state.logins.auth_token);

  // Fetch profiles from API and update state

  const deleteImage = async () => {
    console.log("hii" + image);

    const image_id = imgid;
    //  console.log(image_id);
    try {
      const response = await axios.post('https://themilan.org/api/editUserImages', { token, image_id });
      if (response.data.isSuccess) {
        setImage(null);

      }
      // handle response
      console.log(response)
    } catch (error) {
      // handle error 
      console.log(error)
    }

  }


  const handleCameraLaunch = () => {
    const options = {
      mediaType: type,
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchCamera(options, response => {
      console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.errorCode) {
        console.log('Camera Error: ', response.errorMessage);
      } else {
        // Process the captured image
        let imageUri = response.assets?.[0]?.uri;
        // setSelectedImage(imageUri);
        console.warn(imageUri);
      }
    });
  }

  // Define a function to render the block
  const handleImageUpload = () => {
    console.warn('hii');
    const options = {
      mediaType: type,
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };
    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        console.log('Image picker error: ', response.errorMessage);
      } else {
        let imageUri = response.assets?.[0]?.uri;
        console.warn(imageUri);
        let imageAsset = response.assets?.[0];
        if (imageAsset) {
          console.log(imageAsset);
          //  UploadImage(imageAsset);
          addUserImages(imageAsset)
        } else {
          console.warn('No image selected');
        }

      }
    });

  }

  const addUserImages = async (imageFile: any) => {
    const apiUrl = `https://themilan.org/api/addUserImages`;
    const formData = new FormData();
    formData.append('token', token);
    formData.append('image', {
      name: imageFile.fileName,
      type: imageFile.type,
      uri: Platform.OS === 'ios' ? imageFile.uri.replace('file://', '') : imageFile.uri,
    });
    //formData.append('image', imageFile);

    // console.log(formData);
    try {
      // const datas = {
      //   token: token,
      //   image: imageFile, // Assuming imageFile is the image you want to send
      // };
      // const config = {
      //   headers: {
      //     'Content-Type': 'multipart/form-data',
      //   },
      // };
      // console.log(formData)
      // const response = await axios.post(apiUrl, formData,config);
      // console.log(response);
      // const data = response.data;
      // console.log(data);
      // return data;
      const config = {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      };

      const response = await fetch(apiUrl, config);
      const data = await response.json();
      if (data.isSuccess) {
        setImage(data.image_path);
        console.log('addUserImages ======', data)
        console.log('', image);
      } else {
        console.log("hii==========");
      }

    }
    catch (error: any) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error response from server:', error.response.data);
        console.error('Status code:', error.response.status);
        console.error('Headers:', error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error setting up the request:', error.message);
      }
      throw error;
    }
  };

  const UploadImage = async (imageFile: any) => {
    const formData = new FormData();
    formData.append('key', 'KYhpThsnejTYmofkOndfmkQnci0');
    formData.append('img', imageFile);
    console.log(formData);
    try {
      const response = await fetch(
        'https://jdpcglobal.com/cdn/api/uploadReceipts', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,

      });
      if (!response.ok) {
        throw new Error("ImageUpload Error Api");
      }
      const data = await response.json();
      console.log(data);
      setUrl(imageFile.uri);
      addUserImages(imageFile);
      // console.log('ImageUpload api  === ', data.url);
    } catch (error) {
      console.error('ImageUpload Api error Last ', error);
    }
  }
  const loadImage = () => {
    setLoading(false);
  }
  // Return the profile images card component as a view with a rounded border
  return (
    <View style={styles.container}>
      {loading ? <ActivityIndicator /> : <>
        <View style={styles.imageView}>

          {image !== null ?
            <Image
              source={{ uri: image }}
              style={styles.image}
              onLoad={loadImage}
              onError={(error) => console.error('Error loading image:', error)}
            />
            :
            <Image
              source={{
                uri: 'https://t4.ftcdn.net/jpg/02/61/49/05/360_F_261490536_nJ5LSRAVZA0CK9Nvt2E1fXJVUfpiqvhT.jpg',
              }}
              style={[styles.image]}
              onLoad={() => console.log('Default image loaded successfully')}
              onError={(error) => console.error('Error loading default image:', error)}
            />
          }
        </View>
        <View style={{}}>
          {image !== null ?
            <TouchableOpacity style={styles.editButton2} onPress={deleteImage}>
              <Icon name={'close-outline'} size={20} color={'white'} />
            </TouchableOpacity>
            :
            <TouchableOpacity style={styles.editButton} onPress={handleImageUpload}>
              <Icon name={'add'} size={20} color={'white'} />
            </TouchableOpacity>
          }
        </View></>}
    </View>
  );
};

// Define the styles for the profile images card component
const styles = StyleSheet.create({
  container: {
    width: '27%',
    height: 135,
    margin: 10
  },
  imageView: {
    flex: 1,
  },

  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 30,
  },
  editButton: {
    position: 'absolute',
    right: -10,
    bottom: -10,
    borderRadius: 20,
    backgroundColor: '#bc55fa',
    elevation: 10,
    padding: 10
  },
  editButton2: {
    position: 'absolute',
    right: -10,
    bottom: -10,
    borderRadius: 20,
    backgroundColor: 'red',
    elevation: 10,
    padding: 6
  }

});

// Export the profile images card component
export default ProfileImagesCard;
