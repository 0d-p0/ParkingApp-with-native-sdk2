import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ReceiptScreen from '../BottomNavScreen/ReceiptScreen';
import CreateReceipt from '../RECEIPT/CreateReceipt';


const Stack = createNativeStackNavigator();  // creates object for Stack Navigator

const ReceiptContainer = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false}}  >
            <Stack.Screen
                name="Receipt"
                component={ReceiptScreen}
            />
            <Stack.Screen
                name="create_receipt"
                component={CreateReceipt}
            />
           
        </Stack.Navigator>
    )
}

export default ReceiptContainer