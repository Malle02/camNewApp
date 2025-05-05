import React from 'react';
import { 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  View, 
  Dimensions 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const itemSize = (width - 12) / 3;

const PhotoItem = ({ photo, onPress, onLongPress, selected, selectionMode }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.7}
      delayLongPress={300}
    >
      <Image 
        source={{ uri: photo.uri }} 
        style={styles.image} 
        resizeMode="cover" 
      />
      
      {selectionMode && (
        <View style={[
          styles.selectionOverlay,
          selected && styles.selectedOverlay
        ]}>
          {selected && (
            <View style={styles.checkCircle}>
              <Ionicons name="checkmark" size={16} color="white" />
            </View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: itemSize,
    height: itemSize,
    margin: 1,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 3,
  },
  selectionOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedOverlay: {
    backgroundColor: 'rgba(52, 152, 219, 0.3)',
  },
  checkCircle: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PhotoItem;