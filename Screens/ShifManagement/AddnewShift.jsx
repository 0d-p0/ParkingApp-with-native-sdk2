import { StyleSheet, Text, View, ScrollView, PixelRatio, Pressable } from 'react-native'
import React, { useState } from 'react'
import CustomHeader from '../../component/CustomHeader'
import allColor from '../../Resources/Colors/Color'
import RoundedInputComponent from '../../component/RoundedInputComponent'
import CustomButtonComponent from '../../component/CustomButtonComponent'
import extarnalStyles from '../../Styles/styles'

const AddnewShift = () => {
    const [shiftName, setShiftName] = useState("")
    return (
        <View>
            <CustomHeader title={"Shift Management"} />
            <ScrollView style={styles.container}>

                {/* header title */}
                <Text style={styles.headerText}>
                    {strings.addNewOperator}
                </Text>

                {/* divider */}
                <View style={{ borderBottomColor: allColor['primary-color'], borderBottomWidth: 3, width: PixelRatio.roundToNearestPixel(60), alignSelf: 'center', marginTop: PixelRatio.roundToNearestPixel(20), }} />

                {/* operator code */}
                <View style={{ marginTop: PixelRatio.roundToNearestPixel(20) }}>
                    <Text style={{ marginLeft: PixelRatio.roundToNearestPixel(15), marginBottom: PixelRatio.roundToNearestPixel(5), fontWeight: '600', color: allColor.black }}>
                        Shift Name
                    </Text>

                    <RoundedInputComponent placeholder={"shift name"}
                        value={shiftName}
                        onChangeText={setShiftName} />
                </View>

                {/* operator code */}
                <View style={{ marginTop: PixelRatio.roundToNearestPixel(20) }}>
                    <Text style={{ marginLeft: PixelRatio.roundToNearestPixel(15), marginBottom: PixelRatio.roundToNearestPixel(5), fontWeight: '600', color: allColor.black }}>
                        Shift Time
                    </Text>
                    <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-around'}}>
                        {/* start Time */}
                        <View style={{flexDirection:'row',alignItems:'center'}} > 
                     <Text style={{fontSize:PixelRatio.roundToNearestPixel(16)}}> From : </Text>
                     <Pressable>
                        <Text style={{borderRadius:PixelRatio.roundToNearestPixel(20),borderWidth:1,borderColor:allColor['light-gray'],padding:PixelRatio.roundToNearestPixel(10)}}>
                            01:00:00
                        </Text>
                     </Pressable>
                     </View>
                     <Text> - </Text>
                       {/* End Time */}
                       <View style={{flexDirection:'row',alignItems:'center'}} > 
                     <Text style={{fontSize:PixelRatio.roundToNearestPixel(16)}}> To : </Text>
                     <Pressable>
                        <Text style={{borderRadius:PixelRatio.roundToNearestPixel(20),borderWidth:1,borderColor:allColor['light-gray'],padding:PixelRatio.roundToNearestPixel(10)}}>
                            01:00:00
                        </Text>
                     </Pressable>
                     </View>
                    </View>


                     {/* action buttons */}
                <View style={{...extarnalStyles.password_action_container,marginTop:PixelRatio.roundToNearestPixel(20),marginBottom:PixelRatio.roundToNearestPixel(20)}}>

{/* reset action button */}
<CustomButtonComponent.CancelButton title={"Cancel"} onAction={() => alert("reset")}
    style={{ flex: 1, marginRight: PixelRatio.roundToNearestPixel(8) }}
/>

{/* change password action button */}

<CustomButtonComponent.GoButton title={"Save"} onAction={() => alert("password changed")}   style={{ flex: 1, marginRight: PixelRatio.roundToNearestPixel(8)}}/>
</View>

                </View>

            </ScrollView>
        </View>
    )
}

export default AddnewShift

const styles = StyleSheet.create({
    container: {
        backgroundColor: allColor.white,
        padding: PixelRatio.roundToNearestPixel(15)
    },
    headerText: {
        color: allColor.black,
        alignSelf: 'center',
        fontSize: PixelRatio.roundToNearestPixel(20),
        fontWeight: '600',
    }
})