// this is helper component for textinput 
// textinput with a icon on the left side


import { StyleSheet, TextInput, View } from 'react-native'
import React from 'react'
import normalize from 'react-native-normalize';
import allColor from '../Resources/Colors/Color';


// it`s take 4 parameater - [icon,placeholder,value,onChangeText,keyboardType]
const InputComponent = ({icon,placeholder,value,onChangeText,keyboardType,secureTextEntry}) => {
    return (
        <View style={styles.sectionStyle}>
            {icon}
            <TextInput
                style={styles.input}
                onChangeText={onChangeText}
                value={value}
                placeholder={placeholder}
                keyboardType={keyboardType}
                secureTextEntry={secureTextEntry}

            />
        </View>
    )
}

export default InputComponent

const styles = StyleSheet.create({
    sectionStyle: {
        marginBottom:normalize(20),
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderBottomWidth: 0.5,
        borderColor: '#000',
        height: normalize(40),
        padding: normalize(10)
    },
    input: {
        width:normalize(220),
        height:normalize(40),
        margin: 12,
        // color:allColor.black,

    },
})