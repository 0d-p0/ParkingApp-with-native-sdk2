import { PixelRatio, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import allColor from '../Resources/Colors/Color';
import DropDownPicker from 'react-native-dropdown-picker';

const data = [
    { label: 'Item 1', value: '1' },
    { label: 'Item 2', value: '2' },
    { label: 'Item 3', value: '3' },
    { label: 'Item 4', value: '4' },
    { label: 'Item 5', value: '5' },
    { label: 'Item 6', value: '6' },
    { label: 'Item 7', value: '7' },
    { label: 'Item 8', value: '8' },
];
const DropDownComponent = () => {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null)

    return (
        <View>
            <DropDownPicker
               style={{borderRadius:20,maxWidth:PixelRatio.roundToNearestPixel(150)}}
                open={open}
                value={value}
                items={data}
                setOpen={setOpen}
                setValue={setValue}
               listMode="MODAL"
            />
        </View>
    )
}

export default DropDownComponent

const styles = StyleSheet.create({
    container: {
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: allColor['light-gray'],
    },
  


})