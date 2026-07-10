import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { Dimensions, FlatList, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Defs, Ellipse, RadialGradient, Stop } from 'react-native-svg';
import Header from '../components/Header';
import CHAR_DATA from '../data/char_data.json';
import FIGHTERS_DB from '../data/fighters_db.json';
import MK1_PORTRAITS from '../data/mk1_portraits.json';
import SF6_PORTRAITS from '../data/sf6_portraits.json';
import TEKKEN8_PORTRAITS from '../data/tekken8_portaits.json';

import { resolveImageUri } from '../constants/ImageHelper';

import { useSQLiteContext } from 'expo-sqlite';

const mk1Portraits: Record<string, string> = MK1_PORTRAITS;
const sf6Portraits: Record<string, string> = SF6_PORTRAITS;
const tekken8Portraits: Record<string, string> = TEKKEN8_PORTRAITS;
const charData: Record<string, { bg: [string, string]; icon: string; label: string }> = CHAR_DATA as any;

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 52) / 2; // 2 columns grid with padding/margins

const CharacterSkeleton = () => (
  <View style={styles.card}>
    <View style={[StyleSheet.absoluteFill, { backgroundColor: '#1a1a2e', opacity: 0.4 }]} />
    <LinearGradient
      colors={['transparent', 'rgba(0,0,0,0.85)', '#050505']}
      style={styles.gradient}
    />
    <View style={styles.skeletonCharName} />
  </View>
);

