import { useCallback, useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [isLoaded, setIsLoaded] = useState(false);
  // Ref keeps the latest value available synchronously for hasFavoritesFor
  const favoriteIdsRef = useRef<Set<string>>(new Set());

  // Load from AsyncStorage on mount
  useEffect(() => {
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
  }, []);

  // Persist on every change, but skip the very first render after load
  const isFirstSave = useRef(true);
  useEffect(() => {
    if (!isLoaded) return;
    if (isFirstSave.current) {
      isFirstSave.current = false;
      return;
    }
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([...favoriteIds]));
  }, [favoriteIds, isLoaded]);

  const toggleFavorite = useCallback((key: string) => {
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      favoriteIdsRef.current = next;
      return next;
    });
  }, []);

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
