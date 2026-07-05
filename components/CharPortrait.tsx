import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect, Line, Text as SvgText } from 'react-native-svg';
import MK1_PORTRAITS from '../data/mk1_portraits.json';
import SF6_PORTRAITS from '../data/sf6_portraits.json';
import TEKKEN8_PORTRAITS from '../data/tekken8_portaits.json';
import CHAR_DATA from '../data/char_data.json';

import { resolveImageUri } from '../constants/ImageHelper';

const mk1Portraits: Record<string, string> = MK1_PORTRAITS;
const sf6Portraits: Record<string, string> = SF6_PORTRAITS;
const tekken8Portraits: Record<string, string> = TEKKEN8_PORTRAITS;
const charData: Record<string, { bg: [string, string]; icon: string; label: string }> = CHAR_DATA as any;

export default function CharPortrait({ char, game, size = 80 }: { char: string; game: string; size?: number }) {
  const rawImgUrl = game === "Tekken 8" ? tekken8Portraits[char] : game === "Mortal Kombat 1" ? mk1Portraits[char] : game === "Street Fighter 6" ? sf6Portraits[char] : null;
  const imgUrl = resolveImageUri(rawImgUrl);
  const d = charData[char] || { bg: ["#1a1a2e", "#333"], icon: "🥷", label: char.slice(0, 2).toUpperCase() };

  if (imgUrl) {
    return (
      <View style={[styles.container, { width: size, height: size }]}>
        <Image
          source={{ uri: imgUrl }}
          style={styles.portrait}
          resizeMode="cover"
        />
        {/* Soft overlay on the bottom with label */}
        <View style={styles.labelOverlay}>
          <Text style={styles.labelText}>{d.label || char.slice(0, 3)}</Text>
        </View>
      </View>
    );
  }

  const [c0, c1] = d.bg;
  const id = "cp_" + char.replace(/\s/g, "_");
  const scale = size / 80;

  return (
    <View style={{ width: size, height: size, borderRadius: 12, overflow: 'hidden' }}>
      <Svg width={size} height={size} viewBox="0 0 80 80">
        <Defs>
          <LinearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor={c0} />
            <Stop offset="100%" stopColor={c1} />
          </LinearGradient>
        </Defs>
        <Rect width="80" height="80" rx="12" fill={`url(#${id})`} />
        <Line x1="0" y1="80" x2="80" y2="0" stroke="rgba(255,255,255,0.07)" strokeWidth="20" />
        <SvgText x="40" y="46" textAnchor="middle" fontSize="30">{d.icon}</SvgText>
        <Rect x="0" y="58" width="80" height="22" fill="rgba(0,0,0,0.5)" />
        <SvgText
          x="40"
          y="73"
          textAnchor="middle"
          fill="white"
          fontSize="11"
          fontFamily="Rajdhani-Bold"
          fontWeight="700"
          letterSpacing={0.5}
        >
          {d.label}
        </SvgText>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    backgroundColor: '#050505',
    position: 'relative',
  },
  portrait: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '120%',
  },
  labelOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingVertical: 2,
    alignItems: 'center',
  },
  labelText: {
    color: '#fff',
    fontSize: 9,
    fontFamily: 'Rajdhani-Bold',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});
