import { SafeAreaView, StyleSheet, Text, View, Image, ScrollView } from 'react-native'
import React, { useState } from 'react'

import logo from "../../Resources/Logo/logo.png"
import InputComponent from '../../component/InputComponent'
import ContactComponent from '../../component/ContactComponent'

import styles from '../../Styles/styles.js'
import icons from '../../Resources/Icons/icons'
import strings from '../../Resources/Strings/strings'
import CustomButtonComponent from '../../component/CustomButtonComponent'
import MainView from '../../component/MainView'
import normalize from 'react-native-normalize'

const ForgotPassword = () => {

    const [mobileNumber, changeMobileNumber] = useState('')
    const [password, changePassword] = useState('')
    const [confirmPassword, chaneConfirmPassword] = useState('')


    return (
        <MainView>
            <ScrollView>    
            {/* company Logo */}
            <Image
                source={logo}
                style={styles.logo}
            />

            {/* forgot password logo and text */}
            <View style={styles.forgot_header_container}>

                {icons.forgot}


                <Text style={styles.forgot_password_head_text}>
                    {strings.forgot_password}
                </Text>
            </View>

            {/* ...... divider ....... */}
            <View style={styles.divider} />

            {/* ....... helper text */}
            <Text style={[styles.grettingText, styles.helper_text]}>
                {strings.reset_password_helper_text}
            </Text>
            {/* ...... forgot password container ....... */}
            <View style={[styles.login_container, styles.login_container]}>
                <InputComponent
                    icon={icons.phone}
                    placeholder={"Mobile Number"}
                    value={mobileNumber}
                    onChangeText={changeMobileNumber}
                    keyboardType={'numeric'}
                />
                <InputComponent
                    icon={icons.unlock}
                    placeholder={"Password"}
                    value={password}
                    onChangeText={changePassword}
                    keyboardType={'default'}
                />
                <InputComponent
                    icon={icons.unlock}
                    placeholder={"re-type  Password"}
                    value={confirmPassword}
                    onChangeText={chaneConfirmPassword}
                    keyboardType={'default'}
                />


                {/* password actions */}
                <View style={styles.password_action_container}>

                    {/* reset action button */}
                    <CustomButtonComponent.CancelButton title={"Reset"} onAction={() => alert("reset")}
                       style={{flex:1,marginRight:normalize(8)}}
                    />

                    {/* change password action button */}

                    <CustomButtonComponent.GoButton title={"change Password"} onAction={() => alert("password changed")}/>
                </View>
            </View>

            {/* ....... contact us details ........ */}

            <ContactComponent />

</ScrollView>
        </MainView>
    )
}

export default ForgotPassword

