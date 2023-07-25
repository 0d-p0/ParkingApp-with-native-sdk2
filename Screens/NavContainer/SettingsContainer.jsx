import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import GenaralSettingScreen from '../Settings/GenaralSettingScreen';
import ChangePassword from '../Settings/ChangePassword';
import GSTSettingScreen from '../Settings/GSTSettingScreen';
import PrinterCleaning from '../Settings/PrinterCleaning';
import EraseData from '../Settings/EraseData';
import UserDetails from '../Settings/UserDetails';
import SettingScreen from '../BottomNavScreen/SettingScreen';
import ReceiptSetting from '../Settings/ReceiptSetting';



const Stack = createNativeStackNavigator();  // creates object for Stack Navigator

const SettingsContainer = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }} >
            <Stack.Screen name="setting" component={SettingScreen} />
            <Stack.Screen name="general_setting" component={GenaralSettingScreen} />
            <Stack.Screen name="change_password" component={ChangePassword} />
            {/* <Stack.Screen name="gst_setting" component={GSTSettingScreen} /> */}
     
            {/* <Stack.Screen name="printer_cleaning" component={PrinterCleaning} /> */}

            <Stack.Screen name="receipt_settings" component={ReceiptSetting} />

            {/* <Stack.Screen name="erase_data" component={EraseData} /> */}
            {/* <Stack.Screen name="operator_management" component={OperatorManagement} /> */}
            {/* <Stack.Screen name="edit_operator" component={AddNewOperator} /> */}
            {/* <Stack.Screen name="shift_management" component={ShiftManagement} /> */}
            {/* <Stack.Screen name="addNew_shift" component={AddnewShift} /> */}
            <Stack.Screen name="user_details" component={UserDetails} />
        </Stack.Navigator>
    )
}

export default SettingsContainer