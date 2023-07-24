import { PixelRatio, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect,useState } from 'react'
import normalize from 'react-native-normalize'
import strings from '../Resources/Strings/strings'
import allColor from '../Resources/Colors/Color'
import { responsiveFontSize } from 'react-native-responsive-dimensions'
import icons from '../Resources/Icons/icons'
import storeUsers from '../Hooks/Sql/User/storeuser'
import getAuthUser from '../Hooks/getAuthUser'

const CustomHeader = ({title,navigation}) => {
    const {retrieveAuthUser} = getAuthUser()
    const {getUserByToken} = storeUsers()
    const [userDetails, setUserDetails] = useState();
    // {"allow_flag": "Y", "client_id": null, "client_type_flag": "O", "companyname": "kolkata corporation", "created_at": "2023-06-24T12:10:00.000000Z", "email_verified_at": null, "id": 1, "imei_no": "2", "location": "kolkata", "location_id": "1", "mc_sl_no": null, "name": "pritam", "otp": 829392, "otp_status": "A", "password": "$2y$10$CZDB30C0a4oGQfy.5Gt6gu6PtzZloZ1E0xyTyA9dA0VSlpVWxwlMC", "purchase_date": null, "registration_flag": null, "remember_token": null, "role": "U", "short_name": "Pt", "stPassword": "Abc@1234", "sub_client_id": "1", "token": "95|2qqENdQ7dqd6WYJ6UslLI0lw72b2ZSBUFcpVS4Lz", "updated_at": "2023-06-25T10:22:02.000000Z", "user_id": "8318930255"}
    useEffect(()=>{
        retrieveAuthUser()
        .then(token => {
          getUserByToken(token)
            .then(res => setUserDetails(res))
            .catch(err => console.error(err));
        })
        .catch(err => console.error(err));
    },[])

  return (
    <View style={styles.container}>
    <View style={styles.header_container_one}>
       {navigation && <Pressable 
       onPress={()=>navigation.goBack()}
       style={{position:'absolute',left:PixelRatio.roundToNearestPixel(10),top:PixelRatio.roundToNearestPixel(10)}} 
       >
           {icons.backArrow}
        </Pressable>}
        {/* title */}
        <Text style={styles.title} numberOfLines={1} >
            {title}
        </Text>
        {/* company name signature */}
        <Text style={styles.company_name}>
            {userDetails?.companyname}
        </Text>
    </View>
    <View style={styles.header_container_two}>
        {/* city name */}
      <Text style={styles.city_name}>
    {userDetails?.location}
      </Text>
    </View>
    </View>
  )
}

export default CustomHeader

const styles = StyleSheet.create({
    container:{
        backgroundColor:allColor['blue-lite'],
        borderBottomLeftRadius:normalize(10),
        borderBottomRightRadius:normalize(10)

    },
    header_container_one:{
        backgroundColor:allColor['dodger-blue'],
        borderBottomLeftRadius:normalize(10),
        borderBottomRightRadius:normalize(10),
        padding:normalize(5)
    },
    header_container_two:{
      
    },
    title:{
        color:allColor.black,
        fontWeight:'600',
        fontSize:PixelRatio.roundToNearestPixel(19),
        alignSelf:'center',
        padding:PixelRatio.roundToNearestPixel(10),
        
    },
    company_name:{
        color:allColor.black,
        fontSize:responsiveFontSize(1.8),
        alignSelf:'center',
        marginBottom:normalize(10)
    },
    city_name:{
        alignSelf:"center",
        fontSize:responsiveFontSize(1.5),
        color:allColor.white,
        padding:normalize(10)

    }
})