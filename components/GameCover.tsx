import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect, Line, Text as SvgText } from 'react-native-svg';
import FIGHTERS_DB from '../data/fighters_db.json';

export default function GameCover({ game }: { game: string }) {
  const info = (FIGHTERS_DB as any)[game];
  if (!info) return null;

  if (game === 'Mortal Kombat 1') {
    return (
      <View style={styles.imageContainer}>
        <Image
          source={require('../assets/images/de-dragon.webp')}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
    );
  }

  const [c0, c1, c2] = info.coverGrad;
  const id = 'gc_' + game.replace(/\s/g, '_');

  return (
    <View style={styles.svgContainer}>
      <Svg width="60" height="80" viewBox="0 0 60 80">
        <Defs>
          <LinearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor={c0} />
            <Stop offset="60%" stopColor={c1} />
            <Stop offset="100%" stopColor={c2} />
          </LinearGradient>
        </Defs>
        <Rect width="60" height="80" rx="8" fill={`url(#${id})`} />
        <Line x1="0" y1="20" x2="60" y2="20" stroke="rgba(255,255,255,0.05)" strokeWidth={1} />
        <Line x1="0" y1="40" x2="60" y2="40" stroke="rgba(255,255,255,0.05)" strokeWidth={1} />
        <Line x1="0" y1="60" x2="60" y2="60" stroke="rgba(255,255,255,0.05)" strokeWidth={1} />
        {/* Center the emoji using y=46 */}
        <SvgText x="30" y="46" textAnchor="middle" fontSize="26">
          {info.coverEmoji}
        </SvgText>
        <Rect x="4" y="58" width="52" height="16" rx="4" fill="rgba(0,0,0,0.5)" />
        <SvgText
          x="30"
          y="70"
          textAnchor="middle"
          fill="white"
          fontSize="9"
          fontFamily="BlackOpsOne-Regular"
          letterSpacing={1}
        >
          {info.coverLabel}
        </SvgText>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    width: 60,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  svgContainer: {
    width: 60,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
  },
});
