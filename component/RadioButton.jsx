import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CheckBox from '@react-native-community/checkbox'
import allColor from '../Resources/Colors/Color'

const RoundedRadioButton = ({title}) => {
    const [toggleCheckBox, setToggleCheckBox] = React.useState(false)

    return (
        <View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <CheckBox
                    style={{ borderRadius: '50%' }}
                    disabled={false}
                    value={toggleCheckBox}
                    onValueChange={(newValue) => setToggleCheckBox(newValue)}
                />
                <Text style={{ color: allColor.black, fontWeight: '900' }}>
                    {title}
                </Text>
            </View>
        </View>
    )
}

export default RadioButton = {
    RoundedRadioButton
}

