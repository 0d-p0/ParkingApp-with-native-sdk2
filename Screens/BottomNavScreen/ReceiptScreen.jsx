import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Pressable,
  PixelRatio,
  ScrollView,
  ActivityIndicator,
  ToastAndroid,
  PermissionsAndroid,
  NativeModules,
  Button,
} from 'react-native';

import React, {useContext, useEffect, useRef, useState} from 'react';

import axios from 'axios';

import CustomHeader from '../../component/CustomHeader';

import styles from '../../Styles/styles';
import allColor from '../../Resources/Colors/Color';
import icons from '../../Resources/Icons/icons';
import getVechicles from '../../Hooks/Controller/vechicles/getVechicles';
import storeUsers from '../../Hooks/Sql/User/storeuser';
import getAuthUser from '../../Hooks/getAuthUser';
import {InternetStatusContext} from '../../App';
import {AuthContext} from '../../Auth/AuthProvider';

import {address} from '../../Router/address';
import ThermalPrinterModule from 'react-native-thermal-printer';
import VehicleInOutStore from '../../Hooks/Sql/VehicleInOut/VehicleInOutStore';
import getVehiclePrices from '../../Hooks/Controller/vechicles/getVehiclePrices';
import {useIsFocused} from '@react-navigation/native';

import BleManager from 'react-native-ble-manager';
import getAdvancePrices from '../../Hooks/Controller/AdvancePrice/getAdvancePrices';
import vehicleRatesStorage from '../../Hooks/Sql/vechicles/vehicleRatesStorage';
import {
  changeResetReceiptNo,
  isResetReceiptNo,
} from '../../Hooks/Receipt/isResetReceiptNo';
import increaseReceiptNo from '../../Hooks/Receipt/increaseReceiptNo';

