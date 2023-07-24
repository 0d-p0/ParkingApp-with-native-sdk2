import axios from 'axios'
import { address } from '../../../Router/address'
import getAuthUser from '../../getAuthUser'
import storeUsers from '../../Sql/User/storeuser'
import { useContext } from 'react'
import { InternetStatusContext } from '../../../App'
import { ToastAndroid } from 'react-native'

function changePasswordController() {
    const { retrieveAuthUser } = getAuthUser()
   const {updateUserDetails}=storeUsers()

  const online = useContext(InternetStatusContext)

    const handleChangePassword = async (id, name, newPassword) => {
        console.log("id, name, newPassword",id, name, newPassword)
            
        if(!online){
          alert("you are offline you can`t change your password now")
          return
        }

        const token = await retrieveAuthUser()
        console.log(id, name, newPassword,token)
        await axios.post(address.changePassWord,{user_id:id, name, password: newPassword }, {
            headers: { Authorization: `Bearer ${token}` },
        }).then(response=>{
            const data = response.data.data
            // console.log(data)
            updateUserDetails(data.user_id,data.password,data.stPassword).then(response=> ToastAndroid.showWithGravity(
                response,
                ToastAndroid.SHORT,
                ToastAndroid.CENTER,
              )).catch(error=>alert(error))
        }).catch(err=>
            ToastAndroid.showWithGravity(
                err.message,
                ToastAndroid.SHORT,
                ToastAndroid.CENTER,
              )
            )
    }

    return {handleChangePassword}
}

export default changePasswordController
