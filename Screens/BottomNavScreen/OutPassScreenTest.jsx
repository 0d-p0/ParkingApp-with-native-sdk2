import {
    Alert,
    PixelRatio,
    Pressable,
    StyleSheet,
    Text,
    ToastAndroid,
    View,
    ActivityIndicator,
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
  import { AuthContext } from '../../Auth/AuthProvider';
  import VehicleInOutStore from '../../Hooks/Sql/VehicleInOut/VehicleInOutStore';
  import { Dropdown } from 'react-native-element-dropdown';
  
  const OutpassScreenTest = ({ navigation }) => {
    const { retrieveAuthUser } = getAuthUser();
    const isOnline = useContext(InternetStatusContext);
    // const { generalSetting } = useContext(AuthContext);
    // let { dev_mod } = generalSetting;
  
  let  dev_mod = "D"
    const [modalVisible, setModalVisible] = useState(false);
  
    const [loading, setLoading] = useState(null);
  
    const [number, setNumber] = useState('');
    const [data, setData] = useState();
  
    const [vp, svp] = useState();
  
    const [duration, setDuration] = useState('pritam');
    // const { ding } = playSound()
    const [value, setValue] = useState(null);
    const [isFocus, setIsFocus] = useState(false);
  
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
  
    const { checkIfVehicleOutExists } = receiptDataBase();
    const { getVehicleRatesByVehicleId } = vehicleRatesStorage();
  
    const { getDataByIdOrVehicleNumberStartsWith } = VehicleInOutStore();
  
    const getVehicleInfo = async number => {
      try {
        
        if(number){
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
                  date_time_out: date.toISOString(),
                }; // Create a new object with the modified key name and the rest of the properties
              });
              setData(filteredReceiptData);
    
              console.log(
                'filteredReceiptData?.[0]?.date_time_in',
                filteredReceiptData,
              );
    
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
  
    // CALCULATE PRICE
    async function calculatePrice(inTimestamp, outTimestamp, id) {
      const result = await getVehicleRatesByVehicleId(id);
      // console.log("-----------------------------------", inTimestamp, outTimestamp)
      const isTypeS = result.some(item => item.rate_type === "S");
      if (isTypeS) {
        const diffInMilliseconds = Math.abs(inTimestamp - outTimestamp);
        const diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));
  
        const index = result.findIndex(range =>
          diffInHours >= range.from_hour && diffInHours < range.to_hour
        );
        if(index == -1){
          result[result.length-1].hourly_rate
        }
  
        console.log(result)
        console.log(`The difference is ${diffInHours} hours`,index);
        return result[index].hourly_rate
      }
      // console.log(dev_mod)
      if (dev_mod == 'F') {
        return result[0].fixed_rate;
      }
  
      // console.log(inTimestamp, outTimestamp);
      const inTime = new Date(inTimestamp);
      const outTime = new Date(outTimestamp);
  
      const timeDifference = outTime.getTime() - inTime.getTime();
      const hours = Math.ceil(timeDifference / (1000 * 60 * 60)); // Calculate total hours
  
      let price = hours * parseInt(result[0].vehicle_rate);
  
      // LOG  [{"cgst": "5.00", "fixed_rate": "50.00", "sgst": "5.00", "sl_no": 1, "vehicle_id": "1", "vehicle_rate": "10.00"}]
  
      // TODO may be implement in future
  
      // price =
      //   price +
      //   (price * (parseInt(result[0].sgst) + parseInt(result[0].cgst))) / 100;
      // console.log(price);
  
      return price;
    }
  
    useEffect(() => {
      getVehicleInfo(number);
    }, [number]);

  
    const scanner = async () => {
      navigation.navigate('scanner');
    };
  
    const handleUploadOutPassData = async index => {
    
      const dateTimeString = data?.[0]?.date_time_in;
      const inDateFormat = new Date(dateTimeString);
      const timestamp = inDateFormat.getTime();
  
      const price = await calculatePrice(
        timestamp,
        date.getTime(),
        data?.[0]?.vehicle_id,
      );
      
      console.log(price);
      svp(price);
      const vData = [];
      vData.push({
        label: 'RECEIPT NO',
        value: data?.[index]?.receiptNo || 1,
      });
      vData.push({
        label: 'PARKING FEES',
        value: price,
      });
      if (data?.[index].oprn_mode == 'A') {
        vData.push({
          label: 'ADVANCE AMOUNT',
          value: data?.[index].paid_amt,
        });
  
        vData.push({
          label: 'BALANCE AMOUNT',
          value: price - data?.[index].paid_amt,
        });
      }
      vData.push({
        label: 'VEHICLE TYPE',
        value: data?.[index]?.vehicleType || data?.[index]?.vehicle_name,
      });
  
      vData.push({
        label: 'VEHICLE NO',
        value: data?.[index]?.vehicleNumber || data?.[index]?.vehicle_no,
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
      // ATA PORE DEKHTE HOBE
  
      // vData.push({
      //   label: 'DURATION',
      //   value: duration,
      // })
      // navigate to PRINT PREVIEW SCREEN
      navigation.navigate('outpassPrinterPreview', {
        data: vData,
        others: data,
      });
  
      setNumber();
      setData();
    };
  
  
    const { getAllInVehicles, getAllOutVehicles, updateIsUploadedINById, updateIsUploadedOUTById } = VehicleInOutStore()
  
    const uploadDataToTheServer = async () => {
      try {
        if (!isOnline) {
          ToastAndroid.showWithGravityAndOffset(
            'please connect to the internet first',
            ToastAndroid.LONG,
            ToastAndroid.CENTER,
            25,
            50,
          )
          return
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
          )
        }
        if (inVehiledata.length != 0) {
          const token = await retrieveAuthUser();
          inVehiledata.forEach(async element => {
            const newVinData = [element]
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
                updateIsUploadedINById(element.id)
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
  
          });
  
        }
  
        const outVechileData = await getAllOutVehicles()
        if (outVechileData.length == 0) {
          ToastAndroid.showWithGravityAndOffset(
            'already syn',
            ToastAndroid.LONG,
            ToastAndroid.CENTER,
            25,
            50,
          )
        }
        console.log("---------out car--------------", outVechileData)
  
        if (outVechileData.length != 0) {
          const token = await retrieveAuthUser();
          outVechileData.forEach(async element => {
            const newVoutData = [element]
            await axios
              .post(
                address.carOut,
                { data: newVoutData },
                {
                  headers: { Authorization: `Bearer ${token}` },
                },
              )
              .then(async res => {
                console.log("----------------------------", res.data);
                ToastAndroid.show('Out pass uploaded !', ToastAndroid.LONG);
                updateIsUploadedOUTById(element.id)
              })
              .catch(error => {
                console.log(error.status)
                ToastAndroid.show('some error occur!', ToastAndroid.LONG);
                console.error("----------------errror------------------", error);
              });
          });
  
        }
  
        // if(data.length != 0){
        //   for (const item of data){
        //     await axios.post(address.leave,{ "receiptNo":item.receiptNo,  "outPassNumber":item.outPassNumber, "outTime":item.outTime ,"duration":item.duration}).then(res=>console.warn(res.data)).then(()=>{
        //        deleteDataById(item.outPassNumber)
        //     }).catch(error=>{console.error(error)})
        //   }
        // }
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
  
  <View style={{ borderWidth: 1,
    paddingStart: PixelRatio.roundToNearestPixel(10),
    borderRadius: PixelRatio.roundToNearestPixel(20),
    color:allColor.black,}}>

                         <Dropdown   
                          style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
                          placeholderStyle={styles.placeholderStyle}
                          selectedTextStyle={styles.selectedTextStyle}
                          inputSearchStyle={styles.inputSearchStyle}
                          data={data}
                          search
                          maxHeight={300}
                          labelField="vehicle_no"
                          valueField="date_time_in"
                          placeholder={!isFocus ? 'Search by Receipt No / Vehicle No' : '...'}
                          searchPlaceholder="Search..."
                          mode='modal'
                          value={value}
                          onFocus={() => setIsFocus(true)}
                          onBlur={() => setIsFocus(false)}
                          onChange={item => {
                            console.log(item)
                              setValue(item.value);
                              setIsFocus(false);
                          }}
                          onChangeText={value => {
                            getVehicleInfo(value)
                             console.log(value)
                          }}
                      />
  </View>
  
          <Pressable
            onPress={() => uploadDataToTheServer()}
            style={{ alignSelf: 'center', marginTop: normalize(30) }}>
            {icons.sync}
          </Pressable>
        </View>
      </SafeAreaView>
    );
  };
  
  export default OutpassScreenTest;
  
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
      width: "98%",
      height: PixelRatio.roundToNearestPixel(50),
      borderColor: allColor.black,
      borderWidth: 1,
      borderRadius: PixelRatio.roundToNearestPixel(15),
      paddingHorizontal: 2,
      marginHorizontal: 2
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
      marginLeft: PixelRatio.roundToNearestPixel(5)
    },
    selectedTextStyle: {
      fontSize: 16,
      fontWeight: '600',
      color: allColor.black,
      marginLeft: PixelRatio.roundToNearestPixel(8)
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
  