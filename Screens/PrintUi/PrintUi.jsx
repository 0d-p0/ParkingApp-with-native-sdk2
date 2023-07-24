import { StyleSheet, Text, View, PixelRatio } from 'react-native'
import React from 'react'
import allColor from '../../Resources/Colors/Color'
import CustomButtonComponent from '../../component/CustomButtonComponent'
import CustomHeader from '../../component/CustomHeader'
// import ThermalPrinterModule from 'react-native-thermal-printer';

const PrintUi = ({route,navigation}) => {
 const {data} = route.params;

//  [{"label": "RECEIPT NO.", "value": 13}, {"label": "VEHICLE TYPE", "value": "Car"}, {"label": "VEHICLE N0.", "value": "kyjyjyk"}, {"label": "IN TM", "value": "23/6/2023 - 5:01:29 PM"}]
 const handlePrintReceipt = async () => {
  try {
    await ThermalPrinterModule.printBluetooth({
      payload: `[C]<B>RECEIPT\n`+
      `[L]<b>RECEIPT NO : ${data[0].value}\n`+
      `[L]<b>VEHICLE TYPE : ${data[1].value}\n`+
      `[L]<b>VEHICLE NO : ${data[2].value}\n`+
      `[L]<b>IN Time : ${data[3].value}\n`+
      `[R]<qrcode size='30'>${data[0].value}/${data[1].value}/${data[2].value}/${data[3].value}</qrcode>\n`,
      printerNbrCharactersPerLine: 30,
      printerDpi:120,
      printerWidthMM:58,
      mmFeedPaper:25
    });
    navigation.navigate("bottomNavBAr")
  } catch (err) {
    //error handling
    alert(err.message)
    console.log(err.message);
  }
}
    return (
    <>
    <CustomHeader title={"Printer Preview"} />
        <View style={{ padding: PixelRatio.roundToNearestPixel(15) }}>
            {/* data  loop run below */}
         {
            data && data.map((props,index)=>
                <View key={index}>
                <View style={styles.inLineTextContainer}>
                    <Text style={styles.text}>{props?.label}</Text>
                    <Text style={styles.text}> : {props?.value}</Text>

                </View>
                <View
                    style={{
                        borderBottomColor: 'black',
                        borderBottomWidth: StyleSheet.hairlineWidth,
                    }}
                />
            </View>
            )
         }
            
            <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop:  PixelRatio.roundToNearestPixel(10),
            }}>
            <CustomButtonComponent.CancelButton
              title={'Cancel'}
              onAction={() => {
                   navigation.goBack()
              }}
              style={{flex: 1, marginRight:  PixelRatio.roundToNearestPixel(8)}}
            />

            <CustomButtonComponent.GoButton
              title={'Print Receipt'}
              onAction={() =>{
                handlePrintReceipt()
            }}
              style={{flex: 1, marginLeft: PixelRatio.roundToNearestPixel(8)}}
            />
          </View>
        </View>
    </>
    )
}

export default PrintUi

const styles = StyleSheet.create({
    inLineTextContainer: {
        flexDirection: 'row',
        paddingVertical: PixelRatio.roundToNearestPixel(10),
        alignSelf:'center'
    },
    text: {
        color: allColor.black,
        fontWeight: PixelRatio.roundToNearestPixel(500),
        fontSize: PixelRatio.roundToNearestPixel(18)
    }
})