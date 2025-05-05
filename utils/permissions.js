import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Platform, Alert } from 'react-native';

export const checkPermissions = async () => {
  let permissionsGranted = true;
  
  const cameraPermission = await Camera.requestCameraPermissionsAsync();
  if (cameraPermission.status !== 'granted') {
    Alert.alert(
      'Permission requise',
      'L\'accès à la caméra est nécessaire pour prendre des photos.',
      [{ text: 'OK' }]
    );
    permissionsGranted = false;
  }
  
  if (Platform.OS !== 'web') {
    const galleryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (galleryPermission.status !== 'granted') {
      Alert.alert(
        'Permission requise',
        'L\'accès à la galerie est nécessaire pour afficher vos photos.',
        [{ text: 'OK' }]
      );
      permissionsGranted = false;
    }
  }
  
  const locationPermission = await Location.requestForegroundPermissionsAsync();
  if (locationPermission.status !== 'granted') {
    Alert.alert(
      'Permission requise',
      'L\'accès à la localisation est utile pour géolocaliser vos photos.',
      [{ text: 'OK' }]
    );
  }

  return permissionsGranted;
};

export const addLocationToPhoto = async (photo) => {
  try {
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Highest,
    });
    
    return {
      ...photo,
      location: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy,
      },
    };
  } catch (error) {
    console.log('Erreur lors de la récupération de la localisation:', error);
    return photo;
  }
};

export const getDeviceInfo = async () => {
  try {
    const deviceInfo = {
      platform: Platform.OS,
      version: Platform.Version,
    };
    
    return deviceInfo;
  } catch (error) {
    console.log('Erreur lors de la récupération des informations de l\'appareil:', error);
    return null;
  }
};