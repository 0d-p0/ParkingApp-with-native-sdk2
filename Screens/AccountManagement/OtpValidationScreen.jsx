import { Alert, KeyboardAvoidingView, Pressable, ScrollView, Text, View } from 'react-native'
import React, { useState } from 'react'
import MainView from '../../component/MainView'
import HeaderLogoComponent from '../../component/HeaderLogoComponent'
import icons from '../../Resources/Icons/icons'

import styles from '../../Styles/styles'
import strings from '../../Resources/Strings/strings'
import InputComponent from '../../component/InputComponent'
import CustomButtonComponent from '../../component/CustomButtonComponent'
import allColor from '../../Resources/Colors/Color'

const OtpValidationScreen = () => {
    const [otp, setOtp] = useState('')
    return (
        <MainView>
            <ScrollView>
                {/* .... comapany logo */}

                <HeaderLogoComponent />

                {/* Done Logo */}
                <View style={styles.done_logo}>
                    {icons.done}
                </View>
                {/* succesfull register quote */}
                <View>
                    <Text style={[styles.grettingText, styles.helper_text]}>
                        {strings.you_have_registered}
                    </Text>
                    <Text style={[styles.company_name, styles.grettingText]}>
                        {strings.successfully}
                    </Text>
                </View>

                {/* ....... divider........*/}
                <View style={styles.divider} />

                {/* how to set otp text */}
                <Text style={styles.type_otp_helper_text}>
                    {strings.please_type_otp}
                </Text>


                {/* otp validate container */}
                <View style={styles.login_container}>
                    {/* otp type input text */}
                    <InputComponent
                        placeholder={"Type the OTP"}
                        onChangeText={setOtp}
                        value={otp}
                        keyboardType={"numeric"}
                    />

                    {/* resend button */}
                    <Pressable style={styles.resend_button} onPress={()=>Alert.alert("new otp is sending")} >
                        {icons.resend}
                        <Text>
                            Resend
                        </Text>
                    </Pressable>
                    {/* validate button */}
                    <CustomButtonComponent.GoButton title={"Validate"} onAction={() => Alert.alert("otp success")} />
                </View>

                {/* Skip button */}
                {/* <Pressable style={styles.skip_button}>
                <Text style={{fontSize:20,fontWeight:"900",color:allColor['light-gray']}}>
                    Skip
                </Text>
                {icons.arrowRight}
              </Pressable> */}

            </ScrollView>
        </MainView>
    )
}

export default OtpValidationScreen

