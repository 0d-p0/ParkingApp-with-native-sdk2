import React, { useContext, useEffect } from 'react';
import getAuthUser from '../../getAuthUser';
import { InternetStatusContext } from '../../../App';
import { address } from '../../../Router/address';
import axios from 'axios';
import receiptDataBase from '../../Sql/receipt/receiptDataBase';

function vehicleINOUTController() {
  const online = useContext(InternetStatusContext);

  const { retrieveAuthUser } = getAuthUser();
  const { addOutpassEntry } = receiptDataBase();
  // GET vehicle BY ID
  // not using 
  const getVihicleRatebyID = async (id, token) => {

    if (!online) {
      return;
    }

    const headersList = {
      Authorization: `Bearer ${token}`,
    };
    const response = await axios.get(`${address.rate}?vehicle_id=${id}`, {
      headers: headersList,
    });

    const data = response.data.data[0];
    return data;
  };

  // VEHICLE IN
  const handleVehicleIn = async data => {
    const token = await retrieveAuthUser();
    if (!token) {
      return {
        success: false,
        message: 'please login first',
      };
    }

    if (!online) {
      return {
        success: false,
        message: 'data store in offline there is no internet connection',
      };
    }

    const result = await axios
      .post(
        address.carIn,
        { data: data },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
    // .then(res =>console.log(res.data))
    // .catch(err => alert(err));

    return result 
  };


  // VEHICLE OUT
  const handleVehicleout = async data => {
    console.log("amamr datra ", data)
    const token = await retrieveAuthUser();
    if (!token) {
      return {
        status: false,
        message: 'please login first',
      };
    }
    if (!online) {
      return {
        status: false,
        message: 'data store in offline there is no internet connection',
      };
    }

    const result = await axios.post(
      address.carOut,
      {
        data: data,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    return result;
    // .then(res => {
    //   alert(JSON.stringify(res.data))})
    // .catch(async err => {
    //   await addOutpassEntry(data)
    //   alert(err)
    // });
  };

  return { handleVehicleIn, getVihicleRatebyID, handleVehicleout };
}

export default vehicleINOUTController;
