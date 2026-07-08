import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  BackHandler,
  Keyboard,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import ButtonToken from './ButtonToken';
import ComboInput from './ComboInput';
import { ControlType } from './ControlContext';
import {
  ArcadeArrow,
  ArcadeButton,
  ArcadeSep,
  DirArrow,
  PSBumper,
  PSCircle,
  PSCross,
  PSSquare,
  PSTriangle,
  XboxA,
  XboxB,
  XboxBumper,
  XboxX,
  XboxY,
} from './icons/ControllerIcons';

interface ComboCreatorModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (name: string, input: string, description: string) => void;
  controlType: ControlType;
  game?: string;
}

// Button definitions per controller layout
// label = what user sees, token = what gets stored (always PS notation for PS/Xbox, or native for Arcade)
interface ButtonDef {
  label: string;
  token: string;
  render?: React.ReactNode;
}

function getConsoleButtons(controlType: ControlType): ButtonDef[] {
  if (controlType === 'Xbox') {
    return [
      { label: 'X', token: '□' },
      { label: 'Y', token: '△' },
      { label: 'B', token: '○' },
      { label: 'A', token: '✕' },
      { label: 'LB', token: 'L1' },
      { label: 'LT', token: 'L2' },
      { label: 'RB', token: 'R1' },
      { label: 'RT', token: 'R2' },
    ];
  }
  if (controlType === 'Arcade') {
    return [
      { label: '□', token: '□' },
      { label: '△', token: '△' },
      { label: '○', token: '○' },
      { label: '✕', token: '✕' },
      { label: 'L1', token: 'L1' },
      { label: 'L2', token: 'L2' },
      { label: 'R1', token: 'R1' },
      { label: 'R2', token: 'R2' },
    ];
  }
  // PS default
  return [
    { label: '□', token: '□' },
    { label: '△', token: '△' },
    { label: '○', token: '○' },
    { label: '✕', token: '✕' },
    { label: 'L1', token: 'L1' },
    { label: 'L2', token: 'L2' },
    { label: 'R1', token: 'R1' },
    { label: 'R2', token: 'R2' },
  ];
}

function getGameButtons(game?: string): ButtonDef[] {
  if (game === 'Street Fighter 6') {
    return [
      { label: '[[LP]]', token: '[[LP]]' },
      { label: '[[MP]]', token: '[[MP]]' },
      { label: '[[HP]]', token: '[[HP]]' },
      { label: '[[P]]', token: '[[P]]' },
      { label: '[[LK]]', token: '[[LK]]' },
      { label: '[[MK]]', token: '[[MK]]' },
      { label: '[[HK]]', token: '[[HK]]' },
      { label: '[[K]]', token: '[[K]]' },
      { label: '[[N]]', token: '[[N]]' },
    ];
  }
  return [];
}

const DIRECTION_BUTTONS: { label: string; token: string }[] = [
  { label: '↖', token: '↖' },
  { label: '↑', token: '↑' },
  { label: '↗', token: '↗' },
  { label: '←', token: '←' },
  { label: ' ', token: '' },  // empty center
  { label: '→', token: '→' },
  { label: '↙', token: '↙' },
  { label: '↓', token: '↓' },
  { label: '↘', token: '↘' },
];

// Render the icon for an action button based on control type
function renderButtonIcon(controlType: ControlType, label: string, size: number = 28): React.ReactNode {
  if (controlType === 'Arcade') {
    return <ArcadeButton label={label} size={size + 4} />;
  }
  if (controlType === 'PS') {
    switch (label) {
      case '□': return <PSSquare size={size} />;
      case '△': return <PSTriangle size={size} />;
      case '○': return <PSCircle size={size} />;
      case '✕': return <PSCross size={size} />;
      case 'L1': return <PSBumper label="L1" size={size} />;
      case 'L2': return <PSBumper label="L2" size={size} />;
      case 'R1': return <PSBumper label="R1" size={size} />;
      case 'R2': return <PSBumper label="R2" size={size} />;
    }
  }
  if (controlType === 'Xbox') {
    switch (label) {
      case 'X': return <XboxX size={size} />;
      case 'Y': return <XboxY size={size} />;
      case 'B': return <XboxB size={size} />;
      case 'A': return <XboxA size={size} />;
      case 'LB': return <XboxBumper label="LB" size={size} />;
      case 'LT': return <XboxBumper label="LT" size={size} />;
      case 'RB': return <XboxBumper label="RB" size={size} />;
      case 'RT': return <XboxBumper label="RT" size={size} />;
    }
  }
  return <Text style={styles.btnLabel}>{label}</Text>;
}

