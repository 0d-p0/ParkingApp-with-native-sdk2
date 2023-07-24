import {
  PixelRatio,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import React, {useContext} from 'react';
import CustomHeader from '../../component/CustomHeader';
import MainView from '../../component/MainView';
import ActionBox from '../../component/ActionBox';
import icons from '../../Resources/Icons/icons';
import playSound from '../../Hooks/playSound';
import allColor from '../../Resources/Colors/Color';
import {AuthContext} from '../../Auth/AuthProvider';

const height = Dimensions.get('window').height;

const SettingScreen = ({navigation}) => {
  // const {ding} = playSound();
  const {logOut} = useContext(AuthContext);

  // React.useEffect(() => {
  //   const unsubscribe = navigation.addListener('tabPress', e => {
  //     // console.warn("hello")
  //     ding.play();
  //   });
  //   return unsubscribe;
  // }, [navigation]);

  return (
    <MainView>
      {/* header */}
      <CustomHeader title={'Setting'} />
      {/* scroll view */}

      <ScrollView style={{flex: 1}}>
        <View style={styles.report_container}>
          {/* {data.map((props, index) => (
            <View style={styles.ActionBox_style} key={index} >
              <ActionBox title={props.data} icon={icons.arrowRight} onAction={() => navigation.navigate('genaral_setting')} />
            </View>
          ))} */}
          {/* genaral setting */}
          <View style={styles.ActionBox_style}>
            <ActionBox
              title={'General Setting'}
              icon={icons.setting(allColor['primary-color'],50)}
              onAction={() => navigation.navigate('general_setting')}
            />
          </View>

          {/* change password */}
          <View style={styles.ActionBox_style}>
            <ActionBox
              title={'Change Password'}
              icon={icons.chnagePassword}
              onAction={() => navigation.navigate('change_password')}
            />
          </View>
          {/* printer cleaning */}
          {/* <View style={styles.ActionBox_style}>
            <ActionBox
              title={'printer Cleaning'}
              icon={icons.printer_two}
              onAction={() => navigation.navigate('printer_cleaning')}
            />
          </View> */}

          {/* erase data */}
          {/* <View style={styles.ActionBox_style}>
            <ActionBox
              title={'erase Data'}
              icon={icons.remove}
              onAction={() => navigation.navigate('erase_data')}
            />
          </View> */}

          {/* User Details */}
          <View style={styles.ActionBox_style}>
            <ActionBox
              title={'User Details'}
              icon={icons.userEdit(45,allColor['primary-color'])}
              onAction={() => navigation.navigate('user_details')}
            />
          </View>

          <View style={styles.ActionBox_style}>
            <ActionBox
              title={'Receipt Settings'}
              icon={icons.setting(allColor['primary-color'],50)}
              onAction={() => navigation.navigate('receipt_settings')}
            />
          </View>

          {/* GST Setting */}
          {/* <View style={styles.ActionBox_style}>
            <ActionBox
              title={'GST Setting'}
              icon={icons.book}
              onAction={() => navigation.navigate('gst_setting')}
            />
          </View> */}
          
          {/* shift Management */}

          {/* <View style={styles.ActionBox_style}>
            <ActionBox
              title={'shift Nanagement'}
              icon={icons.eraser(30)}
              onAction={() => navigation.navigate('shift_management')}
            />
          </View> */}

        </View>

        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: allColor['primary-color'],
            padding: 10,
            margin: 10,
            borderRadius: 12,
            elevation: 5,
          }}
          onPressIn={() => logOut()}>
          <Text
            style={{
              textAlign: 'center',
              color: allColor.white,
              fontWeight: 900,
            }}>
            LOG OUT
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </MainView>
  );
};

export default SettingScreen;

const styles = StyleSheet.create({
  report_container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    flexWrap: 'wrap',
    padding: PixelRatio.roundToNearestPixel(10),
  },
  ActionBox_style: {
    alignSelf: 'flex-start',
    width: '48%',
    height: height / 5,
    paddingVertical: PixelRatio.roundToNearestPixel(10),
  },
});
