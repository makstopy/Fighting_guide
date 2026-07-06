import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import Header from '../components/Header';
import GameCover from '../components/GameCover';
import FIGHTERS_DB from '../data/fighters_db.json';
import { useSQLiteContext } from 'expo-sqlite';

export default function HomeScreen() {
  const router = useRouter();
  const isWeb = Platform.OS === 'web';
  
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const db = isWeb ? null : useSQLiteContext();

  const [games, setGames] = useState<[string, any][]>([]);

  useEffect(() => {
    if (isWeb) {
      // Web fallback
      const filtered = Object.entries(FIGHTERS_DB).filter(([game]) =>
        ['Mortal Kombat 1', 'Street Fighter 6', 'Tekken 8'].includes(game)
      );
      setGames(filtered);
    } else if (db) {
      // Native SQLite query
      db.getAllAsync<any>(
        `SELECT id, platform, cover_grad, cover_label, cover_emoji 
         FROM games 
         WHERE id IN ('Mortal Kombat 1', 'Street Fighter 6', 'Tekken 8');`
      )
        .then((rows) => {
          const formatted: [string, any][] = rows.map((r) => [
            r.id,
            {
              platform: r.platform,
              coverGrad: JSON.parse(r.cover_grad || '[]'),
              coverLabel: r.cover_label,
              coverEmoji: r.cover_emoji,
            },
          ]);
          setGames(formatted);
        })
        .catch((err) => {
          console.error('[HomeScreen] Error loading games from SQLite:', err);
          // Fallback to static if SQLite query fails
          const filtered = Object.entries(FIGHTERS_DB).filter(([game]) =>
            ['Mortal Kombat 1', 'Street Fighter 6', 'Tekken 8'].includes(game)
          );
          setGames(filtered);
        });
    }
  }, [isWeb, db]);

  const handleSelectGame = (game: string) => {
    router.push({
      pathname: '/characters',
      params: { game },
    });
  };

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>Выбери файтинг</Text>
        {games.map(([game, info]: [string, any], index) => (
          <TouchableOpacity
            key={game}
            style={styles.gameCard}
            onPress={() => handleSelectGame(game)}
            activeOpacity={0.7}
          >
            <View style={styles.gameInfo}>
              <Text style={styles.gameTitle}>{game}</Text>
              <Text style={styles.gamePlatform}>{info.platform}</Text>
            </View>
            <GameCover game={game} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0f',
  },
  scrollContent: {
    padding: 20,
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
  gameCard: {
    width: '100%',
    backgroundColor: '#16213e',
    borderWidth: 1,
    borderColor: 'rgba(230, 59, 46, 0.13)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gameInfo: {
    flex: 1,
    marginRight: 12,
  },
  gameTitle: {
    fontFamily: 'Rajdhani-Bold',
    fontSize: 16,
    color: '#fff',
    marginBottom: 4,
  },
  gamePlatform: {
    fontFamily: 'Rajdhani-SemiBold',
    fontSize: 11,
    color: '#666',
  },
});
