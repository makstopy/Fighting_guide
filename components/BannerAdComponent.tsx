import React, { useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Set to true for testing with test ads. Set to false before final release to Google Play.
const USE_TEST_ADS = true;

const adUnitId = (__DEV__ || USE_TEST_ADS)
  ? TestIds.ADAPTIVE_BANNER
  : 'ca-app-pub-1629168680416513/6532684528';

export default function BannerAdComponent() {
  const [adLoaded, setAdLoaded] = useState(false);
  const insets = useSafeAreaInsets();

  // Don't show ads on web
  if (Platform.OS === 'web') return null;

  return (
    <View style={[
      styles.container,
      { paddingBottom: insets.bottom },
      !adLoaded && styles.hidden
    ]}>
      <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        onAdLoaded={() => {
          console.log('[AdMob] Banner loaded');
          setAdLoaded(true);
        }}
        onAdFailedToLoad={(error) => {
          console.warn('[AdMob] Banner failed to load:', error);
          setAdLoaded(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#0a0a0f',
  },
  hidden: {
    height: 0,
    overflow: 'hidden',
  },
});
