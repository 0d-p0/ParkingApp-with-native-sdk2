import { PixelRatio, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CustomHeader from '../../component/CustomHeader'
import allColor from '../../Resources/Colors/Color'
import icons from '../../Resources/Icons/icons'
import strings from '../../Resources/Strings/strings'
import CustomButtonComponent from '../../component/CustomButtonComponent'

const PrinterCleaning = ({navigation}) => {
    return (
        <View style={{ flex: 1 }}>
            {/* custom header */}
            <CustomHeader title={"PRINTER CLEANING"}  navigation={navigation}/>
            {/* main container */}
            <View style={styles.container}>
                {/* printer cleaning disclamer */}
                <View style={styles.printer_cleaning_disclamer}>
                    {/* printer icon */}
                    <View style={{ flex: 0.3 }}>
                        {icons.printer_two}
                    </View>
                    {/* printer cleaning text */}
                    <Text style={styles.printer_cleaning_disclamer_text}>
                        {strings.printer_cleaning_disclamer}
                    </Text>
                </View>

                {/* paper roll */}
                <View style={{  alignSelf: 'center' }}>
                    <View style={styles.paperRoll}>
                        {icons.paperRoll(50)}
                    </View>
                    <Text style={{ ...styles.printer_cleaning_disclamer_text, color: allColor.black, marginTop: PixelRatio.roundToNearestPixel(10),flex:0 }}>
                        {strings.paperRollQuantity}
                    </Text>
                </View>

                {/* device position disclamer */}
                <View style={{ alignSelf: 'center' }}>
                <View style={{...styles.paperRoll,   transform: [{ rotateX: '0deg' }, { rotateZ: '0deg' }, { rotateY: '0deg' }],}}>
                        {icons.cellphone(50)}
                    </View>
                    <Text style={{ ...styles.printer_cleaning_disclamer_text, color: allColor.black, marginTop: PixelRatio.roundToNearestPixel(10),flex:0, }}>
                        {strings.devicePosDisclamer}
                    </Text>
                </View>
                {/* printer cleaning action button */}

                <CustomButtonComponent.GoButton title={"Clean Printer Now"} onAction={()=>alert("claen printer func")}
                
                style={{marginTop:PixelRatio.roundToNearestPixel(15)}}
                />
            </View>
        </View>
    )
}

export default PrinterCleaning

const styles = StyleSheet.create({
    container: {
        padding: PixelRatio.roundToNearestPixel(15),
        flex: 1,
        backgroundColor: allColor.white
    },
    printer_cleaning_disclamer: {
        backgroundColor: allColor['cyan-blue'],
        padding: PixelRatio.roundToNearestPixel(10),
        borderRadius: PixelRatio.roundToNearestPixel(10),
        flexDirection: 'row',
        justifyContent: "space-evenly",
        alignItems: 'center'
    },
    printer_cleaning_disclamer_text: {
        flex: 1,
        color: allColor.white,
        fontWeight: '600',
        fontSize: PixelRatio.roundToNearestPixel(16),
        textAlign:'justify'
    },
    paperRoll: {
        marginTop: PixelRatio.roundToNearestPixel(20),
        alignSelf: 'center',
        borderRadius: PixelRatio.roundToNearestPixel(50),
        borderWidth: 1,
        padding: PixelRatio.roundToNearestPixel(10),
        borderColor: allColor['light-gray'],
        transform: [{ rotateX: '0deg' }, { rotateZ: '280deg' }, { rotateY: '180deg' }],
    }
})