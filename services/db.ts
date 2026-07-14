import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { type SQLiteDatabase } from 'expo-sqlite';
import FIGHTERS_DB from '../data/fighters_db.json';
import CHAR_DATA from '../data/char_data.json';
import MK1_PORTRAITS from '../data/mk1_portraits.json';
import SF6_PORTRAITS from '../data/sf6_portraits.json';
import TEKKEN8_PORTRAITS from '../data/tekken8_portaits.json';
import COMBOS_DB from '../data/combos/index';

export const DB_VERSION = 14;

export interface SQLiteCombo {
  id: string;
  game_id: string;
  character_id: string;
  name: string;
  input: string;
  damage: string;
  difficulty: string;
  description: string;
  category: string;
  is_custom: number;
}

export interface SQLiteCharacter {
  id: string;
  game_id: string;
  name: string;
  portrait_uri: string | null;
  bg_grad: string; // JSON string of string[]
  icon: string;
  label: string;
}

export interface SQLiteGame {
  id: string;
  platform: string;
  cover_grad: string; // JSON string of string[]
  cover_label: string;
  cover_emoji: string;
}

// Check if we are running in a web environment
export const isWeb = Platform.OS === 'web';

/**
 * Initializes the SQLite Database schema and seeds static content.
 * Also performs migration of Favorites and Custom Combos from AsyncStorage.
 */
/**
 * Initializes the SQLite Database schema and seeds static content.
 * Returns true if initialization/migration was performed (first launch or upgrade),
 * false if the database was already up to date.
 */
export async function initializeDatabase(db: SQLiteDatabase): Promise<boolean> {
  if (isWeb) return false;

  try {
    // Always-safe pragma: enforce FK constraints on every connection
    await db.execAsync('PRAGMA foreign_keys = ON;');

    // Check Database Version
    const versionResult = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version;');
    const currentVersion = versionResult?.user_version ?? 0;

    console.log(`[Database] Current SQLite user_version = ${currentVersion}, target version = ${DB_VERSION}`);

    if (currentVersion < DB_VERSION) {
      // Set performance pragmas only during initialization (safe on fresh/new DB)
      await db.execAsync('PRAGMA journal_mode = WAL;');
      await db.execAsync('PRAGMA cache_size = -8000;');
      await db.execAsync('PRAGMA synchronous = NORMAL;');

      await setupSchema(db);
      await seedData(db);
      await migrateFromAsyncStorage(db);
      await db.execAsync(`PRAGMA user_version = ${DB_VERSION};`);
      console.log(`[Database] Database initialized and updated to version ${DB_VERSION}`);
      return true;
    }

    return false;
  } catch (error) {
    console.error('[Database] Error initializing database:', error);
    return false;
  }
}


/**
 * Creates DB tables if they do not exist.
 */
