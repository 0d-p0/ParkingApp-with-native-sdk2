import { ScrollView, StyleSheet, Text, TextInput, View, PixelRatio, TouchableOpacity, Image, Button } from 'react-native'
import React, { useState, useEffect } from 'react'
import CustomHeader from '../../component/CustomHeader'
import allColor from '../../Resources/Colors/Color'
import getReceiptSettings from '../../Hooks/Controller/ReceiptSetting/getReceiptSettings'
import { launchImageLibrary } from 'react-native-image-picker';
import ImgToBase64 from 'react-native-image-base64';
// import ThermalPrinterModule from 'react-native-thermal-printer';
import ReceiptImageStorage from '../../Hooks/Sql/Receipt Setting Storage/ReceiptImageStorage'

const ReceiptSetting = ({ navigation }) => {
    const { receiptSettings } = getReceiptSettings()
    const { addNewReceiptImage, getReceiptImage, deleteReceiptImage } = ReceiptImageStorage()
    const [pic, setPic] = useState()
    const [update, setUpdate] = useState(false)
    //    {"footer1": "Test footer1", "footer2": "Test footer2", "header1": "Test header1", "header2": "Test header2", "id": 5, "image": "image.jpeg"}
    async function handlePickImage() {
        const options = {
            selectionLimit: 1,
            maxWidth:250,
            maxHeight:250
        };

        await launchImageLibrary(options).then(
            async res => {
                console.log(res.assets[0])
                setPic(res.assets[0].uri)
                console.log(res.assets[0].uri)

                let base64String = await ImgToBase64.getBase64String(res.assets[0].uri)
                base64String = `data:image/jpeg;base64,${base64String.toString()}`
                base64String = base64String.replace(/\s/g, '')
                console.log("loading complete")
                addNewReceiptImage(base64String).then(res => {
                    setUpdate(!update)
                }).catch(error => console.error(error))


                { }
            }

        ).catch(
            err => console.log("error iss ", err)
        )
    }

    const print = async () => {
        try {
            await ThermalPrinterModule.printBluetooth({
                payload: `[C]<img>${pic}</img>`,
                printerNbrCharactersPerLine: 30,
                printerDpi: 120,
                printerWidthMM: 58,
                mmFeedPaper: 25,
            });
        } catch (error) {
            console.log("error is ", error)
        }
    }

    useEffect(() => {
        getReceiptImage().then(response => {
            setPic(response.image)
        }).catch(error => {
            console.error(error)
        })
    }, [update])

    return (
        <View style={{ flex: 1, }}>
            <CustomHeader title={'General Setting'} navigation={navigation} />
            <ScrollView style={{ flex: 1, margin: 10, backgroundColor: allColor.white, borderRadius: 10, padding: 5 }}>

                {/* Heading 1 */}
                {receiptSettings?.header1_flag != "0" && <View style={{ marginBottom: 10 }}>
                    <Text style={{ marginLeft: 10, marginBottom: 5, color: allColor.black }}>
                        Header1
                    </Text >
                    <View style={styles.sectionStyle}>
                        <TextInput
                            style={[styles.text, styles.input]}
                            value={receiptSettings?.header1}
                            editable={false}
                        />
                    </View>
                </View>}
                {/* Heading 2 */}
                {receiptSettings?.header2_flag != "0" && <View style={{ marginBottom: 10 }}>
                    <Text style={{ marginLeft: 10, marginBottom: 5, color: allColor.black }}>
                        Header2
                    </Text>
                    <View style={styles.sectionStyle}>
                        <TextInput
                            style={[styles.text, styles.input]}
                            value={receiptSettings?.header2}
                            editable={false}
                        />
                    </View>
                </View>}
                {/* Footer 2*/}
                {receiptSettings?.footer1_flag != "0" && <View style={{ marginBottom: 10 }}>
                    <Text style={{ marginLeft: 10, marginBottom: 5, color: allColor.black }}>
                        Footer1
                    </Text>
                    <View style={styles.sectionStyle}>
                        <TextInput
                            style={[styles.text, styles.input]}
                            value={receiptSettings?.footer1}
                            editable={false}
                        />
                    </View>
                </View>}

                {receiptSettings?.footer2_flag != "0" && <View style={{ marginBottom: 10 }}>
                    <Text style={{ marginLeft: 10, marginBottom: 5, color: allColor.black }}>
                        Footer2
                    </Text>
                    <View style={styles.sectionStyle}>
                        <TextInput
                            style={[styles.text, styles.input]}
                            value={receiptSettings?.footer2}
                            editable={false}
                        />
                    </View>
                </View>}


                <View>
                    {(receiptSettings?.footer2_flag == "0" && receiptSettings?.footer1_flag == "0" && receiptSettings?.header2_flag == "0" && receiptSettings?.header1_flag == "0") && <Text>
                        NO DATA AVAILABLE
                    </Text>}
                </View>
                {/* IMAGE CONTAINER */}
                <View style={{ flexDirection: 'row', gap: 10 }}>
                    <TouchableOpacity>
                        {pic && <Image
                            style={{ width: 100, height: 100, borderRadius: 10 }}
                            source={{ uri: pic }}
                        />}
                    </TouchableOpacity>

                    <TouchableOpacity style={{ borderStyle: 'dashed', borderRadius: 10, borderColor: allColor['primary-color'], borderWidth: 2, width: 100 }} onPress={handlePickImage}>
                        <Text style={{ padding: 20 }}>
                            {pic ? "Change Image" : "ADD IMAGE"}
                        </Text>
                    </TouchableOpacity>
                    {pic && (
                        <Button title='Remove' onPress={() => {
                            setPic(null)
                            deleteReceiptImage()
                        }} />
                    )}
 
                    {/* <TouchableOpacity style={{ borderStyle: 'dashed', borderRadius: 10, borderColor: allColor['primary-color'], borderWidth: 2, width: 100 }} onPress={print}>
                        <Text style={{ padding: 20 }}>
                            loop
                        </Text>
                    </TouchableOpacity> */}
                </View>
            </ScrollView>
        </View>
    )
}

export default ReceiptSetting

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
        width: "98%",
        height: PixelRatio.roundToNearestPixel(50),
        borderColor: allColor.black,
        borderWidth: 1,
        borderRadius: PixelRatio.roundToNearestPixel(10),
        paddingHorizontal: 2,
        marginHorizontal: 2
    },
    text: {
        color: allColor.black,
        fontWeight: '600',
        fontSize: PixelRatio.roundToNearestPixel(15),
        marginHorizontal: PixelRatio.roundToNearestPixel(2),
    },
    // input: {
    //     maxWidth: PixelRatio.roundToNearestPixel(100),
    // },
})