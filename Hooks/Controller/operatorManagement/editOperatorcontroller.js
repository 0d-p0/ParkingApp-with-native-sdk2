import axios from 'axios'
import React from 'react'
import { address } from '../../../Router/address'
import getAuthUser from '../../getAuthUser'
import operatorDatabase from '../../Sql/opratorManagements/operatorDatabase'

function editOperatorcontroller() {
    const { retrieveAuthUser } = getAuthUser()
    const {updateOperatorDetails}=operatorDatabase()
    async function handleEditOperator(employes_id, name, mobileno, location_id) {
        const token = await retrieveAuthUser()
        await axios.post(address.employeeEdit, {employes_id, name, mobileno, location_id}, { headers: { Authorization: `Bearer ${token}` } }).then((res) => {
            const data = res.data.data
            // update operator table
            updateOperatorDetails(employes_id,data.employe_name,data.mobile_no,data.location_id).then((res)=>alert(res)).catch(error=>alert(error))
        }).catch(err => console.error(err))
    }
    return {handleEditOperator}
}
export default editOperatorcontroller
