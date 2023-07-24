import { PixelRatio, StyleSheet, ActivityIndicator, View } from 'react-native'
import React from 'react'
import CustomHeader from '../../component/CustomHeader'
import allColor from '../../Resources/Colors/Color'
import icons from '../../Resources/Icons/icons'
import CustomButtonComponent from '../../component/CustomButtonComponent'
import TableComponent from '../../component/TableComponent'
import shiftController from '../../Hooks/Controller/shift/shiftController'

// [{"created_at": "2023-05-26T17:53:14.000000Z", "dp": "test.jpeg", "employe_name": "amit", "employes_id": 1, "imei_no": "868478050297133", "location_id": 1, "mobile_no": "1234567890", "password": "$2y$10$5mpyCKC0BVSZH1yVk5bK6ut/X7DG0wHVxzQ1zVasxBvYvBL7EoqwS", "updated_at": "2023-05-26T17:53:14.000000Z"}, {"created_at": "2023-05-30T13:26:38.000000Z", "dp": "abc.jpeg", "employe_name": "pritam", "employes_id": 2, "imei_no": "863019040270411", "location_id": 5, "mobile_no": "0987654321", "password": "$2y$10$5mpyCKC0BVSZH1yVk5bK6ut/X7DG0wHVxzQ1zVasxBvYvBL7EoqwS", "updated_at": "2023-05-30T13:26:38.000000Z"}],

const ShiftManagement = ({ navigation }) => {

    const { shiftData } = shiftController()
    console.log(shiftData)
    
    const data = shiftData && shiftData.map((props) => {
        const { f_time, t_time, shift_name } = props
        let fromTime = new Date(f_time);
        let toTime = new Date(t_time);
        fromTime = fromTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        toTime = toTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      

        const shiftName = "Shift Name"
        const shiftTime = "Shift Time"
        const edit = { icon: icons.userEdit(), action: "data" }
        const del = { icon: icons.deleteIcon(), action: "data" }

        return {
            [shiftName]: shift_name,
            [shiftTime]: `${fromTime} - ${toTime}`,
            edit, del
        };
    })
    return (
        <View>
            <CustomHeader title={"Shift Management"} />
            <View style={styles.container}>
                <CustomButtonComponent.GoButton title={"Add New"} style={{ marginBottom: 20 }} onAction={() => navigation.navigate("addNew_shift")} />

                <View style={{ padding: 10 }} />
                {!data && <ActivityIndicator size="large" />}

            { data &&    <TableComponent data={data} />}
            </View>
        </View>
    )
}

export default ShiftManagement

const styles = StyleSheet.create({
    container: {
        height: '100%',
        padding: PixelRatio.roundToNearestPixel(15),
        backgroundColor: allColor.white
    },
})