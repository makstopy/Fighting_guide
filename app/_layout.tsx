import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ControlProvider } from '../components/ControlContext';
import { FavoritesProvider } from '../components/FavoritesContext';
import { CustomCombosProvider } from '../components/CustomCombosContext';
import { View } from 'react-native';

import {
  Rajdhani_400Regular,
  Rajdhani_600SemiBold,
  Rajdhani_700Bold
} from '@expo-google-fonts/rajdhani';
import { BlackOpsOne_400Regular } from '@expo-google-fonts/black-ops-one';
import { ShareTechMono_400Regular } from '@expo-google-fonts/share-tech-mono';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    'Rajdhani-Regular': Rajdhani_400Regular,
    'Rajdhani-SemiBold': Rajdhani_600SemiBold,
    'Rajdhani-Bold': Rajdhani_700Bold,
    'BlackOpsOne-Regular': BlackOpsOne_400Regular,
    'ShareTechMono-Regular': ShareTechMono_400Regular,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <SafeAreaProvider>
      <FavoritesProvider>
        <CustomCombosProvider>
          <ControlProvider>
            <View style={{ flex: 1, backgroundColor: '#0a0a0f' }}>
              <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#0a0a0f' } }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="characters" />
                <Stack.Screen name="combos" />
              </Stack>
            </View>
          </ControlProvider>
        </CustomCombosProvider>
      </FavoritesProvider>
    </SafeAreaProvider>
  );
}
