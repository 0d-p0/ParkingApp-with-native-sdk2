import { PixelRatio, StyleSheet, Text, View, ActivityIndicator } from 'react-native'
import React, { useEffect } from 'react'
import CustomHeader from '../../component/CustomHeader'
import allColor from '../../Resources/Colors/Color'
import icons from '../../Resources/Icons/icons'
import CustomButtonComponent from '../../component/CustomButtonComponent'
import TableComponent from '../../component/TableComponent'
import getOperator from '../../Hooks/Controller/operatorManagement/operatorController'


// [{"created_at": "2023-05-26T17:53:14.000000Z", "dp": "test.jpeg", "employe_name": "amit", "employes_id": 1, "imei_no": "868478050297133", "location_id": 1, "mobile_no": "1234567890", "password": "$2y$10$5mpyCKC0BVSZH1yVk5bK6ut/X7DG0wHVxzQ1zVasxBvYvBL7EoqwS", "updated_at": "2023-05-26T17:53:14.000000Z"}, ]
const OperatorManagement = ({ navigation }) => {
  const { operatorData } = getOperator()
  // const data = [
  //   { code: 2, name: 'Jane', edit: 25, delete: 'd' },
  //   { code: 3, name: 'Bob', edit: 40, delete: 'd' },
  //   { code: 4, name: 'Alice', edit: 35, delete: 'd' },
  // ];

  console.log(operatorData)
  const data = operatorData && operatorData.map((props) => {
    const { employes_id, employe_name } = props
    const code = 'code'
    const name = 'name'
    const edit = {
      icon: icons.userEdit(), action: () => navigation.navigate('edit_operator', {
        props
      })
    }
    // const del = { icon: icons.deleteIcon(), action: "data" }
    return { [code]: employes_id, [name]: employe_name, edit }
  })


  useEffect(() => {

  }, [])


  return (
    <View>
      <CustomHeader title={"OperatorManagement"} />
      <View style={styles.container}>
        {/* <CustomButtonComponent.GoButton title={"Add New"} onAction={() => navigation.navigate("addNew_operator")} /> */}


        <View style={{ padding: 10 }} />
        {!data && <ActivityIndicator size="large" />}


        {data && <TableComponent data={data} />}
      </View>
    </View>
  )
}

export default OperatorManagement

const styles = StyleSheet.create({
  container: {
    height: '100%',
    padding: PixelRatio.roundToNearestPixel(15),
    backgroundColor: allColor.white
  },
})