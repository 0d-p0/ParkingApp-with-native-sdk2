import {Text, View} from 'react-native';
import React, {useContext} from 'react';
import {NavigationContainer} from '@react-navigation/native';

import {createNativeStackNavigator} from '@react-navigation/native-stack';

import BottomNavigation from '../../Navigation/BottomNavigation/BottomNavigation';
import SignInScreen from '../AccountManagement/SignInScreen';
import SignUpScreen from '../AccountManagement/SignUpScreen';
import ForgotPassword from '../AccountManagement/ForgotPassword';
import {AuthContext} from '../../Auth/AuthProvider';
import Scanner from '../../component/Scanner';
import PrintUi from '../PrintUi/PrintUi';
import OutpassPrintUI from '../PrintUi/OutpassPrintUI';
import CarReports from '../Reports/CarReports';
import OperatorReport from '../Reports/OperatorReport';
import Unbilled from '../Reports/Unbilled';

const Stack = createNativeStackNavigator();
const NavContainer = () => {
  //    const {user,loading}=getAuthUser()
  const {isLogin, loading} = useContext(AuthContext);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'gray',
        }}
        
        >
        <Text style={{fontSize: 20, color: 'yellow'}}>Loading .....</Text>

        {/* <SplashScreen/> */}
      </View>
    );
  }
  return (
    <NavigationContainer>
      {/* Rest of your app code */}
      {isLogin ? (
        <>
          {/* true */}

          <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="bottomNavBAr" component={BottomNavigation} />
            <Stack.Screen name="scanner" component={Scanner} />
            <Stack.Screen name='printerPreview' component={PrintUi}/>
            <Stack.Screen name='outpassPrinterPreview' component={OutpassPrintUI}/>
            <Stack.Screen name='reportCh' component={Unbilled}/>

            <Stack.Screen name='carReports' component={CarReports}/>
            <Stack.Screen name='operatorReports' component={OperatorReport}/>

          </Stack.Navigator>

          {/* <BottomNavigation /> */}
        </>
      ) : (
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="sign_in" component={SignInScreen} />
          {/* <Stack.Screen name="sign_up" component={SignUpScreen} />
          <Stack.Screen name="forgot_password" component={ForgotPassword} /> */}
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default NavContainer;

{
  /* <Stack.Screen name="home" component={BottomNavigation} /> */
}
{
  /* <Stack.Screen name="create_receipt" component={CreateReceipt} />
                    <Stack.Screen name="genaral_setting" component={GenaralSettingScreen} />
                    <Stack.Screen name="change_password" component={ChangePassword} />
                    <Stack.Screen name="gst_setting" component={GSTSettingScreen} />

                    <Stack.Screen name="printer_cleaning" component={PrinterCleaning} />   
                    <Stack.Screen name="erase_data" component={EraseData} /> 
                    <Stack.Screen name="operator_management" component={OperatorManagement} /> 
                    <Stack.Screen name="edit_operator" component={AddNewOperator} /> 
                    <Stack.Screen name="shift_management" component={ShiftManagement} />    
                    <Stack.Screen name="addNew_shift" component={AddnewShift} />  
                    <Stack.Screen name="user_details" component={UserDetails}/> */
}
