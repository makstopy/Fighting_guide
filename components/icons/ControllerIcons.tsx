import React from 'react';
import Svg, { Circle, Rect, Polygon, Line, Path, Text as SvgText } from 'react-native-svg';
import { StyleSheet, View, Text } from 'react-native';

// ─── PS SVG Icons ─────────────────────────────────────────────────────────────
export function PSSquare({ size = 22 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="11" stroke="#C084FC" strokeWidth={1.5} fill="#C084FC18" />
      <Rect x="7" y="7" width="10" height="10" stroke="#C084FC" strokeWidth={1.8} fill="none" />
    </Svg>
  );
}

export function PSTriangle({ size = 22 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="11" stroke="#34D399" strokeWidth={1.5} fill="#34D39918" />
      <Polygon points="12,6 19,18 5,18" stroke="#34D399" strokeWidth={1.8} fill="none" strokeLinejoin="round" />
    </Svg>
  );
}

export function PSCross({ size = 22 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="11" stroke="#60A5FA" strokeWidth={1.5} fill="#60A5FA18" />
      <Line x1="7.5" y1="7.5" x2="16.5" y2="16.5" stroke="#60A5FA" strokeWidth={2} strokeLinecap="round" />
      <Line x1="16.5" y1="7.5" x2="7.5" y2="16.5" stroke="#60A5FA" strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

export function PSCircle({ size = 22 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="11" stroke="#F87171" strokeWidth={1.5} fill="#F8717118" />
      <Circle cx="12" cy="12" r="5" stroke="#F87171" strokeWidth={1.8} fill="none" />
    </Svg>
  );
}

export function PSBumper({ label, size = 22 }: { label: string; size?: number }) {
  return (
    <Svg width={size * 1.5} height={size} viewBox="0 0 36 24" fill="none">
      <Rect x="1" y="4" width="34" height="16" rx="5" stroke="#94A3B8" strokeWidth={1.5} fill="#94A3B818" />
      <SvgText x="18" y="15" textAnchor="middle" fill="#94A3B8" fontSize={10} fontFamily="Rajdhani-Bold" fontWeight="700">{label}</SvgText>
    </Svg>
  );
}

// ─── Xbox SVG Icons ───────────────────────────────────────────────────────────
export function XboxA({ size = 22 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="11" stroke="#34D399" strokeWidth={1.5} fill="#34D39918" />
      <SvgText x="12" y="16" textAnchor="middle" fill="#34D399" fontSize={12} fontFamily="System" fontWeight="700">A</SvgText>
    </Svg>
  );
}

export function XboxB({ size = 22 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="11" stroke="#F87171" strokeWidth={1.5} fill="#F8717118" />
      <SvgText x="12" y="16" textAnchor="middle" fill="#F87171" fontSize={12} fontFamily="System" fontWeight="700">B</SvgText>
    </Svg>
  );
}

export function XboxX({ size = 22 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="11" stroke="#60A5FA" strokeWidth={1.5} fill="#60A5FA18" />
      <SvgText x="12" y="16" textAnchor="middle" fill="#60A5FA" fontSize={12} fontFamily="System" fontWeight="700">X</SvgText>
    </Svg>
  );
}

export function XboxY({ size = 22 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="11" stroke="#FBBF24" strokeWidth={1.5} fill="#FBBF2418" />
      <SvgText x="12" y="16" textAnchor="middle" fill="#FBBF24" fontSize={12} fontFamily="System" fontWeight="700">Y</SvgText>
    </Svg>
  );
}

export function XboxBumper({ label, size = 22 }: { label: string; size?: number }) {
  return (
    <Svg width={size * 1.5} height={size} viewBox="0 0 36 24" fill="none">
      <Rect x="1" y="4" width="34" height="16" rx="5" stroke="#94A3B8" strokeWidth={1.5} fill="#94A3B818" />
      <SvgText x="18" y="15" textAnchor="middle" fill="#94A3B8" fontSize={10} fontFamily="Rajdhani-Bold" fontWeight="700">{label}</SvgText>
    </Svg>
  );
}

// ─── Direction Arrow SVG ──────────────────────────────────────────────────────
export function DirArrow({ dir, size = 20 }: { dir: string; size?: number }) {
  const arrows: Record<string, string> = {
    "↑": "M12 17 L12 7 M7 12 L12 7 L17 12",
    "↓": "M12 7 L12 17 M7 12 L12 17 L17 12",
    "←": "M17 12 L7 12 M7 12 L12 7 M7 12 L12 17",
    "→": "M7 12 L17 12 M17 12 L12 7 M17 12 L12 17"
  };
  const diag: Record<string, string> = {
    "↗": "M8 16 L16 8 M10 8 L16 8 L16 14",
    "↘": "M8 8 L16 16 M10 16 L16 16 L16 10",
    "↙": "M16 8 L8 16 M8 10 L8 16 L14 16",
    "↖": "M16 16 L8 8 M8 14 L8 8 L14 8"
  };
  const d = arrows[dir] || diag[dir];
  if (!d) return <Text style={{ fontSize: size * 0.65, color: "#aaa" }}>{dir}</Text>;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d={d} stroke="#e2e8f0" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </Svg>
  );
}

// ─── Arcade Numpad Direction SVG ──────────────────────────────────────────────
export function ArcadeDir({ dir, size = 24 }: { dir: string; size?: number }) {
  const DIR_TO_NUM: Record<string, string> = { "↖": "7", "↑": "8", "↗": "9", "←": "4", "N": "5", "→": "6", "↙": "1", "↓": "2", "↘": "3" };
  const NUM_COLORS: Record<string, string> = {
    "7": "#60A5FA", "8": "#60A5FA", "9": "#60A5FA",
    "4": "#60A5FA", "5": "#555", "6": "#60A5FA",
    "1": "#60A5FA", "2": "#60A5FA", "3": "#60A5FA"
  };
  const num = DIR_TO_NUM[dir] || dir;
  const col = NUM_COLORS[num] || "#aaa";
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="1" y="1" width="22" height="22" rx="5" fill={col + "18"} stroke={col} strokeWidth={1.5} />
      <SvgText x="12" y="16" textAnchor="middle" fill={col} fontSize={13} fontFamily="ShareTechMono-Regular" fontWeight="700">{num}</SvgText>
    </Svg>
  );
}

