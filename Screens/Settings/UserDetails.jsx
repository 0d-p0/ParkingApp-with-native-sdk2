import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  PixelRatio,
} from 'react-native';
import CustomHeader from '../../component/CustomHeader';
import storeUsers from '../../Hooks/Sql/User/storeuser';
import getAuthUser from '../../Hooks/getAuthUser';
import shiftDatabase from '../../Hooks/Sql/shiftManagement/shiftDatabase';
import allColor from '../../Resources/Colors/Color';

const UserDetails = ({navigation}) => {
  const [user, setUser] = useState(null);
  const [shift, setShift] = useState(null);

  const {getUserByToken} = storeUsers();
  const {retrieveAuthUser} = getAuthUser();
  const {getShiftByID} = shiftDatabase();

  const getUserData = async () => {
    const token = await retrieveAuthUser();
    const userData = await getUserByToken(token);
    // console.log("---------------",userData)
    setUser(userData);
    const shift = await getShiftByID(userData.client_id);
    setShift(shift);
  };


  useEffect(() => {
    getUserData();
  }, []);

  return (
    <>
    {/* render Header */}
      <CustomHeader title={'User Info'} navigation={navigation} />

      <View style={styles.container}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
      
            <Text style={styles.cardHeaderText}>User Details</Text>
          </View>
          <View style={styles.cardBody}>
            <View style={styles.row}>
              <Text style={styles.label}>ID</Text>
              <Text style={styles.value}>
                {!user ? <ActivityIndicator size="small" /> : user?.id}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Name</Text>
              <Text style={styles.value}>
                {!user ? <ActivityIndicator size="small" /> : user.name}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Short Name</Text>
              <Text style={styles.value}>
                {!user ? <ActivityIndicator size="small" /> : user.short_name}
              </Text>
            </View>
            {/* Add more user details here */}
          </View>
        </View>

  { false &&      <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardHeaderText}>Shift Details</Text>
          </View>
          <View style={styles.cardBody}>
            {user && !shift && (
              <View>
                <Text
                  style={{
                    color: allColor.black,
                    textAlign: 'center',
                    fontWeight: '500',
                    fontSize: PixelRatio.roundToNearestPixel(18),
                  }}>
                  YOUR SHIFT IS NOT ASSIGNED
                </Text>
              </View>
            )}

            {user && shift && (
              <View>
                <View style={styles.row}>
                  <Text style={styles.label}>Shift ID</Text>
                  <Text style={styles.value}>
                    {!shift ? <ActivityIndicator size="small" /> : shift.id}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Employe ID</Text>
                  <Text style={styles.value}>
                    {!shift ? (
                      <ActivityIndicator size="small" />
                    ) : (
                      shift.employes_id
                    )}
                  </Text>
                </View>

                <View style={styles.row}>
                  <Text style={styles.label}>Shift Name</Text>
                  <Text style={styles.value}>
                    {!shift ? (
                      <ActivityIndicator size="small" />
                    ) : (
                      shift.shift_name
                    )}
                  </Text>
                </View>

                <View style={styles.row}>
                  <Text style={styles.label}>From Time</Text>
                  <Text style={styles.value}>
                    {!shift ? <ActivityIndicator size="small" /> : shift.f_time}
                  </Text>
                </View>

                <View style={styles.row}>
                  <Text style={styles.label}>To Time</Text>
                  <Text style={styles.value}>
                    {!shift ? <ActivityIndicator size="small" /> : shift.t_time}
                  </Text>
                </View>

                <View style={styles.row}>
                  <Text style={styles.label}>Location</Text>
                  <Text style={styles.value}>
                    {!shift ? (
                      <ActivityIndicator size="small" />
                    ) : (
                      user.location_id
                    )}
                  </Text>
                </View>
              </View>
            )}

            {/* Add more shift details here */}
          </View>
        </View>}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F6F6F6',
  },
  card: {
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    elevation: 2,
  },
  cardHeader: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#379EBE',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  cardHeaderText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardBody: {
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 16,
    color: '#555555',
  },
  value: {
    flex: 2,
    fontSize: 16,
    color: '#333333',
  },
});

export default UserDetails;

// const user = {
//   "id": 1,
//   "name": "pritam",
//   "short_name": "Pri",
//   "user_id": "0987654321",
//   "imei_no": 863019040270411,
//   "client_id": 1,
//   "client_type_flag": "S",
//   "allow_flag": "Y",
//   "location_id": 5,
//   "role": "U",
//   "otp": 720426,
//   "otp_status": "A",
//   "email_verified_at": null,
//   "password": "$2y$10$Jk5f4uzR8tMXArkavnF/w.f1FRtDQMq8lWojlGSfQBRSNmBYLnaQu",
//   "stPassword": "123456",
//   "remember_token": null,
//   "created_at": "2023-05-30T07:54:48.000000Z",
//   "updated_at": "2023-05-30T07:54:48.000000Z",
//   "module_id": 1,
//   "mc_sl_no": "863019040270411",
//   "purchase_date": "2023-05-30",
//   "sub_client_id": 2,
//   "registration_flag": "Y"
// };

// const shift = [
//   {
//     "id": 1,
//     "employes_id": 1,
//     "shift_id": 1,
//     "created_at": null,
//     "updated_at": null,
//     "dt_no": "",
//     "shift_name": "morning",
//     "f_time": "16:28:44",
//     "t_time": "16:28:45",
//     "employ_id": 1
//   }
// ];

// import {StyleSheet, Text, View} from 'react-native';
// import React, { useEffect } from 'react';
// import shiftDatabase from '../../Hooks/Sql/shiftManagement/shiftDatabase';
// import storeUsers from '../../Hooks/Sql/User/storeuser';
// import getAuthUser from '../../Hooks/getAuthUser';

// const UserDetails = () => {
//   const {getShiftByID} = shiftDatabase();
//   const {getUserByToken} = storeUsers();
//   const {retrieveAuthUser} = getAuthUser();
//  const handleGetshiftById = async () => {
//     const token = await retrieveAuthUser();
//     const user = await getUserByToken(token);
//     console.log("user info ",user)

//      getShiftByID(1)
//       .then(res => console.log('shif data', res))
//       .catch(error => console.error(error));
//   };

//   useEffect(()=>{
//     handleGetshiftById()

//   },[])
//   return (
//     <View>
//       <Text>UserDetails</Text>
//     </View>
//   );
// };

// export default UserDetails;

// const styles = StyleSheet.create({});
