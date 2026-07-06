import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSQLiteContext } from 'expo-sqlite';

const STORAGE_KEY = 'custom_combos_v1';

export interface CustomCombo {
  id: string;
  name: string;
  input: string;        // always stored in PS notation (□ △ ✕ ○ L1 L2 R1 R2 ↑↓←→)
  description: string;
  category: 'custom';
  isCustom: true;
}

type StorageMap = Record<string, CustomCombo[]>;

function storageKey(game: string, char: string): string {
  return game + '::' + char;
}

export interface UseCustomCombosReturn {
  getCustomCombos: (game: string, char: string) => CustomCombo[];
  addCustomCombo: (game: string, char: string, name: string, input: string, description: string) => CustomCombo;
  deleteCustomCombo: (game: string, char: string, comboId: string) => void;
  isLoaded: boolean;
}

export function useCustomCombos(): UseCustomCombosReturn {
  const isWeb = Platform.OS === 'web';
  
  // Conditionally invoke SQLite hook to avoid runtime issues on Web where SQLiteProvider is omitted
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const db = isWeb ? null : useSQLiteContext();

  const [data, setData] = useState<StorageMap>({});
  const [isLoaded, setIsLoaded] = useState(false);
  const dataRef = useRef<StorageMap>({});

  // 1. Initial Load
  useEffect(() => {
    if (isWeb) {
      // Web fallback: Load from AsyncStorage
      AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
        if (raw) {
          try {
            const parsed: StorageMap = JSON.parse(raw);
            dataRef.current = parsed;
            setData(parsed);
          } catch {
            // corrupted — start fresh
          }
        }
        setIsLoaded(true);
      });
    } else if (db) {
      // Native SQLite: Load all custom combos
      db.getAllAsync<any>('SELECT * FROM combos WHERE is_custom = 1;')
        .then((rows) => {
          const map: StorageMap = {};
          for (const row of rows) {
            // character_id in DB is "game::char"
            const key = row.character_id; 
            if (!map[key]) {
              map[key] = [];
            }
            map[key].push({
              id: row.id,
              name: row.name,
              input: row.input,
              description: row.description,
              category: 'custom',
              isCustom: true
            });
          }
          dataRef.current = map;
          setData(map);
          setIsLoaded(true);
        })
        .catch((err) => {
          console.error('[useCustomCombos] Failed to load custom combos from SQLite:', err);
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
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data, isLoaded, isWeb]);

  const getCustomCombos = useCallback(
    (game: string, char: string): CustomCombo[] => {
      const key = storageKey(game, char);
      return data[key] || [];
    },
    [data]
  );

  const addCustomCombo = useCallback(
    (game: string, char: string, name: string, input: string, description: string): CustomCombo => {
      const comboId = `custom_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      const combo: CustomCombo = {
        id: comboId,
        name,
        input,
        description,
        category: 'custom',
        isCustom: true,
      };

      const key = storageKey(game, char);

      // Save to React State immediately
      setData((prev) => {
        const list = [...(prev[key] || []), combo];
        const next = { ...prev, [key]: list };
        dataRef.current = next;
        return next;
      });

      // Persist to Database on Native
      if (!isWeb && db) {
        db.runAsync(
          `INSERT INTO combos (id, character_id, game_id, name, input, category, description, is_custom)
           VALUES (?, ?, ?, ?, ?, 'custom', ?, 1);`,
          [comboId, key, game, name, input, description]
        ).catch((err) => {
          console.error('[useCustomCombos] Failed to save custom combo to SQLite:', err);
        });
      }

      return combo;
    },
    [isWeb, db]
  );

  const deleteCustomCombo = useCallback(
    (game: string, char: string, comboId: string) => {
      const key = storageKey(game, char);

      // Update React State immediately
      setData((prev) => {
        const list = (prev[key] || []).filter((c) => c.id !== comboId);
        const next = { ...prev, [key]: list };
        dataRef.current = next;
        return next;
      });

      // Persist to Database on Native
      if (!isWeb && db) {
        db.runAsync('DELETE FROM combos WHERE id = ?;', [comboId]).catch((err) => {
          console.error('[useCustomCombos] Failed to delete custom combo from SQLite:', err);
        });
      }
    },
    [isWeb, db]
  );

  return { getCustomCombos, addCustomCombo, deleteCustomCombo, isLoaded };
}
