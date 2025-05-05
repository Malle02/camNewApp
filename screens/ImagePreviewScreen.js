import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Image, 
  TouchableOpacity, 
  Alert, 
  Share,
  SafeAreaView 
} from 'react-native';
import { useDispatch } from 'react-redux';
import { deletePhotos } from '../redux/photosSlice';
import { Ionicons } from '@expo/vector-icons';

const ImagePreviewScreen = ({ route, navigation }) => {
  const { uri } = route.params;
  const dispatch = useDispatch();
  const [isZoomed, setIsZoomed] = useState(false);

  const handleDelete = () => {
    Alert.alert(
      'Confirmation',
      'Voulez-vous supprimer cette photo ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Supprimer', 
          style: 'destructive',
          onPress: () => {
            const filename = uri.split('/').pop();
            const id = filename.split('.')[0];
            
            dispatch(deletePhotos([id]));
            navigation.goBack();
          }
        },
      ]
    );
  };

  const handleShare = async () => {
    try {
      await Share.share({
        url: uri,
        message: 'Regarde cette photo prise avec mon application !',
      });
    } catch (error) {
      console.error('Erreur lors du partage:', error);
    }
  };

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity 
        style={styles.imageContainer} 
        activeOpacity={0.9}
        onPress={toggleZoom}
      >
        <Image 
          source={{ uri }} 
          style={[
            styles.image, 
            isZoomed && styles.zoomedImage
          ]} 
          resizeMode={isZoomed ? 'contain' : 'cover'}
        />
      </TouchableOpacity>

      {/* Actions du bas */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={handleDelete}>
          <Ionicons name="trash-outline" size={28} color="#e74c3c" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
          <Ionicons name="share-outline" size={28} color="#3498db" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  zoomedImage: {
    width: '100%',
    height: '100%',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  actionButton: {
    padding: 10,
  },
});

export default ImagePreviewScreen;