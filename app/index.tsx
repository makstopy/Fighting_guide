import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Header from '../components/Header';
import FIGHTERS_DB from '../data/fighters_db.json';

const GAME_LOGOS: Record<string, any> = {
  'Mortal Kombat 1': require('../assets/images/mk1-de-logo-white.webp'),
  'Street Fighter 6': require('../assets/images/SF6_logo.png'),
  'Tekken 8': require('../assets/images/tekken8-logo-sm.png'),
  'Fatal Fury: City of the Wolves': require('../assets/images/logo_fatal_fury_cotw.png'),
};

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
        ['Mortal Kombat 1', 'Street Fighter 6', 'Tekken 8', 'Fatal Fury: City of the Wolves'].includes(game)
      );
      setGames(filtered);
    } else if (db) {
      // Native SQLite query
      db.getAllAsync<any>(
        `SELECT id, platform, cover_grad, cover_label, cover_emoji 
         FROM games 
         WHERE id IN ('Mortal Kombat 1', 'Street Fighter 6', 'Tekken 8', 'Fatal Fury: City of the Wolves');`
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
            ['Mortal Kombat 1', 'Street Fighter 6', 'Tekken 8', 'Fatal Fury: City of the Wolves'].includes(game)
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
        <Text style={styles.sectionTitle}>Choose a fighting game</Text>
        {games.map(([game, info]: [string, any]) => {
          const logoSource = GAME_LOGOS[game];
          const colors = info.coverGrad && info.coverGrad.length >= 2
            ? info.coverGrad
            : ['#16213e', '#0f172a'];

          return (
            <TouchableOpacity
              key={game}
              onPress={() => handleSelectGame(game)}
              activeOpacity={0.85}
              style={styles.cardContainer}
            >
              <LinearGradient
                colors={colors}
                start={game === 'Fatal Fury: City of the Wolves' ? { x: 0, y: 0.5 } : { x: 0, y: 0 }}
                end={game === 'Fatal Fury: City of the Wolves' ? { x: 1, y: 0.5 } : { x: 1, y: 1 }}
                style={styles.gameCard}
              >
                {logoSource ? (
                  <Image
                    source={logoSource}
                    style={game === 'Fatal Fury: City of the Wolves' ? styles.fatalFuryLogo : styles.gameLogo}
                    resizeMode="contain"
                  />
                ) : (
                  <Text style={styles.gameTitle}>{game}</Text>
                )}

                <View style={styles.platformBadge}>
                  <Text style={styles.gamePlatform}>{info.platform}</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          );
        })}
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
  cardContainer: {
    width: '100%',
    marginBottom: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  gameCard: {
    width: '100%',
    height: 130,
    borderRadius: 16,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  gameLogo: {
    width: '80%',
    height: 80,
  },
  fatalFuryLogo: {
    width: '95%',
    height: 120,
  },
  gameTitle: {
    fontFamily: 'Rajdhani-Bold',
    fontSize: 22,
    color: '#fff',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  platformBadge: {
    position: 'absolute',
    bottom: 8,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  gamePlatform: {
    fontFamily: 'Rajdhani-SemiBold',
    fontSize: 9,
    color: 'rgba(255, 255, 255, 0.8)',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
