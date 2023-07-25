import {PixelRatio, StyleSheet, Text, View, TextInput} from 'react-native';
import React from 'react';
import allColor from '../Resources/Colors/Color';

const InputComponentWithText = ({show,value,onChangeText,placeholder,text}) => {
  return (
    <View style={styles.sectionStyle}>
      <TextInput
        style={[styles.text, styles.input]}
        onChangeText={onChangeText}
        value={value}
        // if place Holder Available show *placeholder value or show the "enter Value"
        placeholder={placeholder||"enter value"}
        keyboardType={'number-pad'}
        editable={false}
      />
      {!show && <Text style={styles.text}>{text||"hrs"}</Text>}
    </View>
  );
};

export default CustomInputComponent = {
  InputComponentWithText,
};

const styles = StyleSheet.create({
  sectionStyle: {
    // flex: 1,
    // flexDirection: 'row',
    // alignItems: 'center',
    // borderWidth: 1,
    // paddingHorizontal: PixelRatio.roundToNearestPixel(10),
    // borderRadius: PixelRatio.roundToNearestPixel(20),
    // backgroundColor: allColor.white,
    // width: PixelRatio.roundToNearestPixel(150),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    width:"95%",
    height: PixelRatio.roundToNearestPixel(50),
    borderColor: allColor.black,
    borderWidth: 1,
    borderRadius:PixelRatio.roundToNearestPixel(20),
    paddingHorizontal: 2,
    marginHorizontal:2
  },
  text: {
    color: allColor.black,
    fontWeight: '600',
    fontSize: PixelRatio.roundToNearestPixel(15),
    marginHorizontal: PixelRatio.roundToNearestPixel(-1),
  },
  input: {
    maxWidth: PixelRatio.roundToNearestPixel(100),
  },
});
