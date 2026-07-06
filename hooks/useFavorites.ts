import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSQLiteContext } from 'expo-sqlite';

const STORAGE_KEY = 'favorites_v1';

/**
 * Composite key: game::char::comboName::comboInput
 * Category-agnostic — same combo from any tab maps to same key.
 */
export function makeComboKey(
  game: string,
  char: string,
  comboName: string,
  comboInput: string
): string {
  return game + '::' + char + '::' + comboName + '::' + comboInput;
}

interface UseFavoritesReturn {
  favoriteIds: Set<string>;
  isLoaded: boolean;
  toggleFavorite: (key: string) => void;
  isFavorite: (key: string) => boolean;
  hasFavoritesFor: (game: string, char: string) => boolean;
}

export function useFavorites(): UseFavoritesReturn {
  const isWeb = Platform.OS === 'web';
  
  // Conditionally invoke SQLite hook to avoid runtime issues on Web where SQLiteProvider is omitted
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const db = isWeb ? null : useSQLiteContext();

  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [isLoaded, setIsLoaded] = useState(false);
  const favoriteIdsRef = useRef<Set<string>>(new Set());

  // 1. Initial Load
  useEffect(() => {
    if (isWeb) {
      // Web fallback: Load from AsyncStorage
      AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
        if (raw) {
          try {
            const arr: string[] = JSON.parse(raw);
            const loaded = new Set<string>(arr);
            favoriteIdsRef.current = loaded;
            setFavoriteIds(loaded);
          } catch {
            // corrupted data — start fresh
          }
        }
        setIsLoaded(true);
      });
    } else if (db) {
      // Native SQLite: Query all favorites and build composite keys
      db.getAllAsync<any>(
        `SELECT c.game_id, c.character_id, c.name, c.input 
         FROM favorites f 
         JOIN combos c ON f.combo_id = c.id;`
      )
        .then((rows) => {
          const loadedKeys = new Set<string>();
          for (const row of rows) {
            // character_id is gameName::charName
            const charName = row.character_id.split('::')[1] || row.character_id;
            const key = makeComboKey(row.game_id, charName, row.name, row.input);
            loadedKeys.add(key);
          }
          favoriteIdsRef.current = loadedKeys;
          setFavoriteIds(loadedKeys);
          setIsLoaded(true);
        })
        .catch((err) => {
          console.error('[useFavorites] Failed to load favorites from SQLite:', err);
          setIsLoaded(true);
        });
    }
  }, [isWeb, db]);

  // 2. Web Persist Effect
  const isFirstSave = useRef(true);
  useEffect(() => {
    if (!isWeb || !isLoaded) return;
    if (isFirstSave.current) {
      isFirstSave.current = false;
      return;
    }
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([...favoriteIds]));
  }, [favoriteIds, isLoaded, isWeb]);

  const toggleFavorite = useCallback((key: string) => {
    let wasAdded = false;

    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
        wasAdded = false;
      } else {
        next.add(key);
        wasAdded = true;
      }
      favoriteIdsRef.current = next;
      return next;
    });

    // Save to Database on Native
    if (!isWeb && db) {
      // Parse composite key parts
      const parts = key.split('::');
      if (parts.length < 4) return;
      
      const gameName = parts[0];
      const charName = parts[1];
      const comboName = parts.slice(2, parts.length - 1).join('::');
      const comboInput = parts[parts.length - 1];

      // Async look up the combo in database and update favorites table
      db.getFirstAsync<{ id: string }>(
        `SELECT id FROM combos 
         WHERE game_id = ? AND character_id = ? AND name = ? AND input = ? LIMIT 1;`,
        [gameName, `${gameName}::${charName}`, comboName, comboInput]
      )
        .then((row) => {
          if (!row) {
            console.warn('[useFavorites] Could not find matching combo in SQLite for key:', key);
            return;
          }
          if (wasAdded) {
            db.runAsync(
              `INSERT OR REPLACE INTO favorites (combo_id, created_at) VALUES (?, ?);`,
              [row.id, Date.now()]
            ).catch((err) => console.error('[useFavorites] Failed to insert favorite:', err));
          } else {
            db.runAsync(`DELETE FROM favorites WHERE combo_id = ?;`, [row.id]).catch((err) =>
              console.error('[useFavorites] Failed to delete favorite:', err)
            );
          }
        })
        .catch((err) => {
          console.error('[useFavorites] Error toggling favorite in SQLite:', err);
        });
    }
  }, [isWeb, db]);

  const isFavorite = useCallback(
    (key: string): boolean => favoriteIds.has(key),
    [favoriteIds]
  );

  /**
   * Checks synchronously via ref whether current char has any favorites.
   * Used to pick the default active tab when the screen opens.
   */
  const hasFavoritesFor = useCallback((game: string, char: string): boolean => {
    const prefix = game + '::' + char + '::';
    for (const id of favoriteIdsRef.current) {
      if (id.startsWith(prefix)) return true;
    }
    return false;
  }, []);

  return { favoriteIds, isLoaded, toggleFavorite, isFavorite, hasFavoritesFor };
}
