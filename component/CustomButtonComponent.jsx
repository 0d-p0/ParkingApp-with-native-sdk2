import { StyleSheet, Text, TouchableOpacity, PixelRatio,Pressable } from 'react-native';
import React from 'react';
import allColor from '../Resources/Colors/Color';
import normalize from 'react-native-normalize';

const CancelButton = ({ title,onAction,style }) => {
    return (
        <TouchableOpacity style={[styles.button,styles.resetButton,style]}  onPress={onAction}>
            <Text style={styles.textStyle}>{title}</Text>
        </TouchableOpacity>
    );
};

const GoButton = ({ title,onAction,style }) => {
    return (
        <TouchableOpacity style={[styles.button,styles.changePasswordButton,style]} onPress={onAction}  >
            <Text style={{...styles.textStyle,color:allColor.white}}>{title}</Text>
        </TouchableOpacity>
    );
};

const CustomButtonComponent = {
    CancelButton,
    GoButton
};

export default CustomButtonComponent;

const styles = StyleSheet.create({
    button:{
        borderWidth: 1,
        borderColor: allColor['light-gray'],
        borderRadius: PixelRatio.roundToNearestPixel(20),
        paddingHorizontal: PixelRatio.roundToNearestPixel(20),
        paddingVertical: PixelRatio.roundToNearestPixel(10),
        alignItems: 'center',
        elevation:PixelRatio.roundToNearestPixel(10)
    },
    changePasswordButton:{
     backgroundColor:allColor['primary-color']
    },
    resetButton: {
        backgroundColor: allColor.white,
        
    },
    textStyle:{
  color:allColor['light-gray'],
  fontWeight:"bold",
  fontSize:PixelRatio.roundToNearestPixel(15)
    }
});
