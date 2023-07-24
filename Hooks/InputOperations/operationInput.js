import React,{useState} from 'react'

// {"created_at": "2023-05-30T13:26:38.000000Z", "dp": "abc.jpeg", "employe_name": "pritam", "employes_id": 2, "imei_no": "863019040270411", "location_id": 5, "mobile_no": "0987654321", "password": "$2y$10$5mpyCKC0BVSZH1yVk5bK6ut/X7DG0wHVxzQ1zVasxBvYvBL7EoqwS", "updated_at": "2023-05-30T13:26:38.000000Z"} 
function operationInput(props) {
     const {employe_name,employes_id,imei_no,location_id,mobile_no,password} = props
    const [input, setInput] = useState({
        operatorCode: employes_id.toString() || "",
        operatorName: employe_name|| '',
        shortName:'',
        mobileNumber:mobile_no ||'',
        password:'',
        profilePicture:'',
        location:''
      });

    

      const handleChange = (name, value) => {
        setInput({ ...input, [name]: value });
      };

      return {handleChange,input}

}

export default operationInput
