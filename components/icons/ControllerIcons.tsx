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
    [cx - gap, cy - gap],  // top-left
    [cx + gap, cy - gap],  // top-right
    [cx - gap, cy + gap],  // bottom-left
    [cx + gap, cy + gap],  // bottom-right
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
