import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSequence } from 'react-native-reanimated';
import ComboInput from './ComboInput';
import { ControlType } from './ControlContext';
import { useFavoritesContext } from './FavoritesContext';

interface ComboType {
  name: string;
  input: string;
  inputNumpad?: string;
  category: string;
  difficulty?: string;
  damage?: string;
  description: string;
}

interface ComboCardProps {
  combo: ComboType;
  controlType: ControlType;
  comboKey: string;
}

const CATEGORY_COLORS: Record<string, [string, string]> = {
  normal: ['#94a3b8', '#cbd5e1'],
  jump: ['#3b82f6', '#60a5fa'],
  throw: ['#f97316', '#fb923c'],
  special: ['#8b5cf6', '#a78bfa'],
  combo: ['#e63b2e', '#ff8c00'],
  fatal_blow: ['#eab308', '#fbbf24'],
  brutality: ['#9333ea', '#c026d3'],
  fatality: ['#dc2626', '#ff0000'],
  animality: ['#ec4899', '#f472b6'],
  super: ['#f59e0b', '#fbbf24'],
  rage: ['#ef4444', '#f97316'],
  overdrive: ['#06b6d4', '#0ea5e9'],
  taunt: ['#22d3ee', '#3b82f6'],
  breaker: ['#fb7185', '#dc2626'],
  custom: ['#10b981', '#34d399'],
  'Super Arts': ['#f59e0b', '#fbbf24'],
  'Unique Attacks': ['#3b82f6', '#60a5fa'],
  'Common Moves': ['#64748b', '#94a3b8'],

  // Tekken 8 categories
  'Main Techniques': ['#e63b2e', '#ff8c00'],
  'Heat Moves': ['#ff8c00', '#f59e0b'],
  'Rage Moves': ['#ef4444', '#dc2626'],
  'Normal Moves': ['#94a3b8', '#cbd5e1'],
  'Special Moves': ['#8b5cf6', '#a78bfa'],
  'Moves While Crouching': ['#3b82f6', '#60a5fa'],
  'Moves During Sidestep': ['#06b6d4', '#0ea5e9'],
  'Moves While Facing Backward': ['#f59e0b', '#fbbf24'],
  'Moves During Destructive Form': ['#d946ef', '#f472b6'],
  'Moves During Boot': ['#10b981', '#34d399'],
  'Moves During Dual Boot': ['#22c55e', '#86efac'],
  'Moves During Backup': ['#6366f1', '#818cf8'],
  'Throws': ['#f97316', '#fb923c'],
  'Attack Reversals': ['#ec4899', '#f472b6'],
  'Moves While Opponent is Down': ['#64748b', '#94a3b8'],
  'Unknown': ['#64748b', '#94a3b8']
};

