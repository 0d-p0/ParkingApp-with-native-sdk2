import {StyleSheet, PermissionsAndroid, Alert} from 'react-native';
import React, {useEffect, useState, createContext} from 'react';
import NetInfo from '@react-native-community/netinfo';

import NavContainer from './Screens/NavContainer/NavContainer';
import {AuthProvider} from './Auth/AuthProvider';
import axios from 'axios';
import {address} from './Router/address';
import Pot from './component/Test/Pot';
import receiptDataBase from './Hooks/Sql/receipt/receiptDataBase';
import PrintUi from './Screens/PrintUi/PrintUi';
import getAuthUser from './Hooks/getAuthUser';
import SplashScreen from './Screens/Splash Screen/SplashScreen';
import vehicleINOUTController from './Hooks/Controller/receipt/vehicleINOUTController';
import VehicleInOutStore from './Hooks/Sql/VehicleInOut/VehicleInOutStore';
import OutpassScreenTest from './Screens/BottomNavScreen/OutPassScreenTest';
import uploadVehicleData from './Hooks/Controller/vechicles/uploadVehicleData';
export const InternetStatusContext = createContext(false);

const App = () => {
  // const {createNewReceipt,retrieveAllData} = getDBconnection()
  const {retrieveAuthUser} = getAuthUser();
  const [isOnline, setOnline] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const {
    getAllDataFromTable,
    deleteAllFromINTable,
    getAllOutpassEntries,
    deleteAllOutpassData,
  } = receiptDataBase();

  const {
    getAllInVehicles,
    getAllOutVehicles,
    getAllInVehiclesPastMonth,
    getAllOutVehiclesPastMonth,
    updateIsUploadedINById,
    updateIsUploadedOUTById,
  } = VehicleInOutStore();

  const {uploadAllVehiclesData} = uploadVehicleData();

  const deleteOneMonthOldDataToTheServer = async () => {
    console.log('----------------------delete past data-----------------');
    try {
      const result =
        Promise.all[
          (getAllInVehiclesPastMonth(), getAllOutVehiclesPastMonth())
        ];
      console.log('--------------delete is -------------', result);
    } catch (error) {
      console.error('error from ', error);
    }
  };

  const uploadDataToTheServer = async () => {

    console.log(
      '----------------------upload to the server from APP every interval----------------- is online',
      isOnline,
    );

    if (isOnline) {
   
      await uploadAllVehiclesData();
    }
    return;
    try {
      if (!isOnline) {
        return;
      }
      // handle offline INVCHILE DATA SYNC
      const inVehiledata = await getAllInVehicles();
      if (inVehiledata.length == 0) {
        console.log('already syn');
      }
      if (inVehiledata.length != 0) {
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
              updateIsUploadedINById(element.date_time_in);
            })
            .catch(error => {
              console.error(error);
            });
        }
      }

      const outVechileData = await getAllOutVehicles();
      if (outVechileData.length == 0) {
        console.log('already syn');
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
              updateIsUploadedOUTById(element.date_time_in);
            })
            .catch(error => {
              console.log(error.status);
              console.error('----------------errror------------------', error);
            });
        }
      }
    } catch (error) {
      console.error('error from ', error);
    }
  };

  // render in every connection state change
  useEffect(() => {
    const removeNetInfoSubscription = NetInfo.addEventListener(state => {
      const offline = state.isConnected && state.isInternetReachable;
      console.log('hey pritam ...................', offline);
      setOnline(offline);
    });
    return () => removeNetInfoSubscription();
  }, []);

  useEffect(() => {
    if (isOnline) {
      // uploadDataToTheServer()
      deleteOneMonthOldDataToTheServer();
    }
  }, [isOnline]);

  useEffect(() => {
    const clrInterval = setInterval(() => {
      // console.warn('hey its running');
      uploadDataToTheServer();
    }, 30 * 60 * 1000);
    return () => clearInterval(clrInterval);
  }, [isOnline]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowSplash(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      {showSplash ? (
        <SplashScreen />
      ) : (
        <InternetStatusContext.Provider value={isOnline}>
          {/* <OutpassScreenTest/> */}
          <AuthProvider>
            <NavContainer />
          </AuthProvider>
        </InternetStatusContext.Provider>
      )}
    </>
  );
};

export default App;

const styles = StyleSheet.create({});
