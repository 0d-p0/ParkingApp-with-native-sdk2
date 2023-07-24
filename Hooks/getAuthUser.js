import React, { useEffect, useState } from 'react'
import EncryptedStorage from 'react-native-encrypted-storage';

function getAuthUser() {

    // const [user, setUser] = useState('')
    // const [loading,setLoading]=useState(true)

    async function retrieveAuthUser() {
        try {
            const session = await EncryptedStorage.getItem("auth_user");

            if (session !== undefined) {
                // Congrats! You've just retrieved your first value!
              //  console.warn(JSON.parse(session))
                const data = JSON.parse(session)

                return data?.token
            }
        } catch (error) {
            // There was an error on the native side
            console.warn("there wasn an error")
            return error
        }
    }


    useEffect(() => {
        retrieveAuthUser()
    }, [])

    return { retrieveAuthUser }
}

export default getAuthUser
