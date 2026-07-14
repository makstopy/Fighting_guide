import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ImageMap } from '../constants/ImageMap';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const ALL_PORTRAIT_KEYS = Object.keys(ImageMap);

function pickRandomPortraits(count: number): string[] {
  const shuffled = [...ALL_PORTRAIT_KEYS].sort(() => Math.random() - 0.5);
  // Use a smaller pool of unique images (21) so they decode almost instantly and don't pop-in
  const poolSize = Math.min(21, shuffled.length);
  const pool = shuffled.slice(0, poolSize);
  
  const result = [];
  for (let i = 0; i < count; i++) {
    // Cycle through the pool with a prime step to avoid adjacent duplicates in the 3-column grid
    result.push(pool[(i * 13) % pool.length]);
  }
  return result;
}

const CARD_WIDTH = Math.floor(SCREEN_WIDTH / 3);
const CARD_HEIGHT = Math.floor(CARD_WIDTH * 1.25);
const COLS = 3;
const ROWS = Math.ceil(SCREEN_HEIGHT / CARD_HEIGHT) + 12;
const TOTAL_CARDS = COLS * ROWS;
const GRID_HEIGHT = ROWS * CARD_HEIGHT;

interface IntroScreenProps {
  onReady: () => void;
  dbReady: boolean;
}

export default function IntroScreen({ onReady, dbReady }: IntroScreenProps) {
  const portraits = useRef(pickRandomPortraits(TOTAL_CARDS)).current;
  const scrollY = useRef(new Animated.Value(0)).current;
  const logoPulse = useRef(new Animated.Value(1)).current;
  const spinAnim = useRef(new Animated.Value(0)).current;
  const fadeOut = useRef(new Animated.Value(1)).current;
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    console.log('[IntroScreen] MOUNTED. dbReady =', dbReady);
    return () => console.log('[IntroScreen] UNMOUNTED');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    Animated.timing(scrollY, {
      toValue: -CARD_HEIGHT * 10,
      duration: 36000,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(logoPulse, {
          toValue: 1.04,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(logoPulse, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  // Minimum display time — always show intro for at least 2.5s
  useEffect(() => {
    const timer = setTimeout(() => setMinTimeElapsed(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  // Dismiss only when BOTH db is ready AND min time has passed
  useEffect(() => {
    if (dbReady && minTimeElapsed && !isDone) {
      const timeout = setTimeout(() => {
        console.log('[IntroScreen] DISMISSING (fade out)');
        setIsDone(true);
        Animated.timing(fadeOut, {
          toValue: 0,
          duration: 500,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }).start(() => {
          onReady();
        });
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [dbReady, minTimeElapsed, isDone]);

  const spinInterpolate = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View style={[styles.container, { opacity: fadeOut }]}>
      <Animated.View
        style={[
          styles.gridWrapper,
          { transform: [{ translateY: scrollY }] },
        ]}
      >
        {Array.from({ length: ROWS }).map((_, rowIdx) =>
          Array.from({ length: COLS }).map((_, colIdx) => {
            const index = rowIdx * COLS + colIdx;
            const portraitKey = portraits[index % portraits.length];
            return (
              <View
                key={`${rowIdx}-${colIdx}`}
                style={[
                  styles.portraitCard,
                  {
                    left: colIdx * CARD_WIDTH,
                    top: rowIdx * CARD_HEIGHT,
                    width: CARD_WIDTH,
                    height: CARD_HEIGHT,
                  },
                ]}
              >
                <Image
                  source={ImageMap[portraitKey]}
                  style={styles.portraitImage}
                  resizeMode={portraitKey.includes('sf6') ? 'contain' : 'cover'}
                />
                <View style={styles.cardOverlay} />
              </View>
            );
          })
        )}
      </Animated.View>

      <LinearGradient
        colors={['rgba(10,10,15,0.3)', 'rgba(10,10,15,0.6)', 'rgba(10,10,15,0.9)']}
        locations={[0, 0.7, 1]}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.centerContent}>
        <Animated.View style={{ transform: [{ scale: logoPulse }] }}>
          <Text style={styles.logoText}>
            FIGHTING <Text style={styles.logoHighlight}>GUIDE</Text>
          </Text>
          <Text style={styles.tagline}>Master Every Combo</Text>
        </Animated.View>

        <View style={styles.spinnerWrapper}>
          <Animated.View
            style={[
              styles.spinner,
              { transform: [{ rotate: spinInterpolate }] },
            ]}
          />
        </View>

        <Text style={styles.loadingText}>
          {dbReady ? 'Ready' : 'Initializing...'}
        </Text>
      </View>

      <LinearGradient
        colors={['transparent', 'rgba(10,10,15,0.9)']}
        style={styles.bottomGradient}
        pointerEvents="none"
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0f',
    overflow: 'hidden',
  },
  gridWrapper: {
    position: 'absolute',
    width: SCREEN_WIDTH,
    height: GRID_HEIGHT,
    top: 0,
    left: 0,
  },
  portraitCard: {
    position: 'absolute',
    overflow: 'hidden',
    backgroundColor: '#101018',
  },
  portraitImage: {
    width: '100%',
    height: '100%',
  },
  cardOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(10,10,15,0.35)',
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  logoText: {
    fontFamily: 'BlackOpsOne-Regular',
    fontSize: 38,
    color: '#ffffff',
    letterSpacing: 3,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  logoHighlight: {
    color: '#e63b2e',
  },
  tagline: {
    fontFamily: 'Rajdhani-SemiBold',
    fontSize: 13,
    color: 'rgba(255,255,255,0.45)',
    letterSpacing: 3,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginTop: 6,
  },
  spinnerWrapper: {
    marginTop: 32,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2.5,
    borderColor: 'rgba(255,255,255,0.12)',
    borderTopColor: '#e63b2e',
  },
  loadingText: {
    fontFamily: 'Rajdhani-SemiBold',
    fontSize: 12,
    color: 'rgba(255,255,255,0.35)',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginTop: 4,
  },
  bottomGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
  },
});
