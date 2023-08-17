import getAuthUser from '../../getAuthUser'
import axios from 'axios'
import { address } from '../../../Router/address'
import { useEffect, useState } from 'react'
import storeVechicles from '../../Sql/vechicles/storeVechicles'
import vehicleRatesStorage from '../../Sql/vechicles/vehicleRatesStorage'
import vehicleINOUTController from '../receipt/vehicleINOUTController'
import UserDetails from '../../../Screens/Settings/UserDetails'
import storeUsers from '../../Sql/User/storeuser'

function getVechicles(setVechicles) {
    const { retrieveAuthUser } = getAuthUser()

    const { storeVechiclesData, getVechiclesData } = storeVechicles()

    const { getUserByToken } = storeUsers();

    const getAllVechicles = async () => {
        const token = await retrieveAuthUser();
        const user = await getUserByToken(token)


        const vechiclesData = await getVechiclesData()
        await axios.get(address.vehicle, {
            params: {
                client_id: user.client_id
            },
            headers: { Authorization: `Bearer ${token}` },
        }).then(response => {
            // console.log(response.data.data)
            // console.log(" response okk ",response.data.data)
            storeVechiclesData(response.data.data)
            setVechicles(response.data.data)
            //  getAllVehicleRateAndStore(response.data.data,token)
        }).catch(error => console.error(error))



        // if(vechiclesData.length != 0){
        //    await getAllVehicleRateAndStore(vechiclesData,token)
        // }

    }

    useEffect(() => {
        getAllVechicles()

    }, [])
    return { getVechiclesData }
}

export default getVechicles
