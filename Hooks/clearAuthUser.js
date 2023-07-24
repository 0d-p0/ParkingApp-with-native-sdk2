import React from 'react'
import EncryptedStorage from 'react-native-encrypted-storage';

function clearAuthUser() {
    async function removeAuthUser() {
        try {
            await EncryptedStorage.removeItem("auth_user");
            // Congrats! You've just removed your first value!
            console.warn("auth user clear succesfully")
        } catch (error) {
            // There was an error on the native side
            console.warn("error while clear auth data")
        }
    }


  return {removeAuthUser}
}

export default clearAuthUser
