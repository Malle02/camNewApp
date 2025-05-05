import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import CameraView from '../components/CameraView';

const CameraScreen = ({ navigation }) => {
  const [type, setType] = useState('back');
  const [flash, setFlash] = useState('off');
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden />
      <CameraView style={styles.camera} />
      
      <View style={styles.controlsContainer}>
        <View style={styles.controls}>
          <TouchableOpacity style={styles.button} onPress={toggleFlash}>
            <Ionicons 
              name={flash === 'on' ? 'flash' : flash === 'auto' ? 'flash-outline' : 'flash-off'} 
              size={24} 
              color="white" 
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.captureButton}>
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
});

export default CameraScreen;