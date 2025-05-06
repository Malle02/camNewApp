import React, { useState, useEffect, useRef, forwardRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

// Composant Camera personnalisé utilisant forwardRef
const Camera = forwardRef((props, ref) => {
  // Gestion des permissions caméra avec le hook de Expo
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);

  // Demande de permission dès le montage du composant
  useEffect(() => {
    requestPermission();
  }, []);

  // takePictureAsync à partir du ref parent
  React.useImperativeHandle(ref, () => ({
    takePictureAsync: async (options) => {
      if (cameraRef.current) {
        return cameraRef.current.takePictureAsync(options);
      }
      return null;
    }
  }));

  // Affichage pendant le chargement de la permission
  if (permission === null) {
    return <View style={styles.container}><Text>Chargement de la caméra...</Text></View>;
  }

  // Affichage si la permission est refusée
  if (!permission?.granted) {
    return <View style={styles.container}><Text>Pas d'accès à la caméra</Text></View>;
  }

  // Affichage de la caméra si la permission est accordée
  return (
    <View style={[styles.container, props.style]}>
      <CameraView
        style={styles.camera}
        facing={props.type || 'back'} // Type de caméra : 'back' ou 'front'
        flash={props.flash || 'off'} // Flash activé ou non
        ref={cameraRef} // Réf a la caméra
        onCameraReady={props.onCameraReady} // Callback quand la caméra est prête
      />
    </View>
  );
});

// Styles pour la vue caméra
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
    width: '100%',
  }
});

export default Camera;
