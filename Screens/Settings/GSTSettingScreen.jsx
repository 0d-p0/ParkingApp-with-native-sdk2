import {PixelRatio, StyleSheet, Text, View} from 'react-native';
import React, { useState } from 'react';
import CustomHeader from '../../component/CustomHeader';
import allColor from '../../Resources/Colors/Color';
import RoundedInputComponent from '../../component/RoundedInputComponent';
import CustomButtonComponent from '../../component/CustomButtonComponent';
import { SettingComponent } from './GenaralSettingScreen';
import CustomSwitch from '../../component/CustomSwitch';
import DropDownComponent from '../../component/DropDownComponent';

const GSTSettingScreen = ({navigation}) => {
  const [isEnabled,setIsEnable]=useState(false)
  return (
    <>
      <CustomHeader title={'GST SETTINGS'} navigation={navigation} />

      <View style={styles.container}>
      {/* GST Number */}
        <View style={{marginTop: PixelRatio.roundToNearestPixel(20)}}>
          <Text style={styles.vehicle_text}>
          GST Number</Text>
          <RoundedInputComponent placeholder={'Enter GST Number'} />
        </View>
        {/* CGST */}

        <View style={{marginTop: PixelRatio.roundToNearestPixel(20)}}>
          <Text style={styles.vehicle_text}>
          CGST </Text>
          <RoundedInputComponent placeholder={'Enter CGST'} />
        </View>
        {/* SGST */}

        <View style={{marginTop: PixelRatio.roundToNearestPixel(20)}}>
          <Text style={styles.vehicle_text}>
        SGST</Text>
          <RoundedInputComponent placeholder={'Enter SGST'} />
        </View>

        <SettingComponent text={"GSTN Enable/Disable"} style={{borderBottomWidth:0}}>
            <CustomSwitch isEnabled={isEnabled} handleChange={()=>setIsEnable(!isEnabled)} />
        </SettingComponent>
        <SettingComponent text={"GST Amount"} style={{borderBottomWidth:0}}>
           <DropDownComponent/>
        </SettingComponent>


        {/*............... action buttons ......... */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: PixelRatio.roundToNearestPixel(10),
           
          }}>
          <CustomButtonComponent.CancelButton
            title={'Cancel'}
            onAction={() => {}}
            style={{flex: 1, marginRight: PixelRatio.roundToNearestPixel(8)}}
          />

          <CustomButtonComponent.GoButton
            title={'Save'}
            onAction={() => {}}
            style={{flex: 1, marginLeft: PixelRatio.roundToNearestPixel(8)}}
          />
        </View>
      </View>
    </>
  );
};

export default GSTSettingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: PixelRatio.roundToNearestPixel(20),
  },
  vehicle_text: {
    marginLeft: PixelRatio.roundToNearestPixel(15),
    fontWeight: '600',
    color: allColor.black,
    fontSize: PixelRatio.roundToNearestPixel(15),
    marginBottom: PixelRatio.roundToNearestPixel(10),
  },
});