// ─── Dot Grid SVG ─────────────────────────────────────────────────────────────
export function DotGrid({ dots, size = 28 }: { dots: number[]; size?: number }) {
  const R = size * 0.22;
  const gap = size * 0.24;
  const cx = size / 2;
  const cy = size / 2;
  const positions = [
    [cx - gap, cy - gap],
    [cx + gap, cy - gap],
    [cx - gap, cy + gap],
    [cx + gap, cy + gap],
  ];
  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      {positions.map(([x, y], i) => (
        <Circle
          key={i}
          cx={x}
          cy={y}
          r={R}
          fill={dots[i] ? "#e03050" : "#cccccc"}
          opacity={dots[i] ? 1 : 0.55}
          stroke="#2a292aff"
          strokeWidth={R * 0.35}
        />
      ))}
    </Svg>
  );
}

// ─── Arcade Button SVG ────────────────────────────────────────────────────────
export function ArcadeButton({ label, size = 28 }: { label: string; size?: number }) {
  const ARCADE_DOT_MAP: Record<string, number[]> = {
    "□": [1, 0, 0, 0],  "△": [0, 1, 0, 0],  "○": [0, 0, 1, 0],  "✕": [0, 0, 0, 1],
    "L1": [1, 1, 0, 0], "L2": [0, 0, 1, 1], "R1": [0, 1, 1, 0], "R2": [1, 1, 1, 1],
    "LP": [1, 0, 0, 0], "RP": [0, 1, 0, 0], "LK": [0, 0, 1, 0], "RK": [0, 0, 0, 1],
    "LP+RP": [1, 1, 0, 0], "LK+RK": [0, 0, 1, 1], "RP+LK": [0, 1, 1, 0],
    "LP+RK": [1, 0, 0, 1], "LP+LK": [1, 0, 1, 0], "RP+RK": [0, 1, 0, 1],
    "LP+RP+LK": [1, 1, 1, 0], "LP+RP+RK": [1, 1, 0, 1], "LP+RP+LK+RK": [1, 1, 1, 1],
  };
  const XBOX_DOT_MAP: Record<string, number[]> = {
    "X": [1, 0, 0, 0], "Y": [0, 1, 0, 0], "B": [0, 0, 1, 0], "A": [0, 0, 0, 1],
    "LB": [1, 1, 0, 0], "LT": [0, 0, 1, 1], "RB": [0, 1, 1, 0], "RT": [1, 1, 1, 1],
  };
  const dots = ARCADE_DOT_MAP[label] || XBOX_DOT_MAP[label];
  if (dots) {
    return (
      <View style={{ transform: [{ rotate: '-15deg' }] }}>
        <DotGrid dots={dots} size={size} />
      </View>
    );
  }
  return (
    <View style={{ transform: [{ rotate: '-15deg' }] }}>
      <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
        <Circle cx={14} cy={14} r={12} fill="#333" stroke="#555" strokeWidth={1} />
        <SvgText x="14" y="18" textAnchor="middle" fill="#aaa" fontSize={9} fontFamily="Rajdhani-Bold" fontWeight="700">{label}</SvgText>
      </Svg>
    </View>
  );
}

