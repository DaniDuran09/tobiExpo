import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  TextInput,
  Pressable,
  View,
  Text,
  Platform,
} from 'react-native';
import { Colors } from '../../styles/Colors';

export default function PinValidate({ onPinChange }: any) {
  const inputRef = useRef<TextInput>(null);
  const [pin, setPin] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handlePinChange = (text: string) => {
    const numericText = text.replace(/[^0-9]/g, '');
    if (numericText.length <= 5) {
      setPin(numericText);
      onPinChange(numericText);
    }
  };

  const handleContainerPress = () => {
    inputRef.current?.focus();
  };

  const renderPinBoxes = () => {
    const boxes = [];
    for (let i = 0; i < 5; i++) {
      const isCurrentIndex = isFocused && i === pin.length;
      boxes.push(
        <View
          key={i}
          style={[
            styles.pinBox,
            i < pin.length && styles.pinBoxFilled,
            isCurrentIndex && styles.pinBoxFocused,
          ]}
        >
          <Text style={styles.pinText}>{pin[i] || ''}</Text>
        </View>
      );
    }
    return boxes;
  };

  return (
    <Pressable style={styles.container} onPress={handleContainerPress}>
      <View style={styles.boxesContainer} pointerEvents="none">
        {renderPinBoxes()}
      </View>

      <TextInput
        ref={inputRef}
        keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
        style={styles.hiddenInput}
        value={pin}
        onChangeText={handlePinChange}
        maxLength={5}
        autoFocus={true}
        caretHidden={true}
        textContentType="oneTimeCode"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    backgroundColor: '#FFFFFF',
  },
  boxesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  hiddenInput: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.01,
    color: 'transparent',
    backgroundColor: 'transparent',
  },
  pinBox: {
    width: 50,
    height: 50,
    borderBottomWidth: 2,
    borderBottomColor: '#CCCCCC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pinBoxFilled: {
    borderBottomColor: '#000000',
  },
  pinBoxFocused: {
    borderBottomColor: Colors.primaryColor || '#EF4136',
  },
  pinText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
});