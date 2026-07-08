import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, FlatList, Platform } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useControl } from '../components/ControlContext';
import { useFavoritesContext, makeComboKey } from '../components/FavoritesContext';
import { useCustomCombosContext } from '../components/CustomCombosContext';
import Header from '../components/Header';
import CharacterHeaderCard from '../components/CharacterHeaderCard';
import ComboCard from '../components/ComboCard';
import ComboCreatorModal from '../components/ComboCreatorModal';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSequence, withSpring, Easing } from 'react-native-reanimated';
import COMBOS_DB from '../data/combos/index';
import { useSQLiteContext } from 'expo-sqlite';

import {
  PSSquare,
  PSTriangle,
  PSCircle,
  PSCross,
  PSBumper,
  XboxA,
  XboxB,
  XboxX,
  XboxY,
  XboxBumper,
  ArcadeButton,
  ArcadeArrow,
  ArcadeSep
} from '../components/icons/ControllerIcons';

const GAME_CATS: Record<string, [string, string][]> = {
  "Mortal Kombat 1": [
    ["all", "All"],
    ["normal", "Normal"],
    ["jump", "Jump"],
    ["throw", "Throws"],
    ["special", "Special"],
    ["combo", "Combo"],
    ["fatal_blow", "Fatal Blow"],
    ["breaker", "Breaker"],
    ["taunt", "Taunt"],
    ["brutality", "Brutality"],
    ["animality", "Animality"],
    ["fatality", "Fatality"]
  ],
  "Street Fighter 6": [
    ["all", "Все"],
    ["Special Moves", "Special Moves"],
    ["Super Arts", "Super Arts"],
    ["Unique Attacks", "Unique Attacks"],
    ["Throws", "Throws"],
    ["Common Moves", "Common Moves"]
  ],
  "Tekken 8": [
    ["all", "Все"],
    ["Main Techniques", "Main Techniques"],
    ["Heat Moves", "Heat Moves"],
    ["Rage Moves", "Rage Moves"],
    ["Normal Moves", "Normal Moves"],
    ["Special Moves", "Special Moves"],
    ["Moves While Crouching", "Moves While Crouching"],
    ["Moves During Sidestep", "Moves During Sidestep"],
    ["Moves While Facing Backward", "Moves While Facing Backward"],
    ["Moves During Destructive Form", "Moves During Destructive Form"],
    ["Moves During Boot", "Moves During Boot"],
    ["Moves During Dual Boot", "Moves During Dual Boot"],
    ["Moves During Backup", "Moves During Backup"],
    ["Throws", "Throws"],
    ["Attack Reversals", "Attack Reversals"],
    ["Moves While Opponent is Down", "Moves While Opponent is Down"],
    ["Unknown", "Other"]
  ],
  "Guilty Gear Strive": [
    ["all", "Все"],
    ["combo", "Комбо"],
    ["overdrive", "Overdrive"]
  ],
  "Dragon Ball FighterZ": [
    ["all", "Все"],
    ["combo", "Комбо"],
    ["super", "Суперы"]
  ],
  "Fatal Fury: City of the Wolves": [
    ["all", "Все"],
    ["combo", "Комбо"],
    ["rev_art", "REV Arts"],
    ["super", "Супер"]
  ]
};

const CATEGORY_COLORS: Record<string, string> = {
  normal: '#94a3b8',
  jump: '#3b82f6',
  throw: '#f97316',
  special: '#8b5cf6',
  combo: '#e63b2e',
  fatal_blow: '#eab308',
  brutality: '#9333ea',
  fatality: '#dc2626',
  animality: '#ec4899',
  super: '#f59e0b',
  rage: '#ef4444',
  overdrive: '#06b6d4',
  taunt: '#22d3ee',
  breaker: '#fb7185',
  custom: '#10b981',
  'Super Arts': '#f59e0b',
  'Unique Attacks': '#3b82f6',
  'Common Moves': '#64748b',

  // Tekken 8 categories
  'Main Techniques': '#e63b2e',
  'Heat Moves': '#ff8c00',
  'Rage Moves': '#ef4444',
  'Normal Moves': '#94a3b8',
  'Special Moves': '#8b5cf6',
  'Moves While Crouching': '#3b82f6',
  'Moves During Sidestep': '#06b6d4',
  'Moves While Facing Backward': '#f59e0b',
  'Moves During Destructive Form': '#d946ef',
  'Moves During Boot': '#10b981',
  'Moves During Dual Boot': '#22c55e',
  'Moves During Backup': '#6366f1',
  'Throws': '#f97316',
  'Attack Reversals': '#ec4899',
  'Moves While Opponent is Down': '#64748b',
  'Unknown': '#64748b'
};

