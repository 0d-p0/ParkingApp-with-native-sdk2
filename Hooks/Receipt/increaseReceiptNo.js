import EncryptedStorage from 'react-native-encrypted-storage';

async function increaseReceiptNo(receiptNo) {
        try {
            await EncryptedStorage.setItem(
                "receipt_number",
                JSON.stringify({
                   receiptNo:receiptNo+1
                })
            );
          
            console.warn('increase Receipt No')
        } catch (error) {
            // There was an error on the native side
            // console.warn('there was an error')

        }
    

  return null
}

export default increaseReceiptNo
