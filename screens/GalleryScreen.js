import React, { useState, useCallback, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  TouchableOpacity, 
  Text, 
  Alert,
  SafeAreaView
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { deletePhotos, addPhoto, loadPhotos } from '../redux/photosSlice';
import GalleryView from '../components/GalleryView';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const GalleryScreen = ({ navigation }) => {
  const photos = useSelector(state => state.photos.items);
  const isLoading = useSelector(state => state.photos.isLoading);
  const dispatch = useDispatch();
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [selectionMode, setSelectionMode] = useState(false);

  useEffect(() => {
    dispatch(loadPhotos());
  }, [dispatch]);

  useFocusEffect(
    useCallback(() => {
      setSelectedPhotos([]);
      setSelectionMode(false);
    }, [])
  );

  const handlePhotoPress = (photo) => {
    if (selectionMode) {
      togglePhotoSelection(photo.id);
    } else {
      navigation.navigate('ImagePreview', { uri: photo.uri });
    }
  };

  const handlePhotoLongPress = (photo) => {
    if (!selectionMode) {
      setSelectionMode(true);
      setSelectedPhotos([photo.id]);
    }
  };

  const togglePhotoSelection = (photoId) => {
    setSelectedPhotos(prevSelected => {
      if (prevSelected.includes(photoId)) {
        const newSelected = prevSelected.filter(id => id !== photoId);
        if (newSelected.length === 0) {
          setSelectionMode(false);
        }
        return newSelected;
      } else {
        return [...prevSelected, photoId];
      }
    });
  };

  const deleteSelectedPhotos = () => {
    Alert.alert(
      'Confirmation',
      `Voulez-vous supprimer ${selectedPhotos.length} photo(s) ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Supprimer', 
          style: 'destructive',
          onPress: () => {
            dispatch(deletePhotos(selectedPhotos));
            setSelectedPhotos([]);
            setSelectionMode(false);
          }
        },
      ]
    );
  };

  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const newPhotos = result.assets.map(asset => ({
        uri: asset.uri,
        id: Date.now() + '-' + Math.random().toString(36).substring(2, 9),
        createdAt: new Date().toISOString(),
      }));
      
      dispatch(addPhoto(newPhotos));
    }
  };

  const cancelSelection = () => {
    setSelectionMode(false);
    setSelectedPhotos([]);
  };

  const handleRefresh = () => {
    dispatch(loadPhotos());
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {selectionMode ? `${selectedPhotos.length} sélectionné(s)` : 'Ma Galerie'}
        </Text>
        
        <View style={styles.headerButtons}>
          {selectionMode ? (
            <>
              <TouchableOpacity style={styles.headerButton} onPress={cancelSelection}>
                <Ionicons name="close-circle-outline" size={24} color="#3498db" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerButton} onPress={deleteSelectedPhotos}>
                <Ionicons name="trash-outline" size={24} color="#e74c3c" />
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity style={styles.headerButton} onPress={pickImages}>
              <Ionicons name="add-circle-outline" size={24} color="#3498db" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <GalleryView
        photos={photos}
        loading={isLoading}
        onPhotoPress={handlePhotoPress}
        onPhotoLongPress={handlePhotoLongPress}
        selectedPhotos={selectedPhotos}
        selectionMode={selectionMode}
        onRefresh={handleRefresh}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerButtons: {
    flexDirection: 'row',
  },
  headerButton: {
    marginLeft: 15,
  }
});

export default GalleryScreen;