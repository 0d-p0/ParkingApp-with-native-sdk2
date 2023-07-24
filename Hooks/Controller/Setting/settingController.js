import axios from 'axios';
import React, {useContext, useEffect, useState} from 'react';
import getAuthUser from '../../getAuthUser';
import {address} from '../../../Router/address';
import settingDatabase from '../../Sql/settings/settingDatabase';
import {InternetStatusContext} from '../../../App';

const initialGeneralSettingState = {
  adv_pay: '',
  auto_archive: 0,
  dev_mod: 'D',
  max_receipt: '',
  mc_iemi_no: '',
  mc_lang: 'E',
  otp_val: 'Y',
  parking_entry_type: 'S',
  report_flag: 'Y',
  reset_recipeit_no: 'C',
  setting_id: 0,
  signIn_session: '12',
  total_collection: 'Y',
  vehicle_no: 'Y',
};
function settingController() {
  const isOnline = useContext(InternetStatusContext);
  const {retrieveAuthUser} = getAuthUser();

  const [generalSetting, setGeneralSetting] = useState(
    initialGeneralSettingState,
  );

  const {addGeneralSetting, getGeneralSettingData} = settingDatabase();

  async function getSettings() {
    const token = await retrieveAuthUser();
    
    await axios
      .get(address.getSetting, {
        headers: {Authorization: `Bearer ${token}`},
      })
      .then(res => {
        // console.log("amit ",res.data)
        setGeneralSetting(res.data.data[0]);
        addGeneralSetting(res.data.data[0])
          .then(res =>{ 
            // console.log('general settings ads',res)
          })
          .catch(error => console.error(error));
      })
      .catch(error => console.log(error.message));
  }

  useEffect(() => {
   
     // if machine is online fetch data from server
    if(isOnline){
     
      getSettings();
    }
    // if machine is offline fetch from offline storage
    if (!isOnline) {
      getGeneralSettingData()
        .then(response => {
          if (response[0]) {
            setGeneralSetting(response[0]);
          }
        })
        .catch(error => console.error(error));
    }
  }, [isOnline]);

  return {generalSetting};
}

export default settingController;

// data structure

// {"adv_pay": "", "auto_archive": 30, "created_at": "2023-05-26T18:32:01.000000Z", "dev_mod": "D", "max_receipt": 500, "mc_iemi_no": "1234567890", "mc_lang": "E", "otp_val": "Y", "parking_entry_type": "S", "report_flag": "Y", "reset_recipeit_no": "C", "setting_id": 1, "signIn_session": "12", "total_collection": "Y", "updated_at": "2023-05-26T18:32:01.000000Z", "vehicle_no": "Y"}
