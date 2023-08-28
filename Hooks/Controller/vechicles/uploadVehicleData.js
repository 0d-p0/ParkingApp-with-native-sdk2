import React from 'react';
import VehicleInOutStore from '../../Sql/VehicleInOut/VehicleInOutStore';
import axios from 'axios';
import getAuthUser from '../../getAuthUser';
import {address} from '../../../Router/address';
import { ToastAndroid } from 'react-native';
const batchSize = 50;
function uploadVehicleData() {
  const {retrieveAuthUser} = getAuthUser();
  const {getAllInVehicles, getAllOutVehicles, updateMultipleisUploadedIn,updateMultipleisUploadedOut} =
    VehicleInOutStore();
  function delay(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  }

  async function uploadINDataBatch(batch, token) {
    await delay(1000)
    await axios
      .post(
        address.carInv2,
        {data: batch},
        {
          headers: {Authorization: `Bearer ${token}`},
        },
      )
      .then(async res => {
        console.log('in data', res.data);
        await updateMultipleisUploadedIn(res.data.dateTime);
      })
      .catch(error => {
        console.error(error);
      });
  }

  async function uploadOutDataBatch(batch, token) {
    await delay(1000)
    await axios
      .post(
        address.carOutv2,
        {data: batch},
        {
          headers: {Authorization: `Bearer ${token}`},
        },
      )
      .then(async res => {
        console.log('in data', res.data);
        await updateMultipleisUploadedOut(res.data.outDateTime);
      })
      .catch(error => {
        console.error(error);
      });
  }

  async function uploadAllVehiclesData() {
    const token = await retrieveAuthUser();
    const allVehiclesIndata = await getAllInVehicles();
    const allVehiclesOutdata = await getAllOutVehicles();

     if(allVehiclesIndata.length == 0 && allVehiclesOutdata.length == 0){
        ToastAndroid.showWithGravityAndOffset(
            'already syn',
            ToastAndroid.LONG,
            ToastAndroid.CENTER,
            25,
            50,
          );
        return
     }

     console.log("oikk", allVehiclesOutdata.length);
    for (let i = 0; i < allVehiclesIndata.length; i += batchSize) {
      console.log('---------------------------i', i, '   in data');
      const batch = allVehiclesIndata.slice(i, i + batchSize);
      await uploadINDataBatch(batch, token);
    }

    for (let i = 0; i < allVehiclesOutdata.length; i += batchSize) {
      console.log('---------------------------i', i, '   out data');
      const batch = allVehiclesOutdata.slice(i, i + batchSize);
      await uploadOutDataBatch(batch, token);
    }
  }

  return {uploadAllVehiclesData};
}

export default uploadVehicleData;