async function setupSchema(db: SQLiteDatabase) {
  console.log('[Database] Setting up tables...');
  
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS games (
      id TEXT PRIMARY KEY,
      platform TEXT,
      cover_grad TEXT,
      cover_label TEXT,
      cover_emoji TEXT
    );

    CREATE TABLE IF NOT EXISTS characters (
      id TEXT PRIMARY KEY,
      game_id TEXT NOT NULL,
      name TEXT NOT NULL,
      portrait_uri TEXT,
      bg_grad TEXT,
      icon TEXT,
      label TEXT,
      FOREIGN KEY (game_id) REFERENCES games (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS combos (
      id TEXT PRIMARY KEY,
      character_id TEXT NOT NULL,
      game_id TEXT NOT NULL,
      name TEXT NOT NULL,
      input TEXT NOT NULL,
      damage TEXT DEFAULT '-',
      difficulty TEXT DEFAULT '-',
      description TEXT DEFAULT '',
      category TEXT NOT NULL,
      is_custom INTEGER DEFAULT 0,
      FOREIGN KEY (character_id) REFERENCES characters (id) ON DELETE CASCADE,
      FOREIGN KEY (game_id) REFERENCES games (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS favorites (
      combo_id TEXT PRIMARY KEY,
      created_at INTEGER,
      FOREIGN KEY (combo_id) REFERENCES combos (id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_combos_game_char ON combos(game_id, character_id);
    CREATE INDEX IF NOT EXISTS idx_combos_is_custom ON combos(is_custom);
    CREATE INDEX IF NOT EXISTS idx_characters_game ON characters(game_id);
  `);
}

/**
 * Seeds static data from JSON files into SQLite database.
 */
async function seedData(db: SQLiteDatabase) {
  console.log('[Database] Seeding static games, characters, and combos data...');

  // Wrap all seeds in a transaction for speed and safety
  await db.execAsync('BEGIN TRANSACTION;');
  try {
    // 1. Seed Games — prepare statement once, execute many times
    const gameStmt = await db.prepareAsync(
      `INSERT OR REPLACE INTO games (id, platform, cover_grad, cover_label, cover_emoji) VALUES (?, ?, ?, ?, ?);`
    );
    try {
      for (const [gameName, info] of Object.entries(FIGHTERS_DB)) {
        const g = info as any;
        await gameStmt.executeAsync([
          gameName,
          g.platform || '',
          JSON.stringify(g.coverGrad || []),
          g.coverLabel || '',
          g.coverEmoji || ''
        ]);
      }
    } finally {
      await gameStmt.finalizeAsync();
    }

    // 2. Seed Characters — prepare statement once
    const charStmt = await db.prepareAsync(
      `INSERT OR REPLACE INTO characters (id, game_id, name, portrait_uri, bg_grad, icon, label) VALUES (?, ?, ?, ?, ?, ?, ?);`
    );
    try {
      for (const [gameName, info] of Object.entries(FIGHTERS_DB)) {
        const g = info as any;
        const charactersList = g.characters || [];
        for (const charName of charactersList) {
          const charId = `${gameName}::${charName}`;

          // Resolve portrait image
          let portrait: string | null = null;
          if (gameName === 'Mortal Kombat 1') {
            portrait = (MK1_PORTRAITS as any)[charName] || null;
          } else if (gameName === 'Street Fighter 6') {
            portrait = (SF6_PORTRAITS as any)[charName] || null;
          } else if (gameName === 'Tekken 8') {
            portrait = (TEKKEN8_PORTRAITS as any)[charName] || null;
          }

          // Get design parameters from char_data.json
          const charDesign = (CHAR_DATA as any)[charName] || {
            bg: ['#1a1a2e', '#333333'],
            icon: '🥷',
            label: charName.slice(0, 2).toUpperCase()
          };

          await charStmt.executeAsync([
            charId,
            gameName,
            charName,
            portrait,
            JSON.stringify(charDesign.bg),
            charDesign.icon,
            charDesign.label
          ]);
        }
      }
    } finally {
      await charStmt.finalizeAsync();
    }

    // 3. Clear existing static combos to prevent duplicates/stale data on upgrade
    await db.execAsync('DELETE FROM combos WHERE is_custom = 0;');

    // 4. Seed Combos — prepare statement once for all combos
    const comboStmt = await db.prepareAsync(
      `INSERT INTO combos (id, character_id, game_id, name, input, damage, difficulty, description, category, is_custom)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0);`
    );
    try {
      for (const [gameName, gameCombos] of Object.entries(COMBOS_DB)) {
        for (const [charName, combosList] of Object.entries(gameCombos as any)) {
          if (!Array.isArray(combosList)) continue;
          const charId = `${gameName}::${charName}`;
          for (let i = 0; i < combosList.length; i++) {
            const c = combosList[i] as any;
            const comboId = `static::${gameName}::${charName}::${i}`;
            await comboStmt.executeAsync([
              comboId,
              charId,
              gameName,
              c.name || '',
              c.input || '',
              c.damage || '-',
              c.difficulty || '-',
              c.description || '',
              c.category || 'combo'
            ]);
          }
        }
      }
    } finally {
      await comboStmt.finalizeAsync();
    }

    await db.execAsync('COMMIT;');
    console.log('[Database] Seeding completed successfully!');
  } catch (error) {
    await db.execAsync('ROLLBACK;');
    console.error('[Database] Failed to seed database, transaction rolled back:', error);
    throw error;
  }
}

/**
 * Handles migration from AsyncStorage (Custom Combos & Favorites) to SQLite on initial boot.
 */
async function migrateFromAsyncStorage(db: SQLiteDatabase) {
  console.log('[Database] Checking for pre-existing AsyncStorage user data to migrate...');

  // 1. Migrate Custom Combos
  try {
    const rawCustomCombos = await AsyncStorage.getItem('custom_combos_v1');
    if (rawCustomCombos) {
      console.log('[Database] Found AsyncStorage custom combos. Migrating...');
      const storageMap: Record<string, any[]> = JSON.parse(rawCustomCombos);
      
      await db.execAsync('BEGIN TRANSACTION;');
      for (const [gameCharKey, comboList] of Object.entries(storageMap)) {
        // gameCharKey looks like "game::char"
        const [gameName, charName] = gameCharKey.split('::');
        if (!gameName || !charName) continue;
        const charId = `${gameName}::${charName}`;

        for (const c of comboList) {
          await db.runAsync(
            `INSERT OR REPLACE INTO combos (id, character_id, game_id, name, input, damage, difficulty, description, category, is_custom)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1);`,
            [
              c.id, // Keep the same ID generated by the app previously
              charId,
              gameName,
              c.name || '',
              c.input || '',
              c.damage || '-',
              c.difficulty || '-',
              c.description || '',
              'custom'
            ]
          );
        }
      }
      await db.execAsync('COMMIT;');
      
      // Cleanup AsyncStorage so we don't migrate again
      await AsyncStorage.removeItem('custom_combos_v1');
      console.log('[Database] Custom combos migrated successfully!');
    }
  } catch (err) {
    await db.execAsync('ROLLBACK;');
    console.error('[Database] Failed to migrate custom combos:', err);
  }

  // 2. Migrate Favorites
  try {
    const rawFavorites = await AsyncStorage.getItem('favorites_v1');
    if (rawFavorites) {
      console.log('[Database] Found AsyncStorage favorites list. Migrating...');
      const favoritesList: string[] = JSON.parse(rawFavorites);
      
      await db.execAsync('BEGIN TRANSACTION;');
      for (const favoriteKey of favoritesList) {
        // favoriteKey looks like "game::char::comboName::comboInput"
        const parts = favoriteKey.split('::');
        if (parts.length < 4) continue;
        
        const gameName = parts[0];
        const charName = parts[1];
        const comboName = parts.slice(2, parts.length - 1).join('::'); // handle names with double colons if any
        const comboInput = parts[parts.length - 1];

        // Search for this combo in SQLite (either static or custom)
        const row = await db.getFirstAsync<{ id: string }>(
          `SELECT id FROM combos 
           WHERE game_id = ? AND character_id = ? AND name = ? AND input = ? LIMIT 1;`,
          [gameName, `${gameName}::${charName}`, comboName, comboInput]
        );

        if (row) {
          await db.runAsync(
            `INSERT OR REPLACE INTO favorites (combo_id, created_at) VALUES (?, ?);`,
            [row.id, Date.now()]
          );
        }
      }
      await db.execAsync('COMMIT;');

      // Cleanup AsyncStorage
      await AsyncStorage.removeItem('favorites_v1');
      console.log('[Database] Favorites migrated successfully!');
    }
  } catch (err) {
    await db.execAsync('ROLLBACK;');
    console.error('[Database] Failed to migrate favorites:', err);
  }
}
