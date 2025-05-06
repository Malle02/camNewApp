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

// Composant de galerie photo affichant une liste de photo
const GalleryView = ({ 
  photos,             // Tableau des objets photo à afficher
  loading,            // Booléen indiquant si le chargement est en cours
  onPhotoPress,       // Callback lorsqu'on appuie sur une photo
  onPhotoLongPress,   // Callback lors d'un appui long sur une photo
  selectedPhotos,     // Tableau des IDs de photos sélectionnées
  selectionMode,      // Booléen indiquant si la sélection multiple est active
  onRefresh           // Callback pour rafraîchir la galerie
}) => {

  // Affichage du chargement
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Chargement des photos...</Text>
      </View>
    );
  }

  // Affichage lorsque aucune photo n'est disponible
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

  // Affichage de la galerie sous forme de grille 
  return (
    <FlatList
      data={photos} // Données à afficher
      keyExtractor={(item) => item.id} // Clé unique pour chaque élément
      numColumns={3} // Nombre de colonnes dans la grille
      renderItem={({ item }) => (
        <PhotoItem
          photo={item}
          onPress={() => onPhotoPress(item)}
          onLongPress={() => onPhotoLongPress(item)}
          selected={selectedPhotos.includes(item.id)} // Indique si la photo est sélectionnée
          selectionMode={selectionMode} // Active les styles de sélection
        />
      )}
      contentContainerStyle={styles.photosList}
      refreshControl={
        // Permet le pull to refresh
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

// Styles pour l'affichage de la galerie
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
