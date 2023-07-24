import React,{useState} from 'react'

function InputHelper() {
    const [input, setInput] = useState({
        name: '',
        password: '',
        rePassword:'',
        mobile:'',
        email:'',
        businessName:'',
        businessAddress:'',
        agree:false
      });

    
      const handleChange = (name, value) => {
        setInput({ ...input, [name]: value });
      };


      function ssd (){
        console.log(input)
      }
  return {handleChange,input,ssd}
}

export default InputHelper
