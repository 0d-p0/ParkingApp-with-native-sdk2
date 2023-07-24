import { useState } from 'react'

function settingInputHelper() {
    const [input, setInput] = useState({
        language: '',
        deviceMode: '',
        reports: false,
        otpValidation: false,
        signInSessionDuration: '',
        mandotaryVehicleNumber: false,
        advancedPayment: false,
        total_collection: false,
        advanceAmount: '',
        autoAchiveData: '',
        maximumReceipt: '',
        resetReceiptNo: '',
        freeMins: ''
    });

    // {"adv_pay": "N", "auto_archive": 30, 
    // "created_at": "2023-05-26T13:02:01.000000Z", 
    // "dev_mod": "D",
    //  "max_receipt": 500,
    //   "mc_iemi_no": "1234567890",
    //    "mc_lang": "E",
    //     "otp_val": "Y", 
    //     "parking_entry_type": "S", 
    //     "report_flag": "Y", 
    //     "reset_recipeit_no": "C",
    //      "setting_id": 1,
    //       "signIn_session": "12", 
    //       "total_collection": "Y", 
    //       "updated_at": "2023-05-26T13:02:01.000000Z",
    //        "vehicle_no": "Y"}

    const addInitialData = (setting_id, mc_iemi_no, mc_lang, dev_mod, report_flag,
        otp_val, signIn_session, max_receipt, total_collection, vehicle_no,
        adv_pay, auto_archive, reset_recipeit_no, parking_entry_type,
        created_at, updated_at) => {
            console.log(max_receipt)
        setInput({
            language: mc_lang,
            deviceMode: dev_mod,
            reports: report_flag == "Y" ? true : false,
            otpValidation: otp_val == "Y" ? true : false,
            signInSessionDuration: signIn_session,
            mandotaryVehicleNumber: vehicle_no == "Y" ? true : false,
            advancedPayment: adv_pay == "Y" ? true : false,
            total_collection: total_collection == "Y" ? true : false,
            advanceAmount: '',
            autoAchiveData: auto_archive,
            maximumReceipt: max_receipt.toString(),
            resetReceiptNo: reset_recipeit_no,
            freeMins: ''
        })
    }

    const handleChange = (name, value) => {
        setInput({ ...input, [name]: value });
    };


    return { handleChange, input,addInitialData }

}

export default settingInputHelper
