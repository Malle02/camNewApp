import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Camera } from 'expo-camera';

const CameraView = (props) => {
  const [hasPermission, setHasPermission] = useState(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <View style={styles.container}><Text>Chargement de la caméra...</Text></View>;
  }
  
  if (hasPermission === false) {
    return <View style={styles.container}><Text>Pas d'accès à la caméra</Text></View>;
  }

  return (
    <View style={[styles.container, props.style]}>
      <Text>Caméra</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default CameraView;