export default function ComboCard({ combo, controlType, comboKey }: ComboCardProps) {
  const { isFavorite, toggleFavorite } = useFavoritesContext();
  const fav = isFavorite(comboKey);

  // Spring scale animation for the star button
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const handleFavPress = () => {
    scale.value = withSequence(
      withTiming(1.2, { duration: 80 }),
      withTiming(1, { duration: 80 })
    );
    toggleFavorite(comboKey);
  };

  // Left border gradient colors selection
  const grad = CATEGORY_COLORS[combo.category] || ['#e63b2e', '#ff8c00'];

  // Category Badge config
  const getBadgeConfig = (cat: string): [string, string] => {
    const cfg: Record<string, [string, string]> = {
      normal: ['Normal', '#94a3b8'],
      jump: ['Jump', '#3b82f6'],
      throw: ['Throw', '#f97316'],
      special: ['Special', '#8b5cf6'],
      combo: ['Combo', '#e63b2e'],
      fatal_blow: ['Fatal Blow', '#eab308'],
      brutality: ['Brutality', '#9333ea'],
      fatality: ['Fatality', '#dc2626'],
      animality: ['Animality', '#ec4899'],
      super: ['Super', '#f59e0b'],
      rage: ['Rage', '#ef4444'],
      overdrive: ['OD', '#06b6d4'],
      taunt: ['Taunt', '#22d3ee'],
      breaker: ['Breaker', '#fb7185'],
      custom: ['Custom', '#10b981'],
      'Super Arts': ['Super Art', '#f59e0b'],
      'Unique Attacks': ['Unique', '#3b82f6'],
      'Common Moves': ['Common', '#64748b'],

      // Tekken 8 categories
      'Main Techniques': ['Main', '#e63b2e'],
      'Heat Moves': ['Heat', '#ff8c00'],
      'Rage Moves': ['Rage', '#ef4444'],
      'Normal Moves': ['Normal', '#94a3b8'],
      'Special Moves': ['Special', '#8b5cf6'],
      'Moves While Crouching': ['Crouching', '#3b82f6'],
      'Moves During Sidestep': ['Sidestep', '#06b6d4'],
      'Moves While Facing Backward': ['Backturn', '#f59e0b'],
      'Moves During Destructive Form': ['Destructive', '#d946ef'],
      'Moves During Boot': ['Boot', '#10b981'],
      'Moves During Dual Boot': ['Dual Boot', '#22c55e'],
      'Moves During Backup': ['Backup', '#6366f1'],
      'Throws': ['Throw', '#f97316'],
      'Attack Reversals': ['Reversal', '#ec4899'],
      'Moves While Opponent is Down': ['Ondown', '#64748b'],
      'Unknown': ['Other', '#64748b']
    };
    return cfg[cat] || [cat || '?', '#666'];
  };

  const [badgeLabel, badgeColor] = getBadgeConfig(combo.category);

  // Difficulty colors
  const getDifficultyColors = (diff: string) => {
    if (diff === 'Easy') return { bg: '#2d6a2d', text: '#6eff6e' };
    if (diff === 'Medium') return { bg: '#6a4e2d', text: '#ffcc66' };
    return { bg: '#6a2d2d', text: '#ff6666' };
  };

  const diffColors = combo.difficulty ? getDifficultyColors(combo.difficulty) : null;

  return (
    <View style={styles.cardContainer}>
      <LinearGradient
        colors={['#1a1a2e', '#16213e']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      {/* Left accent bar — colored by category */}
      <LinearGradient
        colors={grad}
        style={styles.accentBar}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />

      {/* Favorite star button — top right */}
      <TouchableOpacity
        style={styles.favButton}
        onPress={handleFavPress}
        hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
        activeOpacity={0.7}
      >
        <Animated.Text style={[styles.favIcon, fav && styles.favIconActive, animStyle]}>
          ♥
        </Animated.Text>
      </TouchableOpacity>

      <View style={styles.contentWrapper}>
        {/* Title and Badges */}
        <View style={styles.headerRow}>
          <Text style={styles.comboName}>{combo.name}</Text>
          <View style={styles.badgeContainer}>
            {/* Category badge */}
            <View style={[styles.badge, { backgroundColor: `${badgeColor}22`, borderColor: `${badgeColor}44` }]}>
              <Text style={[styles.badgeText, { color: badgeColor }]}>{badgeLabel}</Text>
            </View>
            {/* Difficulty badge */}
            {combo.difficulty && combo.difficulty !== '-' && diffColors && (
              <View style={[styles.badge, { backgroundColor: diffColors.bg, borderColor: 'transparent' }]}>
                <Text style={[styles.badgeText, { color: diffColors.text }]}>{combo.difficulty}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Input tokens row */}
        <ComboInput input={combo.input} controlType={controlType} />



        {/* Damage and description */}
        <Text style={styles.descriptionText}>
          {combo.damage && combo.damage !== '-' && (
            <Text style={styles.damageHighlight}>💥 {combo.damage} dmg </Text>
          )}
          {combo.description}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    borderWidth: 1,
    borderColor: 'rgba(230, 59, 46, 0.2)',
    borderRadius: 12,
    marginBottom: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  accentBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 3,
    height: '100%',
    zIndex: 2,
  },
  contentWrapper: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 40, // Space reserved at the bottom for the absolute star button
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  comboName: {
    fontFamily: 'Rajdhani-Bold',
    fontSize: 15,
    color: '#ff8c00',
    textTransform: 'uppercase',
    letterSpacing: 1,
    flex: 1,
    marginRight: 8,
  },
  badgeContainer: {
    flexDirection: 'row',
    gap: 5,
  },
  badge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 20,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 10,
    fontFamily: 'Rajdhani-Bold',
    textTransform: 'uppercase',
  },

  descriptionText: {
    fontSize: 12,
    color: '#888',
    fontFamily: 'Rajdhani-SemiBold',
    lineHeight: 16,
  },
  damageHighlight: {
    color: '#ff8c00',
  },
  favButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    zIndex: 10,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favIcon: {
    fontSize: 26,
    color: 'rgba(255, 255, 255, 0.15)',
  },
  favIconActive: {
    color: '#ef4444',
  },
});
