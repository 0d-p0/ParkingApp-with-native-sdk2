import { PixelRatio, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import allColor from '../Resources/Colors/Color'
import icons from '../Resources/Icons/icons'
import playSound from '../Hooks/playSound'

const ActionBox = ({ icon, title, onAction }) => {

    return (
        <TouchableOpacity style={styles.container} onPress={() => {
            // ding.play()
            onAction()
        }}>
            {icon || icons.bike}
            <View style={styles.divider} />
            <Text style={styles.text}>
                {title || "Operator wise report Operator wise report"}
            </Text>
        </TouchableOpacity>
    )
}

export default ActionBox

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: PixelRatio.roundToNearestPixel(10),
        backgroundColor: allColor.white,
        borderRadius: PixelRatio.roundToNearestPixel(10),
        flexDirection:'column',
        justifyContent:'space-evenly'
    },
    divider: {
        width: "100%",
        borderBottomWidth: 3,
        borderBottomColor: allColor.gray,
        marginTop:10
    },
    text: {
        fontSize: PixelRatio.roundToNearestPixel(14),
        fontWeight: '600',
        color: allColor.black,
        marginTop: PixelRatio.roundToNearestPixel(20),
        textAlign: 'center'
    }
})