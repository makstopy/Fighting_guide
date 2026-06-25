import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import {
  PSSquare,
  PSTriangle,
  PSCross,
  PSCircle,
  PSBumper,
  XboxA,
  XboxB,
  XboxX,
  XboxY,
  XboxBumper,
  DirArrow,
  ArcadeDir,
  ArcadeButton,
  ArcadeArrow,
  ArcadeSep,
  DotGrid
} from './icons/ControllerIcons';
import { ControlType } from './ControlContext';

const MOVE_ICONS: Record<string, any> = {
  "heat-engager": require('../assets/images/heat-engager.avif'),
  "gauge-diminisher": require('../assets/images/gauge-diminisher.avif'),
  "homing-attack": require('../assets/images/homing-attack.avif'),
  "power-crush": require('../assets/images/power-crush.avif'),
  "tornado-move": require('../assets/images/tornado-move.avif'),
};

const ARCADE_DOT_MAP: Record<string, number[]> = {
  "□": [1, 0, 0, 0],
  "△": [0, 1, 0, 0],
  "○": [0, 0, 1, 0],
  "✕": [0, 0, 0, 1],
  "L1": [1, 1, 0, 0],
  "L2": [0, 0, 1, 1],
  "R1": [0, 1, 1, 0],
  "R2": [1, 1, 1, 1],
  "LP": [1, 0, 0, 0],
  "RP": [0, 1, 0, 0],
  "LK": [0, 0, 1, 0],
  "RK": [0, 0, 0, 1],
  "LP+RP": [1, 1, 0, 0],
  "LK+RK": [0, 0, 1, 1],
  "RP+LK": [0, 1, 1, 0],
  "LP+RK": [1, 0, 0, 1],
  "LP+LK": [1, 0, 1, 0],
  "RP+RK": [0, 1, 0, 1],
  "LP+RP+LK": [1, 1, 1, 0],
  "LP+RP+RK": [1, 1, 0, 1],
  "LP+RP+LK+RK": [1, 1, 1, 1],
};

interface ButtonTokenProps {
  token: string;
  controlType: ControlType;
}

