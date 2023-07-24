import { useEffect, useState } from 'react'
import { address } from '../../../Router/address'
import getAuthUser from '../../getAuthUser';
import axios from 'axios';
import shiftDatabase from '../../Sql/shiftManagement/shiftDatabase';

function shiftController() {
    const { retrieveAuthUser } = getAuthUser()
    const {storeShiftData,getShiftData } = shiftDatabase()
    const [shiftData, setShiftData] = useState()
    const fetchShift = async () => {
        const token = await retrieveAuthUser();
        await axios.get(address.shiftList, {
            headers: { Authorization: `Bearer ${token}` },
        }).then(response => {
            const data = response.data.data
            setShiftData(data)
            storeShiftData(data)
          
        }).catch(error => {
            console.error(error.message)
        })
    }

    useEffect(() => {
        getShiftData((res)=>setShiftData(res)).catch(err=>console.error(err))
        fetchShift()
    }, [])

    return {shiftData}
}

export default shiftController
