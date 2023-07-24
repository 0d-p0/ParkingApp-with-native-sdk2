import React from 'react'
import EncryptedStorage from 'react-native-encrypted-storage';

function setAuthUser() {
    async function storeUser(token) {
        try {
            await EncryptedStorage.setItem(
                "auth_user",
                JSON.stringify({
                   token
                })
            );
    
            // Congrats! You've just stored your first value!
            console.warn('You are Logged in succesfully')
        } catch (error) {
            // There was an error on the native side
            console.warn('there was an error')

        }
    }
  return {storeUser}
}

export default setAuthUser
