import AsyncStorage from '@react-native-async-storage/async-storage';

//setItem in AsyncStorage
export async function setItem(key: string, data: any) {
  return await AsyncStorage.setItem(key, data);
}

export const storeData = async (key : string, value:string) => {
  try {
    await AsyncStorage.setItem(key, value);
    return true;
  } catch (e) {
    // saving error
    return false;
  }
};

//getItem from AsyncStorage
export async function getItem(key: string) {
  return await AsyncStorage.getItem(key);
}

//remove all keys
export async function removeItem(key: string) {
  AsyncStorage.removeItem(key);
}

export const PermissionMessages = {
  CAMERA_PERMISSION:
    'Access to the camera has been prohibited please enable it in the Settings app to continue.',
  IMAGE_PROCESSING: 'Uploading, please wait...',
  FILE_ERROR: 'Please select a valid file.',
  GALLERY_PERMISSION:
    'Access to the gallery has been prohibited please enable it in the Settings app to continue.',
  DELETE_CONFIRMATION: 'Are you sure you want to delete this file ?',
};
