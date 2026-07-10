import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { ImageMap } from './ImageMap';

export function resolveImageUri(path: string | null): any {
  if (!path) return undefined;

  if (ImageMap[path]) {
    return ImageMap[path];
  }

  // On Web, relative paths like /avatars/... resolve correctly automatically
  if (Platform.OS === 'web') {
    return path;
  }

  // On Native (Android/iOS) in development, prepend the Metro dev server host
  if (path.startsWith('/') && __DEV__) {
    const debuggerHost = Constants.expoConfig?.hostUri;
    if (debuggerHost) {
      const ip = debuggerHost.split(':')[0];
      return `http://${ip}:8081${path}`;
    }
    // Fallback for local emulator
    return `http://10.0.2.2:8081${path}`;
  }

  return path;
}