export default function CharactersScreen() {
  const router = useRouter();
  const { game } = useLocalSearchParams<{ game: string }>();
  const [isTransitionFinished, setIsTransitionFinished] = useState(Platform.OS === 'web');
  const isWeb = Platform.OS === 'web';

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const db = isWeb ? null : useSQLiteContext();

  const [characters, setCharacters] = useState<string[]>([]);

  useEffect(() => {
    if (Platform.OS === 'web') return;

    let idleId: any;
    let fallbackTimer: any;

    if (typeof requestIdleCallback !== 'undefined') {
      idleId = requestIdleCallback(() => {
        setIsTransitionFinished(true);
      });
    } else {
      fallbackTimer = setTimeout(() => {
        setIsTransitionFinished(true);
      }, 250);
    }

    return () => {
      if (idleId && typeof cancelIdleCallback !== 'undefined') {
        cancelIdleCallback(idleId);
      }
      if (fallbackTimer) {
        clearTimeout(fallbackTimer);
      }
    };
  }, []);

  useEffect(() => {
    if (!game) return;

    if (isWeb) {
      // Web fallback
      const info = (FIGHTERS_DB as any)[game];
      setCharacters(info ? info.characters : []);
    } else if (db) {
      // Native SQLite query
      db.getAllAsync<{ name: string }>(
        `SELECT name FROM characters WHERE game_id = ? ORDER BY name ASC;`,
        [game]
      )
        .then((rows) => {
          setCharacters(rows.map((r) => r.name));
        })
        .catch((err) => {
          console.error('[CharactersScreen] Error loading characters from SQLite:', err);
          // Fallback
          const info = (FIGHTERS_DB as any)[game];
          setCharacters(info ? info.characters : []);
        });
    }
  }, [game, isWeb, db]);

  const handleSelectChar = (char: string) => {
    router.push({
      pathname: '/combos',
      params: { game, char },
    });
  };

  const renderItem = ({ item: char }: { item: string }) => {
    const rawImgUrl = game === "Tekken 8" ? tekken8Portraits[char] : game === "Mortal Kombat 1" ? mk1Portraits[char] : game === "Street Fighter 6" ? sf6Portraits[char] : null;
    const imgUrl = resolveImageUri(rawImgUrl);
    const d = charData[char] || { bg: ["#1a1a2e", "#333"], icon: "🥷", label: char.slice(0, 2).toUpperCase() };
    const [c0, c1] = d.bg;
    const glowColor = c0 !== "#FFFFFF" && c0 !== "#ffffff" && c0 !== "#000000" ? c0 : "#e63b2e";
    const cleanId = char.replace(/[^a-zA-Z0-9]/g, '_');

    if (imgUrl) {
      return (
        <TouchableOpacity
          style={styles.card}
          onPress={() => handleSelectChar(char)}
          activeOpacity={0.8}
        >
          {/* Radial glow behind portrait — works on web/iOS/Android */}
          <Svg
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            width={CARD_WIDTH}
            height={CARD_WIDTH * 1.25}
          >
            <Defs>
              <RadialGradient
                id={`cg_${cleanId}`}
                cx="50%" cy="80%" r="50%"
                fx="50%" fy="80%"
              >
                <Stop offset="0%" stopColor={glowColor} stopOpacity={0.6} />
                <Stop offset="40%" stopColor={glowColor} stopOpacity={0.3} />
                <Stop offset="70%" stopColor={glowColor} stopOpacity={0.1} />
                <Stop offset="100%" stopColor={glowColor} stopOpacity={0} />
              </RadialGradient>
            </Defs>
            <Ellipse
              cx="50%"
              cy="25%"
              rx={CARD_WIDTH * 0.75}
              ry={CARD_WIDTH * 0.75}
              fill={`url(#cg_${cleanId})`}
            />
          </Svg>
          {Platform.OS === 'web' ? (
            <img
              src={imgUrl}
              alt={char}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: game === 'Street Fighter 6' ? 'contain' : 'cover',
                objectPosition: 'top',
              } as React.CSSProperties}
            />
          ) : (
            <Image
              source={{ uri: imgUrl }}
              style={styles.cardImage}
              resizeMode={game === 'Street Fighter 6' ? 'contain' : 'cover'}
            />
          )}
          {/* Smooth dark gradient fade at the bottom where name sits */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.85)', '#050505']}
            style={styles.gradient}
          />
          {/* Full Name at the bottom of the card over gradient */}
          <Text style={styles.charNameText}>{char}</Text>
        </TouchableOpacity>
      );
    }

    // Fallback style for other characters with no portraits
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => handleSelectChar(char)}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={[c0, c1]}
          style={styles.cardFallback}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.charIcon}>{d.icon}</Text>
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.6)']}
            style={styles.gradientHalf}
          />
          <Text style={styles.charNameText}>{char}</Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  const listData = isTransitionFinished ? characters : [1, 2, 3, 4, 5, 6];

  const renderCharacterItem = ({ item }: { item: any }) => {
    if (!isTransitionFinished) {
      return <CharacterSkeleton />;
    }
    return renderItem({ item });
  };

  return (
    <View style={styles.container}>
      <Header showBack gameTitle={game} />
      <FlatList
        data={listData}
        renderItem={renderCharacterItem}
        keyExtractor={(item, index) => (isTransitionFinished ? item : `skeleton_${index}`)}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.scrollContent}
        ListHeaderComponent={<Text style={styles.sectionTitle}>Choose a character</Text>}
        initialNumToRender={6}
        maxToRenderPerBatch={6}
        windowSize={3}
        removeClippedSubviews={Platform.OS === 'android'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0f',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    color: '#666',
    fontSize: 13,
    fontFamily: 'Rajdhani-Bold',
    marginBottom: 16,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 1.25,
    backgroundColor: '#050505',
    borderWidth: 1,
    borderColor: 'rgba(230, 59, 46, 0.13)',
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardFallback: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  charIcon: {
    fontSize: 36,
    marginBottom: 8,
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '55%',
  },
  gradientHalf: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
  },
  charNameText: {
    position: 'absolute',
    bottom: 12,
    left: 8,
    right: 8,
    zIndex: 2,
    fontFamily: 'Rajdhani-Bold',
    fontSize: 13.5,
    color: '#fff',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  skeletonCharName: {
    position: 'absolute',
    bottom: 14,
    left: '20%',
    right: '20%',
    height: 12,
    backgroundColor: '#222',
    borderRadius: 4,
    zIndex: 2,
  },
});
