import {
  Alert,
  PixelRatio,
  Pressable,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect, useState, useContext } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import CustomHeader from '../../component/CustomHeader';
import CustomButtonComponent from '../../component/CustomButtonComponent';
import normalize from 'react-native-normalize';
import allColor from '../../Resources/Colors/Color';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import RoundedInputComponent from '../../component/RoundedInputComponent';
import receiptDataBase from '../../Hooks/Sql/receipt/receiptDataBase';
import vehicleRatesStorage from '../../Hooks/Sql/vechicles/vehicleRatesStorage';
import vehicleINOUTController from '../../Hooks/Controller/receipt/vehicleINOUTController';
import { InternetStatusContext } from '../../App';
import axios from 'axios';
import { address } from '../../Router/address';
import getAuthUser from '../../Hooks/getAuthUser';
// import ThermalPrinterModule from 'react-native-thermal-printer';
import { AuthContext } from '../../Auth/AuthProvider';
import VehicleInOutStore from '../../Hooks/Sql/VehicleInOut/VehicleInOutStore';
import { Dropdown } from 'react-native-element-dropdown';
import HourlyPriceCalculate from '../../Hooks/PriceCalculator/HourlyPriceCalculate';
import DayTimePriceCalculate from '../../Hooks/PriceCalculator/DayTimePriceCalculate';
import GstPriceCalculator from '../../Hooks/PriceCalculator/GstPriceCalculator';
import gstSettingsController from '../../Hooks/Controller/GST_Settings/gstSettingsController';

