import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@photo_app_photos';

const initialState = {
  items: [],
  isLoading: false,
  error: null,
};

const savePhotos = async (photos) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(photos));
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des photos:', error);
  }
};

const photosSlice = createSlice({
  name: 'photos',
  initialState,
  reducers: {
    addPhoto: (state, action) => {
     
      const newPhotos = Array.isArray(action.payload) 
        ? action.payload 
        : [action.payload];
        
      state.items = [...newPhotos, ...state.items];
      
      savePhotos(state.items);
    },
    
    deletePhotos: (state, action) => {
      const idsToDelete = action.payload;
      state.items = state.items.filter(photo => !idsToDelete.includes(photo.id));
      
      savePhotos(state.items);
    },
    
    loadPhotosStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loadPhotosSuccess: (state, action) => {
      state.items = action.payload;
      state.isLoading = false;
    },
    loadPhotosFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const { 
  addPhoto, 
  deletePhotos,
  loadPhotosStart,
  loadPhotosSuccess,
  loadPhotosFailure,
} = photosSlice.actions;

export default photosSlice.reducer;

export const loadPhotos = () => async (dispatch) => {
  dispatch(loadPhotosStart());
  try {
    const storedPhotos = await AsyncStorage.getItem(STORAGE_KEY);
    const photos = storedPhotos ? JSON.parse(storedPhotos) : [];
    dispatch(loadPhotosSuccess(photos));
  } catch (error) {
    dispatch(loadPhotosFailure(error.message));
  }
}