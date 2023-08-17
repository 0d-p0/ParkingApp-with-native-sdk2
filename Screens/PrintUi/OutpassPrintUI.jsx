import { StyleSheet, Text, View, PixelRatio, ToastAndroid, ActivityIndicator, PermissionsAndroid, ScrollView } from 'react-native';
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
  // Extract data and others from the route params  
  const { data, others, gstSettings } = route.params;

  console.log("----------------------", others.date_time_out)

  // helper Function to get Current user, which store in offline using SqlLite.
  const { getUserByToken } = storeUsers()
  // this function return the token.which store in offline using Async storage
  const { retrieveAuthUser } = getAuthUser()

  // State for managing Loading State
  const [loading, setLoading] = useState(false);
  // State for manage picture/image 
  // which we got from offline Store
  const [pic, setPic] = useState()

  // receiptSetting it`s a state which holds receiptSettings
  // Like Header1,Footer1 .....
  const { receiptSettings } = getReceiptSettings()
  // console.log('loppppppp--------------', others);


  // this State holds is Internet Connectivity Available or Not
  const isOnline = useContext(InternetStatusContext);


  // helper Function for upload Vehicles to the Server.
  const { handleVehicleout } = vehicleINOUTController();
  // helper function for Get stored image.
  const { getReceiptImage } = ReceiptImageStorage()
  // helper function for store vehicles Data stored offline.
  const { createOrUpdateVehicleInOut } = VehicleInOutStore()

  //This State holds isBlueToothEnable enable or not.
  const [isBlueToothEnable, setIsBlueToothEnable] = useState(false)

  // function to check isBlueToothEnable?
  async function checkBluetoothEnabled() {
    try {
      // request for location Permissions
      // it`s require to enable bluetooth.
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
        // bluetooth is not enabled call this functions it`s self.
        checkBluetoothEnabled()
        console.log('Bluetooth permission denied');
      }
    } catch (error) {
      console.log('Error checking Bluetooth status:', error);
    }
  }

  // run once only 
  useEffect(() => {
    // Checking blutooh is enabled?
    checkBluetoothEnabled()
    // Get the offline stored Image 
    getReceiptImage().then(response => {
      // Store at pic State
      setPic(response.image)
    }).catch(error => {
      console.error(error)
    })
  }, [])


  // console.log('ata[1].value - others[0].paid_amt', data);

  // handle Receipt printing
  const handlePrintReceipt = async () => {
    // if bluetooth is not enabled.
    // this return from here [*isBlueToothEnable]
    if (!isBlueToothEnable) {
      ToastAndroid.show('please enable the bluetooth first', ToastAndroid.SHORT);
      // [*isBlueToothEnable]
      return
    }

    //if loading state is true then it`s return from here [*loading]
    // why i put this here?
    // to prevent multiple call of this function.
    if (loading) {
      //[*loading]
      return
    }
    // set loading state to true
    setLoading(true)

    // await handleStoreOrUploadCarOut();
    // setLoading(false)
    // return

    // if advance value is greater than the ZERO 
    // then its call handleAdvancePrintReceipt()
    // and return from here [*advance]
    if (others.advance != "0") {
      await handleAdvancePrintReceipt()
      // [*advance]
      return
    }

    // call this below function
    await handleStoreOrUploadCarOut();
    // setLoading(false)
    // return

    try {
      // payload variable holds all the texts.
      // Which will be printed.
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

      payload += `[C]<B><font size='big'>---------------</font>\n`

      data.forEach((item) => {
        payload += `[L]<b> ${item.label} : ${item.value}\n`
      })

      if (receiptSettings.footer1_flag == "1") {
        payload += `[C] ${receiptSettings.footer1} \n`
      }

      if (receiptSettings.footer2_flag == "1") {
        payload += `[C]${receiptSettings.footer2} \n`
      }
      // this function start the printing process.
      // this is an external package.
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

    // After all, the process completed loading state set to false
    setLoading(false)

  };


  //  this function handle printing when advance price is greater than zero
  const handleAdvancePrintReceipt = async () => {
    // if bluetooth is not enabled.
    // this return from here [*isBlueToothEnable]
    if (!isBlueToothEnable) {
      ToastAndroid.show('please enable the bluetooth first', ToastAndroid.SHORT);
      // [*isBlueToothEnable]
      return
    }
    //if loading state is true then it`s return from here [*loading]
    // why i put this here?
    // to prevent multiple call of this function.
    if (loading) {
      //[*loading]
      return
    }
    // set loading state to true
    setLoading(true)
    // call this below function
    await handleStoreOrUploadCarOut();
    // setLoading(false)
    // return
    try {
      // payload variable holds all the texts.
      // Which will be printed.
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

      payload += `[C]<B><font size='big'>---------------</font>\n` 
      data.forEach((item) => {
        payload += `[L]<b> ${item.label} : ${item.value}\n`
      })

      if (receiptSettings.footer1_flag == "1") {
        payload += `[C] ${receiptSettings.footer1} \n`
      }

      if (receiptSettings.footer2_flag == "1") {
        payload += `[C]${receiptSettings.footer2} \n`
      }
      // this function start the printing
      // this is an external package
     
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
  const findValueByLabel = (array, label) => {
    const item = array.find(item => item.label === label);
    return item ? item.value : null;
  };


  // It`s handle the upload and offline storing of vehicle data.
  const handleStoreOrUploadCarOut = async () => {
    const PARKING_FEES = findValueByLabel(data, "PARKING FEES");
    let cgst = 0
    let sgst = 0;
    let base_amt = PARKING_FEES
    let isGst = "N"
    if (gstSettings && gstSettings?.gst_flag == "1") {
      isGst = "Y"
      cgst = findValueByLabel(data, "CGST")
      sgst = findValueByLabel(data, "SGST")
      base_amt = findValueByLabel(data, "BASE AMOUNT")
    }
    // store return data into token variable
    const token = await retrieveAuthUser();
    // store return data into user variable
    const user = await getUserByToken(token);

    // crete a blanck data array
    // which holds the vehicle data
    // for Uploading to the server
    // const data2 = [];
    // // push data into data2 array for not advanced mode
    // if (others.advance == "0") {
    //   data2.push({
    //     receiptNo: data?.[0]?.value,
    //     date_time_in: others.date_time_in,
    //     oprn_mode: others.oprn_mode,
    //     vehicle_id: others.vehicle_id,
    //     vehicle_no: others?.vehicle_no,
    //     receipt_type: 'S',
    //     date_time_out: others?.date_time_out,
    //     user_id_out: others?.userId || user?.id,
    //     paid_amt: PARKING_FEES,
    //     gst_flag: isGst,
    //     duration: 0,
    //     mc_srl_no_out: user?.imei_no,
    //     mc_srl_no: others?.mc_srl_no,
    //     cgst: cgst,
    //     sgst: sgst,
    //     base_amt: base_amt
    //   })
    // }

    // //push data into data2 array for  advanced mode
    // if (others.advance != "0") {
    //   data2.push({
    //     receiptNo: data?.[0]?.value,
    //     date_time_in: others?.date_time_in,
    //     oprn_mode: "A",
    //     vehicle_id: others.vehicle_id,
    //     vehicle_no: others.vehicle_no,
    //     receipt_type: 'S',
    //     date_time_out: others?.date_time_out,
    //     user_id_out: others.userId || user?.id,
    //     paid_amt: PARKING_FEES,
    //     gst_flag: isGst,
    //     duration: 0,
    //     mc_srl_no_out: user?.imei_no,
    //     advance: others.advance,
    //     mc_srl_no: others.mc_srl_no,
    //     cgst: cgst,
    //     sgst: sgst,
    //     base_amt: base_amt
    //   })
    // }
    // console.log("----------------------data 2 -----------------------", data2)
    // setLoading(false)
    // return
    // if (!isOnline) {
      await createOrUpdateVehicleInOut(
        others.receiptNo, others.vehicleType, others.vehicle_id, others.receipt_type,
        others.vehicle_no, others.date_time_in, others.oprn_mode, user.name, others.user_id_in, others.mc_srl_no, others.date_time_out, user.user_id, PARKING_FEES, isGst, 0, user?.imei_no, others.advance, others.isUploadedIN, false, base_amt, cgst, sgst
      )
      ToastAndroid.showWithGravity(
        'car out data store in offfline',
        ToastAndroid.LONG,
        ToastAndroid.CENTER,
      );
      // navigate to previous screen
      navigation.navigate('bottomNavBAr');
      return;
    // }

    // if internet connection is available then 
    // call handleVehicleout() 
    // and store return data to res variable
    // const res = await handleVehicleout(data2);
    // // if status not equal to 200 run below block
    // if (res.status != 200) {
    //   ToastAndroid.showWithGravity(
    //     'car out data store in offfline server error',
    //     ToastAndroid.LONG,
    //     ToastAndroid.CENTER,
    //   );
    //   await createOrUpdateVehicleInOut(
    //     others.receiptNo, others.vehicleType, others.vehicle_id, others.receipt_type,
    //     others.vehicle_no, others.date_time_in, others.oprn_mode, user.name, others.user_id_in, others.mc_srl_no, others.date_time_out, user.user_id, PARKING_FEES, isGst, 0, user?.imei_no, others.advance, others.isUploadedIN, false, base_amt, cgst, sgst
    //   )
    //   // await addOutpassEntry(data2);
    // }

    // console.log("outpass data", res.data)

    // // if status not equal to 200 run below block
    // if (res.status == 200) {
    //   createOrUpdateVehicleInOut(
    //     others.receiptNo, others.vehicleType, others.vehicle_id, others.receipt_type,
    //     others.vehicle_no, others.date_time_in, others.oprn_mode, user.name, others.user_id_in, others.mc_srl_no, others.date_time_out, user.user_id, PARKING_FEES, isGst, 0, user?.imei_no, others.advance, others.isUploadedIN, true, base_amt, cgst, sgst
    //   )
    //   ToastAndroid.showWithGravity(
    //     'car out data upload successfully',
    //     ToastAndroid.SHORT,
    //     ToastAndroid.CENTER,
    //   );
    // }
    // navigate to previous screen
    navigation.navigate('bottomNavBAr');

    //  if you wonder why we are call createOrUpdateVehicleInOut() for status 200 and not equal 200
    //Although createOrUpdateVehicleInOut () requires a lot of arguments, there is a call for isUploadedOut that can be either true or false.
    // this help us in future to upload data to the server. which are not uploaded due to no internet connectivity.
  };

  return (
    <>
      {/* if loading state is true render loading */}
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
      {/* render custom header */}
      <CustomHeader title={'Printer Preview'} />
      <ScrollView>

        {/* render printer preview and action buttons */}
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

          {/* render action buttons */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: PixelRatio.roundToNearestPixel(10),
            }}>
            {/* render goback button */}
            <CustomButtonComponent.CancelButton
              title={'Cancel'}
              onAction={() => {
                navigation.goBack();
              }}
              style={{ flex: 1, marginRight: PixelRatio.roundToNearestPixel(8) }}
            />

            {/*  render printing button */}
            <CustomButtonComponent.GoButton
              title={'Print Receipt'}
              onAction={() => {
                handlePrintReceipt();
              }}
              style={{ flex: 1, marginLeft: PixelRatio.roundToNearestPixel(8) }}
            />
          </View>
        </View>
      </ScrollView>
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