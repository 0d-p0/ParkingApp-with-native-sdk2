import { StyleSheet, Text, View, PixelRatio, ToastAndroid, ActivityIndicator, PermissionsAndroid } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import allColor from '../../Resources/Colors/Color';
import CustomButtonComponent from '../../component/CustomButtonComponent';
import CustomHeader from '../../component/CustomHeader';
 import ThermalPrinterModule from 'react-native-thermal-printer';
import vehicleINOUTController from '../../Hooks/Controller/receipt/vehicleINOUTController';
import receiptDataBase from '../../Hooks/Sql/receipt/receiptDataBase';
import { InternetStatusContext } from '../../App';
import storeUsers from '../../Hooks/Sql/User/storeuser';
import getAuthUser from '../../Hooks/getAuthUser';
import DeviceInfo from 'react-native-device-info';
import VehicleInOutStore from '../../Hooks/Sql/VehicleInOut/VehicleInOutStore';
import BleManager from 'react-native-ble-manager';
import getReceiptSettings from '../../Hooks/Controller/ReceiptSetting/getReceiptSettings';
import ReceiptImageStorage from '../../Hooks/Sql/Receipt Setting Storage/ReceiptImageStorage';

const OutpassPrintUI = ({ route, navigation }) => {
  const { data, others } = route.params;

  const { getUserByToken } = storeUsers()
  const { retrieveAuthUser } = getAuthUser()

  const [loading, setLoading] = useState(false);
  const [pic, setPic] = useState()

  const { receiptSettings } = getReceiptSettings()
  // console.log('loppppppp--------------', others);


  const isOnline = useContext(InternetStatusContext);


  const { handleVehicleout } = vehicleINOUTController();
  const { getReceiptImage } = ReceiptImageStorage()

  const { createOrUpdateVehicleInOut } = VehicleInOutStore()

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


  useEffect(() => {
    checkBluetoothEnabled()
    getReceiptImage().then(response => {
      setPic(response.image)
    }).catch(error => {
      console.error(error)
    })
  }, [])


  // console.log('ata[1].value - others[0].paid_amt', data);
  const handlePrintReceipt = async () => {

    if (!isBlueToothEnable) {
      ToastAndroid.show('please enable the bluetooth first', ToastAndroid.SHORT);
      return
    }

    if (loading) {
      return
    }
    setLoading(true)

    // await handleStoreOrUploadCarOut();
    // setLoading(false)
    // return

    if (others.advance != "0") {
      await handleAdvancePrintReceipt()
      return
    }

    await handleStoreOrUploadCarOut();

    try {
      let payload = `[C]<font size='tall'><B>OUTPASS</font>\n`

      if (pic) {
        payload += `[R]<img>${pic}</img>\n\n` + '\n'
      }
      if (receiptSettings.header1_flag == "1") {
        payload += `[C]<font size='tall'> ${receiptSettings.header1}</font>\n`
      }
      if (receiptSettings.header2_flag == "1") {
        payload += `[c]${receiptSettings.header2}\n`
      }

      payload +=`[C]<B><font size='big'>---------------</font>\n`+
       `[L]<b>RECEIPT NO : ${data[0].value}\n` +
        `[L]<b>PARKING FEES : ${data[1].value}\n` +
        `[L]<b>VEHICLE TYPE : ${data[2].value}\n` +
        `[L]<b>VEHICLE NO : ${data[3].value}\n` +
        `[L]<b>IN Time : ${data[4].value}\n` +
        `[L]<b>OUT Time : ${data[5].value}\n` +
        `[L]<b>DURATION : ${data[data.length - 1].value}\n`

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

      // await handleStoreOrUploadCarOut();
    } catch (err) {
      setLoading(false)
      //error handling
      ToastAndroid.show(err.message, ToastAndroid.LONG);
      // alert(err.message);
      console.log(err.message);
    }
    setLoading(false)

  };


  const handleAdvancePrintReceipt = async () => {
    if (!isBlueToothEnable) {
      ToastAndroid.show('please enable the bluetooth first', ToastAndroid.SHORT);
      return
    }

    if (loading) {
      return
    }
    setLoading(true)
    await handleStoreOrUploadCarOut();
    // setLoading(false)
    // return
    try {
      let payload = `[C]<font size='tall'><B>OUTPASS</font>\n`
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
        `[L]<b>RECEIPT NO : ${data[0].value}\n` +
        `[L]<b>PARKING FEES : ${data[1].value}\n` +
        `[L]<b>Advance AMOUNT : ${data[2].value}\n` +
        `[L]<b>BALANCE AMOUNT : ${data[3].value}\n` +
        `[L]<b>VEHICLE TYPE : ${data[4].value}\n` +
        `[L]<b>VEHICLE NO : ${data[5].value}\n` +
        `[L]<b>IN Time : ${data[6].value}\n` +
        `[L]<b>OUT Time : ${data[7].value}\n` +
        `[L]<b>DURATION : ${data[data.length - 1].value}\n\n`

      if (receiptSettings.footer1_flag == "1") {
        payload += `[C] ${receiptSettings.footer1} \n`
      }

      if (receiptSettings.footer2_flag == "1") {
        payload += `[C]${receiptSettings.footer2} \n`
      }
      await ThermalPrinterModule.printBluetooth({
        payload: payload
        ,
        printerNbrCharactersPerLine: 30,
        printerDpi: 120,
        printerWidthMM: 58,
        mmFeedPaper: 25,
      });

      // await handleStoreOrUploadCarOut();
    } catch (err) {
      //error handling
      ToastAndroid.show(err.message, ToastAndroid.LONG);
      // alert(err.message);
      console.log(err.message);
    }
    setLoading(false)

  };


  const handleStoreOrUploadCarOut = async () => {
    // ToastAndroid.showWithGravity(
    //   'All Your Base Are Belong To Us',
    //   ToastAndroid.SHORT,
    //   ToastAndroid.CENTER,
    // );


    const token = await retrieveAuthUser();
    const user = await getUserByToken(token);
    const mc_srl_no_out = DeviceInfo.getSerialNumberSync();


    const data2 = [];
    // for not advanced mode
    if (others.advance == "0") {
      data2.push({
        receiptNo: data?.[0]?.value,
        date_time_in: others.date_time_in,
        oprn_mode: others.oprn_mode,
        vehicle_id: others.vehicle_id,
        vehicle_no: data?.value,
        receipt_type: 'S',
        date_time_out: others?.date_time_out,
        user_id_out: others?.userId || user?.id,
        paid_amt: data?.[1]?.value,
        gst_flag: 'Y',
        duration: 0,
        mc_srl_no_out: mc_srl_no_out,
        mc_srl_no: others?.mc_srl_no
      })
    }

    // for  advanced mode
    if (others.advance != "0") {
      data2.push({
        receiptNo: data?.[0]?.value,
        date_time_in: others?.date_time_in,
        oprn_mode: others?.oprn_mode,
        vehicle_id: others.vehicle_id,
        vehicle_no: data[5].value,
        receipt_type: 'S',
        date_time_out: others?.date_time_out,
        user_id_out: others.userId || user?.id,
        paid_amt: data[1].value,
        gst_flag: 'N',
        duration: 0,
        mc_srl_no_out: mc_srl_no_out,
        advance: others.advance,
        mc_srl_no: others.mc_srl_no
      })
    }
    console.log("----------------------data 2 -----------------------", data2)
    // setLoading(false)
    // return
    if (!isOnline) {
      await createOrUpdateVehicleInOut(
        others.receiptNo, others.vehicleType, others.vehicle_id, others.receipt_type,
        others.vehicle_no, others.date_time_in, others.oprn_mode, user.name, others.user_id_in, others.mc_srl_no, others.date_time_out, user.user_id, data[1].value, "Y", 0, mc_srl_no_out, others.advance, others.isUploadedIN, false
      )
      ToastAndroid.showWithGravity(
        'car out data store in offfline',
        ToastAndroid.LONG,
        ToastAndroid.CENTER,
      );
      navigation.navigate('bottomNavBAr');
      return;
    }

    const res = await handleVehicleout(data2);
    if (res.status != 200) {
      ToastAndroid.showWithGravity(
        'car out data store in offfline server error',
        ToastAndroid.LONG,
        ToastAndroid.CENTER,
      );
      await createOrUpdateVehicleInOut(
        others.receiptNo, others.vehicleType, others.vehicle_id, others.receipt_type,
        others.vehicle_no, others.date_time_in, others.oprn_mode, user.name, others.user_id_in, others.mc_srl_no, others.date_time_out, user.user_id, data[1].value, "Y", 0, mc_srl_no_out, others.advance, others.isUploadedIN, false
      )
      // await addOutpassEntry(data2);
    }

    console.log("outpass data", res.data)
    if (res.status == 200) {
      createOrUpdateVehicleInOut(
        others.receiptNo, others.vehicleType, others.vehicle_id, others.receipt_type,
        others.vehicle_no, others.date_time_in, others.oprn_mode, user.name, others.user_id_in, others.mc_srl_no, others.date_time_out, user.user_id, data[1].value, "Y", 0, mc_srl_no_out, others.advance, others.isUploadedIN, true
      )
      ToastAndroid.showWithGravity(
        'car out data upload successfully',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
    }
    navigation.navigate('bottomNavBAr');
  };

  return (
    <>

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

      <CustomHeader title={'Printer Preview'} />
      <View style={{ padding: PixelRatio.roundToNearestPixel(15) }}>
        {/* data  loop run below */}
        {data &&
          data.map((props, index) => (
            <View key={index}>
              <View style={styles.inLineTextContainer}>
                <Text style={styles.text}>{props?.label}</Text>
                <Text style={styles.text}> : {props?.value}</Text>
              </View>
              <View
                style={{
                  borderBottomColor: 'black',
                  borderBottomWidth: StyleSheet.hairlineWidth,
                }}
              />
            </View>
          ))}

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: PixelRatio.roundToNearestPixel(10),
          }}>
          <CustomButtonComponent.CancelButton
            title={'Cancel'}
            onAction={() => {
              navigation.goBack();
            }}
            style={{ flex: 1, marginRight: PixelRatio.roundToNearestPixel(8) }}
          />

          <CustomButtonComponent.GoButton
            title={'Print Receipt'}
            onAction={() => {
              handlePrintReceipt();
            }}
            style={{ flex: 1, marginLeft: PixelRatio.roundToNearestPixel(8) }}
          />
        </View>
      </View>
    </>
  );
};

