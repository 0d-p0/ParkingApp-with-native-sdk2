
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ReceiptScreen from '../../Screens/BottomNavScreen/ReceiptScreen';
import icons from '../../Resources/Icons/icons';
import ReportScreen from '../../Screens/BottomNavScreen/ReportScreen';
import NavigatioRoute from '../../Router/NavigationRoute/NavigatioRoute';
import OutpassScreen from '../../Screens/BottomNavScreen/OutPassScreen';
import SettingScreen from '../../Screens/BottomNavScreen/SettingScreen';
import { View } from 'react-native'

const Tab = createBottomTabNavigator();

function BottomBarContainer({ children }) {

  const { receipt, outPass, report, setting } = NavigatioRoute

  return (
    <View>
      {children}
      <Tab.Navigator screenOptions={{ headerShown: false }} initialRouteName={receipt}>
        {/* Receipt Screen */}
        <Tab.Screen
          name={receipt}
          options={{
            title: 'Receipt',
            tabBarIcon: ({ color, size }) => (
              icons.receipt(color, size)
            ),
          }}
          component={ReceiptScreen} />

        {/* Out pass bill */}
        <Tab.Screen name={outPass}
          options={{
            title: 'Outpass',
            tabBarIcon: ({ color, size }) => (
              icons.setting(color, size)
            ),

          }} component={OutpassScreen} />

        {/* report genarate */}
        <Tab.Screen name={report}
          options={{
            title: 'Report',
            tabBarIcon: ({ color, size }) => (
              icons.report(color, size)
            )
          }} component={ReportScreen} />

        {/*Setting Screen */}
        <Tab.Screen name={setting}
          options={{
            title: 'setting',
            tabBarIcon: ({ color, size }) => (
              icons.setting(color, size)
            ),

          }}
          component={SettingScreen} />

      </Tab.Navigator>

    </View>
  )
}


export default BottomBarContainer

