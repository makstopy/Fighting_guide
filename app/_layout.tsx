import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState, useCallback, useMemo, Suspense } from 'react';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ControlProvider } from '../components/ControlContext';
import { FavoritesProvider } from '../components/FavoritesContext';
import { CustomCombosProvider } from '../components/CustomCombosContext';
import { Platform, StyleSheet, View } from 'react-native';
import { SQLiteProvider, type SQLiteDatabase } from 'expo-sqlite';
import { initializeDatabase, DB_VERSION } from '../services/db';
import { StatusBar } from 'expo-status-bar';
import { NavigationBar } from 'expo-navigation-bar';
import IntroScreen from '../components/IntroScreen';

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
  const [showIntro, setShowIntro] = useState(true);
  const [dbReady, setDbReady] = useState(false);

  const handleDbInit = useCallback(async (db: SQLiteDatabase) => {
    console.log('[Layout] handleDbInit: START');
    try {
      // Quick pre-check: does DB need migration?
      const versionResult = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version;');
      const currentVersion = versionResult?.user_version ?? 0;
      console.log('[Layout] handleDbInit: currentVersion =', currentVersion, 'target =', DB_VERSION);

      if (currentVersion < DB_VERSION) {
        // Intro is already showing, just yield so React can render it before heavy migration begins
        console.log('[Layout] Migration needed');
        await new Promise<void>(resolve => setTimeout(resolve, 80));
      }

      const didInit = await initializeDatabase(db);
      console.log('[Layout] handleDbInit: didInit =', didInit);
    } catch (e) {
      console.error('[Layout] handleDbInit: ERROR', e);
    } finally {
      console.log('[Layout] handleDbInit: DONE, setting dbReady=true');
      setDbReady(true);
    }
  }, []);

  const handleIntroReady = useCallback(() => {
    setShowIntro(false);
  }, []);

  // Memoized so providers don't remount when showIntro/dbReady state changes
  const mainContent = useMemo(() => (
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
  ), []);

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      {Platform.OS === 'android' && (
        <NavigationBar style="light" />
      )}
      {Platform.OS === 'web' ? (
        mainContent
      ) : (
        <View style={styles.root}>
          {/* Main app — inside Suspense/SQLiteProvider */}
          <Suspense fallback={<View style={styles.root} />}>
            <SQLiteProvider databaseName="fighters.db" onInit={handleDbInit}>
              {mainContent}
            </SQLiteProvider>
          </Suspense>
          {/* IntroScreen is OUTSIDE Suspense so it can render DURING migration */}
          {showIntro && (
            <View style={StyleSheet.absoluteFill}>
              <IntroScreen dbReady={dbReady} onReady={handleIntroReady} />
            </View>
          )}
        </View>
      )}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0a0a0f',
  },
});
