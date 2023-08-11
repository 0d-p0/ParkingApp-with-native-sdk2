import React, { useContext } from 'react'
import { Alert, TouchableOpacity } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ReceiptScreen from '../../Screens/BottomNavScreen/ReceiptScreen';
import icons from '../../Resources/Icons/icons';
import ReportScreen from '../../Screens/BottomNavScreen/ReportScreen';
import NavigatioRoute from '../../Router/NavigationRoute/NavigatioRoute';
import OutpassScreen from '../../Screens/BottomNavScreen/OutPassScreen';
import SettingScreen from '../../Screens/BottomNavScreen/SettingScreen';
import ReceiptContainer from '../../Screens/NavContainer/ReceiptContainer';
import SettingsContainer from '../../Screens/NavContainer/SettingsContainer';
import { AuthContext } from '../../Auth/AuthProvider';


const Tab = createBottomTabNavigator();

function BottomNavigation() {
  const { generalSetting } = useContext(AuthContext)
  const { receipt, outPass, report, setting } = NavigatioRoute
  let { dev_mod } = generalSetting

  return (


    <Tab.Navigator screenOptions={{ headerShown: false, tabBarStyle: { height: 60, size: 20 }, tabBarHideOnKeyboard: true }} initialRouteName={receipt}>
      {/* Receipt Screen */}
      {  <Tab.Screen
        name={"ReceiptScreen"}
        options={{
          title: 'Receipt',
          tabBarIcon: ({ color, size }) => (
            icons.receipt(color, 30)
          ),
        }}

        component={ReceiptContainer} />}

      {/* Out pass bill */}
      {dev_mod != "R"  && dev_mod != "F" && <Tab.Screen name={outPass}
        options={{
          title: 'Outpass',
          tabBarIcon: ({ color, size }) => (
            icons.setting(color, 30)
          ),
        }} component={OutpassScreen} />
      }
      {/* report genarate */}
      <Tab.Screen name={report}
        options={{
          title: 'Report',
          tabBarIcon: ({ color, size }) => (
            icons.report(color, 30)
          )
        }} component={ReportScreen} />

      {/*Setting Screen */}
      <Tab.Screen name={setting}
        options={{
          title: 'setting',
          tabBarIcon: ({ color, size }) => (
            icons.setting(color, 30)
          ),

        }}
        component={SettingsContainer} />

    </Tab.Navigator>

  )
}

export default BottomNavigation