const ComboSkeleton = () => (
  <View style={styles.cardContainer}>
    <View style={[StyleSheet.absoluteFill, { backgroundColor: '#1a1a2e', opacity: 0.4 }]} />
    <View style={[styles.accentBar, { backgroundColor: '#333' }]} />
    <View style={styles.contentWrapper}>
      <View style={styles.headerRow}>
        <View style={styles.skeletonTitle} />
        <View style={styles.skeletonBadge} />
      </View>
      <View style={styles.skeletonInput} />
      <View style={styles.skeletonNumpad} />
      <View style={styles.skeletonDesc} />
    </View>
  </View>
);

export default function CombosScreen() {
  const { game, char } = useLocalSearchParams<{ game: string; char: string }>();
  const { controlType } = useControl();
  const { favoriteIds, hasFavoritesFor, toggleFavorite } = useFavoritesContext();
  const { getCustomCombos, addCustomCombo } = useCustomCombosContext();
  const [isCreatorVisible, setIsCreatorVisible] = useState(false);

  // Default to 'favorite' if character already has saved favorites, otherwise 'all'
  const [activeCategory, setActiveCategory] = useState<string>(() =>
    hasFavoritesFor(game, char) ? 'favorite' : 'all'
  );
  const [combos, setCombos] = useState<any[]>([]);
  const [isTransitionFinished, setIsTransitionFinished] = useState(Platform.OS === 'web');
  // Controls whether real cards or skeletons are shown for the current category
  const [isCategoryReady, setIsCategoryReady] = useState(true);
  const SKELETON_COUNT = 8;
  // Guards async callbacks after unmount
  const isMountedRef = useRef(false);
  // Skips skeleton phase on initial data load (isTransitionFinished handles that)
  const isFirstMountRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    if (Platform.OS === 'web') return;

    let idleId: any;
    let fallbackTimer: any;

    if (typeof requestIdleCallback !== 'undefined') {
      idleId = requestIdleCallback(() => {
        if (isMountedRef.current) setIsTransitionFinished(true);
      });
    } else {
      fallbackTimer = setTimeout(() => {
        if (isMountedRef.current) setIsTransitionFinished(true);
      }, 250);
    }

    return () => {
      isMountedRef.current = false;
      if (idleId && typeof cancelIdleCallback !== 'undefined') cancelIdleCallback(idleId);
      if (fallbackTimer) clearTimeout(fallbackTimer);
    };
  }, []);

  const isWeb = Platform.OS === 'web';

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const db = isWeb ? null : useSQLiteContext();

  // Function to load and transform combos based on active controller type
  const mapCombosByControl = useCallback((raw: any[], control: string) => {
    if (control === 'Xbox') {
      const map: Record<string, string> = {
        "□": "X", "△": "Y", "○": "B", "✕": "A",
        "L1": "LB", "L2": "LT", "R1": "RB", "R2": "RT",
        "LP": "X", "RP": "Y", "LK": "B", "RK": "A",
        "LP+RP": "LB", "LK+RK": "LT", "RP+LK": "RB", "LP+RP+LK+RK": "RT"
      };
      return raw.map((c: any) => ({
        ...c,
        input: c.input.split(/(\s+|,)/).map((t: string) => map[t] || t).join("")
      }));
    }

    if (control === 'PS') {
      // Tekken notation → PS conversions (in addition to direct rendering in ButtonToken)
      const map: Record<string, string> = {
        "LP": "□", "RP": "△", "LK": "○", "RK": "✕",
        "LP+RP": "L1", "LK+RK": "L2", "RP+LK": "R1", "LP+RP+LK+RK": "R2"
      };
      return raw.map((c: any) => ({
        ...c,
        input: c.input.split(/(\s+|,)/).map((t: string) => map[t] || t).join("")
      }));
    }

    if (control === 'Arcade') {
      const dirMap: Record<string, string> = {
        "↖": "7", "↑": "8", "↗": "9",
        "←": "4", "→": "6",
        "↙": "1", "↓": "2", "↘": "3"
      };
      return raw.map((c: any) => ({
        ...c,
        inputNumpad: c.input.split("").map((ch: string) => dirMap[ch] || ch).join("")
      }));
    }

    return raw;
  }, []);

  useEffect(() => {
    if (game && char) {
      if (isFirstMountRef.current) {
        // On first mount, skip skeleton phase — isTransitionFinished already handles initial load
        isFirstMountRef.current = false;
      } else {
        // User changed controlType: show skeletons immediately
        setIsCategoryReady(false);
      }

      if (isWeb) {
        const raw = (COMBOS_DB as any)[game]?.[char] || [];
        setCombos(mapCombosByControl(raw, controlType));
      } else if (db) {
        db.getAllAsync<any>(
          `SELECT name, input, damage, difficulty, description, category 
           FROM combos 
           WHERE character_id = ? AND is_custom = 0;`,
          [`${game}::${char}`]
        )
          .then((rows) => {
            if (isMountedRef.current) {
              setCombos(mapCombosByControl(rows, controlType));
            }
          })
          .catch((err) => {
            console.error('[CombosScreen] Error loading combos from SQLite:', err);
            // Fallback
            const raw = (COMBOS_DB as any)[game]?.[char] || [];
            setCombos(mapCombosByControl(raw, controlType));
          });
      }
    }
  }, [game, char, controlType, isWeb, db, mapCombosByControl]);

  // When category changes: phase 1 = skeletons shown immediately,
  // phase 2 = real cards rendered after one animation frame
  const handleCategoryPress = useCallback((key: string) => {
    if (key === activeCategory) return;
    setIsCategoryReady(false);   // immediately show skeletons
    setActiveCategory(key);      // highlight tab right away
  }, [activeCategory]);

  useEffect(() => {
    if (isCategoryReady) return;
    // Wait for the skeleton frame to paint, then swap in real cards
    const rafId = requestAnimationFrame(() => {
      if (isMountedRef.current) setIsCategoryReady(true);
    });
    return () => cancelAnimationFrame(rafId);
  }, [isCategoryReady]);

  const PSLegend = () => (
    <View style={styles.legendIconsContainer}>
      <PSSquare size={20} /><PSTriangle size={20} /><PSCircle size={20} /><PSCross size={20} />
      <PSBumper label="L1" size={20} /><PSBumper label="L2" size={20} />
      <PSBumper label="R1" size={20} /><PSBumper label="R2" size={20} />
    </View>
  );

  const XboxLegend = () => (
    <View style={styles.legendIconsContainer}>
      <XboxA size={20} /><XboxB size={20} /><XboxX size={20} /><XboxY size={20} />
      <XboxBumper label="LB" size={20} /><XboxBumper label="LT" size={20} />
      <XboxBumper label="RB" size={20} /><XboxBumper label="RT" size={20} />
    </View>
  );

  const ArcadeLegend = () => (
    <View>
      <View style={[styles.legendIconsContainer, { marginBottom: 6 }]}>
        {[
          ["□", "LP"], ["△", "RP"], ["○", "LK"], ["✕", "RK"],
          ["L1", "1+2"], ["L2", "3+4"], ["R1", "2+3"], ["R2", "ALL"]
        ].map(([sym, lbl]) => (
          <View key={sym} style={styles.arcadeLegendItem}>
            <ArcadeButton label={sym} size={28} />
            <Text style={styles.arcadeLegendLabel}>{lbl}</Text>
          </View>
        ))}
      </View>
      <View style={styles.legendDirectionsRow}>
        {["↑", "↓", "←", "→", "↗", "↘", "↙", "↖"].map(d => (
          <ArcadeArrow key={d} dir={d} size={22} />
        ))}
      </View>
    </View>
  );

  // Convert a single combo's input from PS notation to current controlType
  const convertComboInput = useCallback((combo: any, control: string) => {
    if (control === 'Xbox') {
      const map: Record<string, string> = {
        "□": "X", "△": "Y", "○": "B", "✕": "A",
        "L1": "LB", "L2": "LT", "R1": "RB", "R2": "RT",
      };
      return {
        ...combo,
        input: combo.input.split(/(\s+|,)/).map((t: string) => map[t] || t).join("")
      };
    }
    if (control === 'Arcade') {
      const dirMap: Record<string, string> = {
        "↖": "7", "↑": "8", "↗": "9",
        "←": "4", "→": "6",
        "↙": "1", "↓": "2", "↘": "3"
      };
      return {
        ...combo,
        inputNumpad: combo.input.split("").map((ch: string) => dirMap[ch] || ch).join("")
      };
    }
    return combo;
  }, []);

  // Merge custom combos with DB combos (applying controlType conversion)
  const allCombos = useMemo(() => {
    const custom = getCustomCombos(game, char).map(c => convertComboInput(c, controlType));
    return [...combos, ...custom];
  }, [combos, game, char, getCustomCombos, controlType, convertComboInput]);

  // Determine which categories actually contain combos for the current character
  const presentCategories = useMemo(() => {
    const set = new Set<string>();
    allCombos.forEach(c => {
      if (c.category) {
        set.add(c.category);
      }
    });
    return set;
  }, [allCombos]);

  // Filter combos by selected category tab
  const filteredCombos = useMemo(() => {
    if (activeCategory === 'all') return allCombos;
    if (activeCategory === 'favorite')
      return allCombos.filter(c => favoriteIds.has(makeComboKey(game, char, c.name, c.input)));
    return allCombos.filter(c => c.category === activeCategory);
  }, [activeCategory, allCombos, favoriteIds, game, char]);

  // Empty state for Favorite tab
  const EmptyFavorites = () => (
    <View style={styles.emptyFavContainer}>
      <Text style={styles.emptyFavStar}>☆</Text>
      <Text style={styles.emptyFavTitle}>Нет избранных комбо</Text>
      <Text style={styles.emptyFavHint}>
        Нажми ★ на карточке комбо,{`\n`}чтобы добавить его в избранное
      </Text>
    </View>
  );

  const renderHeader = useCallback(() => (
    <View>
      {/* Character bio card */}
      <CharacterHeaderCard game={game} char={char} />

      {/* Controller inputs legend banner */}
      <View style={styles.legendBanner}>
        {controlType === 'PS' ? <PSLegend /> : controlType === 'Xbox' ? <XboxLegend /> : <ArcadeLegend />}
      </View>

      {/* Category tabs */}
      {game && GAME_CATS[game] && (
        <View style={styles.categoriesWrap}>
          {/* Favorite tab — always first, Custom tab — after favorites */}
          {[
            ['favorite', '⭐ Избранное', '#FFD700'] as [string, string, string],
            ['custom', '🛠 Custom', '#10b981'] as [string, string, string],
            ...GAME_CATS[game]
              .filter(([k]) => k === 'all' || presentCategories.has(k))
              .map(([k, l]) => [k, l, CATEGORY_COLORS[k] || '#e63b2e'] as [string, string, string])
          ].map(([key, label, col]) => {
            const isActive = activeCategory === key;
            return (
              <Pressable
                key={key}
                onPress={() => handleCategoryPress(key)}
                style={({ pressed }) => [
                  styles.categoryTab,
                  isActive
                    ? { backgroundColor: `${col}33`, borderColor: col }
                    : styles.categoryTabInactive,
                  pressed && { opacity: 0.6, transform: [{ scale: 0.95 }] },
                ]}
              >
                <Text style={[styles.categoryTabText, isActive ? { color: col } : styles.categoryTabInactiveText]}>
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  ), [game, char, controlType, activeCategory]);

  const renderItem = useCallback(({ item }: { item: any }) => {
    if (!isTransitionFinished || !isCategoryReady) {
      return <ComboSkeleton />;
    }
    const key = makeComboKey(game, char, item.name, item.input);
    return <ComboCard combo={item} controlType={controlType} comboKey={key} />;
  }, [isTransitionFinished, isCategoryReady, game, char, controlType]);

  // Phase 1: show fixed-count skeletons; Phase 2: show real filtered combos
  const showingSkeletons = !isTransitionFinished || !isCategoryReady;
  const listData = showingSkeletons ? Array(SKELETON_COUNT).fill(null) : filteredCombos;

  // Determine ListEmptyComponent: only show when real cards are loaded and list is empty
  const emptyComponent = (!showingSkeletons)
    ? activeCategory === 'favorite'
      ? <EmptyFavorites />
      : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📋</Text>
          <Text style={styles.emptyText}>Нет записей в этой категории</Text>
        </View>
      )
    : null;

  // FAB pulse animation
  const fabScale = useSharedValue(1);
  useEffect(() => {
    fabScale.value = withRepeat(
      withSequence(
        withTiming(1.08, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);
  const fabAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: fabScale.value }],
  }));

  const handleSaveCustomCombo = useCallback((name: string, input: string, description: string) => {
    const combo = addCustomCombo(game, char, name, input, description);
    // Auto-add to favorites
    const key = makeComboKey(game, char, combo.name, combo.input);
    toggleFavorite(key);
    setIsCreatorVisible(false);
    // Switch to Custom category to show the newly created combo
    handleCategoryPress('custom');
  }, [game, char, addCustomCombo, toggleFavorite, handleCategoryPress]);

  return (
    <View style={styles.container}>
      <Header showBack gameTitle={game} charName={char} />
      <FlatList
        data={listData}
        renderItem={renderItem}
        keyExtractor={(_, index) => (showingSkeletons ? `skeleton_${index}` : `${(listData[index] as any)?.name || index}_${index}`)}
        contentContainerStyle={styles.scrollContent}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={emptyComponent}
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        windowSize={5}
        removeClippedSubviews={Platform.OS === 'android'}
      />

      {/* FAB — Add Custom Combo */}
      <Animated.View style={[styles.fabContainer, fabAnimStyle]}>
        <Pressable
          style={({ pressed }) => [
            styles.fab,
            pressed && styles.fabPressed,
          ]}
          onPress={() => setIsCreatorVisible(true)}
        >
          <Text style={styles.fabIcon}>+</Text>
        </Pressable>
      </Animated.View>

      {/* Creator Modal */}
      <ComboCreatorModal
        visible={isCreatorVisible}
        onClose={() => setIsCreatorVisible(false)}
        onSave={handleSaveCustomCombo}
        controlType={controlType}
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
    paddingTop: 0,
    paddingBottom: 100,
  },
  legendBanner: {
    marginBottom: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: '#111',
    borderRadius: 10,
  },
  legendIconsContainer: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  legendFooter: {
    fontSize: 11,
    color: '#444',
    marginTop: 6,
    fontFamily: 'ShareTechMono-Regular',
  },
  arcadeLegendItem: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 2,
  },
  arcadeLegendLabel: {
    fontSize: 9,
    color: '#555',
    fontFamily: 'ShareTechMono-Regular',
  },
  legendDirectionsRow: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  arcadeNextText: {
    fontSize: 14,
    color: '#555',
    fontFamily: 'Rajdhani-SemiBold',
  },
  categoriesWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 14,
    paddingVertical: 4,
  },
  categoryTab: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1.5,
    marginRight: 6,
  },
  categoryTabInactive: {
    borderColor: '#333',
    backgroundColor: 'transparent',
  },
  categoryTabText: {
    fontFamily: 'Rajdhani-Bold',
    fontSize: 13,
    letterSpacing: 0.5,
  },
  categoryTabInactiveText: {
    color: '#555',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'Rajdhani-SemiBold',
    color: '#444',
  },
  emptyFavContainer: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 30,
  },
  emptyFavStar: {
    fontSize: 52,
    color: '#FFD700',
    marginBottom: 12,
    opacity: 0.6,
  },
  emptyFavTitle: {
    fontFamily: 'Rajdhani-Bold',
    fontSize: 18,
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  emptyFavHint: {
    fontFamily: 'Rajdhani-SemiBold',
    fontSize: 13,
    color: '#555',
    textAlign: 'center',
    lineHeight: 20,
  },
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
    paddingVertical: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  skeletonTitle: {
    height: 16,
    width: '40%',
    backgroundColor: '#222',
    borderRadius: 4,
  },
  skeletonBadge: {
    height: 16,
    width: 50,
    backgroundColor: '#222',
    borderRadius: 8,
  },
  skeletonInput: {
    height: 24,
    width: '70%',
    backgroundColor: '#222',
    borderRadius: 6,
    marginTop: 8,
  },
  skeletonNumpad: {
    height: 10,
    width: '30%',
    backgroundColor: '#222',
    borderRadius: 4,
    marginTop: 6,
  },
  skeletonDesc: {
    height: 14,
    width: '90%',
    backgroundColor: '#222',
    borderRadius: 4,
    marginTop: 8,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 28,
    right: 20,
    zIndex: 100,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#10b981',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#34d39955',
  },
  fabPressed: {
    backgroundColor: '#059669',
    transform: [{ scale: 0.92 }],
  },
  fabIcon: {
    color: '#fff',
    fontSize: 30,
    fontWeight: '300',
    marginTop: -2,
  },
});
