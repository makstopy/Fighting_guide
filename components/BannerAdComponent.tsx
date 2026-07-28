import React, { useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

// Use test ID in dev, real ad unit ID in production
const adUnitId = __DEV__
  ? TestIds.ADAPTIVE_BANNER
  : 'ca-app-pub-1629168680416513/6532684528';

export default function BannerAdComponent() {
  const [adLoaded, setAdLoaded] = useState(false);

  // Don't show ads on web
  if (Platform.OS === 'web') return null;

  return (
    <View style={[styles.container, !adLoaded && styles.hidden]}>
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
