import React from 'react'
import EncryptedStorage from 'react-native-encrypted-storage';

async function isResetReceiptNo() {
    try {
        const session = await EncryptedStorage.getItem("is_reset_receipt_number");
        if (session !== undefined) {
            // Congrats! You've just retrieved your first value!
            //  console.warn(JSON.parse(session))
            const data = JSON.parse(session)
            // if (data == null) {
            //     return { is_reset_receipt_number: data?.is_reset_receipt_number || false, time: null }
            // }
             return { is_reset_receipt_number: data?.is_reset_receipt_number, time: data.time || null}
        }
    } catch (error) {
        // There was an error on the native side
        console.warn("there wasn an error")
        return error
    }
    return null
}


async function changeResetReceiptNo(is_reset_receipt_number,time) {

    try {
        await EncryptedStorage.setItem(
            "is_reset_receipt_number",
            JSON.stringify({
                is_reset_receipt_number: is_reset_receipt_number,
                time: time
            })
        );

        console.warn('is_reset_receipt_number change')
    } catch (error) {
        // There was an error on the native side
        console.warn('there was an error')

    }


    return null
}

export { isResetReceiptNo, changeResetReceiptNo }
