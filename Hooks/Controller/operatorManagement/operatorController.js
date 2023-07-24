import { useEffect, useState,useContext } from 'react'
import { address } from '../../../Router/address'
import getAuthUser from '../../getAuthUser';
import axios from 'axios';
import operatorDatabase from '../../Sql/opratorManagements/operatorDatabase';
import { InternetStatusContext } from '../../../App';

function getOperator() {
  const { retrieveAuthUser } = getAuthUser()
  const {storeOperatorData,getStoreOperatorData} = operatorDatabase()
  const [operatorData,setOperatorData]=useState()
  const online = useContext(InternetStatusContext)

  const fetchOperators = async () => {
    const token = await retrieveAuthUser();
    await axios.get(address.employees, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(response => {
      const data = response.data.data
      console.log(data)
      setOperatorData(data)
      storeOperatorData(data)
      //  console.log(data)
    }).catch(error => {
      console.error(error.message)
    })
  }

  useEffect(() => {
    // !online = offline
   
    if(!online){
      getStoreOperatorData().then(res=>{
        console.log("offline op data",)
        setOperatorData(res)
      }).catch((err)=>console.error(err))
    }
    
    if(online){
      console.log("fetch")
      fetchOperators()
    }

   
  }, [])


  return {operatorData}
}

export default getOperator
