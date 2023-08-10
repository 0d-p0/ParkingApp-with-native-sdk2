import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { address } from '../../../Router/address'
import gstSettingStorage from '../../Sql/GST_Setting_Storage/gstSettingStorage'
import { InternetStatusContext } from '../../../App'
import storeUsers from '../../Sql/User/storeuser'
import getAuthUser from '../../getAuthUser'

export default function gstSettingsController() {
    const [gstSettings, setGstSettings] = useState()
    const { storeGSTSettings, getAllGstSettings } = gstSettingStorage()
    const { getUserByToken } = storeUsers()
    const { retrieveAuthUser } = getAuthUser()
    const isOnline = useContext(InternetStatusContext)
    async function handleGetGstSettings() {
        if (isOnline) {
            await handleGetGstSettingsFromServer()
        } else {
            await handleGetGstSettingsFromStorage()
        }
    }

    async function handleGetGstSettingsFromServer() {
        if (!isOnline) {
            return
        }
        const token = await retrieveAuthUser()
        const user = await getUserByToken(token)
        try {
            const result = await axios.get(`${address.gstSettings}?subclient_id=${user.sub_client_id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            await storeGSTSettings(result.data.data[0])
            setGstSettings(result.data.data[0])
        } catch (error) {
            if (error.response) {
                // The client was given an error response (5xx, 4xx)
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                // The client never received a response, and the request was never left
            } else {
                // Anything else
            }
        }
    }


    async function handleGetGstSettingsFromStorage() {
        try {
            const result = getAllGstSettings()
            return result
        } catch (error) {
            console.error("some error ocur", error)
        }
    }
    // console.log(" ===========   ================= ",gstSettings)


    return { handleGetGstSettingsFromServer, handleGetGstSettingsFromStorage }
}
