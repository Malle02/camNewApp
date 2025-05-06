import React, { useState, useRef, useCallback } from 'react';
import { StyleSheet, View, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import CameraView from '../components/CameraView';
import { addPhoto } from '../redux/photosSlice';
import { addLocationToPhoto } from '../utils/permissions';

const CameraScreen = ({ navigation }) => {
  // État pour le type de caméra : 'back' ou 'front'
  const [type, setType] = useState('back');
  // État pour le flash : 'off', 'on', 'auto'
  const [flash, setFlash] = useState('off');
  // État indiquant si la caméra est prête
  const [cameraReady, setCameraReady] = useState(false);

  // Référence au composant CameraView pour appeler takePictureAsync
  const cameraRef = useRef(null);

  // Hook Redux pour dispatcher des actions
  const dispatch = useDispatch();

  // Permet de basculer entre la caméra avant et arrière
  const toggleCameraType = () => {
    setType(current => (current === 'back' ? 'front' : 'back'));
  };

  // Permet de changer le mode du flash de manière cyclique
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

  // Callback appelé lorsque la caméra est prête à l'utilisation
  const onCameraReady = useCallback(() => {
    setCameraReady(true);
  }, []);

  // Fonction pour capturer une photo
  const takePicture = async () => {
    // Vérifie que la caméra est prête et que la référence est définie
    if (!cameraReady || !cameraRef.current) return;

    try {
      // Capture de la photo avec des options
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
        skipProcessing: false
      });

      // Ajout des métadonnées de localisation à la photo
      const photoWithLocation = await addLocationToPhoto({
        uri: photo.uri,
        id: Date.now() + '-' + Math.random().toString(36).substring(2, 9),
        createdAt: new Date().toISOString(),
      });

      // Envoi de la photo au store Redux
      dispatch(addPhoto(photoWithLocation));

    } catch (error) {
      console.error('Erreur lors de la prise de photo:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden />
      
      {/* Composant caméra */}
      <CameraView 
        style={styles.camera}
        type={type}
        flash={flash}
        ref={cameraRef}
        onCameraReady={onCameraReady}
      />

      {/* Interface de contrôle */}
      <View style={styles.controlsContainer}>
        <View style={styles.controls}>
          {/* Bouton pour changer le mode flash */}
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

          {/* Bouton de capture */}
          <TouchableOpacity 
            style={[styles.captureButton, !cameraReady && styles.disabledButton]} 
            onPress={takePicture}
            disabled={!cameraReady}
          >
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>

          {/* Bouton pour inverser la caméra */}
          <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
            <Ionicons name="camera-reverse-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

// Styles pour l'écran de la caméra
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