function renderDirectionIcon(controlType: ControlType, dir: string, size: number = 26): React.ReactNode {
  if (controlType === 'Arcade') {
    return <ArcadeArrow dir={dir} size={size} />;
  }
  return <DirArrow dir={dir} size={size} />;
}

export default function ComboCreatorModal({ visible, onClose, onSave, controlType, game }: ComboCreatorModalProps) {
  const [name, setName] = useState('');
  const [tokens, setTokens] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  // Animated save button scale
  const saveScale = useSharedValue(1);
  const saveAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: saveScale.value }],
  }));

  const inputString = useMemo(() => tokens.join(' '), [tokens]);

  // Convert PS-notation tokens to current controlType for preview rendering
  const previewInputString = useMemo(() => {
    if (controlType === 'PS') return inputString;
    if (controlType === 'Xbox') {
      const map: Record<string, string> = {
        '□': 'X', '△': 'Y', '○': 'B', '✕': 'A',
        'L1': 'LB', 'L2': 'LT', 'R1': 'RB', 'R2': 'RT',
      };
      return tokens.map(t => map[t] || t).join(' ');
    }
    // Arcade: keep PS tokens — ButtonToken handles them in Arcade mode
    return inputString;
  }, [tokens, inputString, controlType]);

  const addToken = useCallback((token: string) => {
    setTokens((prev) => [...prev, token]);
  }, []);

  const removeLastToken = useCallback(() => {
    setTokens((prev) => prev.slice(0, -1));
  }, []);

  const clearTokens = useCallback(() => {
    setTokens([]);
  }, []);

  const handleSave = useCallback(() => {
    if (!name.trim() || tokens.length === 0) return;
    saveScale.value = withSequence(
      withTiming(0.93, { duration: 80 }),
      withSpring(1, { damping: 12 })
    );
    onSave(name.trim(), inputString, description.trim());
    // Reset form
    setName('');
    setTokens([]);
    setDescription('');
  }, [name, tokens, inputString, description, onSave, saveScale]);

  const handleClose = useCallback(() => {
    setName('');
    setTokens([]);
    setDescription('');
    onClose();
  }, [onClose]);

  const consoleButtons = useMemo(() => getConsoleButtons(controlType), [controlType]);
  const gameButtons = useMemo(() => getGameButtons(game), [game]);

  const canSave = name.trim().length > 0 && tokens.length > 0;

  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    if (!visible) return;
    const backAction = () => {
      handleClose();
      return true;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    // Track keyboard height manually to avoid native layout bugs on Android
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSubscription = Keyboard.addListener(showEvent, (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const hideSubscription = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
    });

    return () => {
      backHandler.remove();
      showSubscription.remove();
      hideSubscription.remove();
      setKeyboardHeight(0);
    };
  }, [visible, handleClose]);

  const { height: windowHeight, width: windowWidth } = useWindowDimensions();

  if (!visible) return null;

  return (
    <View style={[styles.rootContainer, { width: windowWidth, height: windowHeight }]}>
      <Animated.View
        entering={FadeIn.duration(200)}
        exiting={FadeOut.duration(200)}
        style={styles.backdrop}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />
      </Animated.View>

      <View
        style={[styles.keyboardAvoid, { paddingBottom: keyboardHeight }]}
      >
        <Animated.View
          entering={SlideInDown.duration(250).easing(Easing.out(Easing.quad))}
          exiting={SlideOutDown.duration(200).easing(Easing.in(Easing.quad))}
          style={styles.modalContainer}
        >
          <ScrollView
            ref={scrollViewRef}
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View style={styles.modalHeader}>
              <Pressable onPress={handleClose} hitSlop={12}>
                <Text style={styles.closeBtn}>✕</Text>
              </Pressable>
              <Text style={styles.modalTitle}>НОВОЕ КОМБО</Text>
              <View style={{ width: 28 }} />
            </View>

            {/* Name input */}
            <Text style={styles.fieldLabel}>НАЗВАНИЕ</Text>
            <TextInput
              style={styles.textInput}
              value={name}
              onChangeText={setName}
              placeholder="Моё комбо..."
              placeholderTextColor="#444"
              maxLength={60}
              autoCorrect={false}
            />

            {/* Live preview */}
            <Text style={styles.fieldLabel}>ПРЕВЬЮ</Text>
            <View style={styles.previewContainer}>
              {tokens.length > 0 ? (
                <>
                  <ComboInput input={previewInputString} controlType={controlType} />
                  <Text style={styles.rawInputText}>{previewInputString}</Text>
                </>
              ) : (
                <Text style={styles.previewPlaceholder}>
                  Нажимай кнопки ниже для ввода комбо
                </Text>
              )}
            </View>

            {/* Action buttons keyboard */}
            <Text style={styles.fieldLabel}>
              {controlType === 'PS' ? 'PLAYSTATION' : controlType === 'Xbox' ? 'XBOX' : '🕹️ ARCADE'} КНОПКИ
            </Text>
            <View style={styles.actionButtonsGrid}>
              {consoleButtons.map((btn) => (
                <Pressable
                  key={btn.label}
                  style={({ pressed }) => [
                    styles.keyBtn,
                    styles.actionKeyBtn,
                    pressed && styles.keyBtnPressed,
                  ]}
                  onPress={() => addToken(btn.token)}
                >
                  {renderButtonIcon(controlType, btn.label, 30)}
                </Pressable>
              ))}
            </View>

            {/* Game buttons keyboard (colored strikes) */}
            {gameButtons.length > 0 && (
              <>
                <Text style={styles.fieldLabel}>ИГРОВЫЕ КНОПКИ (УДАРЫ)</Text>
                <View style={styles.actionButtonsGrid}>
                  {gameButtons.map((btn) => (
                    <Pressable
                      key={btn.label}
                      style={({ pressed }) => [
                        styles.keyBtn,
                        styles.actionKeyBtn,
                        pressed && styles.keyBtnPressed,
                      ]}
                      onPress={() => addToken(btn.token)}
                    >
                      <ButtonToken token={btn.token} controlType="Arcade" />
                    </Pressable>
                  ))}
                </View>
              </>
            )}

            {/* Direction pad */}
            <Text style={styles.fieldLabel}>НАПРАВЛЕНИЯ</Text>
            <View style={styles.dpadContainer}>
              <View style={styles.dpadGrid}>
                {DIRECTION_BUTTONS.map((btn, i) => (
                  btn.token === '' ? (
                    <View key={`empty_${i}`} style={styles.dpadBtn} />
                  ) : (
                    <Pressable
                      key={btn.token}
                      style={({ pressed }) => [
                        styles.dpadBtn,
                        styles.dpadBtnActive,
                        pressed && styles.keyBtnPressed,
                      ]}
                      onPress={() => addToken(btn.token)}
                    >
                      {renderDirectionIcon(controlType, btn.label, 24)}
                    </Pressable>
                  )
                ))}
              </View>
            </View>

            {/* Modifiers & controls */}
            <Text style={styles.fieldLabel}>МОДИФИКАТОРЫ</Text>
            <View style={styles.modifiersRow}>
              <Pressable
                style={({ pressed }) => [styles.modBtn, styles.modBtnComma, pressed && styles.keyBtnPressed]}
                onPress={() => addToken(',')}
              >
                {controlType === 'Arcade' ? (
                  <ArcadeSep />
                ) : (
                  <Text style={styles.modBtnText}>,</Text>
                )}
                <Text style={styles.modBtnHint}>далее</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [styles.modBtn, styles.modBtnPlus, pressed && styles.keyBtnPressed]}
                onPress={() => addToken('+')}
              >
                <Text style={styles.modBtnText}>+</Text>
                <Text style={styles.modBtnHint}>вместе</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [styles.modBtn, styles.modBtnBackspace, pressed && styles.keyBtnPressed]}
                onPress={removeLastToken}
              >
                <Text style={styles.modBtnText}>⌫</Text>
                <Text style={styles.modBtnHint}>назад</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [styles.modBtn, styles.modBtnClear, pressed && styles.keyBtnPressed]}
                onPress={clearTokens}
              >
                <Text style={styles.modBtnText}>✕</Text>
                <Text style={styles.modBtnHint}>очистить</Text>
              </Pressable>
            </View>

            {/* Description */}
            <Text style={styles.fieldLabel}>ЗАМЕТКА (ОПЦИОНАЛЬНО)</Text>
            <TextInput
              style={[styles.textInput, styles.descInput]}
              value={description}
              onChangeText={setDescription}
              placeholder="Описание, заметки..."
              placeholderTextColor="#444"
              maxLength={200}
              multiline
              numberOfLines={2}
              autoCorrect={false}
              onFocus={() => {
                setTimeout(() => {
                  scrollViewRef.current?.scrollToEnd({ animated: true });
                }, 250);
              }}
            />

            {/* Save button */}
            <Animated.View style={saveAnimStyle}>
              <Pressable
                style={({ pressed }) => [
                  styles.saveBtn,
                  !canSave && styles.saveBtnDisabled,
                  pressed && canSave && { opacity: 0.8 },
                ]}
                onPress={handleSave}
                disabled={!canSave}
              >
                <Text style={[styles.saveBtnText, !canSave && styles.saveBtnTextDisabled]}>
                  💾  СОХРАНИТЬ КОМБО
                </Text>
              </Pressable>
            </Animated.View>
          </ScrollView>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  keyboardAvoid: {
    flex: 1,
    justifyContent: 'flex-end',
    width: '100%',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#12121f',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '92%',
    borderTopWidth: 1,
    borderColor: '#10b98144',
    width: '100%',
    flexShrink: 1,
  },
  scrollView: {
    width: '100%',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 120,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  closeBtn: {
    color: '#666',
    fontSize: 22,
    fontWeight: '600',
  },
  modalTitle: {
    fontFamily: 'BlackOpsOne-Regular',
    fontSize: 16,
    color: '#10b981',
    letterSpacing: 2,
  },
  fieldLabel: {
    fontFamily: 'Rajdhani-Bold',
    fontSize: 11,
    color: '#555',
    letterSpacing: 1.5,
    marginBottom: 8,
    marginTop: 16,
  },
  textInput: {
    backgroundColor: '#1a1a2e',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2a2a4e',
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#eee',
    fontFamily: 'Rajdhani-SemiBold',
    fontSize: 15,
  },
  descInput: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
  previewContainer: {
    backgroundColor: '#1a1a2e',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2a2a4e',
    padding: 12,
    minHeight: 60,
    justifyContent: 'center',
  },
  previewPlaceholder: {
    color: '#444',
    fontFamily: 'Rajdhani-SemiBold',
    fontSize: 14,
    textAlign: 'center',
  },
  rawInputText: {
    fontFamily: 'ShareTechMono-Regular',
    fontSize: 10,
    color: '#444',
    marginTop: 4,
  },
  actionButtonsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  keyBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 1,
  },
  actionKeyBtn: {
    width: 56,
    height: 50,
    backgroundColor: '#1a1a2e',
    borderColor: '#2a2a4e',
  },
  keyBtnPressed: {
    backgroundColor: '#10b98133',
    borderColor: '#10b981',
    transform: [{ scale: 0.92 }],
  },
  btnLabel: {
    color: '#ccc',
    fontSize: 16,
    fontFamily: 'Rajdhani-Bold',
  },
  dpadContainer: {
    alignItems: 'center',
  },
  dpadGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 168,
  },
  dpadBtn: {
    width: 52,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    margin: 2,
  },
  dpadBtnActive: {
    backgroundColor: '#1a1a2e',
    borderWidth: 1,
    borderColor: '#2a2a4e',
  },
  modifiersRow: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
  },
  modBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modBtnComma: {
    backgroundColor: '#1e3a5f22',
    borderColor: '#3b82f644',
  },
  modBtnPlus: {
    backgroundColor: '#3a1e5f22',
    borderColor: '#8b5cf644',
  },
  modBtnBackspace: {
    backgroundColor: '#5f3a1e22',
    borderColor: '#f9731644',
  },
  modBtnClear: {
    backgroundColor: '#5f1e1e22',
    borderColor: '#ef444444',
  },
  modBtnText: {
    color: '#ccc',
    fontSize: 18,
    fontWeight: '700',
  },
  modBtnHint: {
    color: '#555',
    fontSize: 9,
    fontFamily: 'Rajdhani-SemiBold',
    marginTop: 2,
  },
  saveBtn: {
    marginTop: 24,
    backgroundColor: '#10b981',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveBtnDisabled: {
    backgroundColor: '#1a2a1e',
    opacity: 0.5,
  },
  saveBtnText: {
    fontFamily: 'BlackOpsOne-Regular',
    fontSize: 14,
    color: '#fff',
    letterSpacing: 1.5,
  },
  saveBtnTextDisabled: {
    color: '#555',
  },
});
