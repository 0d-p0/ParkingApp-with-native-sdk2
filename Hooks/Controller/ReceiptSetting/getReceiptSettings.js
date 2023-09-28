import React, { useContext, useEffect, useState } from 'react'
import { InternetStatusContext } from '../../../App'
import ReceiptSettingStorage from '../../Sql/Receipt Setting Storage/ReceiptSettingStorage'
import axios from 'axios'
import { address } from '../../../Router/address'
import getAuthUser from '../../getAuthUser'

function getReceiptSettings() {
    const isOnline = useContext(InternetStatusContext)
    const { addNewReceiptSetting, getAllReceiptSetting, } = ReceiptSettingStorage()
    const { retrieveAuthUser } = getAuthUser()
    const [receiptSettings, setReceiptSettings] = useState("hello")

    const handleGetReceiptSettings = async () => {
        const token = await retrieveAuthUser()
        if (isOnline) {
            await HandleGetDataFromOnline(token)
        }
        if (!isOnline) {
            getAllReceiptSetting().then(res => {
                // console.log("offline receipt settings ", res)
                setReceiptSettings(res[0])
            }).catch(error => {
                console.error(error)
            })
        }
    }

    async function HandleGetDataFromOnline(token) {
        await axios.get(address.receiptSettings, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }).then(async res => {
            // console.log("from receipt settings  ", res.data.data)
            // setReceiptSettings(res.data.data[0])
            const { header1, header2, header3, header4, footer1, footer2, footer3, footer4, header1_flag, header2_flag, header3_flag, header4_flag, footer1_flag, footer2_flag, footer3_flag, footer4_flag, image_flag } = res.data.data[0] || {}
            console.log(res.data.data[0])
            addNewReceiptSetting(header1, header2, header3, header4, footer1, footer2, footer3, footer4, header1_flag, header2_flag, header3_flag, header4_flag, footer1_flag, footer2_flag, footer3_flag, footer4_flag, image_flag).then((res) => {
                console.log(res)
                getAllReceiptSetting().then(res => {
                    // console.log("offline receipt settings ", res)
                    setReceiptSettings(res[0])
                }).catch(error => {
                    console.error(error)
                })
            }).catch(error => console.log(error))
        }).catch(error => {
            if (error.message == "Request failed with status code 500") { }
            console.error("errror issssss from receipt settings ", error)
            console.log(error.respons);
            console.log(error.response);
            console.log(error.response);
        })
    }

    useEffect(() => {
        handleGetReceiptSettings()
    }, [])
    return { receiptSettings }
}

export default getReceiptSettings
