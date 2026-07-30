import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface HeaderProps {
  showBack?: boolean;
  gameTitle?: string;
  charName?: string;
  showControls?: boolean;
}

export default function Header({ showBack = false, gameTitle, charName }: HeaderProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 10) }]}>
      {/* Top row: Back button + Branding logo */}
      <View style={styles.topRow}>
        {showBack && (
          <TouchableOpacity onPress={handleBack} style={styles.backButton} activeOpacity={0.7}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
        )}
        <View style={styles.logoContainer}>
          <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
            <Text style={[styles.logoText, { includeFontPadding: false }]}>FIGHTING </Text>
            <Text style={[styles.logoText, styles.logoHighlight, { includeFontPadding: false, top: 1 }]}>GUIDE</Text>
          </View>
          {(gameTitle || charName) && (
            <Text style={styles.subtitle} numberOfLines={1}>
              {gameTitle}
              {charName ? ` · ${charName}` : ''}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0a0a0f',
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a2e',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
  },
  backButton: {
    paddingRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  backArrow: {
    color: '#e63b2e',
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'System',
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  logoText: {
    fontFamily: 'BlackOpsOne-Regular',
    fontSize: 20,
    color: '#fff',
    letterSpacing: 1.5,
  },
  logoHighlight: {
    color: '#e63b2e',
  },
  subtitle: {
    fontFamily: 'Rajdhani-SemiBold',
    fontSize: 12,
    color: '#666',
    letterSpacing: 0.8,
    marginTop: 1,
    textTransform: 'uppercase',
  },
});
