import { PixelRatio, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import CustomHeader from '../../component/CustomHeader'
import CustomButtonComponent from '../../component/CustomButtonComponent'
import allColor from '../../Resources/Colors/Color'
import RoundedInputComponent from '../../component/RoundedInputComponent'

const EraseData = ({navigation}) => {
    const[password,setPassword] = useState('')
  return (
    <View style={{ flex: 1 }}>
    {/* custom header */}
    <CustomHeader title={"Erase Data"} navigation={navigation}/>
    {/* main container */}
    <ScrollView style={styles.container}>
        {/* printer cleaning disclamer */}
        <View style={styles.data_erage_alert}>
            {/* printer icon */}
            <View style={{ flex: 0.3 }}>
                {icons.alertIcon(50,allColor.white)}
            </View>
            {/* printer cleaning text */}
            <Text style={styles.data_erage_disclamer_text}>
                {strings.data_erage_alert}
            </Text>
        </View>

        {/* eraser Icon */}
        <View style={{  alignSelf: 'center' }}>
            <View style={styles.eraser}>
                {icons.eraser(50)}
            </View>
            <Text style={{ ...styles.data_erage_disclamer_text, color: allColor.black, marginTop: PixelRatio.roundToNearestPixel(10),flex:0,fontSize:PixelRatio.roundToNearestPixel(20)}}>
                {strings.want_to_continue}
            </Text>
            {/* Divider */}
            <View style={{width:PixelRatio.roundToNearestPixel(60),borderBottomColor:allColor['primary-color'],borderBottomWidth:3,alignSelf:'center',marginTop:PixelRatio.roundToNearestPixel(10)}}/>
        </View>

        {/* erase data controler*/}
          <View>
            <Text style={{marginLeft:PixelRatio.roundToNearestPixel(15),fontWeight:'600'}}>
                Current Password
            </Text>
            <RoundedInputComponent placeholder={"Current Password"} value={password} onChangeText={setPassword} />
          <CustomButtonComponent.GoButton title={"Erase Data Now"} onAction={()=>alert("data erase")}
        style={{marginTop:PixelRatio.roundToNearestPixel(15)}}
        />
          </View>
      
    </ScrollView>
</View>
  )
}

export default EraseData
const styles = StyleSheet.create({
    container: {
        padding: PixelRatio.roundToNearestPixel(15),
        flex: 1,
        backgroundColor: allColor.white
    },
    data_erage_alert: {
        backgroundColor: allColor['cyan-blue'],
        padding: PixelRatio.roundToNearestPixel(10),
        borderRadius: PixelRatio.roundToNearestPixel(10),
        flexDirection: 'row',
        justifyContent: "space-evenly",
        alignItems: 'center'
    },
    data_erage_disclamer_text: {
        flex: 1,
        color: allColor.white,
        fontWeight: '600',
        fontSize: PixelRatio.roundToNearestPixel(16),
        textAlign:'justify'
    },
    eraser: {
        marginTop: PixelRatio.roundToNearestPixel(20),
        alignSelf: 'center',
        borderRadius: PixelRatio.roundToNearestPixel(50),
        borderWidth: 1,
        padding: PixelRatio.roundToNearestPixel(10),
        borderColor: allColor['light-gray'],
        
    }
})