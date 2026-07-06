import { useCallback, useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'custom_combos_v1';

export interface CustomCombo {
  id: string;
  name: string;
  input: string;        // always stored in PS notation (□ △ ✕ ○ L1 L2 R1 R2 ↑↓←→)
  description: string;
  category: 'custom';
  isCustom: true;
}

/** Full storage shape: { "game::char": CustomCombo[] } */
type StorageMap = Record<string, CustomCombo[]>;

function storageKey(game: string, char: string): string {
  return game + '::' + char;
}

export interface UseCustomCombosReturn {
  /** All custom combos for a given game+char */
  getCustomCombos: (game: string, char: string) => CustomCombo[];
  /** Add a new custom combo (returns the created combo) */
  addCustomCombo: (game: string, char: string, name: string, input: string, description: string) => CustomCombo;
  /** Delete a custom combo by id */
  deleteCustomCombo: (game: string, char: string, comboId: string) => void;
  /** Whether the initial load from storage has completed */
  isLoaded: boolean;
}

export function useCustomCombos(): UseCustomCombosReturn {
  const [data, setData] = useState<StorageMap>({});
  const [isLoaded, setIsLoaded] = useState(false);
  const dataRef = useRef<StorageMap>({});

  // Load from AsyncStorage on mount
  useEffect(() => {
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
  }, []);

  // Persist on every change (skip first render after load)
  const isFirstSave = useRef(true);
  useEffect(() => {
    if (!isLoaded) return;
    if (isFirstSave.current) {
      isFirstSave.current = false;
      return;
    }
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data, isLoaded]);

  const getCustomCombos = useCallback(
    (game: string, char: string): CustomCombo[] => {
      const key = storageKey(game, char);
      return data[key] || [];
    },
    [data]
  );

  const addCustomCombo = useCallback(
    (game: string, char: string, name: string, input: string, description: string): CustomCombo => {
      const combo: CustomCombo = {
        id: `custom_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        name,
        input,
        description,
        category: 'custom',
        isCustom: true,
      };
      setData((prev) => {
        const key = storageKey(game, char);
        const list = [...(prev[key] || []), combo];
        const next = { ...prev, [key]: list };
        dataRef.current = next;
        return next;
      });
      return combo;
    },
    []
  );

  const deleteCustomCombo = useCallback(
    (game: string, char: string, comboId: string) => {
      setData((prev) => {
        const key = storageKey(game, char);
        const list = (prev[key] || []).filter((c) => c.id !== comboId);
        const next = { ...prev, [key]: list };
        dataRef.current = next;
        return next;
      });
    },
    []
  );

  return { getCustomCombos, addCustomCombo, deleteCustomCombo, isLoaded };
}
