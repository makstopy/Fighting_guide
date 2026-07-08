import React from 'react';
import { StyleSheet, View } from 'react-native';
import ButtonToken from './ButtonToken';
import { ControlType } from './ControlContext';

interface ComboInputProps {
  input: string;
  controlType: ControlType;
}

export function tokeniseInput(input: string): string[] {
  // First extract [[ICON:xxx]] tags as atomic tokens
  const iconRegex = /\[\[ICON:([a-z0-9-]+)\]\]/g;
  const parts: { icon?: string; text?: string }[] = [];
  let last = 0;
  let m;

  while ((m = iconRegex.exec(input)) !== null) {
    if (m.index > last) parts.push({ text: input.slice(last, m.index) });
    parts.push({ icon: m[1] });
    last = m.index + m[0].length;
  }
  if (last < input.length) parts.push({ text: input.slice(last) });

  const tokens: string[] = [];
  parts.forEach(part => {
    if (part.icon) {
      tokens.push(`[[ICON:${part.icon}]]`);
      return;
    }
    if (part.text) {
      // Split text on spaces, treat "," and ">" as their own tokens
      const raw = part.text.split(/(\s+|[,>])/).filter(s => s && s.trim());
      raw.forEach(segment => {
        if (segment === ',') {
          tokens.push(',');
          return;
        }
        if (segment === '>') {
          tokens.push('>');
          return;
        }
        const chars = [...segment];
        let buf = '';
        chars.forEach(ch => {
          if (['↑', '↓', '←', '→', '↗', '↘', '↙', '↖'].includes(ch)) {
            if (buf) {
              tokens.push(buf);
              buf = '';
            }
            tokens.push(ch);
          } else {
            buf += ch;
          }
        });
        if (buf) tokens.push(buf);
      });
    }
  });

  return tokens;
}

export default function ComboInput({ input, controlType }: ComboInputProps) {
  const tokens = tokeniseInput(input);

  return (
    <View style={styles.container}>
      {tokens.map((tok, i) => (
        <View
          key={i}
          style={[
            styles.tokenWrapper,
            controlType === 'Arcade' ? styles.arcadeWrapper : null
          ]}
        >
          <ButtonToken token={tok} controlType={controlType} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    alignItems: 'center',
    paddingVertical: 6,
  },
  tokenWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  arcadeWrapper: {
    marginVertical: 6,
    marginHorizontal: 2,
  },
});
