import {
  StyleSheet,
  Text,
  View,
  PixelRatio,
  ScrollView,
  ActivityIndicator,
  ToastAndroid,
  PermissionsAndroid
} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';

import CustomHeader from '../../component/CustomHeader';
import icons from '../../Resources/Icons/icons';
import allColor from '../../Resources/Colors/Color';
import normalize from 'react-native-normalize';
import RoundedInputComponent from '../../component/RoundedInputComponent';
import CustomButtonComponent from '../../component/CustomButtonComponent';
import receiptDataBase from '../../Hooks/Sql/receipt/receiptDataBase';
import increaseReceiptNo from '../../Hooks/Receipt/increaseReceiptNo';
import vehicleINOUTController from '../../Hooks/Controller/receipt/vehicleINOUTController';
import { AuthContext } from '../../Auth/AuthProvider';
import ThermalPrinterModule from 'react-native-thermal-printer';
import { InternetStatusContext } from '../../App';
import vehicleRatesStorage from '../../Hooks/Sql/vechicles/vehicleRatesStorage';
import currentReceiptNo from '../../Hooks/Receipt/currentReceiptNo';

import DeviceInfo from 'react-native-device-info';
import VehicleInOutStore from '../../Hooks/Sql/VehicleInOut/VehicleInOutStore';
import BleManager from 'react-native-ble-manager';
import advancePriceStorage from '../../Hooks/Sql/AdvancePricesStorage/advancePriceStorage';
import getReceiptSettings from '../../Hooks/Controller/ReceiptSetting/getReceiptSettings';
import ReceiptImageStorage from '../../Hooks/Sql/Receipt Setting Storage/ReceiptImageStorage';

