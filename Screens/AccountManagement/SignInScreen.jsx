import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';

import InputComponent from '../../component/InputComponent';
import ContactComponent from '../../component/ContactComponent';
import icons from '../../Resources/Icons/icons';
import strings from '../../Resources/Strings/strings';

import styles from '../../Styles/styles';
import MainView from '../../component/MainView';
import HeaderLogoComponent from '../../component/HeaderLogoComponent';

import { AuthContext } from '../../Auth/AuthProvider';
import DeviceInfo from 'react-native-device-info';

const SignInScreen = ({ navigation }) => {
  const [text, onChangeText] = useState('');
  const [password, onChangePassword] = useState('');
  const [deviceId, SetDeviceId] = useState('')
  const { login } = useContext(AuthContext);

  console.log(text, password);


  useEffect(()=>{
   const deviceId = DeviceInfo.getUniqueIdSync()
   SetDeviceId(deviceId)
  },[])

  // const {createUser}=getDBconnection()
  // createUser ("pritam",'123')
  return (
    <MainView>
      <ScrollView keyboardShouldPersistTaps={'handled'}>
        <HeaderLogoComponent />


        {/* .............gretting msg............... */}
        <Text style={styles.grettingText}>WELCOME TO</Text>

        {/* .......comapny name ........... */}
        <Text style={[styles.company_name, styles.grettingText]}>
          {strings.app_name}
        </Text>

        {/* ...... divider ....... */}
        <View style={styles.divider} />

        {/* ....... helper text */}
        <Text style={[styles.grettingText, styles.helper_text]}>
          {strings.helper_text}
        </Text>

        <Text style={{...styles.grettingText,...styles.helper_text,fontSize:20,fontWeight:'600'}}>
          Your Device ID is : { deviceId}
        </Text>
        {/* ...... login container ....... */}
        <View style={[styles.login_container, styles.login_container]}>
          <InputComponent
            icon={icons.phone}
            placeholder={'Mobile Number'}
            value={text}
            onChangeText={onChangeText}
            keyboardType={'default'}
          />
          <InputComponent
            icon={icons.unlock}
            placeholder={'Password'}
            value={password}
            onChangeText={onChangePassword}
            keyboardType={'default'}
            secureTextEntry={true}
          />
          {/* { showImeiInput && */}
          {/* <InputComponent
                        // icon={icons.alertIcon}
                        placeholder={"enter imei number manually"}
                        value={imei}
                        onChangeText={setImei}
                        keyboardType={'default'}
                    /> */}
          {/* // } */}
          {/* <Pressable onPress={() => navigation.navigate('forgot_password')}>
                        <Text style={styles.forgot_password_text}>
                            Forgot password?
                        </Text>
                    </Pressable> */}

          {/* ........ sign in button ....... */}
          <TouchableOpacity
            style={styles.sign_in_button}
            onPress={() => {
              // storeUser()
              login(text, password);
            }}>
            {icons.arrowRight}
          </TouchableOpacity>
          {/* ... not regiter text */}
          {/* <Text style={styles.not_register_text}>
                        {strings.not_register_yet}
                    </Text> */}

          {/* navigate to sign up screen */}

          {/* <TouchableOpacity onPress={() => navigation.navigate('sign_up')} >
                        <Text style={styles.sign_up}>
                            {strings.sign_up_here}
                        </Text>
                    </TouchableOpacity> */}
        </View>

        {/* ....... contact us details ........ */}

        <ContactComponent />
      </ScrollView>
    </MainView>
  );
};

export default SignInScreen;
