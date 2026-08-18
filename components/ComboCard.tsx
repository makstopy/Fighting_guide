import React, { useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSequence } from 'react-native-reanimated';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import Svg, { Path } from 'react-native-svg';
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
  rev_art: ['#06b6d4', '#3b82f6'],
  taunt: ['#22d3ee', '#3b82f6'],
  breaker: ['#fb7185', '#dc2626'],
  custom: ['#10b981', '#34d399'],
  'Super Arts': ['#f59e0b', '#fbbf24'],
  'Unique Attacks': ['#3b82f6', '#60a5fa'],
  'Common Moves': ['#64748b', '#94a3b8'],

  // Fatal Fury categories
  'Command Moves': ['#3b82f6', '#60a5fa'],
  'Command Combos': ['#8b5cf6', '#a78bfa'],
  'Special Moves': ['#f97316', '#fb923c'],
  'REV Blows': ['#06b6d4', '#22d3ee'],
  'Ignition Gears': ['#f59e0b', '#fbbf24'],
  'Redline Gears': ['#ef4444', '#f87171'],
  'Hidden Gear': ['#ec4899', '#f472b6'],

  // Tekken 8 categories
  'Main Techniques': ['#e63b2e', '#ff8c00'],
  'Heat Moves': ['#ff8c00', '#f59e0b'],
  'Normal Moves': ['#94a3b8', '#cbd5e1'],
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

function parseNameBadges(name: string) {
  const badges: string[] = [];
  let cleanTitle = name;

  if (/\bBR\b/.test(cleanTitle)) {
    badges.push('BR');
    cleanTitle = cleanTitle.replace(/\bBR\b/g, '');
  }
  if (/\bFE\b/.test(cleanTitle)) {
    badges.push('FE');
    cleanTitle = cleanTitle.replace(/\bFE\b/g, '');
  }

  cleanTitle = cleanTitle.replace(/\s+/g, ' ').trim();

  return { cleanTitle, badges };
}

