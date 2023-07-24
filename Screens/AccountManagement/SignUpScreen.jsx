import { SafeAreaView, Text, View, Image, TouchableOpacity, ScrollView, PixelRatio } from 'react-native'
import React, { useContext, useState } from 'react'
import LinearGradient from 'react-native-linear-gradient'
import CheckBox from '@react-native-community/checkbox';
import logo from '../../Resources/Logo/logo.png'

import InputComponent from '../../component/InputComponent';

import icons from '../../Resources/Icons/icons';
import strings from '../../Resources/Strings/strings';

import styles from '../../Styles/styles';
import normalize from 'react-native-normalize';
import MainView from '../../component/MainView';
import InputHelper from '../../Hooks/InputOperations/InputHelper';
import { AuthContext } from '../../Auth/AuthProvider';


const SignUpScreen = ({ navigation }) => {
    const [text, onChangeText] = useState('');
    const [password, onChangePassword] = useState('');
    const [isSelected, setSelection] = useState(false);
    const { handleChange, input, ssd } = InputHelper()
    const {signUp} = useContext(AuthContext)
    const handleSignUp = () => {
        const { name,
            password,
            rePassword,
            mobile,
            email,
            businessName,
            businessAddress,
            agree } = input

            if(!name || !password || !rePassword || !mobile || !email || !businessName || !businessAddress){
              return  alert("please fill all the feild")
            }

            if(!agree){
              return  alert("please accept the term and constion")
            }

            signUp(mobile,password)
    }
    return (
        <MainView>
            <ScrollView>


                <Image
                    source={logo}
                    style={styles.logo}
                />

                {/* .............gretting msg............... */}
                <Text style={styles.grettingText}>
                    WELCOME TO
                </Text>

                {/* .......comapny name ........... */}
                <Text style={[styles.company_name, styles.grettingText]}>
                    {strings.app_name}
                </Text>

                {/* ...... divider ....... */}
                <View style={styles.divider} />

                {/* ....... helper text */}
                <Text style={[styles.grettingText, styles.helper_text]}>
                    {strings.signUp_helper_text}
                </Text>
                {/* ...... login container ....... */}
                <View style={[styles.login_container, styles.login_container]}>
                    {/* .... Person Name...*/}
                    <InputComponent
                        icon={icons.person}
                        placeholder={"Enter Name"}
                        value={input.name}
                        onChangeText={(value) => handleChange('name', value)}
                        keyboardType={'default'}
                    />

                    {/* ....business name......... */}

                    <InputComponent
                        icon={icons.buildibg}
                        placeholder={"Business Name"}
                        value={input.businessName}
                        onChangeText={(value) => handleChange('businessName', value)}
                        keyboardType={'default'}
                    />

                    {/* ....business address ......... */}

                    <InputComponent
                        icon={icons.buildibgLocation}
                        placeholder={"Business Address"}
                        value={input.businessAddress}
                        onChangeText={(value) => handleChange('businessAddress', value)}
                        keyboardType={'default'}
                    />


                    {/* ....Email ID......... */}

                    <InputComponent
                        icon={icons.email}
                        placeholder={"Email ID"}
                        value={input.email}
                        onChangeText={(value) => handleChange('email', value)}
                        keyboardType={'default'}
                    />
                    {/* .... mobile number ...*/}
                    <InputComponent
                        icon={icons.phone}
                        placeholder={"Mobile Number"}
                        value={input.mobile}
                        onChangeText={(value) => handleChange('mobile', value)}
                        keyboardType={'numeric'}
                    />
                    {/* .....password ..... */}
                    <InputComponent
                        icon={icons.unlock}
                        placeholder={"Password"}
                        value={input.password}
                        onChangeText={(value) => handleChange('password', value)}
                        keyboardType={'default'}
                    />
                    {/* ....Confirm password */}
                    <InputComponent
                        icon={icons.unlock}
                        placeholder={"re-type Password"}
                        value={input.rePassword}
                        onChangeText={(value) => handleChange('rePassword', value)}
                        keyboardType={'default'}
                    />
                    <View style={styles.checkboxContainer}>
                        <CheckBox
                            value={input.agree}
                            onValueChange={(value) => handleChange('agree', !input.agree)}
                            style={styles.checkbox}
                        />
                        <Text style={styles.label}>
                            Agree with terms of use and privacyPolicy
                        </Text>
                    </View>

                    {/* ........ sign up button ....... */}
                    <TouchableOpacity style={styles.sign_in_button} onPress={handleSignUp} >
                        {icons.arrowRight}
                    </TouchableOpacity>
                    {/* ... not regiter text */}
                    <Text style={styles.not_register_text}>
                        {strings.already_register}
                    </Text>

                    <TouchableOpacity onPress={() => navigation.navigate('sign_in')} >
                        <Text style={styles.sign_up}>
                            {strings.sign_in_here}
                        </Text>
                    </TouchableOpacity>

                </View>

                <View style={{ marginTop: PixelRatio.roundToNearestPixel(20) }} />

            </ScrollView>
        </MainView>
    )
}

export default SignUpScreen
