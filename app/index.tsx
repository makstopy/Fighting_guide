import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Header from '../components/Header';
import GameCover from '../components/GameCover';
import FIGHTERS_DB from '../data/fighters_db.json';

export default function HomeScreen() {
  const router = useRouter();

  // Filter games from database matching Vite app selection
  const games = Object.entries(FIGHTERS_DB).filter(([game]) =>
    ['Mortal Kombat 1', 'Street Fighter 6', 'Tekken 8'].includes(game)
  );

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