export default function ButtonToken({ token, controlType }: ButtonTokenProps) {
  const s = 22;

  // ── Arcade mode ─────────────────────────────────────────────────────────────
  if (controlType === 'Arcade') {
    if (token.startsWith('[[ICON:')) {
      const key = token.slice(7, -2);
      const src = MOVE_ICONS[key];
      if (src) {
        return (
          <Image
            source={src}
            style={styles.arcadeIcon}
            resizeMode="contain"
          />
        );
      }
      return <Text style={styles.iconFallback}>[{key}]</Text>;
    }

    if (['↑', '↓', '←', '→', '↗', '↘', '↙', '↖'].includes(token)) {
      return <ArcadeArrow dir={token} size={28} />;
    }

    if (ARCADE_DOT_MAP[token]) {
      return <ArcadeButton label={token} size={35} />;
    }

    if (token.includes('+')) {
      const parts = token.split('+');
      const combined = parts.reduce((acc, p) => {
        const d = ARCADE_DOT_MAP[p];
        if (!d) return acc;
        return acc.map((v, i) => v || d[i] ? 1 : 0);
      }, [0, 0, 0, 0]);

      if (combined.some(v => v)) {
        return (
          <View style={styles.arcadeCombinedDotGrid}>
            <DotGrid dots={combined} size={35} />
          </View>
        );
      }
    }

    if (token === ',') return <ArcadeSep />;
    if (token === '+') return <Text style={styles.arcadePlus}>+</Text>;

    return <Text style={styles.arcadeTokenFallback}>{token}</Text>;
  }

  // ── PS mode ──────────────────────────────────────────────────────────────────
  if (controlType === 'PS') {
    if (token === '□') return <PSSquare size={s} />;
    if (token === '△') return <PSTriangle size={s} />;
    if (token === '✕' || token === 'X') return <PSCross size={s} />;
    if (token === '○') return <PSCircle size={s} />;
    if (token === 'L1') return <PSBumper label="L1" size={s} />;
    if (token === 'L2') return <PSBumper label="L2" size={s} />;
    if (token === 'R1') return <PSBumper label="R1" size={s} />;
    if (token === 'R2') return <PSBumper label="R2" size={s} />;

    // Tekken notation → PS
    const tekkenPS: Record<string, React.ReactNode> = {
      'LP': <PSSquare size={s} />,
      'RP': <PSTriangle size={s} />,
      'LK': <PSCircle size={s} />,
      'RK': <PSCross size={s} />,
      'LP+RP': <PSBumper label="L1" size={s} />,
      'LK+RK': <PSBumper label="L2" size={s} />,
      'RP+LK': <PSBumper label="R1" size={s} />,
      'LP+RP+LK+RK': <PSBumper label="R2" size={s} />,
    };
    if (tekkenPS[token]) return <>{tekkenPS[token]}</>;
  }

  // ── Xbox mode ────────────────────────────────────────────────────────────────
  if (controlType === 'Xbox') {
    if (token === 'A') return <XboxA size={s} />;
    if (token === 'B') return <XboxB size={s} />;
    if (token === 'X') return <XboxX size={s} />;
    if (token === 'Y') return <XboxY size={s} />;
    if (token === 'LB') return <XboxBumper label="LB" size={s} />;
    if (token === 'LT') return <XboxBumper label="LT" size={s} />;
    if (token === 'RB') return <XboxBumper label="RB" size={s} />;
    if (token === 'RT') return <XboxBumper label="RT" size={s} />;

    // Tekken notation → Xbox
    const tekkenXbox: Record<string, React.ReactNode> = {
      'LP': <XboxX size={s} />,
      'RP': <XboxY size={s} />,
      'LK': <XboxB size={s} />,
      'RK': <XboxA size={s} />,
      'LP+RP': <XboxBumper label="LB" size={s} />,
      'LK+RK': <XboxBumper label="LT" size={s} />,
      'RP+LK': <XboxBumper label="RB" size={s} />,
      'LP+RP+LK+RK': <XboxBumper label="RT" size={s} />,
    };
    if (tekkenXbox[token]) return <>{tekkenXbox[token]}</>;
  }

  // ── Move-type icons ([[ICON:xxx]]) ──────────────────────────────────────────
  if (token.startsWith('[[ICON:')) {
    const key = token.slice(7, -2);
    const src = MOVE_ICONS[key];
    if (src) {
      return (
        <Image
          source={src}
          style={styles.smallMoveIcon}
          resizeMode="contain"
        />
      );
    }
    return <Text style={styles.smallIconFallback}>[{key}]</Text>;
  }

  if (['↑', '↓', '←', '→', '↗', '↘', '↙', '↖'].includes(token)) {
    return <DirArrow dir={token} size={s} />;
  }

  if (token === '~') return <Text style={styles.tilde}>~</Text>;
  if (token === '+') return <Text style={styles.plus}>+</Text>;
  if (token === ',') return <Text style={styles.comma}>,</Text>;

  return <Text style={styles.tokenFallback}>{token}</Text>;
}

const styles = StyleSheet.create({
  arcadeIcon: {
    width: 35,
    height: 35,
    marginHorizontal: 2,
  },
  iconFallback: {
    color: '#16f1f9',
    fontSize: 11,
    fontFamily: 'System',
  },
  arcadeCombinedDotGrid: {
    transform: [{ rotate: '-15deg' }],
  },
  arcadePlus: {
    color: '#22c55e',
    fontSize: 14,
    fontWeight: '700',
    marginHorizontal: 2,
    fontFamily: 'System',
  },
  arcadeTokenFallback: {
    color: '#aaa',
    fontSize: 16,
    fontFamily: 'System',
  },
  smallMoveIcon: {
    width: 20,
    height: 20,
    marginHorizontal: 2,
  },
  smallIconFallback: {
    color: '#f97316',
    fontSize: 11,
    fontFamily: 'System',
  },
  tilde: {
    color: '#e63b2e',
    fontSize: 14,
    fontWeight: '700',
    marginHorizontal: 1,
    fontFamily: 'System',
  },
  plus: {
    color: '#ff8c00',
    fontSize: 14,
    fontWeight: '700',
    marginHorizontal: 1,
    fontFamily: 'System',
  },
  comma: {
    color: '#fff',
    fontSize: 16,
    marginHorizontal: 4,
    fontWeight: '700',
    fontFamily: 'System',
  },
  tokenFallback: {
    color: '#eae7e7',
    fontSize: 16,
    fontFamily: 'ShareTechMono-Regular',
    marginHorizontal: 1,
  },
});
