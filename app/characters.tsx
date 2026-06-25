import React from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Header from '../components/Header';
import FIGHTERS_DB from '../data/fighters_db.json';
import MK1_PORTRAITS from '../data/mk1_portraits.json';
import SF6_PORTRAITS from '../data/sf6_portraits.json';
import TEKKEN8_PORTRAITS from '../data/tekken8_portaits.json';
import CHAR_DATA from '../data/char_data.json';

import { resolveImageUri } from '../constants/ImageHelper';

const mk1Portraits: Record<string, string> = MK1_PORTRAITS;
const sf6Portraits: Record<string, string> = SF6_PORTRAITS;
const tekken8Portraits: Record<string, string> = TEKKEN8_PORTRAITS;
const charData: Record<string, { bg: [string, string]; icon: string; label: string }> = CHAR_DATA as any;

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 52) / 2; // 2 columns grid with padding/margins

export default function CharactersScreen() {
  const router = useRouter();
  const { game } = useLocalSearchParams<{ game: string }>();

  const info = (FIGHTERS_DB as any)[game];
  const characters: string[] = info ? info.characters : [];

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

    if (imgUrl) {
      return (
        <TouchableOpacity
          style={styles.card}
          onPress={() => handleSelectChar(char)}
          activeOpacity={0.8}
        >
          <Image
            source={{ uri: imgUrl }}
            style={styles.cardImage}
            resizeMode="cover"
          />
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

  return (
    <View style={styles.container}>
      <Header showBack gameTitle={game} />
      <FlatList
        data={characters}
        renderItem={renderItem}
        keyExtractor={(item) => item}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.scrollContent}
        ListHeaderComponent={<Text style={styles.sectionTitle}>Выбери персонажа</Text>}
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
});