// ─── Arcade Arrow SVG ─────────────────────────────────────────────────────────
export function ArcadeArrow({ dir, size = 28 }: { dir: string; size?: number }) {
  const paths: Record<string, string> = {
    "↑": "M14 22 L14 6 M8 12 L14 6 L20 12",
    "↓": "M14 6 L14 22 M8 16 L14 22 L20 16",
    "←": "M22 14 L6 14 M12 8 L6 14 L12 20",
    "→": "M6 14 L22 14 M16 8 L22 14 L16 20",
    "↗": "M7 17 L17 7 M11 7 L17 7 L17 13",
    "↘": "M7 7 L17 17 M11 17 L17 17 L17 11",
    "↙": "M17 7 L7 17 M7 11 L7 17 L13 17",
    "↖": "M17 17 L7 7 M7 13 L7 7 L13 7",
  };
  return (
    <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <Path d={paths[dir] || ""} stroke="white" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </Svg>
  );
}

// ─── Arcade Separator SVG ─────────────────────────────────────────────────────
export function ArcadeSep() {
  return (
    <Svg width={14} height={20} viewBox="0 0 14 20" fill="none" style={{ marginLeft: 3 }}>
      <Polygon points="2,4 12,10 2,16" fill="#22c55e" />
    </Svg>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── Fatal Fury: City of the Wolves — ARCADE STYLE Buttons ───────────────────
// ═══════════════════════════════════════════════════════════════════════════════

// LP — Light Punch (pink, clean circle with tick marks)
export function FFLightPunch({ size = 28 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="11" stroke="#E879F9" strokeWidth={2} fill="#E879F915" />
      <Circle cx="12" cy="12" r="7" stroke="#E879F9" strokeWidth={0.8} fill="none" />
      <Line x1="12" y1="1.5" x2="12" y2="5" stroke="#E879F9" strokeWidth={1.5} strokeLinecap="round" />
      <Line x1="22.5" y1="12" x2="19" y2="12" stroke="#E879F9" strokeWidth={1.5} strokeLinecap="round" />
      <Line x1="12" y1="22.5" x2="12" y2="19" stroke="#E879F9" strokeWidth={1.5} strokeLinecap="round" />
      <Line x1="1.5" y1="12" x2="5" y2="12" stroke="#E879F9" strokeWidth={1.5} strokeLinecap="round" />
      <SvgText x="12" y="15.5" textAnchor="middle" fill="#E879F9" fontSize={8.5} fontFamily="Rajdhani-Bold" fontWeight="700">LP</SvgText>
    </Svg>
  );
}

// HP — Heavy Punch (orange, 8-pointed star)
export function FFHeavyPunch({ size = 28 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Polygon
        points="12,1 14.3,6.46 19.78,4.22 17.54,9.7 23,12 17.54,14.3 19.78,19.78 14.3,17.54 12,23 9.7,17.54 4.22,19.78 6.46,14.3 1,12 6.46,9.7 4.22,4.22 9.7,6.46"
        fill="#F9731615" stroke="#F97316" strokeWidth={1.5} strokeLinejoin="round"
      />
      <SvgText x="12" y="15.5" textAnchor="middle" fill="#F97316" fontSize={8.5} fontFamily="Rajdhani-Bold" fontWeight="700">HP</SvgText>
    </Svg>
  );
}

// LK — Light Kick (blue, clean circle with tick marks)
export function FFLightKick({ size = 28 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="11" stroke="#60A5FA" strokeWidth={2} fill="#60A5FA15" />
      <Circle cx="12" cy="12" r="7" stroke="#60A5FA" strokeWidth={0.8} fill="none" />
      <Line x1="12" y1="1.5" x2="12" y2="5" stroke="#60A5FA" strokeWidth={1.5} strokeLinecap="round" />
      <Line x1="22.5" y1="12" x2="19" y2="12" stroke="#60A5FA" strokeWidth={1.5} strokeLinecap="round" />
      <Line x1="12" y1="22.5" x2="12" y2="19" stroke="#60A5FA" strokeWidth={1.5} strokeLinecap="round" />
      <Line x1="1.5" y1="12" x2="5" y2="12" stroke="#60A5FA" strokeWidth={1.5} strokeLinecap="round" />
      <SvgText x="12" y="15.5" textAnchor="middle" fill="#60A5FA" fontSize={8.5} fontFamily="Rajdhani-Bold" fontWeight="700">LK</SvgText>
    </Svg>
  );
}

// HK — Heavy Kick (green, 8-pointed star)
export function FFHeavyKick({ size = 28 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Polygon
        points="12,1 14.3,6.46 19.78,4.22 17.54,9.7 23,12 17.54,14.3 19.78,19.78 14.3,17.54 12,23 9.7,17.54 4.22,19.78 6.46,14.3 1,12 6.46,9.7 4.22,4.22 9.7,6.46"
        fill="#22C55E15" stroke="#22C55E" strokeWidth={1.5} strokeLinejoin="round"
      />
      <SvgText x="12" y="15.5" textAnchor="middle" fill="#22C55E" fontSize={8.5} fontFamily="Rajdhani-Bold" fontWeight="700">HK</SvgText>
    </Svg>
  );
}

// REV Guard — gold pentagon shield
export function FFREVGuard({ size = 28 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M 12,1.5 L 21,6.5 L 21,16.5 Q 12,23 12,23 Q 12,23 3,16.5 L 3,6.5 Z" fill="#FBBF2420" stroke="#FBBF24" strokeWidth={1.5} />
      <SvgText x="12" y="13.5" textAnchor="middle" fill="#FBBF24" fontSize={7} fontFamily="Rajdhani-Bold" fontWeight="700">REV</SvgText>
    </Svg>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── Fatal Fury: City of the Wolves — SMART STYLE Buttons ────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

// P — Punch (red circle)
export function FFPunch({ size = 28 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="11" stroke="#EF4444" strokeWidth={2} fill="#EF444418" />
      <SvgText x="12" y="16" textAnchor="middle" fill="#EF4444" fontSize={12} fontFamily="Rajdhani-Bold" fontWeight="700">P</SvgText>
    </Svg>
  );
}

// K — Kick (blue circle)
export function FFKick({ size = 28 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="11" stroke="#3B82F6" strokeWidth={2} fill="#3B82F618" />
      <SvgText x="12" y="16" textAnchor="middle" fill="#3B82F6" fontSize={12} fontFamily="Rajdhani-Bold" fontWeight="700">K</SvgText>
    </Svg>
  );
}

// SP — Special Move (cyan rotated diamond)
export function FFSpecial({ size = 28 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Polygon
        points="12,2 22,12 12,22 2,12"
        fill="#06B6D415" stroke="#06B6D4" strokeWidth={1.5}
      />
      <SvgText x="12" y="15.5" textAnchor="middle" fill="#06B6D4" fontSize={8} fontFamily="Rajdhani-Bold" fontWeight="700">SP</SvgText>
    </Svg>
  );
}

// SC — Smart Combo (yellow 6-pointed star)
export function FFSmartCombo({ size = 28 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Polygon
        points="12,1 14.5,7.67 21.53,6.5 17,12 21.53,17.5 14.5,16.33 12,23 9.5,16.33 2.47,17.5 7,12 2.47,6.5 9.5,7.67"
        fill="#FBBF2415" stroke="#FBBF24" strokeWidth={1.5} strokeLinejoin="round"
      />
      <SvgText x="12" y="15.5" textAnchor="middle" fill="#FBBF24" fontSize={8} fontFamily="Rajdhani-Bold" fontWeight="700">SC</SvgText>
    </Svg>
  );
}

// RB — REV Blow (green shield variant)
export function FFREVBlow({ size = 28 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M 12,2 L 20.5,7 L 20.5,16 Q 12,22.5 12,22.5 Q 12,22.5 3.5,16 L 3.5,7 Z" fill="#22C55E18" stroke="#22C55E" strokeWidth={1.5} />
      <SvgText x="12" y="13.5" textAnchor="middle" fill="#22C55E" fontSize={7} fontFamily="Rajdhani-Bold" fontWeight="700">REV</SvgText>
      <SvgText x="12" y="19.5" textAnchor="middle" fill="#22C55E" fontSize={5.5} fontFamily="Rajdhani-Bold" fontWeight="700">BLOW</SvgText>
    </Svg>
  );
}

// DA — Dodge Attack (purple circle)
export function FFDodge({ size = 28 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="11" stroke="#A855F7" strokeWidth={2} fill="#A855F718" />
      <SvgText x="12" y="15.5" textAnchor="middle" fill="#A855F7" fontSize={8.5} fontFamily="Rajdhani-Bold" fontWeight="700">DA</SvgText>
    </Svg>
  );
}

// TH — Throw (pink circle)
export function FFThrow({ size = 28 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="11" stroke="#EC4899" strokeWidth={2} fill="#EC489918" />
      <SvgText x="12" y="15.5" textAnchor="middle" fill="#EC4899" fontSize={8.5} fontFamily="Rajdhani-Bold" fontWeight="700">TH</SvgText>
    </Svg>
  );
}

// ─── FF Context Badges ([In air] / [S.P.G.]) ─────────────────────────────────
export function FFContextBadge({ label }: { label: string }) {
  const isSPG = label === 'S.P.G.';
  const borderColor = isSPG ? '#FBBF24' : '#00c4cc';
  const textColor = isSPG ? '#FBBF24' : '#00c4cc';
  return (
    <View style={[ffBadgeStyles.badge, { borderColor }]}>
      <Text style={[ffBadgeStyles.text, { color: textColor }]}>{label}</Text>
    </View>
  );
}

// ─── FF Modifier Badge (BR / FE) ──────────────────────────────────────────────
export function FFModBadge({ label }: { label: string }) {
  return (
    <View style={ffBadgeStyles.modBadge}>
      <Text style={ffBadgeStyles.modText}>{label}</Text>
    </View>
  );
}

// ─── FF Neutral Direction Badge (N) ───────────────────────────────────────────
export function FFNeutralIcon({ size = 28 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="11" fill="#FACC15" stroke="#EAB308" strokeWidth={1.5} />
      <SvgText x="12" y="16.5" textAnchor="middle" fill="#000" fontSize={13} fontFamily="Rajdhani-Bold" fontWeight="700">N</SvgText>
    </Svg>
  );
}

const ffBadgeStyles = StyleSheet.create({
  badge: {
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 2,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 10,
    fontFamily: 'ShareTechMono-Regular',
    letterSpacing: 0.3,
  },
  modBadge: {
    backgroundColor: '#FBBF24',
    borderRadius: 3,
    paddingHorizontal: 4,
    paddingVertical: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modText: {
    color: '#000',
    fontSize: 9,
    fontFamily: 'Rajdhani-Bold',
    fontWeight: '700',
  },
});
