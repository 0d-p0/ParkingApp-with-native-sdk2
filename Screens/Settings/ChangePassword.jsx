import { PixelRatio, StyleSheet, Text, View, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import CustomHeader from '../../component/CustomHeader';
import allColor from '../../Resources/Colors/Color';
import strings from '../../Resources/Strings/strings';
import icons from '../../Resources/Icons/icons';
import InputComponent from '../../component/InputComponent';
import CustomButtonComponent from '../../component/CustomButtonComponent';

import estyles from '../../Styles/styles';
import getAuthUser from '../../Hooks/getAuthUser';
import storeUsers from '../../Hooks/Sql/User/storeuser';
import changePasswordController from '../../Hooks/Controller/User/changePasswordController';

const ChangePassword = ({ navigation }) => {
  // hook help us to retrive  the token
  const { retrieveAuthUser } = getAuthUser();
  // helper to retrive user details
  const { getUserByToken } = storeUsers();
  // this hook handle change password 
  const { handleChangePassword } = changePasswordController();
  // state to store user details
  const [userDetails, setUserDetails] = useState();
  // state to store  password
  const [password, changePassword] = useState('');
  // state to store Confirm password
  const [confirmPassword, chaneConfirmPassword] = useState('');


  // {"allow_flag": "Y", "client_id": null, "client_type_flag": "O", "created_at": "2023-06-24T12:10:00.000000Z", "email_verified_at": null, "id": 1, "imei_no": "2", "location_id": "1", "mc_sl_no": null, "name": "Pritam", "otp": 0, "otp_status": "A", "password": "$2y$10$EuE3aplbLuLDZFFX2mbQaej4ngBoEtPXqdJH3nuhJiWyDCg1ZmxyW", "purchase_date": null, "registration_flag": null, "remember_token": null, "role": "U", "short_name": "Pt", "stPassword": "Abc@1234", "sub_client_id": "1", "token": "84|Qh7dkbb6KSsEdC4Uv2sWv8RdDZmYplIIoSSb2zBm", "updated_at": "2023-06-24T12:10:00.000000Z", "user_id": "8318930255"}

  // Run onces
  useEffect(() => {
    // retriveAuthUser which return a token
    retrieveAuthUser()
      .then(token => {
        // Get the user details
        getUserByToken(token)
          // set user details to userDetails State
          .then(res => setUserDetails(res))
          .catch(err => console.error(err));
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <>
      {/* Render Heade */}
      <CustomHeader title={'Change Password'} navigation={navigation} />
      <View style={styles.container}>
        <ScrollView>
          {/* user Details */}
          <View style={styles.userDetils_container}>
            {/* user name */}
            <Text style={styles.user_name}> Hello, {userDetails?.name} </Text>
            {/* comapny Name */}
            <Text style={styles.comapny_name}> {strings.company_name} </Text>
            {/* Divider */}
            <View style={styles.divider} />
            {/* email  */}
            {/* <View style={{flexDirection: 'row'}}>
              {icons.email}
              <Text style={{marginLeft: 10}}>{'email@email.com'}</Text>
            </View> */}
            {/* phone */}
            <View style={{ flexDirection: 'row' }}>
              {icons.phone}
              <Text style={{ marginLeft: 10 }}>{userDetails?.user_id}</Text>
            </View>
          </View>
          {/* Change Password */}
          <View>
            <View
              style={{
                alignItems: 'center',
                marginVertical: PixelRatio.roundToNearestPixel(10),
              }}>
              {/* icon */}
              {icons.forgot}

              {/* change password Text */}

              <Text style={styles.change_password_text}>
                {strings.change_password}
              </Text>
              {/* Divider */}
              <View style={styles.divider_Two} />
            </View>

            <View>
              {/* new  password feild */}

              {/* re-type Password feild */}

              {/* Action Button */}

              <View style={[estyles.login_container, estyles.login_container]}>
                <InputComponent
                  icon={icons.unlock}
                  placeholder={'Password'}
                  value={password}
                  onChangeText={changePassword}
                  keyboardType={'default'}
                  secureTextEntry={true}
                />
                <InputComponent
                  icon={icons.unlock}
                  placeholder={'re-type  Password'}
                  value={confirmPassword}
                  onChangeText={chaneConfirmPassword}
                  keyboardType={'default'}
                  secureTextEntry={true}
                />

                {/* password actions */}
                <View style={estyles.password_action_container}>
                  {/* reset action button */}
                  <CustomButtonComponent.CancelButton
                    title={'Reset'}
                    onAction={() => {
                      changePassword('');
                      chaneConfirmPassword('');
                    }}
                    style={{
                      flex: 1,
                      marginRight: PixelRatio.roundToNearestPixel(8),
                    }}
                  />

                  {/* change password action button */}

                  <CustomButtonComponent.GoButton
                    title={'change Password'}
                    onAction={() =>
                      (password && confirmPassword) ? (
                        password == confirmPassword
                          ? handleChangePassword(
                            userDetails.user_id,
                            userDetails.name,
                            password,
                          ).then(() => {
                            changePassword('')
                            chaneConfirmPassword('')
                          })
                          : alert('password does not match ')) : alert('please enter  password')
                    }
                  />
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </>
  );
};

export default ChangePassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: PixelRatio.roundToNearestPixel(10),
  },
  userDetils_container: {
    borderRadius: PixelRatio.roundToNearestPixel(10),
    padding: PixelRatio.roundToNearestPixel(10),
    backgroundColor: allColor.white,
    borderWidth: PixelRatio.roundToNearestPixel(0.2),
    borderColor: allColor['light-gray'],
    elevation: PixelRatio.roundToNearestPixel(1),
  },

  divider: {
    width: '100%',
    borderWidth: 0.5,
    borderColor: allColor.gray,
    marginVertical: PixelRatio.roundToNearestPixel(10),
  },
  divider_Two: {
    marginTop: PixelRatio.roundToNearestPixel(20),
    alignSelf: 'center',
    backgroundColor: '#18a2ba',
    width: PixelRatio.roundToNearestPixel(60),
    height: PixelRatio.roundToNearestPixel(2),
  },
  change_password_text: {
    fontSize: PixelRatio.roundToNearestPixel(20),
    color: allColor['black'],
    fontWeight: 'bold',
    marginTop: PixelRatio.roundToNearestPixel(10),
  },
});
