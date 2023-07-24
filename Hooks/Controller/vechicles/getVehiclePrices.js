import React from 'react'
import getAuthUser from '../../getAuthUser'
import storeUsers from '../../Sql/User/storeuser'
import axios from 'axios'
import { address } from '../../../Router/address'
import vehicleRatesStorage from '../../Sql/vechicles/vehicleRatesStorage'

function getVehiclePrices() {
    const { storeVechiclesRates, deleteAllVehicleRates } = vehicleRatesStorage()
    // GET ALL VEHICLES RATES FROM ONLINE SERVERS
    const handleGetAllVehiclesRates = async (token, sub_client_id) => {

        const headersList = {
            Authorization: `Bearer ${token}`,
        };
        const response = await axios.get(`${address.rate}?sub_client_id=${sub_client_id}`, {
            headers: headersList,
        });


        if (response.status == 200) {
            await deleteAllVehicleRates()
            await handleStoreVehiclesRates(response.data.data)
        }
    }

    // STORE PRICE DATA ONE BY ONE FROM ARRAY WHICH WE GOT FROM SERVER RESPONSE
    const handleStoreVehiclesRates = async (array) => {
        array.forEach(async element => {
            await storeVechiclesRates(element).then(res => {
                // console.log("vehicles Rates are successfully stored")
                }).catch(error => console.error("while storing vehicle prices occur an error", error))
        });
    }


    return { handleGetAllVehiclesRates }
}

export default getVehiclePrices
