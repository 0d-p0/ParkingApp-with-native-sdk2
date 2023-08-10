import axios from 'axios'
import { address } from '../../../Router/address'
import getAuthUser from '../../getAuthUser'
import storeUsers from '../../Sql/User/storeuser'
import { useContext } from 'react'
import { InternetStatusContext } from '../../../App'
import { ToastAndroid } from 'react-native'

function changePasswordController() {
  const { retrieveAuthUser } = getAuthUser()
  const { updateUserDetails } = storeUsers()

  const online = useContext(InternetStatusContext)

  const handleChangePassword = async (id, name, newPassword) => {
    console.log("id, name, newPassword", id, name, newPassword)

    if (!online) {
      alert("you are offline you can`t change your password now")
      return
    }

    const token = await retrieveAuthUser()
    console.log(id, name, newPassword, token)
    try {
      const response = await axios.post(address.changePassWord, { user_id: id, name, password: newPassword }, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = response.data.data
      // console.log(data)
      updateUserDetails(data.user_id, data.password, data.stPassword).then(response => 
        ToastAndroid.showWithGravity(
        response,
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      )).catch(error => alert(error))
      // .then(response=>{
      //     const data = response.data.data
      //     // console.log(data)
      //     updateUserDetails(data.user_id,data.password,data.stPassword).then(response=> ToastAndroid.showWithGravity(
      //         response,
      //         ToastAndroid.SHORT,
      //         ToastAndroid.CENTER,
      //       )).catch(error=>alert(error))
      // }).catch(err=>
      //     ToastAndroid.showWithGravity(
      //         err.message,
      //         ToastAndroid.SHORT,
      //         ToastAndroid.CENTER,
      //       )
      //     )
    } catch (error) {
      console.log(error.response.data);
      ToastAndroid.showWithGravity(
        error.response.data.password[0],
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      )
      console.log(error.response.status);
      console.log(error.response.headers);
    }
  }

  return { handleChangePassword }
}

export default changePasswordController
