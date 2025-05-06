import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Clé de stockage pour sauvegarder les photos dans AsyncStorage
const STORAGE_KEY = '@photo_app_photos';

// État initial du slice
const initialState = {
  items: [],        // Tableau des photos
  isLoading: false, // Indique si un chargement est en cours
  error: null,      // Contiendra les erreurs potentielles
};

// Fonction pour sauvegarder les photos localement dans AsyncStorage
const savePhotos = async (photos) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(photos));
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des photos:', error);
  }
};

// Création du slice Redux pour gérer les photos
const photosSlice = createSlice({
  name: 'photos',
  initialState,
  reducers: {
    // Ajout d'une ou plusieurs nouvelles photos
    addPhoto: (state, action) => {
      const newPhotos = Array.isArray(action.payload) 
        ? action.payload 
        : [action.payload]; // S'assure que le payload est toujours un tableau

      // Ajoute les nouvelles photos en début de liste
      state.items = [...newPhotos, ...state.items];

      // Sauvegarde dans AsyncStorage
      savePhotos(state.items);
    },
    
    // Suppression de photos par leurs identifiants
    deletePhotos: (state, action) => {
      const idsToDelete = action.payload;
      state.items = state.items.filter(photo => !idsToDelete.includes(photo.id));

      // Sauvegarde la liste mise à jour
      savePhotos(state.items);
    },

    // Début du chargement des photos
    loadPhotosStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },

    // Chargement des photos réussi
    loadPhotosSuccess: (state, action) => {
      state.items = action.payload;
      state.isLoading = false;
    },

    // Échec du chargement des photos
    loadPhotosFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

// Exportation des actions
export const { 
  addPhoto, 
  deletePhotos,
  loadPhotosStart,
  loadPhotosSuccess,
  loadPhotosFailure,
} = photosSlice.actions;

// Exportation du reducer à utiliser dans le store Redux
export default photosSlice.reducer;

// Methode asynchrone pour charger les photos depuis AsyncStorage au démarrage de l'app
export const loadPhotos = () => async (dispatch) => {
  dispatch(loadPhotosStart());
  try {
    const storedPhotos = await AsyncStorage.getItem(STORAGE_KEY);
    const photos = storedPhotos ? JSON.parse(storedPhotos) : [];
    dispatch(loadPhotosSuccess(photos));
  } catch (error) {
    dispatch(loadPhotosFailure(error.message));
  }
};
