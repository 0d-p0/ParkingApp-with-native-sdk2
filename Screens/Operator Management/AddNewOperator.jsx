import { PixelRatio, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import CustomHeader from '../../component/CustomHeader'
import allColor from '../../Resources/Colors/Color'
import strings from '../../Resources/Strings/strings'
import RoundedInputComponent from '../../component/RoundedInputComponent'
import CustomButtonComponent from '../../component/CustomButtonComponent'
import operationInput from '../../Hooks/InputOperations/operationInput'

import extarnalStyles from '../../Styles/styles'
import CustomDropdown from '../../component/CustomDropdown'
import { Dropdown } from 'react-native-element-dropdown';
import locationController from '../../Hooks/Controller/Location/locationController'
import editOperatorcontroller from '../../Hooks/Controller/operatorManagement/editOperatorcontroller'


const AddNewOperator = ({ navigation, route }) => {
    const { props } = route.params
    const { handleChange, input } = operationInput(props)
    const [value, setValue] = useState(null);
    const [isFocus, setIsFocus] = useState(false);
    const { handleGetLocation, locationData } = locationController()
    const {handleEditOperator} = editOperatorcontroller()
    return (
        <View style={{ flex: 1 }}>

            <CustomHeader title={"operator Management"} />
            <ScrollView style={styles.container}>

                {/* header title */}
                <Text style={styles.headerText}>
                    {strings.editOperator}
                </Text>

                {/* divider */}
                <View style={{ borderBottomColor: allColor['primary-color'], borderBottomWidth: 3, width: PixelRatio.roundToNearestPixel(60), alignSelf: 'center', marginTop: PixelRatio.roundToNearestPixel(20), }} />

                {/* operator code */}
                <View style={{ marginTop: PixelRatio.roundToNearestPixel(20) }}>
                    <Text style={{ marginLeft: PixelRatio.roundToNearestPixel(15), marginBottom: PixelRatio.roundToNearestPixel(5), fontWeight: '600' }}>
                        Operator Code
                    </Text>

                    <RoundedInputComponent placeholder={"Operator Code"}
                        value={input.operatorCode}
                        onChangeText={(value) => handleChange('operatorCode', value)} />
                </View>

                {/* operator Name */}
                <View style={{ marginTop: PixelRatio.roundToNearestPixel(10) }}>
                    <Text style={{ marginLeft: PixelRatio.roundToNearestPixel(15), marginBottom: PixelRatio.roundToNearestPixel(5), fontWeight: '600' }}>
                        Operator Name
                    </Text>

                    <RoundedInputComponent placeholder={"Operator Name"}
                        value={input.operatorName}
                        onChangeText={(value) => handleChange('operatorName', value)} />
                </View>

                {/* short Name */}
                {/* <View style={{ marginTop: PixelRatio.roundToNearestPixel(10) }}>
                    <Text style={{ marginLeft: PixelRatio.roundToNearestPixel(15), marginBottom: PixelRatio.roundToNearestPixel(5), fontWeight: '600' }}>
                        Short Name
                    </Text>

                    <RoundedInputComponent placeholder={"short name"}
                        value={input.shortName}
                        onChangeText={(value) => handleChange('shortName', value)} />
                </View> */}


                {/* Mobile Number */}
                <View style={{ marginTop: PixelRatio.roundToNearestPixel(10) }}>
                    <Text style={{ marginLeft: PixelRatio.roundToNearestPixel(15), marginBottom: PixelRatio.roundToNearestPixel(5), fontWeight: '600' }}>
                        Mobile Number
                    </Text>

                    <RoundedInputComponent placeholder={"Mobile"}
                        value={input.mobileNumber}
                        onChangeText={(value) => handleChange('mobileNumber', value)} />
                </View>


                {/* Profile Picture */}
                {/* <View style={{ marginTop: PixelRatio.roundToNearestPixel(10) }}>
                    <Text style={{ marginLeft: PixelRatio.roundToNearestPixel(15), marginBottom: PixelRatio.roundToNearestPixel(5), fontWeight: '600' }}>
                        Profile Picture
                    </Text>

                    <RoundedInputComponent placeholder={"Select from gallery"}
                        value={input.profilePicture}
                        onChangeText={(value) => handleChange('profilePicture', value)} />
                </View> */}

                {/* Profile Picture */}
                <View style={{ marginTop: PixelRatio.roundToNearestPixel(10) }}>
                    <Text style={{ marginLeft: PixelRatio.roundToNearestPixel(15), marginBottom: PixelRatio.roundToNearestPixel(5), fontWeight: '600' }}>
                        location
                    </Text>

                    <Dropdown
                        style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        data={locationData}
                        search
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        placeholder={!isFocus ? 'Select item' : '...'}
                        searchPlaceholder="Search..."
                        mode='modal'
                        value={value}
                        onFocus={() => setIsFocus(true)}
                        onBlur={() => setIsFocus(false)}
                        onChange={item => {
                            setValue(item.value);
                            setIsFocus(false);
                        }}
                        onChangeText={value => {
                            handleGetLocation(value)
                        }}
                    />
                </View>
                {/* Password */}
                <View style={{ marginTop: PixelRatio.roundToNearestPixel(10) }}>
                    <Text style={{ marginLeft: PixelRatio.roundToNearestPixel(15), marginBottom: PixelRatio.roundToNearestPixel(5), fontWeight: '600' }}>
                        password
                    </Text>

                    <RoundedInputComponent placeholder={"password"}
                        value={input.password}
                        onChangeText={(value) => handleChange('password', value)} />
                </View>



                {/* action buttons */}
                <View style={{ ...extarnalStyles.password_action_container, marginTop: PixelRatio.roundToNearestPixel(20), marginBottom: PixelRatio.roundToNearestPixel(20) }}>

                    {/* reset action button */}
                    <CustomButtonComponent.CancelButton title={"Cancel"} 
                    onAction={() => alert("reset")}
                        style={{ flex: 1, marginRight: PixelRatio.roundToNearestPixel(8) }}
                    />

                    {/* change password action button */}

                    <CustomButtonComponent.GoButton title={"Save"}
                     onAction={() => handleEditOperator(input.operatorCode,input.operatorName,input.mobileNumber,value)}
                    style={{ flex: 1, marginRight: PixelRatio.roundToNearestPixel(8) }}
                    />
                </View>

                <View style={{ margin: 20 }} />
            </ScrollView>
        </View>
    )
}

export default AddNewOperator

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: allColor.white,
        padding: PixelRatio.roundToNearestPixel(15)
    },
    headerText: {
        color: allColor.black,
        alignSelf: 'center',
        fontSize: PixelRatio.roundToNearestPixel(20),
        fontWeight: '600',
    },
    dropdown: {
        backgroundColor: 'white',
        width: "98%",
        height: PixelRatio.roundToNearestPixel(50),
        borderColor: allColor.black,
        borderWidth: 1,
        borderRadius: PixelRatio.roundToNearestPixel(15),
        paddingHorizontal: 2,
        marginHorizontal: 2
    },
    icon: {
        marginRight: 5,
    },
    label: {
        position: 'absolute',
        backgroundColor: 'white',
        right: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
    },
    placeholderStyle: {
        fontSize: 16,
        color: allColor.black,
        marginLeft: PixelRatio.roundToNearestPixel(5)
    },
    selectedTextStyle: {
        fontSize: 16,
        fontWeight: '600',
        color: allColor.black,
        marginLeft: PixelRatio.roundToNearestPixel(8)
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
})