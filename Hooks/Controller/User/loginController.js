import axios from 'axios';
import React, {useContext} from 'react';
import {address} from '../../../Router/address';
import {Platform, ToastAndroid} from 'react-native';
import DeviceInfo from 'react-native-device-info';

function loginController() {
  const loginHandaler = async (user_id, password) => {
    console.log("ser_id,password",user_id,password)
    try {
      // let imei_no;
      // // if (Platform.Version <= 29) {
      //   const IMEI = require('react-native-imei');
      //   await IMEI.getImei().then(async imeiList => {
      //     imei_no = imeiList[0];
      //   });
      // // }else{
      // //   imei_no = imei
      // // }
      const imein = DeviceInfo.getSerialNumberSync();
      //  "0300221120152387"
      //  DeviceInfo.getSerialNumberSync();
      
      // alert(imein)
      console.log("-----------imei--------",imein)
      const result = await axios.post(address.login, {
        user_id,
        password,
        imei_no: imein,
      });
      return result;

    } catch (error) {
      if(error.message== "Request failed with status code 401"){
        ToastAndroid.showWithGravity(
          'check user name and password',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
        return
      }
      if(error.message== "Request failed with status code 500"){
        ToastAndroid.showWithGravity(
          'Can Not Communicate with Server..',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
        return
      }
      
     console.log(" err is",error.message)
    }
  };
  return {loginHandaler};
}

export default loginController;

// const getImeiNumber = async () => {
//   try {
//     const IMEI = require('react-native-imei');
//     IMEI.getImei().then(imeiList => {
//       console.log(imeiList[0])
//     });
//   } catch (error) {
//     console.log('Error retrieving IMEI number:', error);
//   }
// };
