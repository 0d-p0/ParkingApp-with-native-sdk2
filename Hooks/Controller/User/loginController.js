import axios from 'axios';
import React, { useContext } from 'react';
import { address } from '../../../Router/address';
import { Platform, ToastAndroid } from 'react-native';
import DeviceInfo from 'react-native-device-info';

function loginController() {
  const loginHandaler = async (user_id, password) => {
    console.log("ser_id,password", user_id, password)
    try {

      const imein = DeviceInfo.getUniqueIdSync()
      console.log("-----------imei--------", imein)
      const result = await axios.post(address.login, {
        user_id,
        password,
        imei_no: imein,
      });
      console.log("ooppppppppppppppppoooooooooooooooooo", result)
      return result;

    } catch (error) {

      if (error.response) {
        // The client was given an error response (5xx, 4xx)
        console.log(error.response.data)
        ToastAndroid.showWithGravity(
          `${error.response.data.message}`,
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
        return
      } else if (error.request) {
        // The client never received a response, and the request was never left
        ToastAndroid.showWithGravity(
          `${"Server is not Reachable"}`,
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
        return
      } else {
        // Anything else
      }

      // if (error.message == "Request failed with status code 401") {
      //   ToastAndroid.showWithGravity(
      //     'check user name and password',
      //     ToastAndroid.SHORT,
      //     ToastAndroid.CENTER,
      //   );
      //   return
      // }
      // if (error.message == "Request failed with status code 500") {
      //   ToastAndroid.showWithGravity(
      //     'Can Not Communicate with Server..',
      //     ToastAndroid.SHORT,
      //     ToastAndroid.CENTER,
      //   );
      //   return
      // }

      console.log(" err is", error.message)
    }
  };
  return { loginHandaler };
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