import bill from './bill.jpg';
import advancePriceStorage from '../../Hooks/Sql/AdvancePricesStorage/advancePriceStorage';
import gstSettingsController from '../../Hooks/Controller/GST_Settings/gstSettingsController';
import fixedPriceController from '../../Hooks/Controller/FIxedPrice/fixedPriceController';
import fixedPriceStorage from '../../Hooks/Sql/FixedPriceStore/fixedPriceStorage';
import dummyData from './dummy_in_data.json';
import uploadVehicleData from '../../Hooks/Controller/vechicles/uploadVehicleData';
const ReceiptScreen = ({navigation}) => {
  const MyNativeModule = NativeModules.MyPrinter;

  const isOnline = useContext(InternetStatusContext);
  const isFoccused = useIsFocused();
  const {generalSetting, logOut} = useContext(AuthContext);

  const [vechicles, setVechicles] = useState();
  // GST SETTINGS
  const {handleGetGstSettingsFromServer} = gstSettingsController();
  // setter and getter current time
  const [currentTime, setCurrentTime] = useState(new Date());

  const {
    calculateTotalAmount,
    calculateTotalVehicleIn,
    calculateTotalVehicleOut,
    getAllInVehicles,
    getAllOutVehicles,
    updateIsUploadedINById,
    updateIsUploadedOUTById,
    calculateStatistics
  } = VehicleInOutStore();
  const {getAdvancePricesByVehicleId} = advancePriceStorage();
  const {getFixedPricesByVehicleId} = fixedPriceStorage();
  const [totalAmount, setTotalAmount] = useState();
  const [totalVehicleIn, setTotalVehicleIn] = useState();
  const [totalVehicleOut, setTotalVehicleOut] = useState();

  const [receiptNo, setReceiptNo] = useState(null);

  const {getUserByToken, deleteUserById} = storeUsers();
  const {retrieveAuthUser} = getAuthUser();
  const {getVechiclesData} = getVechicles(setVechicles);
  const {getVehicleRatesByVehicleId} = vehicleRatesStorage();

  const {uploadAllVehiclesData} = uploadVehicleData();
  // const { handleGetReceiptSettings } =
  const [userDetails, setUserDetails] = useState();

  // const { ding } = playSound()
  const [isBlueToothEnable, setIsBlueToothEnable] = useState(false);
  async function checkBluetoothEnabled() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Bluetooth Permission',
          message:
            'This app needs access to your location to check Bluetooth status.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // Permission granted, check Bluetooth status
        BleManager.enableBluetooth()
          .then(() => {
            // Success code
            setIsBlueToothEnable(true);
            console.log('The bluetooth is already enabled or the user confirm');
          })
          .catch(error => {
            // Failure code
            console.log('The user refuse to enable bluetooth');
          });
        // const isEnabled = await BluetoothStatus.isEnabled();
        // console.log('Bluetooth Enabled:', isEnabled);
      } else {
        console.log('Bluetooth permission denied');
      }
    } catch (error) {
      console.log('Error checking Bluetooth status:', error);
    }
  }

  // {"carin": 3, "carout": 3, "totalCollection": "170.00"}
  const todayCollectionArray = [
    {title: 'Operator Name', data: userDetails?.name},
    {title: 'Total vehicles In', data: totalVehicleIn},
    {title: 'Total vehicles Out', data: totalVehicleOut},
    {title: 'Total Collection', data: totalAmount || 0},
  ];

  const handlePlay = async () => {
    await checkBluetoothEnabled();

    if (!isBlueToothEnable) {
      ToastAndroid.show(
        'please enable the bluetooth first',
        ToastAndroid.SHORT,
      );
      return;
    }

    try {
      await ThermalPrinterModule.printBluetooth({
        payload:
          `[C]<u><font size='tall'>${userDetails?.companyname.toUpperCase()}</font></u>\n` +
          '[c]-----------------------\n' +
          `[L]<font size='normal'>NAME : ${userDetails?.name.toUpperCase()}</font>\n` +
          `[L]<font size='normal'>PHONE No. : ${userDetails?.user_id}</font>\n` +
          `[L]<font size='normal'>LOCATION : ${userDetails?.location}</font>\n` +
          `[L]<font size='normal'>SERIAL No. : ${userDetails?.imei_no}</font>`,
        printerNbrCharactersPerLine: 30,
        printerDpi: 120,
        printerWidthMM: 58,
        mmFeedPaper: 25,
      });
    } catch (err) {
      //error handling
      //
      ToastAndroid.show('hello error', ToastAndroid.SHORT);
      console.log(err.message);
    }
  };

  const getStoreVechiclesData = async () => {
    const data = await getVechiclesData();
    if (data != 0) {
      setVechicles(data);
    }
  };

  async function getUserDetails() {
    try {
      // Perform asynchronous operations here
      const token = await retrieveAuthUser();
      const user = await getUserByToken(token);
      console.log('user details', user);
      setUserDetails(user);
      await updateVehicleRates(token, user.sub_client_id);
    } catch (error) {
      console.error(error);
    }
  }

  const uploadDataToTheServer = async () => {

    if (isOnline) {
      await uploadAllVehiclesData();
    }

    if (!isOnline) {
      ToastAndroid.showWithGravityAndOffset(
        'please connect to the internet first',
        ToastAndroid.LONG,
        ToastAndroid.CENTER,
        25,
        50,
      );
      return;
    }

    return;
    console.log('----------------------upload to the server -----------------');
    try {
      if (!isOnline) {
        ToastAndroid.showWithGravityAndOffset(
          'please connect to the internet first',
          ToastAndroid.LONG,
          ToastAndroid.CENTER,
          25,
          50,
        );
        return;
      }
      // handle offline INVCHILE DATA SYNC
      const inVehiledata = await getAllInVehicles();
      if (inVehiledata.length == 0) {
        console.log('already syn');
        ToastAndroid.showWithGravityAndOffset(
          'already syn',
          ToastAndroid.LONG,
          ToastAndroid.CENTER,
          25,
          50,
        );
      }
      if (inVehiledata.length != 0) {
        console.log('---------IN car--------------', inVehiledata);

        const token = await retrieveAuthUser();

        for (const element of inVehiledata) {
          const newVinData = [element];
          await axios
            .post(
              address.carIn,
              {data: newVinData},
              {
                headers: {Authorization: `Bearer ${token}`},
              },
            )
            .then(async res => {
              console.log('in data', res.data);
              ToastAndroid.show('receipt uploaded!', ToastAndroid.SHORT);
              updateIsUploadedINById(element.date_time_in);
            })
            .catch(error => {
              ToastAndroid.showWithGravityAndOffset(
                'some error occur',
                ToastAndroid.LONG,
                ToastAndroid.CENTER,
                25,
                50,
              );
              console.error(error);
              console.warn('errior');
            });
        }
      }

      const outVechileData = await getAllOutVehicles();
      if (outVechileData.length == 0) {
        console.log('already syn');
        ToastAndroid.showWithGravityAndOffset(
          'already syn',
          ToastAndroid.LONG,
          ToastAndroid.CENTER,
          25,
          50,
        );
      }
      console.log('---------out car--------------', outVechileData);

      if (outVechileData.length != 0) {
        const token = await retrieveAuthUser();
        for (const element of outVechileData) {
          const newVoutData = [element];
          await axios
            .post(
              address.carOut,
              {data: newVoutData},
              {
                headers: {Authorization: `Bearer ${token}`},
              },
            )
            .then(async res => {
              console.log('----------------out data------------', res.data);
              ToastAndroid.show('Out pass uploaded !', ToastAndroid.LONG);
              updateIsUploadedOUTById(element.date_time_in);
            })
            .catch(error => {
              console.log(error.status);
              ToastAndroid.show('some error occur!', ToastAndroid.LONG);
              console.error('----------------errror------------------', error);
            });
        }
      }
    } catch (error) {
      console.error('error from ', error);
    }
  };

  const handleSamplePrintReceipt = async () => {
    // const result = await getVehicleRatesByVehicleId(id);
    //  checkBluetoothEnabled()
    await checkBluetoothEnabled();

    if (!isBlueToothEnable) {
      ToastAndroid.show(
        'please enable the bluetooth first',
        ToastAndroid.SHORT,
      );
      return;
    }
    try {
      await ThermalPrinterModule.printBluetooth({
        payload: `[C]`,
        printerNbrCharactersPerLine: 30,
        printerDpi: 120,
        printerWidthMM: 58,
        mmFeedPaper: 25,
      });
    } catch (err) {
      //error handling
      //
      ToastAndroid.show('hello error', ToastAndroid.SHORT);
      console.log(err.message);
    }
  };
  // UPDATE VEHICLE RATES IN EVERY NEW RENDER IF ONLONE
  const {handleGetAllVehiclesRates} = getVehiclePrices();
  const {handleGetAllAdvancePrices} = getAdvancePrices();
  const {handleGetAllFixedPrices} = fixedPriceController();
  const updateVehicleRates = async (token, sub_client_id) => {
    if (isOnline) {
      await handleGetAllVehiclesRates(token, sub_client_id);
      // if(generalSetting.dev_mod == "A")
      await handleGetAllAdvancePrices(token, sub_client_id);
      await handleGetAllFixedPrices(token, sub_client_id);
      await handleGetGstSettingsFromServer();
    }
  };

  const handleResetReceipt = async () => {
    // {"is_reset_receipt_number": false, "time": null}
    const current_date_time = new Date();

    const data = await isResetReceiptNo();
    const date = new Date();
    date.setHours(0, 0);
    date.setDate(date.getDate() + 1);
    console.log(data);

    const {time} = data;

    if (generalSetting?.reset_recipeit_no == 'D') {
      if (time == null || time < current_date_time) {
        Promise.all(increaseReceiptNo(-1), changeResetReceiptNo(true, date));
      }
    }
  };
  async function checkUserIsAvailable() {
    if (isOnline && userDetails) {
      // console.log(`${address.isUser}?user_id=${userDetails?.user_id}`)
      try {
        const res = await axios.get(
          `${address.isUser}?user_id=${userDetails?.user_id}`,
          {
            headers: {
              Authorization: `Bearer ${userDetails?.token}`,
            },
          },
        );
        if (res?.data?.data == 0) {
          alert('please login again \n no User found');
          await deleteUserById(userDetails?.user_id);
          return logOut();
        }
        // console.log(
        //   '_____________________IS USER AUTH_______________________',
        //   res.data,
        // );
      } catch (error) {
        if (error.response) {
          // The client was given an error response (5xx, 4xx)
          console.log(error.response.data);
          console.log(error.response.status);
          if (error.response.status == 401) {
            await deleteUserById(userDetails?.user_id);
            alert('please login again \n no User found');
            return logOut();
          }
          console.log(error.response.headers);
        } else if (error.request) {
          // The client never received a response, and the request was never left
        } else {
          // Anything else
        }
      }
    }
  }

  useEffect(() => {
    getUserDetails();
    getStoreVechiclesData();
    // dashboardDAta();
  }, [isOnline]);
  useEffect(() => {
    if (isFoccused) {
      checkUserIsAvailable();
    }
  }, [isOnline, userDetails, isFoccused]);

  useEffect(() => {
    if (isFoccused) {
      // totalAmount": 0, "vehicleInCount": 30169, "vehicleOutCount":
      calculateStatistics() .then(res => {
       console.log("-----------------------------------------------",res)
       setTotalAmount(Math.round(res.totalAmount * 100) / 100);
       setTotalVehicleIn(res.vehicleInCount)
       setTotalVehicleOut(res.vehicleOutCount)

      })
      .catch(err => console.error(err));

      // calculateTotalAmount()
      //   .then(res => {
      //     setTotalAmount(Math.round(res * 100) / 100);
      //   })
      //   .catch(err => console.error(err));
      // calculateTotalVehicleIn()
      //   .then(res => setTotalVehicleIn(res))
      //   .catch(err => console.error(err));
      // calculateTotalVehicleOut()
      //   .then(res => setTotalVehicleOut(res))
      //   .catch(err => console.error(err));
    }
  }, [isFoccused]);


  // reinitiate the current time and date
  useEffect(() => {
    // handleResetReceipt()
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleNavigation = async props => {
    const result = await getVehicleRatesByVehicleId(props.vehicle_id);
    if (result.length == 0 && generalSetting?.dev_mod != 'F') {
      ToastAndroid.showWithGravityAndOffset(
        'Vehicle Rate Not available contact owner',
        ToastAndroid.LONG,
        ToastAndroid.CENTER,
        25,
        50,
      );
      return;
    }
    let advancePrice = false;
    if (generalSetting.adv_pay == 'Y' && generalSetting?.dev_mod != 'F') {
      advancePrice = await getAdvancePricesByVehicleId(props.vehicle_id);
      if (advancePrice.length == 0) {
        ToastAndroid.showWithGravityAndOffset(
          'Advance price Not available contact owner',
          ToastAndroid.LONG,
          ToastAndroid.CENTER,
          25,
          50,
        );
        return;
      }
    }
    let fixedPrice = false;
    if (generalSetting?.dev_mod == 'F') {
      fixedPrice = await getFixedPricesByVehicleId(props.vehicle_id);
      // alert(JSON.stringify(fixedPrice))
      if (fixedPrice.length == 0) {
        ToastAndroid.showWithGravityAndOffset(
          'Fixed price Not available contact owner',
          ToastAndroid.LONG,
          ToastAndroid.CENTER,
          25,
          50,
        );
        return;
      }
    }
    navigation.navigate('create_receipt', {
      type: props.vehicle_name,
      id: props.vehicle_id,
      userId: userDetails?.user_id,
      operatorName: userDetails?.name,
      receiptNo: receiptNo,
      currentDayTotalReceipt: totalVehicleIn,
      imei_no: userDetails?.imei_no,
      advanceData: advancePrice,
      fixedPriceData: fixedPrice,
    });
  };

  const {createVehicleInOut,amit} = VehicleInOutStore();
  const [dummyDataLoadig, setDummyDataLoding] = useState(false);
  function delay(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  }
  const generateDummyData = async () => {

    //  amit().then(res=>console.log("---------------**********amit**********---------",res)).catch(err=>{
    //   console.log("---------------**********amit**********---------",err)
    // })
    
    if (dummyDataLoadig) {
      return;
    }
    
    setDummyDataLoding(true);
    // return
   
    // for (let i = 0 ; i<dummyData.length;i++) {

   
    //   // await delay(300)
  
    //   await createVehicleInOut(
    //     i+1,
    //     dummyData[i].type,
    //     dummyData[i].id,
    //     'S',
    //     i.toString().toUpperCase(),
    //     currentTime.toISOString().slice(0, -5) + 'Z',
    //     'D',
    //     dummyData[i].operator_name,
    //     dummyData[i].user_id,
    //     dummyData[i].imei_no,
    //     0,
    //     'N',
    //     0,
    //     false,
    //   );
    // }

    setDummyDataLoding(false);
    
  };



  return (
    <View style={{flex: 1}}>
      <CustomHeader title={'RECEIPT'} />

      {/* today total receipt */}
      <Text style={styles.title}>Today`s Collection</Text>
      <Text
        style={{
          ...styles.title,
          fontSize: PixelRatio.roundToNearestPixel(14),
          padding: 0,
          paddingBottom: PixelRatio.roundToNearestPixel(4),
          paddingTop: -20,
        }}>
        {currentTime.toLocaleDateString()} - {currentTime.toLocaleTimeString()}
      </Text>
      {/* today collection table */}
      <View style={styles.today_collection}>
        {todayCollectionArray.map((props, index) => (
          <View key={index}>
            <View style={otherStyle.today_collection_data}>
              <Text style={otherStyle.data}>{props.title}</Text>
              <Text style={otherStyle.data}>{props.data}</Text>
            </View>
            {/* if this is the last data then below border will not print */}
            {todayCollectionArray.length != index + 1 && (
              <View
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: allColor.black,
                }}
              />
            )}
          </View>
        ))}
      </View>

      {/* print action conatiner */}

      <View style={otherStyle.print_container}>
        <TouchableOpacity
          style={otherStyle.print_action_button}
          onPress={uploadDataToTheServer}>
          {icons.sync}
        </TouchableOpacity>
        <TouchableOpacity
          style={otherStyle.print_action_button}
          onPress={handleSamplePrintReceipt}>
          {icons.arrowUp}
        </TouchableOpacity>
        <TouchableOpacity
          style={otherStyle.print_action_button}
          onPress={handlePlay}>
          {icons.print}
        </TouchableOpacity>
      </View>
{/* 
      <View>
        {dummyDataLoadig && (
          <Text style={{fontWeight: '700', color: 'red', fontSize: 20}}>
            {' '}
            please wait dummy data storing ......{' '}
          </Text>
        )}

        <Button
          onPress={generateDummyData}
          title="generate dummy in data"
          disabled={dummyDataLoadig}
        />
      </View> */}
      {/* vehicle container */}
      <View
        style={{
          ...otherStyle.vehicle_container,
          bottom: 20,
          alignSelf: 'center',
        }}>
        {!generalSetting?.dev_mod && <ActivityIndicator size="large" />}
      </View>

      {generalSetting?.dev_mod != 'B' && (
        <ScrollView horizontal={true} style={otherStyle.vehicle_container}>
          {vechicles &&
            vechicles.map((props, index) => (
              <Pressable
                key={index}
                style={otherStyle.vehicle}
                onPress={() => {
                  handleNavigation(props);
                }}>
                {icons.dynamicvechicleIcon(props.vehicle_icon)}
                <Text style={otherStyle.vehicle_name}>
                  {props.vehicle_name}
                </Text>
              </Pressable>
            ))}
        </ScrollView>
      )}
    </View>
  );
};

export default ReceiptScreen;

const otherStyle = StyleSheet.create({
  today_collection_data: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: PixelRatio.roundToNearestPixel(10),
  },
  data: {
    fontWeight: '400',
    color: allColor.black,
    fontSize: PixelRatio.roundToNearestPixel(20),
  },
  print_container: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  print_action_button: {
    marginHorizontal: PixelRatio.roundToNearestPixel(10),
  },
  vehicle: {
    margin: 10,
    borderWidth: 1,
    alignSelf: 'center',
    paddingHorizontal: PixelRatio.roundToNearestPixel(20),
    borderRadius: PixelRatio.roundToNearestPixel(10),
  },
  vehicle_container: {
    // flex: 1,
    flexDirection: 'row',
    // justifyContent: "space-evenly",
    position: 'absolute',
    bottom: 0,
    // width: '100%',
    marginBottom: PixelRatio.roundToNearestPixel(5),
    elevation: 10,
  },
  vehicle_name: {
    alignSelf: 'center',
    color: allColor.black,
    fontWeight: '500',
    marginTop: PixelRatio.roundToNearestPixel(-10),
    marginBottom: PixelRatio.roundToNearestPixel(5),
  },
});

{
  /* ......... Bike ......... */
}
<Pressable
  style={otherStyle.vehicle}
  onPress={() => {
    navigation.navigate('create_receipt', {type: 'BIKE'});
    handlePlay();
  }}>
  {icons.bike}
  <Text style={otherStyle.vehicle_name}>BIKE</Text>
</Pressable>;
{
  /* .......... CAR ......... */
}
<Pressable
  style={otherStyle.vehicle}
  onPress={() => {
    navigation.navigate('create_receipt', {type: 'CAR'});
    handlePlay();
  }}>
  {icons.car}
  <Text style={otherStyle.vehicle_name}>CAR</Text>
</Pressable>;
{
  /* ....... TRUCK ......... */
}
<Pressable
  style={otherStyle.vehicle}
  onPress={() => {
    navigation.navigate('create_receipt', {type: 'BIKE'});
    handlePlay();
  }}>
  {icons.truck}
  <Text style={otherStyle.vehicle_name}>TRUCK</Text>
</Pressable>;