export default function ComboCard({ combo, controlType, comboKey }: ComboCardProps) {
  const { isFavorite, toggleFavorite } = useFavoritesContext();
  const fav = isFavorite(comboKey);
  const captureViewRef = useRef<View>(null);

  // Spring scale animation for the fav button
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  // Spring scale animation for the share button
  const shareScale = useSharedValue(1);
  const shareAnimStyle = useAnimatedStyle(() => ({ transform: [{ scale: shareScale.value }] }));

  const handleFavPress = () => {
    scale.value = withSequence(
      withTiming(1.2, { duration: 80 }),
      withTiming(1, { duration: 80 })
    );
    toggleFavorite(comboKey);
  };

  const handleSharePress = async () => {
    try {
      shareScale.value = withSequence(
        withTiming(1.2, { duration: 80 }),
        withTiming(1, { duration: 80 })
      );
      if (!captureViewRef.current) return;
      const uri = await captureRef(captureViewRef, {
        format: 'png',
        quality: 1,
      });
      await Sharing.shareAsync(uri, {
        mimeType: 'image/png',
        dialogTitle: 'Share Combo',
      });
    } catch (error) {
      console.error('Share failed:', error);
    }
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
      rev_art: ['REV Art', '#06b6d4'],
      taunt: ['Taunt', '#22d3ee'],
      breaker: ['Breaker', '#fb7185'],
      custom: ['Custom', '#10b981'],
      'Super Arts': ['Super Art', '#f59e0b'],
      'Unique Attacks': ['Unique', '#3b82f6'],
      'Common Moves': ['Common', '#64748b'],

      // Fatal Fury categories
      'Command Moves': ['Cmd Move', '#3b82f6'],
      'Command Combos': ['Cmd Combo', '#8b5cf6'],
      'Special Moves': ['Special', '#f97316'],
      'REV Blows': ['REV Blow', '#06b6d4'],
      'Ignition Gears': ['Ignition', '#f59e0b'],
      'Redline Gears': ['Redline', '#ef4444'],
      'Hidden Gear': ['Hidden', '#ec4899'],

      // Tekken 8 categories
      'Main Techniques': ['Main', '#e63b2e'],
      'Heat Moves': ['Heat', '#ff8c00'],
      'Rage Moves': ['Rage', '#ef4444'],
      'Normal Moves': ['Normal', '#94a3b8'],
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
  const { cleanTitle, badges: nameBadges } = parseNameBadges(combo.name);

  // Difficulty colors
  const getDifficultyColors = (diff: string) => {
    if (diff === 'Easy') return { bg: '#2d6a2d', text: '#6eff6e' };
    if (diff === 'Medium') return { bg: '#6a4e2d', text: '#ffcc66' };
    return { bg: '#6a2d2d', text: '#ff6666' };
  };

  const diffColors = combo.difficulty ? getDifficultyColors(combo.difficulty) : null;

  // Shared card content rendered in both visible and capture views
  const renderCardContent = () => (
    <>
      <LinearGradient
        colors={['#1a1a2e', '#16213e']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <LinearGradient
        colors={grad}
        style={styles.accentBar}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />
      <View style={styles.contentWrapper}>
        <View style={styles.headerRow}>
          <View style={styles.titleWithBadgesContainer}>
            <Text style={styles.comboName}>{cleanTitle}</Text>
            {nameBadges.map((b, idx) => (
              <Image
                key={idx}
                source={
                  b === 'BR'
                    ? require('../assets/images/fatal_fury_icons/ff_braking_ok.png')
                    : require('../assets/images/fatal_fury_icons/ff_feint_ok.png')
                }
                style={styles.nameBadgeImage}
                resizeMode="contain"
              />
            ))}
          </View>
          <View style={styles.badgeContainer}>
            <View style={[styles.badge, { backgroundColor: `${badgeColor}22`, borderColor: `${badgeColor}44` }]}>
              <Text style={[styles.badgeText, { color: badgeColor }]}>{badgeLabel}</Text>
            </View>
            {combo.difficulty && combo.difficulty !== '-' && diffColors && (
              <View style={[styles.badge, { backgroundColor: diffColors.bg, borderColor: 'transparent' }]}>
                <Text style={[styles.badgeText, { color: diffColors.text }]}>{combo.difficulty}</Text>
              </View>
            )}
          </View>
        </View>
        <ComboInput input={combo.input} controlType={controlType} />
        <Text style={styles.descriptionText}>
          {combo.damage && combo.damage !== '-' && (
            <Text style={styles.damageHighlight}>💥 {combo.damage} dmg </Text>
          )}
          {combo.description}
        </Text>
      </View>
    </>
  );

  return (
    <View style={styles.cardContainer}>
      {/* Hidden capture view — identical size/content + app logo instead of buttons.
          Covered completely by the visible layer on top, so user never sees it,
          but Android lays it out within the screen bounds so Image is fully rendered for captureRef. */}
      <View
        ref={captureViewRef}
        collapsable={false}
        pointerEvents="none"
        style={StyleSheet.absoluteFill}
      >
        {renderCardContent()}
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/images/app_icon.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>
      </View>

      {/* Visible layer — rendered in-flow on top with action buttons */}
      {renderCardContent()}

      {/* Share button — above favorite */}
      <TouchableOpacity
        style={styles.shareButton}
        onPress={handleSharePress}
        hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
        activeOpacity={0.7}
      >
        <Animated.View style={shareAnimStyle}>
          <Svg width={22} height={22} viewBox="0 -960 960 960">
            <Path d="M680-80q-50 0-85-35t-35-85q0-6 3-28L282-392q-16 15-37 23.5t-45 8.5q-50 0-85-35t-35-85q0-50 35-85t85-35q24 0 45 8.5t37 23.5l281-164q-2-7-2.5-13.5T560-760q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35q-24 0-45-8.5T598-672L317-508q2 7 2.5 13.5t.5 14.5q0 8-.5 14.5T317-452l281 164q16-15 37-23.5t45-8.5q50 0 85 35t35 85q0 50-35 85t-85 35Zm0-80q17 0 28.5-11.5T720-200q0-17-11.5-28.5T680-240q-17 0-28.5 11.5T640-200q0 17 11.5 28.5T680-160ZM200-440q17 0 28.5-11.5T240-480q0-17-11.5-28.5T200-520q-17 0-28.5 11.5T160-480q0 17 11.5 28.5T200-440Zm508.5-291.5Q720-743 720-760t-11.5-28.5Q697-800 680-800t-28.5 11.5Q640-777 640-760t11.5 28.5Q663-720 680-720t28.5-11.5ZM680-200ZM200-480Zm480-280Z" fill="rgba(255,255,255,0.15)" />
          </Svg>
        </Animated.View>
      </TouchableOpacity>

      {/* Favorite button */}
      <TouchableOpacity
        style={styles.favButton}
        onPress={handleFavPress}
        hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
        activeOpacity={0.7}
      >
        <Animated.View style={animStyle}>
          <Svg width={24} height={24} viewBox="0 -960 960 960">
            <Path d={fav
              ? 'm480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Z'
              : 'm480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z'
            } fill={fav ? '#ef4444' : 'rgba(255,255,255,0.15)'} />
          </Svg>
        </Animated.View>
      </TouchableOpacity>
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
  titleWithBadgesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    flex: 1,
    marginRight: 8,
    gap: 5,
  },
  comboName: {
    fontFamily: 'Rajdhani-Bold',
    fontSize: 15,
    color: '#ff8c00',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  nameBadgeImage: {
    height: 18,
    width: 40,
    marginHorizontal: 1,
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
  shareButton: {
    position: 'absolute',
    bottom: 44,
    right: 8,
    zIndex: 10,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    zIndex: 10,
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: 44,
    height: 44,
    borderRadius: 8,
  },
});
