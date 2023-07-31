import {
  PixelRatio,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
} from 'react-native';
import React, {useState, useEffect, useContext} from 'react';
import CustomHeader from '../../component/CustomHeader';
import icons from '../../Resources/Icons/icons';
import allColor from '../../Resources/Colors/Color';

import DropDownComponent from '../../component/DropDownComponent';
import CustomSwitch from '../../component/CustomSwitch';
import CustomInputComponent from '../../component/CustomInputComponent';
import CustomButtonComponent from '../../component/CustomButtonComponent';
import CustomDropdown from '../../component/CustomDropdown';
import settingController from '../../Hooks/Controller/Setting/settingController';
import settingInputHelper from '../../Hooks/InputOperations/settingInputHelper';
import {AuthContext} from '../../Auth/AuthProvider';
const width = Dimensions.get('screen').width;

const language = [
  {label: 'English', value: 'E'},
  {label: 'Hindi', value: 'H'},
  {label: 'Tamil', value: 'T'},
];

const deviceMode = [
  {label: 'Dual Mode', value: 'D'},
  {label: 'Receipt Mode', value: 'R'},
  {label: 'Bill Mode', value: 'B'},
  {label: 'Fixed Mode', value: 'F'},
  {label: 'Advanced Mode', value: 'A'},
];

const autoArchiveData = [
  {label: '30 Days', value: '30'},
  {label: '60 Days', value: '60'},
  {label: '90 Days', value: '90'},
  {label: '120 Days', value: '120'},
];

const resetReceipt = [
  {label: 'daily', value: 'D'},
  {label: 'continuous', value: 'C'},
];
const SettingComponent = ({icon, text, children, style}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomColor: allColor.gray,
        borderBottomWidth: 1,
        padding: 10,
        ...style,
      }}>
      {/* {children} */}
      <View style={{flex: 0.8, flexDirection: 'row', alignItems: 'center'}}>
        {icon}
        <Text style={styles.text}> {text} </Text>
      </View>
      <View style={{flex: 0.5, alignItems: 'flex-end'}}>{children}</View>
    </View>
  );
};

