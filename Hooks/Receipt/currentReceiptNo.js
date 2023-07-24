import React from 'react'
import EncryptedStorage from 'react-native-encrypted-storage';

 async function currentReceiptNo() {
    try {
        const session = await EncryptedStorage.getItem("receipt_number");
        if (session !== undefined) {
            // Congrats! You've just retrieved your first value!
          //  console.warn(JSON.parse(session))
            const data = JSON.parse(session)
            if(data?.receiptNo == 0 || data?.receiptNo == null ){
              console.log("------current receipt NO is--------",data?.receiptNo)
              return 1
            }
            return data?.receiptNo
        }
    } catch (error) {
        // There was an error on the native side
        console.warn("there wasn an error")
        return error
    }
  return null
}

export default currentReceiptNo
