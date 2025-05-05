import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import CameraScreen from './screens/CameraScreen';
import GalleryScreen from './screens/GalleryScreen';
import ImagePreviewScreen from './screens/ImagePreviewScreen';
import { checkPermissions } from './utils/permissions';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Caméra') {
            iconName = focused ? 'camera' : 'camera-outline';
          } else if (route.name === 'Galerie') {
            iconName = focused ? 'images' : 'images-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#3498db',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Caméra" component={CameraScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Galerie" component={GalleryScreen} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [permissionsGranted, setPermissionsGranted] = useState(false);

  useEffect(() => {
    const setupPermissions = async () => {
      const granted = await checkPermissions();
      setPermissionsGranted(granted);
    };
    
    setupPermissions();
  }, []);

  if (!permissionsGranted) {
    return null; 
  }

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen 
            name="Main" 
            component={MainTabs} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="ImagePreview" 
            component={ImagePreviewScreen} 
            options={{ title: 'Aperçu' }} 
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}