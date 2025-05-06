import React, { useState, useRef, useCallback } from 'react';
import { StyleSheet, View, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import CameraView from '../components/CameraView';
import { addPhoto } from '../redux/photosSlice';
import { addLocationToPhoto } from '../utils/permissions';

const CameraScreen = ({ navigation }) => {
  const [type, setType] = useState('back');
  const [flash, setFlash] = useState('off');
  const [cameraReady, setCameraReady] = useState(false);
  const cameraRef = useRef(null);
  const dispatch = useDispatch();

  const toggleCameraType = () => {
    setType(current => (current === 'back' ? 'front' : 'back'));
  };

  const toggleFlash = () => {
    setFlash(current => {
      switch (current) {
        case 'off': return 'on';
        case 'on': return 'auto';
        case 'auto': return 'off';
        default: return 'off';
      }
    });
  };

  const onCameraReady = useCallback(() => {
    setCameraReady(true);
  }, []);

  const takePicture = async () => {
    if (!cameraReady || !cameraRef.current) return;
    
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
        skipProcessing: false
      });
      
      const photoWithLocation = await addLocationToPhoto({
        uri: photo.uri,
        id: Date.now() + '-' + Math.random().toString(36).substring(2, 9),
        createdAt: new Date().toISOString(),
      });
      
     
      dispatch(addPhoto(photoWithLocation));
      
    
    } catch (error) {
      console.error('Erreur lors de la prise de photo:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden />
      <CameraView 
        style={styles.camera}
        type={type}
        flash={flash}
        ref={cameraRef}
        onCameraReady={onCameraReady}
      />
      
      <View style={styles.controlsContainer}>
        <View style={styles.controls}>
          <TouchableOpacity style={styles.button} onPress={toggleFlash}>
            <Ionicons 
              name={
                flash === 'on' 
                  ? 'flash' 
                  : flash === 'auto' 
                    ? 'flash-outline' 
                    : 'flash-off'
              } 
              size={24} 
              color="white" 
            />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.captureButton, !cameraReady && styles.disabledButton]} 
            onPress={takePicture}
            disabled={!cameraReady}
          >
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
            <Ionicons name="camera-reverse-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 20,
  },
  button: {
    padding: 15,
    borderRadius: 30,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  captureButton: {
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 40,
    height: 80,
    width: 80,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 65,
    height: 65,
    borderRadius: 35,
    backgroundColor: 'white',
  },
  disabledButton: {
    opacity: 0.5,
  }
});

export default CameraScreen;