export default OutpassPrintUI;

const styles = StyleSheet.create({
  inLineTextContainer: {
    flexDirection: 'row',
    paddingVertical: PixelRatio.roundToNearestPixel(10),
    alignSelf: 'center',
  },
  text: {
    color: allColor.black,
    fontWeight: PixelRatio.roundToNearestPixel(500),
    fontSize: PixelRatio.roundToNearestPixel(18),
  },
});


  // [{"label": "RECEIPT NO", "value": 1}, {"label": "PARKING FEES", "value": 15}, {"label": "VEHICLE TYPE", "value": "bike"}, {"label": "VEHICLE NO", "value": "vvbbn"}, {"label": "IN TIME", "value": "6/23/2023 - 6:08:11 PM"}, {"label": "out TIME", "value": "6/23/2023 - 6:08:11 PM"}]

  // {"allow_flag": "Y", "client_id": null, "client_type_flag": "O", "companyname": "kolkata corporation", "created_at": "2023-06-24T12:10:00.000000Z", "email_verified_at": null, "id": 1, "imei_no": "2", "location": "kolkata", "location_id": "1", "mc_sl_no": null, "name": "pritam", "otp": 829392, "otp_status": "A", "password": "$2y$10$CZDB30C0a4oGQfy.5Gt6gu6PtzZloZ1E0xyTyA9dA0VSlpVWxwlMC", "purchase_date": null, "registration_flag": null, "remember_token": null, "role": "U", "short_name": "Pt", "stPassword": "Abc@1234", "sub_client_id": "1", "token": "96|Jutwjg60RaP4jcUQ7Lj8MXCy6HPl2KS9I3E7AY1E", "updated_at": "2023-06-25T10:22:02.000000Z", "user_id": "8318930255"}

  // [{"created_at": "2023-06-25T16:50:22.000000Z", "date_time_in": "2023-06-25 22:20:00", "date_time_out": null, "oprn_mode": "A", "paid_amt": "50.00", "receipt_type": "S", "sl_no": 81, "updated_at": "2023-06-25T16:50:22.000000Z", "user_id_in": 1, "user_id_out": null, "vehicle_id": 2, "vehicle_name": "bike", "vehicle_no": "NONE90"}]