const CreateReceipt = ({ navigation, route }) => {
  // check is Internet available or not
  const isOnline = useContext(InternetStatusContext);

  // loading when a vehicle in and prinout Process goes on
  const [loading, setLoading] = useState(false);
  const [pic, setPic] = useState()

  // get general settings from authcontext provider

  const { generalSetting } = useContext(AuthContext);

  //  destructureing dev_mod from generalSetting
  const { dev_mod, max_receipt, adv_pay } = generalSetting;


  // dev_mod = "A"

  // get vehicle rates by vehicleID
  const { getVehicleRatesByVehicleId } = vehicleRatesStorage();
  const { getAdvancePricesByVehicleId } = advancePriceStorage()

  const { createVehicleInOut } = VehicleInOutStore()

  // RECEIPT SETTINGS
  const { receiptSettings } = getReceiptSettings()

  // GET LOGO
  const { getReceiptImage } = ReceiptImageStorage()


  // vehicleNumber input controller
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [READ_PHONE_STATE, setREAD_PHONE_STATE] = useState(false);

  // setter and getter current time
  const [currentTime, setCurrentTime] = useState(new Date());

  //  date time set options
  const day = String(currentTime.getDate()).padStart(2, '0');
  const month = String(currentTime.getMonth() + 1).padStart(2, '0');
  const year = String(currentTime.getFullYear()).slice(-2);
  const hour = String(currentTime.getHours()).padStart(2, '0');
  const minute = String(currentTime.getMinutes()).padStart(2, '0');

  // Format the date and time as "date/month year hh:mm"
  const formattedDateTime = `${day}/${month}/${year} ${hour}:${minute}`;
  // console.log("------------------",currentTime.toISOString("en-US"))

  // VEHICLE IN/OUT CONTROLLER
  const { handleVehicleIn } = vehicleINOUTController();

  // const { ding } = playSound()

  // get data from previous screen
  const { type, id, userId, operatorName, currentDayTotalReceipt } = route.params;


  const [isBlueToothEnable, setIsBlueToothEnable] = useState(false)
  async function checkBluetoothEnabled() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Bluetooth Permission',
          message: 'This app needs access to your location to check Bluetooth status.',
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
            setIsBlueToothEnable(true)
            console.log("The bluetooth is already enabled or the user confirm");
          })
          .catch((error) => {
            // Failure code
            console.log("The user refuse to enable bluetooth");
          });
        // const isEnabled = await BluetoothStatus.isEnabled();
        // console.log('Bluetooth Enabled:', isEnabled);
      } else {
        checkBluetoothEnabled()
        console.log('Bluetooth permission denied');
      }
    } catch (error) {
      console.log('Error checking Bluetooth status:', error);
    }
  }



  const isPermitted = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
        {
          title: 'Phone state access Permission',
          message: 'to access your machine imei',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        setREAD_PHONE_STATE(true);
        // console.log('You can use this');
      } else {
        setREAD_PHONE_STATE(false);
        // console.log('permission denied');
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  // reinitiate the current time and date
  useEffect(() => {
    checkBluetoothEnabled()
    isPermitted()
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Handle offline car in
  const handelOfflineCarIN = async () => {
    // if (currentDayTotalReceipt > max_receipt) {
    //   return ToastAndroid.showWithGravityAndOffset(
    //      'Today maximum Receipt reached ',
    //      ToastAndroid.LONG,
    //      ToastAndroid.CENTER,
    //      25,
    //      50,
    //    )

    //  }

    if (!isBlueToothEnable) {
      ToastAndroid.show('please enable the bluetooth first', ToastAndroid.SHORT);
      return
    }
    const receiptNo = await currentReceiptNo();
    const mc_srl_no = DeviceInfo.getSerialNumberSync();

    try {
      if (!READ_PHONE_STATE) {
        Alert.alert(
          'Phone State Permission',
          'You have to give us the phone state permission to continue',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            { text: 'OK', onPress: isPermitted },
          ],
        );
        return;
      }

      if (!isOnline) {
        // const createData = ;
        // const increaseNO = ;

        await Promise.all([createVehicleInOut(receiptNo, type, id, "S", vehicleNumber.toUpperCase(), currentTime.toISOString(), dev_mod, operatorName, userId, mc_srl_no, 0, "Y", 0, false), increaseReceiptNo(receiptNo),
        handlePrintReceipt(receiptNo, mc_srl_no, true)
        ])

        return
      };

      const InData = [
        {
          receiptNo: receiptNo,
          date_time_in: currentTime.toISOString(),
          oprn_mode: dev_mod,
          vehicle_id: id,
          vehicle_no: vehicleNumber.toUpperCase(),
          receipt_type: 'S',
          mc_srl_no: mc_srl_no,
          gst_flag: "Y"
        },
      ];

      const response = await handleVehicleIn(InData);

      if (response.status === 200) {
        await Promise.all([createVehicleInOut(receiptNo, type, id, "S", vehicleNumber.toUpperCase(), currentTime.toISOString(), dev_mod, operatorName, userId, mc_srl_no, 0, "Y", 0, true), increaseReceiptNo(receiptNo), handlePrintReceipt(receiptNo, mc_srl_no, true)])

        ToastAndroid.showWithGravity(
          'Uploaded',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
      } else {
        await Promise.all([createVehicleInOut(receiptNo, type, id, "S", vehicleNumber.toUpperCase(), currentTime.toISOString(), dev_mod, operatorName, userId, mc_srl_no, 0, "Y", 0, false), increaseReceiptNo(receiptNo), handlePrintReceipt(receiptNo, mc_srl_no, false)])
      }


    } catch (error) {
      console.error(error.message);
    }
  };

  // Handle offline *Advance car in
  const handelAdvanceOfflineCarIN = async () => {

    // if (currentDayTotalReceipt > max_receipt) {
    //   return ToastAndroid.showWithGravityAndOffset(
    //      'for ',
    //      ToastAndroid.LONG,
    //      ToastAndroid.CENTER,
    //      25,
    //      50,
    //    )

    //  }
    if (!isBlueToothEnable) {
      ToastAndroid.show('please enable the bluetooth first', ToastAndroid.SHORT);
      return
    }
    const advancePrice = await getAdvancePricesByVehicleId(id);
    console.log(" loopp p ", advancePrice)
    const receiptNo = await currentReceiptNo();
    const mc_srl_no = DeviceInfo.getSerialNumberSync();
    // [{"advance_amount": "50.00", "advance_id": "2", "id": 2, "subclient_id": "1", "vehicle_id": "1"}]
    console.log("advance price is = ", advancePrice)

    try {
      if (!READ_PHONE_STATE) {
        Alert.alert(
          'Phone State Permission',
          'You have to give us the phone state permission to continue',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            { text: 'OK', onPress: isPermitted },
          ],
        );
        return;
      }

      if (!isOnline) {
        // const createData = ;
        // const increaseNO = ;
        await Promise.all([createVehicleInOut(receiptNo, type, id, "S", vehicleNumber.toUpperCase(), currentTime.toISOString(), dev_mod, operatorName, userId, mc_srl_no, 0, "Y", advancePrice[0].advance_amount, false), increaseReceiptNo(receiptNo),
        handleAdvancePrintReceipt(receiptNo, advancePrice[0].advance_amount, mc_srl_no, false)
        ])
        return
      };

      const InData = [
        {
          receiptNo: receiptNo,
          date_time_in: currentTime.toISOString(),
          oprn_mode: dev_mod,
          vehicle_id: id,
          vehicle_no: vehicleNumber.toUpperCase(),
          receipt_type: 'S',
          mc_srl_no: mc_srl_no,
          advance: advancePrice[0].advance_amount,
          gst_flag: "Y"
        },

      ];

      console.log(InData)
      // upload to the server


      const response = await handleVehicleIn(InData);

      console.log(response)

      if (response.status === 200) {
        // STORE,INCREASE RECEIPT NO and HANDLE PRINTOUT
        await Promise.all([createVehicleInOut(receiptNo, type, id, "S", vehicleNumber.toUpperCase(), currentTime.toISOString(), dev_mod, operatorName, userId, mc_srl_no, 0, "Y", advancePrice[0].advance_amount, true), increaseReceiptNo(receiptNo), handleAdvancePrintReceipt(receiptNo, advancePrice[0].advance_amount, mc_srl_no, true)
        ])

        ToastAndroid.showWithGravity(
          'Uploaded',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
      } else {
        // STORE,INCREASE RECEIPT NO and HANDLE PRINTOUT
        await Promise.all([createVehicleInOut(receiptNo, type, id, "S", vehicleNumber.toUpperCase(), currentTime.toISOString(), dev_mod, operatorName, userId, mc_srl_no, 0, "Y", advancePrice[0].advance_amount, false), increaseReceiptNo(receiptNo), handleAdvancePrintReceipt(receiptNo, advancePrice[0].advance_amount, mc_srl_no, false)
        ])
      }


    } catch (error) {
      console.error(error.message);
    }
  };

  // Handle print receipt
  const handlePrintReceipt = async (receiptNo, mc_srl_no, isUploadedIN) => {
    // const result = await getVehicleRatesByVehicleId(id);
    const qrData = {
      receiptNo: receiptNo,
      vehicleType: type,
      vehicle_id: id,
      receipt_type: 'S',
      vehicle_no: vehicleNumber,
      date_time_in: currentTime.toISOString(),
      oprn_mode: dev_mod,
      opratorName: operatorName,
      user_id_in: userId,
      mc_srl_no: mc_srl_no,
      paid_amt: 0,
      gst_flag: "Y",
      advance: 0,
      isUploadedIN: isUploadedIN
    }

    try {
      let payload = `[C]<font size='tall'><B>RECEIPT</font>\n`
      if (pic) {
        payload += `[R]<img>${pic}</img>\n\n`+'\n'
      }
      if (receiptSettings.header1_flag == "1") {
        payload += `[C]<font size='tall'> ${receiptSettings.header1}</font>\n`
      }
      if (receiptSettings.header2_flag == "1") {
        payload += `[c]${receiptSettings.header2}\n`
      }
      payload += `[C]<B><font size='big'>---------------</font>\n` +
        `[L]<b>RECEIPT NO : ${receiptNo}\n` +
        `[L]<b>VEHICLE TYPE : ${type}\n` +
        `[L]<b>VEHICLE NO : ${vehicleNumber.toUpperCase()}\n` +
        `[L]<b>IN Time : ${formattedDateTime}\n\n` +
        `[R]<qrcode size='35'>${receiptNo}-*-${type}-*-${id}-*-${'S'}-*-${vehicleNumber.toUpperCase()}-*-${currentTime.toISOString()}-*-${dev_mod}-*-${operatorName}-*-${userId}-*-${mc_srl_no}-*-${0}-*-${"Y"}-*-${0}-*-${isUploadedIN}</qrcode>\n\n`

      if (receiptSettings.footer1_flag == "1") {
        payload += `[C] ${receiptSettings.footer1} \n`
      }

      if (receiptSettings.footer2_flag == "1") {
        payload += `[C]${receiptSettings.footer2} \n`
      }
      await ThermalPrinterModule.printBluetooth({
        payload: payload,
        printerNbrCharactersPerLine: 30,
        printerDpi: 120,
        printerWidthMM: 58,
        mmFeedPaper: 25,
      });
      navigation.navigate('bottomNavBAr');
    } catch (err) {
      //error handling
      //
      ToastAndroid.show('hello error', ToastAndroid.SHORT);
      console.log(err.message);
    }
  };

  // HANDLE ADVANCE PRINT RECEIPT
  const handleAdvancePrintReceipt = async (receiptNo, advance, mc_srl_no, isUploadedIN) => {

    try {


      let payload = `[C]<font size='tall'><B>RECEIPT</font>\n`
      if (pic) {
        payload += `[R]<img>${pic}</img>\n\n`+'\n'
      }
      if (receiptSettings.header1_flag == "1") {
        payload += `[C]<font size='tall'> ${receiptSettings.header1}</font>\n`
      }
      if (receiptSettings.header2_flag == "1") {
        payload += `[c]${receiptSettings.header2}\n`
      }

      payload += `[C]<B><font size='big'>---------------</font>\n` +
        `[L]<b>RECEIPT NO : ${receiptNo}\n` +
        `[L]<b>VEHICLE TYPE : ${type}\n` +
        `[L]<b>VEHICLE NO : ${vehicleNumber.toUpperCase()}\n` +
        `[L]<b>ADVANCE : ${advance}\n` +
        `[L]<b>IN Time : ${formattedDateTime}\n\n` +
        `[R]<qrcode size='35'>${receiptNo}-*-${type}-*-${id}-*-${'S'}-*-${vehicleNumber.toUpperCase()}-*-${currentTime.toISOString()}-*-${dev_mod}-*-${operatorName}-*-${userId}-*-${mc_srl_no}-*-${0}-*-${"Y"}-*-${advance}-*-${isUploadedIN}-*-${adv_pay}</qrcode>\n\n`


      if (receiptSettings.footer1_flag == "1") {
        payload += `[C] ${receiptSettings.footer1} \n`
      }

      if (receiptSettings.footer2_flag == "1") {
        payload += `[C]${receiptSettings.footer2} \n`
      }
      await ThermalPrinterModule.printBluetooth({
        payload: payload,

        printerNbrCharactersPerLine: 30,
        printerDpi: 120,
        printerWidthMM: 58,
        mmFeedPaper: 25,
      });
      navigation.navigate('bottomNavBAr');
    } catch (err) {
      //error handling
      ToastAndroid.show(err.message, ToastAndroid.SHORT);
      console.log(err.message);
    }
  };


  // main fun() for all upload and store and printing
  const handleCreateReceipt = async () => {
    // preventing the continuos button click
    if (loading == true) {
      return;
    }
    setLoading(true);
    if (!vehicleNumber) {
      setLoading(false);
      return ToastAndroid.showWithGravity(
        'plase add the vehicle number to continue',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
    }

    if (adv_pay == 'Y') {
      await handelAdvanceOfflineCarIN()
    }

    if (adv_pay != 'Y') {
      await handelOfflineCarIN()
    }
    setLoading(false);
    setVehicleNumber();
    // setModalVisible(true);
    navigation.navigate('Receipt')
  };

  useEffect(() => {
    getReceiptImage().then(response => {
      setPic(response.image)
    }).catch(error => {
      console.error(error)
    })
  }, [])

  return (
    <View>
      {loading && (
        <View
          style={{
            position: 'absolute',
            top: '50%',
            left: '35%',
            backgroundColor: allColor.white,
            padding: PixelRatio.roundToNearestPixel(20),
            borderRadius: 10,
          }}>
          <ActivityIndicator size="large" />
          <Text>Loading...</Text>
        </View>
      )}

      {/* {dev_mod == 'A' ? <Text> Hello </Text> : ''} */}

      <ScrollView>
        <CustomHeader title={'RECEIPT'} navigation={navigation} />
        <View style={{ padding: PixelRatio.roundToNearestPixel(30) }}>
          {/* current time and date */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            {/* date */}
            <View style={styles.date_time_container}>
              {icons.calendar}
              <View>
                <Text style={styles.date_time}>Date</Text>

                <Text style={styles.date_time_data}>
                  {currentTime.toLocaleDateString()}
                </Text>
              </View>
            </View>
            {/* time */}
            <View style={styles.date_time_container}>
              {icons.time}
              <View>
                <Text style={styles.date_time}>Time</Text>

                <Text style={styles.date_time_data}>
                  {currentTime.toLocaleTimeString()}
                </Text>
              </View>
            </View>
          </View>

          {/* ......... vehicle type .......... */}
          <View style={{ marginTop: normalize(20) }}>
            <Text style={styles.vehicle_text}>Vechicle Type</Text>
            <RoundedInputComponent placeholder={type} disable={true} />
          </View>
          {/* ..........receipt type ........... */}

          <View style={{ marginTop: normalize(20) }}>
            <Text style={styles.vehicle_text}>Receipt Type</Text>
            <View
              style={{
                marginLeft: normalize(10),
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              {/* ........ single........ */}
              {/* <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <CheckBox
                  style={{borderRadius: '50%'}}
                  disabled={false}
                  value={toggleCheckBox}
                  onValueChange={newValue => setToggleCheckBox(newValue)}
                />
                <Text
                  style={{color: allColor['primary-color'], fontWeight: '900'}}>
                  Single
                </Text>
              </View> */}
              {/* ....... multiple ......... */}
              {/* <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginLeft: normalize(10),
                }}>
                <CheckBox
                  style={{borderRadius: '50%'}}
                  disabled={false}
                  value={toggleCheckBox}
                  onValueChange={newValue => setToggleCheckBox(newValue)}
                />
                <Text
                  style={{color: allColor['primary-color'], fontWeight: '900'}}>
                  Multiple
                </Text>
              </View> */}
            </View>
          </View>
          {/* ......... vehicle Number .......... */}
          <View style={{ marginTop: normalize(20) }}>
            <Text style={styles.vehicle_text}>Vechicle Number</Text>
            <RoundedInputComponent
              placeholder={'Enter Vechicle Number'}
              value={vehicleNumber}
              onChangeText={setVehicleNumber}
            />
          </View>
          {/*............... action buttons ......... */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: normalize(10),
              marginHorizontal: normalize(10),
            }}>
            <CustomButtonComponent.CancelButton
              title={'Cancel'}
              onAction={() => {
                navigation.navigate('Receipt');
              }}
              style={{ flex: 1, marginRight: normalize(8) }}
            />

            <CustomButtonComponent.GoButton
              title={'Print Receipt'}
              onAction={() => handleCreateReceipt()}
              style={{ flex: 1, marginLeft: normalize(8) }}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default CreateReceipt;

const styles = StyleSheet.create({
  container: {},
  date_time_container: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  date_time: {
    color: allColor.black,
    fontWeight: '600',
    fontSize: PixelRatio.roundToNearestPixel(18),
    marginLeft: PixelRatio.roundToNearestPixel(10),
  },
  date_time_data: {
    color: allColor.gray,
    fontWeight: '600',
    fontSize: PixelRatio.roundToNearestPixel(15),
    marginLeft: normalize(10),
  },
  vehicle_text: {
    marginLeft: PixelRatio.roundToNearestPixel(15),
    fontWeight: '600',
    color: allColor.black,
    fontSize: PixelRatio.roundToNearestPixel(15),
    marginBottom: normalize(10),
  },
});

const modalStyle = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: allColor.black,
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: PixelRatio.roundToNearestPixel(16),
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

// const data=[]
// data.push({
//   label:"RECEIPT NO",
//   value:rn || 1
// })
// data.push({
//   label:"VEHICLE TYPE",
//   value:type
// })
// data.push({
//   label:"VEHICLE N0",
//   value:vehicleNumber
// })
// data.push({
//   label:"IN TIME",
//   value:currentTime.toLocaleDateString() +" - "+currentTime.toLocaleTimeString()
// })
// navigation.navigate("printerPreview",{data:data})}

{
  /* <View>
<Modal
  animationType="slide"
  transparent={true}
  visible={modalVisible}
  onRequestClose={() => {
    Alert.alert('Modal has been closed.');
    setModalVisible(!modalVisible);
  }}>
  <View style={modalStyle.centeredView}>
    <View style={modalStyle.modalView}>
      <Text style={[modalStyle.modalText, modalStyle.textStyle]}>
        receipt No : {rn}
      </Text>

      <Text style={[modalStyle.modalText, modalStyle.textStyle]}>
        vehicle Type : {type}
      </Text>

      <Text style={[modalStyle.modalText, modalStyle.textStyle]}>
        vehicle No : {vehicleNumber}
      </Text>

      <Text style={[modalStyle.modalText, modalStyle.textStyle]}>
        In time : {time},
      </Text>
      <Text style={[modalStyle.modalText, modalStyle.textStyle]}>
        In Date : {currentTime.toLocaleDateString()}
      </Text>

      <QRCode value="This is the value in the QRcode" />

      <Pressable
        style={{marginTop: 10}}
        onPress={() => setModalVisible(!modalVisible)}>
        <Text style={modalStyle.textStyle}>close</Text>
      </Pressable>

      <Pressable
        style={{marginTop: 10}}
        onPress={() => handlePrintOut()}>
        <Text style={modalStyle.textStyle}>Print</Text>
      </Pressable>
    </View>
  </View>
</Modal>

{/* <Pressable
  style={[modalStyle.button, modalStyle.buttonOpen]}
  onPress={() => setModalVisible(true)}>
  <Text style={modalStyle.textStyle}>Show Modal</Text>
</Pressable> */
}
// </View> */}

// const handlePrintOut = async () => {
//   await handlePrintReceipt();
//   setModalVisible(!modalVisible);
//   setVehicleNumber('');
// };

// const handlePrintReceipt = async () => {
//   try {
//     await ThermalPrinterModule.printBluetooth({
//       payload:
//         `[L]<b>Receipt No : ${rn || 'rn'}\n` +
//         `[L]<b>Vehicle Type : ${type || 'rn'}\n` +
//         `[L]<b>Vehicle Number : ${vehicleNumber || 'rn'}\n` +
//         `[L]<b>IN Time : ${time || 'rn'}\n` +
//         `[L]<b>IN Date : ${currentTime.toLocaleDateString() || 'rn'}\n` +
//         `[C]<qrcode size='40'>http://www.developpeur-web.dantsu.com/</qrcode>\n`,
//       printerNbrCharactersPerLine: 42,
//       printerDpi: 100,
//     });
//   } catch (err) {
//     //error handling
//     ToastAndroid.show(err.message, ToastAndroid.LONG);
//     console.log(err.message);
//   }
// };

{
  /* {modalVisible &&
    <>

   
    <QRCode value={`${rn||1}-*-${type}-*-${vehicleNumber}-*-${date22+" "+time22}-*-${id}`} />
    <Text>
      {vehicleNumber}
    </Text>
    </>
    } */
}



// const handelAdvanceOfflineCarIN = async () => {
//   const result = await getVehicleRatesByVehicleId(id);
//   const receiptNo = await currentReceiptNo()
//   const mc_srl_no = DeviceInfo.getSerialNumberSync();

//   try {
//     //  *rn = receipt Number
//     // const rn = await currentReceiptNo();
//     await createEntryReceipt(
//       type,
//       id,
//       receiptNo,
//       's',
//       vehicleNumber.toUpperCase(),
//       currentTime.toISOString(),
//       dev_mod,
//       operatorName,
//       userId,
//       result?.[0]?.advance,
//       mc_srl_no
//     ).then(async () => await increaseReceiptNo(receiptNo));
//   } catch (error) {
//     console.error(error.message);
//   }
// };