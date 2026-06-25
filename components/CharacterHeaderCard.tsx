import React from 'react';
import { StyleSheet, View, Text, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import CHAR_DATA from '../data/char_data.json';
import TEKKEN8_CHAR_DETAILS from '../data/tekken_char_details.json';
import MK1_PORTRAITS from '../data/mk1_portraits.json';
import SF6_PORTRAITS from '../data/sf6_portraits.json';
import TEKKEN8_PORTRAITS from '../data/tekken8_portaits.json';

import { resolveImageUri } from '../constants/ImageHelper';

const mk1Portraits: Record<string, string> = MK1_PORTRAITS;
const sf6Portraits: Record<string, string> = SF6_PORTRAITS;
const tekken8Portraits: Record<string, string> = TEKKEN8_PORTRAITS;
const charData: Record<string, { bg: [string, string]; icon: string; label: string }> = CHAR_DATA as any;
const tekkenDetails: Record<string, { title: string; country: string; style: string; bio: string }> = TEKKEN8_CHAR_DETAILS as any;

const { width } = Dimensions.get('window');

interface CharacterHeaderCardProps {
  game: string;
  char: string;
}

export default function CharacterHeaderCard({ game, char }: CharacterHeaderCardProps) {
  const rawImgUrl = game === "Tekken 8" ? tekken8Portraits[char] : game === "Mortal Kombat 1" ? mk1Portraits[char] : game === "Street Fighter 6" ? sf6Portraits[char] : null;
  const imgUrl = resolveImageUri(rawImgUrl);
  const d = charData[char] || { bg: ["#1a1a2e", "#333"], icon: "🥷", label: "" };
  const [c0] = d.bg;

  if (!imgUrl) return null;

  const details = (game === "Tekken 8" && tekkenDetails[char]) || {
    title: "Legendary Fighter",
    country: "Unknown",
    style: "Unknown",
    bio: `Meet ${char}, a powerful warrior in the world of ${game}. Master their combos and dominate the arena!`
  };

  const accentColor = c0 !== "#FFFFFF" && c0 !== "#ffffff" && c0 !== "#000000" ? c0 : "#e63b2e";

  return (
    <View style={styles.container}>
      {/* Background radial soft light glow based on character's signature color */}
      <View style={[styles.glow, { backgroundColor: `${accentColor}33` }]} />

      {/* Large character render image with no border/sticker background */}
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: imgUrl }}
          style={[
            styles.charImage,
            game === "Street Fighter 6" ? styles.containImage : styles.coverImage
          ]}
          resizeMode={game === "Street Fighter 6" ? "contain" : "cover"}
        />
        {/* Transparent bottom gradient to fade character legs into background */}
        <LinearGradient
          colors={['transparent', 'rgba(10, 10, 15, 0.5)', '#0a0a0f']}
          style={styles.bottomGradient}
        />
      </View>

      {/* Info Content Section */}
      <View style={styles.infoSection}>
        {/* Name - huge, condensed, signature color */}
        <Text style={[styles.charName, { color: accentColor }]}>
          {char}
        </Text>

        {/* Title/Subtitle */}
        <Text style={styles.charTitle}>
          {details.title}
        </Text>

        {/* Key-Value Info block */}
        <View style={styles.keyValBlock}>
          <Text style={styles.infoRow}>
            <Text style={styles.infoKey}>Country of origin: </Text>
            <Text style={[styles.infoVal, { color: accentColor }]}>{details.country}</Text>
          </Text>
          <Text style={styles.infoRow}>
            <Text style={styles.infoKey}>Fighting style: </Text>
            <Text style={[styles.infoVal, { color: accentColor }]}>{details.style}</Text>
          </Text>
        </View>

        {/* Description Bio text */}
        <View style={[styles.bioContainer, { borderLeftColor: accentColor }]}>
          <Text style={styles.bioText}>
            {details.bio}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
    marginBottom: 24,
    alignItems: 'center',
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute',
    top: 50,
    width: 250,
    height: 250,
    borderRadius: 125,
    opacity: 0.6,
    zIndex: 0,
  },
  imageWrapper: {
    position: 'relative',
    width: width,
    height: 360,
    justifyContent: 'flex-end',
    alignItems: 'center',
    zIndex: 1,
    overflow: 'hidden',
  },
  charImage: {
    width: '100%',
    height: '100%',
  },
  coverImage: {
    // top aligned positioning
  },
  containImage: {
    // bottom centered
  },
  bottomGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 140,
    zIndex: 2,
  },
  infoSection: {
    position: 'relative',
    zIndex: 2,
    width: '100%',
    paddingHorizontal: 8,
    marginTop: -24, // overlap text with faded bottom of image
  },
  charName: {
    fontFamily: 'BlackOpsOne-Regular',
    fontSize: 40,
    textTransform: 'uppercase',
    lineHeight: 40,
    letterSpacing: -1,
    marginBottom: 6,
    textAlign: 'left',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  charTitle: {
    fontSize: 17,
    fontFamily: 'Rajdhani-Bold',
    color: '#fff',
    marginBottom: 14,
    textAlign: 'left',
    letterSpacing: 0.5,
  },
  keyValBlock: {
    marginBottom: 14,
    gap: 4,
  },
  infoRow: {
    fontSize: 14,
    fontFamily: 'Rajdhani-SemiBold',
    color: '#fff',
  },
  infoKey: {
    color: '#888',
  },
  infoVal: {
    fontWeight: '700',
  },
  bioContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.015)',
    borderLeftWidth: 3,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  bioText: {
    fontSize: 13.5,
    color: '#aaa',
    lineHeight: 20,
    fontFamily: 'Rajdhani-SemiBold',
  },
});
