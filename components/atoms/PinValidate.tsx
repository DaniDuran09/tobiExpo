import React, { useEffect, useRef, useState } from 'react'
import { StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { View, Text } from 'react-native-ui-lib';

export default function PinValidate({onPinChange}:any) {
    const inputRef = useRef(null);
    const [pin, setPin] = useState('');

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handlePinChange = (text:any) => {
        const numericText = text.replace(/[^0-9]/g, '');
        if (numericText.length <= 5) {
            setPin(numericText);
            onPinChange(numericText);
        }
    };

    const renderPinBoxes = () => {
        const boxes = [];
        for (let i = 0; i < 5; i++) {
            boxes.push(
                <View key={i} style={[
                    styles.pinBox,
                    i < pin.length && styles.pinBoxFilled
                ]}>
                    <Text style={styles.pinText}>
                        {pin[i] || ''}
                    </Text>
                </View>
            );
        }
        return boxes;
    };

    const handleContainerPress = () => {
        inputRef.current?.focus();
    };

    return (
        <TouchableWithoutFeedback onPress={handleContainerPress}>
            <View bg-white width={"100%"} marginT-20 center paddingH-20>
                <TextInput
                    ref={inputRef}
                    keyboardType='numeric'
                    style={styles.hiddenInput}
                    value={pin}
                    onChangeText={handlePinChange}
                    maxLength={5}
                    autoFocus={true}
                />
                
                <View row spread width={"100%"}>
                    {renderPinBoxes()}
                </View>
            </View>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    hiddenInput: {
        position: 'absolute',
        width: 1,
        height: 1,
        opacity: 0
    },
    pinBox: {
        width: 50,
        height: 50,
        borderBottomWidth: 2,
        borderBottomColor: '#CCCCCC',
        justifyContent: 'center',
        alignItems: 'center'
    },
    pinBoxFilled: {
        borderBottomColor: '#000000'
    },
    pinText: {
        fontSize: 18,
        fontWeight: 'bold'
    }
});