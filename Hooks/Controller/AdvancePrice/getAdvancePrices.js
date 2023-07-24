import axios from 'axios';
import React from 'react'
import { address } from '../../../Router/address';
import advancePriceStorage from '../../Sql/AdvancePricesStorage/advancePriceStorage';

function getAdvancePrices() {
     const {storeAdvancePrices,deleteAllAdvancePrices}=advancePriceStorage()
    // GET ALL VEHICLES RATES FROM ONLINE SERVERS
    const handleGetAllAdvancePrices = async (token, sub_client_id) => {

        const headersList = {
            Authorization: `Bearer ${token}`,
        };
        const response = await axios.get(`${address.advance}?sub_client=${sub_client_id}`, {
            headers: headersList,
        });

        if (response.status == 200) {
            await deleteAllAdvancePrices()
            await handleStoreVehiclesRates(response.data.data)
        }
    }

    // STORE PRICE DATA ONE BY ONE FROM ARRAY WHICH WE GOT FROM SERVER RESPONSE
    const handleStoreVehiclesRates = async (array) => {
        array.forEach(async element => {
            await storeAdvancePrices(element).then(res => {
                // console.log("vehicles Rates are successfully stored")
                }).catch(error => console.error("while storing vehicle prices occur an error", error))
        });
    }
  return {handleGetAllAdvancePrices}
}

export default getAdvancePrices
