import {
  Modal,
  PixelRatio,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useContext, useState} from 'react';
import {responsiveHeight} from 'react-native-responsive-dimensions';
import {InternetStatusContext} from '../../App';
import allColor from '../../Resources/Colors/Color';

const Pot = () => {
  const isOnline = useContext(InternetStatusContext);
  const [isDropDown, setDropDown] = useState(false);
  const handleSelect = item => {
    console.log('Selected item:', item);
    // Handle the selected item as needed
  };
  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: "space-evenly",
          borderBottomColor: allColor.gray,
          borderBottomWidth: 1,
          padding: 10,
        }}>
        <View style={{flex:1}}>
          <CustomDropdown />
        </View>
      
        <View style={{flex: 5}}>
        </View>
      </View>
    </View>
  );
};

export default Pot;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
