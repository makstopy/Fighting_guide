import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, FlatList, Platform } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useControl } from '../components/ControlContext';
import Header from '../components/Header';
import CharacterHeaderCard from '../components/CharacterHeaderCard';
import ComboCard from '../components/ComboCard';
import COMBOS_DB from '../data/combos/index';

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
    ["brutality", "Brutality"],
    ["fatality", "Fatality"]
  ],
  "Street Fighter 6": [
    ["all", "Все"],
    ["combo", "Комбо"],
    ["super", "Суперы"]
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
    ["Moves While Opponent is Down", "Moves While Opponent is Down"]
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
  super: '#f59e0b',
  rage: '#ef4444',
  overdrive: '#06b6d4',
  taunt: '#22d3ee',
  breaker: '#fb7185',

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
  'Moves While Opponent is Down': '#64748b'
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
  const [activeCategory, setActiveCategory] = useState('all');
  const [combos, setCombos] = useState<any[]>([]);
  const [isTransitionFinished, setIsTransitionFinished] = useState(Platform.OS === 'web');

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

  // Function to load and transform combos based on active controller type
  const loadCombos = (gameName: string, character: string, control: string) => {
    const raw = (COMBOS_DB as any)[gameName]?.[character] || [];
    
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
  };

  useEffect(() => {
    if (game && char) {
      setCombos(loadCombos(game, char, controlType));
    }
  }, [game, char, controlType]);

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
        <ArcadeSep />
        <Text style={styles.arcadeNextText}>= следующий</Text>
      </View>
    </View>
  );

  // Filter combos by selected category tab
  const filteredCombos = activeCategory === 'all'
    ? combos
    : combos.filter(c => c.category === activeCategory);

  const renderHeader = () => (
    <View>
      {/* Character bio card */}
      <CharacterHeaderCard game={game} char={char} />

      {/* Controller inputs legend banner */}
      <View style={styles.legendBanner}>
        {controlType === 'PS' ? <PSLegend /> : controlType === 'Xbox' ? <XboxLegend /> : <ArcadeLegend />}
        <Text style={styles.legendFooter}>, = кансел  ·  + одновременно</Text>
      </View>

      {/* Category tabs */}
      {game && GAME_CATS[game] && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScroll}
        >
          {GAME_CATS[game].map(([key, label]) => {
            const isActive = activeCategory === key;
            const col = CATEGORY_COLORS[key] || '#e63b2e';
            return (
              <TouchableOpacity
                key={key}
                onPress={() => setActiveCategory(key)}
                style={[
                  styles.categoryTab,
                  isActive ? { backgroundColor: `${col}22`, borderColor: col } : styles.categoryTabInactive
                ]}
                activeOpacity={0.8}
              >
                <Text style={[styles.categoryTabText, isActive ? { color: col } : styles.categoryTabInactiveText]}>
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </View>
  );

  const renderItem = ({ item }: { item: any }) => {
    if (!isTransitionFinished) {
      return <ComboSkeleton />;
    }
    return <ComboCard combo={item} controlType={controlType} />;
  };

  const listData = isTransitionFinished ? filteredCombos : [1, 2, 3];

  return (
    <View style={styles.container}>
      <Header showBack gameTitle={game} charName={char} />
      <FlatList
        data={listData}
        renderItem={renderItem}
        keyExtractor={(item, index) => (isTransitionFinished ? `${item.name || index}_${index}` : `skeleton_${index}`)}
        contentContainerStyle={styles.scrollContent}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          isTransitionFinished ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>📋</Text>
              <Text style={styles.emptyText}>Нет записей в этой категории</Text>
            </View>
          ) : null
        }
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        windowSize={5}
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
    paddingTop: 16,
    paddingBottom: 40,
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
    flexWrap: 'wrap',
    marginTop: 4,
  },
  arcadeNextText: {
    fontSize: 14,
    color: '#555',
    fontFamily: 'Rajdhani-SemiBold',
  },
  categoriesScroll: {
    flexDirection: 'row',
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
});
