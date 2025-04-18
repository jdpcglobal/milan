import React, { useEffect, useState } from 'react';
import { View, Image, ActivityIndicator, StyleSheet, TouchableOpacity, Alert, Platform, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { LoginState } from '../Utils/Types';
import { useSelector } from 'react-redux';
import LoaderKit from 'react-native-loader-kit';
import { Snackbar } from 'react-native-paper';
import AWS from 'aws-sdk';

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
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);

  const s3 = new AWS.S3({
    accessKeyId: 'AKIA6ASUEPGOFCUR63R3',
    secretAccessKey: '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',
    region: 'ap-south-1',
  });

  useEffect(() => {
    setImgId(props.id);
    setImage(props.uri);
  }, [props.id, props.uri]);

  const deleteImage = async () => {
    if (!imgid) {
      // console.log('Image ID is null or undefined. Cannot delete image.');
      return;
    }
    try {
      setIsLoading2(true);
      const response = await axios.post('https://themilan.org/api/editUserImages', { token, image_id: imgid });
      if (response.data.isSuccess) {
        // Clear the image and its ID
        setImage(null);
        setImgId(null);
        console.log('Image deleted successfully');
      } else {
        console.error('Failed to delete image:', response.data.message);
      }
    } catch (error) {
      console.error('Error deleting image:', error);
    } finally {
      setIsLoading2(false);
    }
  };


  const handleImageUpload = () => {
    // console.warn('hii');
    const options = {
      mediaType: type,
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };
    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        // console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        // console.log('Image picker error: ', response.errorMessage);
      } else {
        let imageUri = response.assets?.[0]?.uri;
        console.warn(imageUri);
        let imageAsset = response.assets?.[0];

        if (imageAsset) {
          uploadToS3(imageAsset);
        } else {
          console.warn('No image selected');
        }

      }
    });
  }

  const loadImage = () => {
    setLoading(false);
  }

  const uploadToS3 = async (imageFile) => {
    const file = {
      uri: imageFile.uri,
      name: imageFile.fileName || `image_${Date.now()}.jpg`,
      type: imageFile.type || 'image/jpeg',
    };
    const fileUri = Platform.OS === 'ios' ? file.uri.replace('file://', '') : file.uri;
    const response = await fetch(fileUri);
    const blob = await response.blob()
    
    const s3Params = {
      Bucket: 'milan-app',
      Key: file.name,
      Body: blob,
      ContentType: file.type,
    };
    try {
      setIsLoading(true);
      const upload = await s3.upload(s3Params).promise();
      console.log('Upload Success:', upload.Location);
      const addUserImages = async () => {
        const apiUrl = `https://themilan.org/api/addUserImages`;
        const formData = new FormData();
        formData.append('token', token);
        formData.append('image', upload.Location);
        //  console.log('>>>>>>>>>>>>>>>>>>>>', formData);
        try {
          setIsLoading(true);
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
            setImgId(data.image_id);
            console.log('Image uploaded successfully:', data);
          } else {
            console.error('Upload failed:', data.message);
          }
        } catch (error: any) {
          console.error('Error uploading image:', error.message);
        } finally {
          setIsLoading(false);
        }
      };
      addUserImages();
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? <ActivityIndicator /> : <>
        <View style={styles.imageView}>
          {image !== null ?
            <View style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 5,
            }}>
              <Image
                source={{ uri: image }}
                style={styles.image}
                onLoad={loadImage}
                onError={(error) => console.error('Error loading image:', error)}
              />
            </View>
            :
            <View style={[styles.image]}>
            </View>
          }
        </View>
        <View style={{}}>
          {image !== null ? (
            <TouchableOpacity style={styles.editButton2} onPress={deleteImage}>
              {isLoading2 ? (
                <LoaderKit
                  style={{ width: 30, height: 30 }}
                  name={'BallClipRotateMultiple'}
                  color={'#4A4744'}
                />
              ) : (
                <Icon name={'close-outline'} size={20} color={'#5A5552'} />
              )}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.editButton} onPress={handleImageUpload}>
              {isLoading ? (
                <LoaderKit
                  style={{ width: 30, height: 30 }}
                  name={'BallClipRotateMultiple'}
                  color={'#4A4744'}
                />
              ) : (
                <Icon name={'add'} size={20} color={'#5A5552'} />
              )}
            </TouchableOpacity>
          )}
        </View>
      </>}
    </View>
  );
};
export default ProfileImagesCard;

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
    borderRadius: 10,
    backgroundColor: '#F6F6F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 5
  },
  editButton: {
    position: 'absolute',
    right: -10,
    bottom: -10,
    borderRadius: 20,
    backgroundColor: 'white',
    elevation: 4,
    padding: 10
  },
  editButton2: {
    position: 'absolute',
    right: -10,
    bottom: -10,
    borderRadius: 20,
    backgroundColor: '#E5E4E2',
    elevation: 5,
    padding: 6
  }

});

// Export the profile images card component

