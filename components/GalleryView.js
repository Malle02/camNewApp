import React from 'react';
import { 
  StyleSheet, 
  View, 
  FlatList, 
  Text, 
  ActivityIndicator, 
  RefreshControl 
} from 'react-native';
import PhotoItem from './PhotoItem';

const GalleryView = ({ 
  photos, 
  loading, 
  onPhotoPress, 
  onPhotoLongPress, 
  selectedPhotos, 
  selectionMode,
  onRefresh 
}) => {
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Chargement des photos...</Text>
      </View>
    );
  }

  if (photos.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>Aucune photo</Text>
        <Text style={styles.emptySubText}>
          Prenez une photo ou importez-en depuis votre galerie
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={photos}
      keyExtractor={(item) => item.id}
      numColumns={3}
      renderItem={({ item }) => (
        <PhotoItem
          photo={item}
          onPress={() => onPhotoPress(item)}
          onLongPress={() => onPhotoLongPress(item)}
          selected={selectedPhotos.includes(item.id)}
          selectionMode={selectionMode}
        />
      )}
      contentContainerStyle={styles.photosList}
      refreshControl={
        <RefreshControl
          refreshing={loading}
          onRefresh={onRefresh}
          colors={['#3498db']}
          tintColor="#3498db"
        />
      }
    />
  );
};

const styles = StyleSheet.create({
  photosList: {
    padding: 2,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#7f8c8d',
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#7f8c8d',
  },
  emptySubText: {
    fontSize: 14,
    color: '#95a5a6',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default GalleryView;