// {"adv_pay": "N", "auto_archive": 30, "created_at": "2023-05-26T13:02:01.000000Z", "dev_mod": "D", "max_receipt": 500, "mc_iemi_no": "1234567890", "mc_lang": "E", "otp_val": "Y", "parking_entry_type": "S", "report_flag": "Y", "reset_recipeit_no": "C", "setting_id": 1, "signIn_session": "12", "total_collection": "Y", "updated_at": "2023-05-26T13:02:01.000000Z", "vehicle_no": "Y"}
const GenaralSettingScreen = ({navigation}) => {
  // const { generalSetting } = settingController()

  //  GETING GENARAL SETTINGS
  const {generalSetting} = useContext(AuthContext);

  console.log(generalSetting);
  // const { input, addInitialData, handleChange } = settingInputHelper()
  const {
    setting_id,
    mc_iemi_no,
    mc_lang,
    dev_mod,
    report_flag,
    otp_val,
    signIn_session,
    max_receipt,
    total_collection,
    vehicle_no,
    adv_pay,
    auto_archive,
    reset_recipeit_no,
    parking_entry_type,
    created_at,
    updated_at,
  } = generalSetting;

  // alert (JSON.stringify(generalSetting))
  useEffect(() => {
    // addInitialData(setting_id, mc_iemi_no, mc_lang, dev_mod, report_flag,
    //   otp_val, signIn_session, max_receipt.toString(), total_collection, vehicle_no,
    //   adv_pay, auto_archive, reset_recipeit_no, parking_entry_type,
    //   created_at, updated_at)
  }, []);

  return (
    <View style={{flex: 1}}>
      <CustomHeader title={'General Setting'} navigation={navigation} />
      {generalSetting && (
        <ScrollView style={{flex: 1, margin: 10}}>
          <View>
            {/* display language */}
            {mc_lang && (
              <SettingComponent icon={icons.language} text={'Display Language'}>
                <CustomDropdown
                  data={language}
                  labelId={mc_lang}
                  onChange={e => handleChange('language', e)}
                />
              </SettingComponent>
            )}

            {/* device Mode */}
            {dev_mod && (
              <SettingComponent icon={icons.deviceMode} text={'Device Mode'}>
                <CustomDropdown
                  data={deviceMode}
                  labelId={dev_mod}
                  onChange={e => handleChange('deviceMode', e)}
                />
              </SettingComponent>
            )}
            {/* Reports */}
            {report_flag && (
              <SettingComponent
                icon={icons.report(allColor['primary-color'], 25)}
                text={'Reports'}>
                <CustomSwitch
                  isEnabled={report_flag == 'Y' ? true : false}
                  handleChange={() => {}}
                />
              </SettingComponent>
            )}
            {/* OTP Validation */}
            {otp_val && (
              <SettingComponent
                icon={icons.onepassword}
                text={'OTP Validation'}>
                <CustomSwitch
                  isEnabled={otp_val == 'Y' ? true : false}
                  handleChange={() => {}}
                />
              </SettingComponent>
            )}

            {/* Sign in session */}
            {signIn_session && (
              <SettingComponent
                icon={icons.timeSand}
                text={'Signin Session duration'}>
                <CustomInputComponent.InputComponentWithText
                  value={signIn_session}
                  onChangeText={value =>
                    handleChange('signInSessionDuration', value)
                  }
                />
              </SettingComponent>
            )}

            {/* total collection */}
            {total_collection && (
              <SettingComponent
                icon={icons.totalCollection}
                text={'Total Collection'}>
                <CustomSwitch
                  isEnabled={total_collection == 'Y' ? true : false}
                  handleChange={() => {}}
                />
              </SettingComponent>
            )}

            {/* Mandotary Vehicle No. */}
            {vehicle_no && (
              <SettingComponent
                icon={icons.mandotaryVehicle}
                text={'Mandotary Vehicle Number'}>
                <CustomSwitch
                  isEnabled={vehicle_no == 'Y' ? true : false}
                  handleChange={() => {}}
                />
              </SettingComponent>
            )}

            {/* Advanced Payment*/}
            {adv_pay && (
              <SettingComponent
                icon={icons.totalCollection}
                text={'Advanced Payment'}>
                <CustomSwitch
                  isEnabled={adv_pay == 'Y' ? true : false}
                  handleChange={() => {}}
                />
              </SettingComponent>
            )}

            {/* Advanced Amount*/}
            {false && (
              <SettingComponent
                icon={icons.totalCollection}
                text={'Advanced Amount'}>
                <CustomInputComponent.InputComponentWithText
                  value={''}
                  placeholder={'enter amount'}
                  onChangeText={value => handleChange(advancedPayment, value)}
                />
              </SettingComponent>
            )}

            {/* Auto archive data*/}
            {auto_archive && (
              <SettingComponent
                icon={icons.archiveData}
                text={'Auto Archive Data'}>
                {/* <CustomDropdown data={autoArchiveData} labelId={auto_archive.toString()}
              onChange={(e) => handleChange("autoAchiveData", e)}
            /> */}

                {auto_archive && (
                  <CustomInputComponent.InputComponentWithText
                    value={auto_archive.toString()}
                    onChangeText={value => {}}
                    text={'Days'}
                  />
                )}
              </SettingComponent>
            )}

            {/* Maximum Receipt */}
            {max_receipt && (
              <SettingComponent
                icon={icons.receipt(allColor['primary-color'], 25)}
                text={'Maximum Receipt'}>
                <CustomInputComponent.InputComponentWithText
                  show={true}
                  value={max_receipt.toString()}
                  // onChangeText={(value) => handleChange("maximumReceipt", value)}
                />
              </SettingComponent>
            )}

            {/*Reset Receipt No */}
            {reset_recipeit_no && (
              <SettingComponent
                icon={icons.resetReceipt}
                text={'Reset Receipt No'}>
                <CustomDropdown
                  data={resetReceipt}
                  labelId={generalSetting.reset_recipeit_no.toString()}
                  onChange={e => handleChange('resetReceiptNo', e)}
                />
              </SettingComponent>
            )}

            {/* Free Mins */}
            {/* <SettingComponent icon={icons.phone} text={'Free mins'}>
            <CustomInputComponent.InputComponentWithText value={"60"} show={true} />
          </SettingComponent> */}
          </View>

          {/* <View style={styles.actionButton}>
          <CustomButtonComponent.CancelButton title={"Discard"} style={{ flex: 1, marginRight: 10 }} />
          <CustomButtonComponent.GoButton title={"Save"} style={{ flex: 1, marginLeft: 10 }} />
        </View> */}
        </ScrollView>
      )}
    </View>
  );
};

export default GenaralSettingScreen;

export {SettingComponent};

const styles = StyleSheet.create({
  text: {
    fontWeight: '600',
    color: allColor.black,
    fontSize: PixelRatio.roundToNearestPixel(16),
    marginLeft: PixelRatio.roundToNearestPixel(10),
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  label: {
    marginLeft: 10,
  },
  actionButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',

    marginBottom: PixelRatio.roundToNearestPixel(5),
    width: width - 20,
    padding: PixelRatio.roundToNearestPixel(10),
  },
});