const OutpassScreen = ({ navigation }) => {
  const { retrieveAuthUser } = getAuthUser();
  const isOnline = useContext(InternetStatusContext);
  // Get GST Settings
  const { handleGetGstSettingsFromStorage } = gstSettingsController()

  // dev_mod = "F"
  const [modalVisible, setModalVisible] = useState(false);

  const [loading, setLoading] = useState(null);

  const [number, setNumber] = useState('');
  const [data, setData] = useState();

  const [vp, svp] = useState();

  const [duration, setDuration] = useState('pritam');


  const entrydate = new Date(data?.[0]?.time || data?.[0]?.date_time_in);

  const options = {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  };

  const dateoptions = { day: '2-digit', month: '2-digit', year: '2-digit' };
  const formattedDate = entrydate.toLocaleDateString(undefined, dateoptions);
  const formattedTime = entrydate.toLocaleTimeString(undefined, options);

  const date = new Date();

  const { getVehicleRatesByVehicleId } = vehicleRatesStorage();

  const { getDataByIdOrVehicleNumberStartsWith } = VehicleInOutStore();

  const getVehicleInfo = async number => {

    try {
      if (number) {
        setLoading(true);
        let filteredReceiptData = await getDataByIdOrVehicleNumberStartsWith(
          number,
        );

        // offline
        if (filteredReceiptData.length != 0) {
          filteredReceiptData = filteredReceiptData.map(item => {
            const { Price, ...rest } = item; // Destructure "Price" and capture the rest of the properties
            return {
              paid_amt: Price,
              ...rest,
              date_time_out: date.toISOString().slice(0, -5) + "Z",
            }; // Create a new object with the modified key name and the rest of the properties
          });
          setData(filteredReceiptData);

          // console.log(
          //   'filteredReceiptData?.[0]?.date_time_in',
          //   filteredReceiptData,
          // );

          setLoading(false);

          return;
        }
      }
    } catch (error) {
      // console.error("Number is empty")
      setLoading(false);
      // console.log(error);
    }
  };

  async function calculateTotalPrice(
    vehicleId,
    inTimestamp,
    outTimestamp,
    start_time,
    end_time,
  ) {
    // get Vehicle Rates By Id From Local Storage
    const result = await getVehicleRatesByVehicleId(vehicleId);

    // console.log(" result us -----", result)

    if (result[0].rate_type == 'H') {
      // If Rate type is H, H For Hourly
      const price = HourlyPriceCalculate(
        result,
        start_time,
        end_time,
      );
      return price;
    }

    if (result[0].rate_type == 'T') {
      // If Rate type is T, T For Timely
      const testStrtT = new Date(start_time);
      const testEndT = new Date(end_time);

      // console.log(result);
      // console.log(testStrtT.toLocaleString(), '--', testEndT.toLocaleString());

      const { price } = DayTimePriceCalculate(start_time, end_time, result);
      return price;
    }
  }

  // Calculate Total Duration
  function calculateDuration(inTimestamp, outTimestamp) {
    let duration = '';
    const diffInMilliseconds = Math.abs(inTimestamp - outTimestamp);
    const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
    const diffHours = Math.floor(diffInMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffInMinutes >= 60) {
      duration = `${diffHours} hours ${diffInMinutes % 60} minutes`;
    } else {
      duration = `${diffInMinutes} minutes`;
    }

    if (diffHours >= 24) {
      duration = `${diffDays} days ${diffHours % 24} hours ${diffInMinutes % 60
        } minutes`;
    }

    return duration;
  }

  useEffect(() => {
    getVehicleInfo(number);

    if (!number) {
      setData();
    }
  }, [number]);

  const scanner = async () => {
    navigation.navigate('scanner');
  };


  const handleUploadOutPassData = async index => {
    const dateTimeString = data?.[index]?.date_time_in;
    const inDateFormat = new Date(dateTimeString);
    const timestamp = inDateFormat.getTime();

    let price = await calculateTotalPrice(
      data?.[index]?.vehicle_id,
      timestamp,
      date.getTime(),
      data?.[index]?.date_time_in,
      data?.[index]?.date_time_out,
    );

    // const price = await calculateTotalPrice(
    //   timestamp,
    //   date.getTime(),
    //   data?.[0]?.vehicle_id,
    //   data?.[0]?.date_time_in,
    //   data?.[0]?.date_time_out,
    // );
    // console.log(price);
    const gstSettings = await handleGetGstSettingsFromStorage()
    console.log(gstSettings)
    const totalDuration = calculateDuration(timestamp, date.getTime());
    let gstPrice;
    if (gstSettings && gstSettings?.gst_flag == "1") {
      gstPrice = GstPriceCalculator(gstSettings, price)
    }
    svp(price);
    console.log(price)

    const vData = [];
    vData.push({
      label: 'RECEIPT NO',
      value: data?.[index]?.receiptNo || 1,
    });
    if (gstSettings && gstSettings?.gst_flag == "1") {
      vData.push({
        label: 'BASE AMOUNT',
        value: gstPrice.price,
      });
      vData.push({
        label: 'CGST',
        value: gstPrice.CGST,
      });
      vData.push({
        label: 'SGST',
        value: gstPrice.SGST,
      });
      vData.push({
        label: 'PARKING FEES',
        value: gstPrice.totalPrice,
      });
    }
    if (!gstSettings || gstSettings?.gst_flag == "0") {
      vData.push({
        label: 'PARKING FEES',
        value: price,
      });
    }

    console.log(gstSettings)
    if (data?.[index].advance != '0') {
      vData.push({
        label: 'ADVANCE AMOUNT',
        value: data?.[index].advance,
      });

      if (gstSettings && gstSettings?.gst_flag == "1") {
        vData.push({
          label: 'BALANCE AMOUNT',
          value: gstPrice.totalPrice - data?.[index].advance,
        });
      }

      if (!gstSettings || gstSettings?.gst_flag == "0") {
        vData.push({
          label: 'BALANCE AMOUNT',
          value: price - data?.[index].advance,
        });

      }
    }
    vData.push({
      label: 'VEHICLE TYPE',
      value: data?.[index]?.vehicleType,
    });

    vData.push({
      label: 'VEHICLE NO',
      value: data?.[index]?.vehicle_no,
    });
    const inDate = new Date(data[index]?.date_time_in);
    console.log(
      '-------------------- in date -----------',
      inDate.toLocaleDateString(undefined, dateoptions),
    );
    vData.push({
      label: 'IN TIME',
      value:
        inDate.toLocaleDateString(undefined, dateoptions) +
        ' ' +
        inDate.toLocaleTimeString(undefined, options),
    });

    vData.push({
      label: 'OUT TIME',
      value:
        date.toLocaleDateString(undefined, dateoptions) +
        ' ' +
        date.toLocaleTimeString(undefined, options),
    });

    vData.push({
      label: 'DURATION',
      value: totalDuration,
    });
    // navigate to PRINT PREVIEW SCREEN
    navigation.navigate('outpassPrinterPreview', {
      data: vData,
      others: data[index],
      gstSettings
    });

    setNumber();
    setData();
  };

  const {
    getAllInVehicles,
    getAllOutVehicles,
    updateIsUploadedINById,
    updateIsUploadedOUTById,
  } = VehicleInOutStore();

  const uploadDataToTheServer = async () => {
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
        ToastAndroid.showWithGravityAndOffset(
          'already syn',
          ToastAndroid.LONG,
          ToastAndroid.CENTER,
          25,
          50,
        );
      }
      if (inVehiledata.length != 0) {
        const token = await retrieveAuthUser();

        for (const element of inVehiledata){
          const newVinData = [element];
          await axios
            .post(
              address.carIn,
              { data: newVinData },
              {
                headers: { Authorization: `Bearer ${token}` },
              },
            )
            .then(async res => {
              console.log(res.data);
              ToastAndroid.show('receipt uploaded!', ToastAndroid.SHORT);
              updateIsUploadedINById(element.id);
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
            });
        }
      }

      const outVechileData = await getAllOutVehicles();
      if (outVechileData.length == 0) {
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
        
        for (const element of outVechileData){
          const newVoutData = [element];
          await axios
            .post(
              address.carOut,
              { data: newVoutData },
              {
                headers: { Authorization: `Bearer ${token}` },
              },
            )
            .then(async res => {
              console.log('----------------------------', res.data);
              ToastAndroid.show('Out pass uploaded !', ToastAndroid.LONG);
              updateIsUploadedOUTById(element.id);
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

  return (
    <SafeAreaView>
      <CustomHeader title={'BILL/OUTPASS'} />
      <View style={styles.padding_container}>
        <CustomButtonComponent.GoButton
          title={'Scan'}
          onAction={() => scanner()}
        />

        <Text style={styles.receipt_or_vehicleNo}>Receipt / Vehicle No.</Text>
        <View style={styles.radioButton_container}>
          {/* <RadioButton.RoundedRadioButton title={'Vehicle Number'} /> */}
          {/* <RadioButton.RoundedRadioButton title={"Receipt Number"} /> */}
        </View>

        <View
          style={{
            width: '97%',
            bottom: PixelRatio.roundToNearestPixel(160),
            position: 'absolute',
            backgroundColor: allColor['light-gray'],
            borderRadius: PixelRatio.roundToNearestPixel(10),
            maxHeight: PixelRatio.roundToNearestPixel(100),
            justifyContent: 'center',
            left: PixelRatio.roundToNearestPixel(25),
          }}>
          {/* {loading && <ActivityIndicator size="large" />} */}

          <ScrollView style={{ width: '100%' }} keyboardShouldPersistTaps={'handled'}>
            {data &&
              data.map((props, index) => {
                const formatTime = new Date(props.date_time_in);
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleUploadOutPassData(index)}
                    style={{
                      borderColor: allColor.white,
                      borderBottomWidth: 1,
                      width: '100%',
                      padding: 5,
                    }}>
                    <Text
                      style={{
                        fontWeight: '600',
                        fontSize: PixelRatio.roundToNearestPixel(16),
                        color: 'black',
                        margin: PixelRatio.roundToNearestPixel(2),
                      }}>
                      {' '}
                      {props?.vehicleNumber || props?.vehicle_no}
                      {'   -  '}
                      {formatTime.toLocaleString()} {'   -  '}
                      {props.receiptNo}
                    </Text>
                  </TouchableOpacity>
                );
              })}
          </ScrollView>
        </View>
        <RoundedInputComponent
          placeholder={'Enter Receipt / Vehicle No'}
          value={number}
          onChangeText={setNumber}
        />
        {/* render vehicle */}

        <Pressable
          onPress={() => uploadDataToTheServer()}
          style={{ alignSelf: 'center', marginTop: normalize(30) }}>
          {icons.sync}
        </Pressable>

        {/* <View style={{ width: '100%', bottom: PixelRatio.roundToNearestPixel(55), position: 'absolute', backgroundColor: allColor['light-gray'], borderRadius: PixelRatio.roundToNearestPixel(10),maxHeight:PixelRatio.roundToNearestPixel(100) }}>
        <ScrollView>
        {data &&
                data.map((props, index) => {
                  const formatTime = new Date(props.date_time_in)
                  return(
                    <>
                     <Pressable
                    key={index}
                    onPress={() => handleUploadOutPassData(index)}
                   style={{borderColor:allColor.white,borderBottomWidth:1,width:"100%",}}
                  >
                    <Text
                      style={{
                        fontWeight: '600',
                        fontSize: PixelRatio.roundToNearestPixel(16),
                        color: 'black',
                        margin: PixelRatio.roundToNearestPixel(2),
                      }}>
                      {' '}
                      {props?.vehicleNumber || props?.vehicle_no}{'   -  '}
                      {formatTime.toLocaleString()} {'   -  '}
                      {props.receiptNo}
                    </Text>
                  </Pressable>
                    </>
                  )
                })}
        </ScrollView>
        </View> */}
      </View>
    </SafeAreaView>
  );
};

export default OutpassScreen;

const styles = StyleSheet.create({
  padding_container: {
    padding: normalize(20),
  },
  receipt_or_vehicleNo: {
    alignSelf: 'center',
    color: allColor.black,
    marginTop: normalize(20),
    fontWeight: 'bold',
    fontSize: responsiveFontSize(2.3),
  },
  radioButton_container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: normalize(10),
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
  dropdown: {
    backgroundColor: 'white',
    width: '98%',
    height: PixelRatio.roundToNearestPixel(50),
    borderColor: allColor.black,
    borderWidth: 1,
    borderRadius: PixelRatio.roundToNearestPixel(15),
    paddingHorizontal: 2,
    marginHorizontal: 2,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    right: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
    color: allColor.black,
    marginLeft: PixelRatio.roundToNearestPixel(5),
  },
  selectedTextStyle: {
    fontSize: 16,
    fontWeight: '600',
    color: allColor.black,
    marginLeft: PixelRatio.roundToNearestPixel(8),
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});

// const submit = async () => {
//   // const date = new Date();
//   // const result = await createLeaveReceipt(
//   //   'Car',
//   //   '9',
//   //   'single',
//   //   'wb005',
//   //   date.toLocaleDateString(),
//   //   date.toLocaleTimeString(),
//   //   5,
//   //   date.toLocaleTimeString(),
//   //   100,
//   //   '10:10:00',
//   // );
//   // console.log(result);
// };

{
  /* model */
}
//   <View>
//   <Modal
//     animationType="slide"
//     transparent={true}
//     visible={modalVisible}
//     onRequestClose={() => {
//       Alert.alert('Modal has been closed.');
//       setModalVisible(!modalVisible);
//     }}>
//     <View style={modalStyle.centeredView}>
//       <View style={modalStyle.modalView}>
//         <Text style={[modalStyle.modalText, modalStyle.textStyle]}>
//           receipt No : {data?.[0]?.receiptNo}
//         </Text>
//         <Text style={[modalStyle.modalText, modalStyle.textStyle]}>
//           parking fee : {vp}
//           {/* {calculatePrice(data?.[0]?.time, date.getTime(), 10)} */}
//         </Text>
//         <Text style={[modalStyle.modalText, modalStyle.textStyle]}>
//           vehicle Type : {data?.[0]?.vehicleType || data?.[0]?.vehicle_name}
//         </Text>

//         <Text style={[modalStyle.modalText, modalStyle.textStyle]}>
//           vehicle No : {data?.[0]?.vehicleNumber || data?.[0]?.vehicle_no}
//         </Text>

//         <Text style={[modalStyle.modalText, modalStyle.textStyle]}>
//           In time : {formattedTime}
//         </Text>

//         <Text style={[modalStyle.modalText, modalStyle.textStyle]}>
//           In Date : {formattedDate}
//         </Text>
//         <Text style={[modalStyle.modalText, modalStyle.textStyle]}>
//           out time : {date.toLocaleTimeString()}
//         </Text>

//         <Text style={[modalStyle.modalText, modalStyle.textStyle]}>
//           out Date : {date.toLocaleDateString()}
//         </Text>

//         {/* <Text style={[modalStyle.modalText, modalStyle.textStyle]}>
//           total duration :  {data?.[0]?.inDate}
//         </Text> */}
//         <QRCode value="This is the value in the QRcode" />

//         <Pressable
//           style={{ marginTop: 10 }}
//           onPress={() => setModalVisible(!modalVisible)}>
//           <Text style={modalStyle.textStyle}>close</Text>
//         </Pressable>
//         <Pressable
//           style={{ marginTop: 10 }}
//           onPress={() =>printoutput()}>
//           <Text style={modalStyle.textStyle}>Print</Text>
//         </Pressable>
//       </View>
//     </View>
//   </Modal>

//   {/* <Pressable
//     style={[modalStyle.button, modalStyle.buttonOpen]}
//     onPress={() => setModalVisible(true)}>
//     <Text style={modalStyle.textStyle}>Show Modal</Text>
//   </Pressable> */}
// </View>

// const handlePrintReceipt = async () => {
//   try {
//     await ThermalPrinterModule.printBluetooth({
//       payload:
//         // '[C]<img>https://via.placeholder.com/300.jpg</img>\n' +
//         `[L]<b>Receipt No : ${data?.[0]?.receiptNo}\n` +
//         `[L]<b>Parking fee : ${vp}\n` +
//         `[L]<b>Vehicle Type : ${
//           data?.[0]?.vehicleType || data?.[0]?.vehicle_name
//         }\n` +
//         `[L]<b>Vehicle No : ${
//           data?.[0]?.vehicleNumber || data?.[0]?.vehicle_no
//         }\n` +
//         `[L]<b>IN Time : ${formattedTime}\n` +
//         `[L]<b>IN Date : ${formattedDate}\n` +
//         `[L]<b>OUT Date : ${formattedDate}\n` +
//         `[L]<b>OUT Time : ${date.toLocaleTimeString()}\n` +
//         `[L]<qrcode size='30'>http://www.developpeur-web.dantsu.com/</qrcode>\n`,
//       printerNbrCharactersPerLine: 38,
//     });
//   } catch (err) {
//     //error handling
//     console.log(err.message);
//   }
// };

// if (isOnline) {
//   setLoading(true)
//   const token = await retrieveAuthUser();
//   axios
//     .post(
//       address.getCarDetails,
//       { car_number: number },
//       {
//         headers: { Authorization: `Bearer ${token}` },
//       },
//     )
//     .then(async response => {
//       let datak = response.data.Data;
//       // if(response.data){
//       //   return
//       // }

//       const newDateTimeIn =  new Date(datak?.date_time_in)
//       const dateString = datak?.date_time_in;

//       datak = [datak].map(item => {
//         const {date_time_in,...rest } = item; // Destructure "Price" and capture the rest of the properties
//         return { ...rest,date_time_in:newDateTimeIn.toISOString(), date_time_out:date.toISOString() }; // Create a new object with the modified key name and the rest of the properties
//       });
//       setData(datak);

//       // newDateTimeIn.toISOString()

//       console.log("----------data k --------------", datak);

//       const inDate = new Date(dateString);
//       const timestamp = inDate.getTime();
//       // data.date_time_in = timestamp;
//       const price = await calculatePrice(
//         timestamp,
//         date.getTime(),
//         datak[0].vehicle_id,
//       );

//       console.log(price)
//       svp(price);
//       setLoading(false)

//     })
//     .catch(error => {
//       setLoading(false)
//       // console.error(error)
//     });
// }

// -----------------------------------price calculation -------------------

//  // CALCULATE PRICE
//  async function calculateTotalPrice(
//   inTimestamp,
//   outTimestamp,
//   id,
//   start_time,
//   end_time,
// ) {
//   const result = await getVehicleRatesByVehicleId(id);
//   let price = 0;

//   const nightModeIndex = result.findIndex(item => item.night_day_flag == 'N');

//   // console.log("is night mode on ", !(nightModeIndex == -1));

//   // CALCULATE THE NIGHT HOURS , NIGHT DAYS AND REMAING HOURS
//   if (!(nightModeIndex == -1)) {
//     console.log('is this run');
//     const {nighttime_hours, num_nights, remaining_hours} =
//       calculateNighttimeHoursAndNights(
//         start_time,
//         end_time,
//         result[nightModeIndex],
//       );
//     console.log(nighttime_hours, num_nights, remaining_hours);

//     // CALCULATE THE PRICE OF HOURS EXCEPT THE NIGHT HOURS
//     if (!(nighttime_hours > 0 && remaining_hours == 0)) {
//       price = calculatePrice(remaining_hours, result);
//     }

//     // CALCULATING THE PRICE
//     if (result[nightModeIndex].rate_flag == 'F') {
//       // CALCULATE PRICE FOR FIXED NIGHT TIME [LIKE 00:00 to 06:00 have constant PRICE]
//       price += result[nightModeIndex].vehicle_rate * num_nights;
//     } else {
//       // CALCULATE PRICE FOR PER HOUR NIGHT TIME [LIKE 00:00 to 06:00 have variable prices PRICE]
//       price += result[nightModeIndex].vehicle_rate * nighttime_hours;
//     }

//     console.log(price);
//   } else {
//     // CALCULATE ONLY HOURLY PRICES
//     const price = calculateHourlyPriceOnly(inTimestamp, outTimestamp, result);
//     console.log(price);
//   }

//   return price;
// }

// function calculateNighttimeHoursAndNights(start_time, end_time, nightTime) {
//   const start_datetime = new Date(start_time);
//   const end_datetime = new Date(end_time);

//   const nightStartHoursData = nightTime.from_hour.split(':');
//   const nightToHoursData = nightTime.to_hour.split(':');

//   const nightHour = nightStartHoursData[0];
//   const nightMinute = nightStartHoursData[1];

//   const nightEndHour = nightToHoursData[0];
//   const nightEndMinute = nightToHoursData[1];

//   const nighttime_start = new Date(start_datetime);
//   nighttime_start.setHours(nightHour, nightMinute, 0, 0);
//   const nighttime_end = new Date(nighttime_start);
//   nighttime_end.setHours(nightEndHour, nightEndMinute, 0, 0);

//   let nighttime_hours = 0;
//   let num_nights = 0;
//   let remaining_hours = 0;

//   // console.log("start date time is ",start_datetime.toLocaleString())
//   // console.log("night start time is ",nighttime_start.toLocaleString())

//   // console.log("end date time is ",end_datetime.toLocaleString())
//   // console.log("night end time is ",nighttime_end.toLocaleString())

//   if (start_datetime.getDate() === end_datetime.getDate()) {
//     console.log('its same day');
//     if (start_datetime >= nighttime_start && end_datetime <= nighttime_end) {
//       console.log('1st if block');
//       num_nights += 1;
//       nighttime_hours = (end_datetime - start_datetime) / (1000 * 60 * 60);
//     } else if (
//       start_datetime >= nighttime_start &&
//       end_datetime >= nighttime_start
//     ) {
//       console.log('2nd if block');
//       num_nights += 1;
//       nighttime_hours = (nighttime_end - start_datetime) / (1000 * 60 * 60);
//       if (Math.sign(nighttime_hours) == -1) {
//         num_nights = 0;
//         nighttime_hours = 0;
//       }
//       if (nighttime_hours == 0) {
//         num_nights = 0;
//       }
//     }
//   } else {
//     let current_date = new Date(start_datetime);
//     current_date.setHours(0, 0, 0, 0);

//     while (current_date <= end_datetime) {
//       const night_start = new Date(current_date);
//       night_start.setHours(nightHour, nightMinute, 0, 0);
//       const night_end = new Date(night_start);
//       night_end.setHours(nightEndHour, nightEndMinute, 0, 0);

//       const night_hours = Math.max(
//         0,
//         Math.min(6, (night_end - night_start) / (1000 * 60 * 60)),
//       );

//       if (current_date.getDate() === start_datetime.getDate()) {
//         nighttime_hours += Math.max(
//           0,
//           Math.min(6, (night_end - start_datetime) / (1000 * 60 * 60)),
//         );
//       } else if (current_date.getDate() === end_datetime.getDate()) {
//         nighttime_hours += Math.max(
//           0,
//           Math.min(6, (end_datetime - night_start) / (1000 * 60 * 60)),
//         );
//       } else {
//         nighttime_hours += night_hours;
//       }

//       current_date.setDate(current_date.getDate() + 1);
//       if (nighttime_hours != 0) {
//         num_nights++;
//       }
//     }
//   }

//   nighttime_hours = Math.ceil(nighttime_hours);
//   const total_hours = (end_datetime - start_datetime) / (1000 * 60 * 60);
//   remaining_hours = total_hours - nighttime_hours;
//   remaining_hours = Math.ceil(remaining_hours);
//   return {nighttime_hours, num_nights, remaining_hours};
// }

// function calculatePrice(hours, heyData) {
//   let price = 0;
//   //  hours * parseInt(heyData[0].vehicle_rate);
//   const index = heyData.findIndex(
//     range => hours >= range.from_hour && hours <= range.to_hour,
//   );

//   for (let [i, item] of heyData.entries()) {
//     if (item.rate_flag == 'F') {
//       price += parseInt(item.vehicle_rate);
//     }
//     if (item.rate_flag == 'P') {
//       let currentHour = hours - item.from_hour;
//       if (currentHour > item.to_hour) {
//         currentHour = parseInt(item.to_hour) - parseInt(item.from_hour);
//       }
//       console.log(item.to_hour, 'current hour', currentHour);
//       price += currentHour * parseInt(item.vehicle_rate);
//     }
//     if (i == index) {
//       break;
//     }
//   }
//   console.log('calculate price hour is ', hours);

//   return price;
// }

// function calculateHourlyPriceOnly(inTimestamp, outTimestamp, heyData) {
//   const inTime = new Date(inTimestamp);
//   const outTime = new Date(outTimestamp);

//   const timeDifference = outTime.getTime() - inTime.getTime();
//   const hours = Math.ceil(timeDifference / (1000 * 60 * 60)); // Calculate total hours
//   let price = 0;
//   //  hours * parseInt(heyData[0].vehicle_rate);
//   const index = heyData.findIndex(
//     range => hours >= range.from_hour && hours <= range.to_hour,
//   );

//   for (let [i, item] of heyData.entries()) {
//     if (item.rate_flag == 'F') {
//       price += parseInt(item.vehicle_rate);
//     }
//     if (item.rate_flag == 'P') {
//       let currentHour = hours - item.from_hour;
//       if (currentHour > item.to_hour - item.from_hour) {
//         currentHour = parseInt(item.to_hour) - parseInt(item.from_hour);
//       }
//       price += currentHour * parseInt(item.vehicle_rate);
//       console.log(price);
//     }

//     if (i == index) {
//       break;
//     }
//   }
//   //   console.log("calculate price hour is ", hours);

//   return price;
// }
