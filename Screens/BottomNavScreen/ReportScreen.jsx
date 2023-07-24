import { PixelRatio, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CustomHeader from '../../component/CustomHeader'
import MainView from '../../component/MainView'
import ActionBox from '../../component/ActionBox'
import playSound from '../../Hooks/playSound'
import UserDetails from '../Settings/UserDetails'
import icons from '../../Resources/Icons/icons'

const ReportScreen = ({ navigation }) => {
  // const {ding} = playSound()

  let data = [
    { data: "ok" },
    { data: "ok" },
    { data: "ok" },
    { data: "ok" },
    { data: "ok" },
    { data: "ok" },
    { data: "ok" },
    { data: "ok" },
    { data: "ok" },
    { data: "ok" },
    { data: "ok" },
    { data: "ok" },
    { data: "ok" },
    { data: "ok" },
    { data: "ok" },
    { data: "ok" },
    { data: "ok" },
    { data: "ok" },
    { data: "ok" },
    { data: "ok" },
    { data: "ok" },
    { data: "ok" },
    { data: "ok" },
    { data: "ok" },
    { data: "ok" },
    { data: "ok" },
    { data: "ok" },
    { data: "ok" },
  ]
  data.length = 20


  // React.useEffect(() => {
  //   const unsubscribe = navigation.addListener('tabPress', (e) => {
  //     // console.warn("hello")

  //      ding.play()
  //   });

  //   return unsubscribe;
  // }, [navigation]);
  return (
    <MainView>
      {/* header */}
      <CustomHeader title={"Reports"} />
      {/* scroll view */}

      <ScrollView>
        <View style={styles.report_container}>

          <View style={styles.ActionBox_style} >
            <ActionBox title={"Unbilled Reports"}  onAction={() => navigation.navigate("reportCh")} />
          </View>
          <View style={styles.ActionBox_style} >
            <ActionBox title={"Vehicle Wise Reports"} onAction={() => navigation.navigate("carReports")} />
          </View>
          <View style={styles.ActionBox_style} >
            <ActionBox title={"Operator Wise Reports"} onAction={() => navigation.navigate("operatorReports")} icon={icons.users} />
          </View>
         
        </View>
      </ScrollView>
      {/* <ScrollView>
       <View style={styles.report_container}>
        {data.map((props,index)=>(
          <View style={styles.ActionBox_style} key={index} >
            <ActionBox onAction={()=>alert("this feature not available now")}/>
            </View>
        ))}
       </View>
    </ScrollView> */}
    </MainView>
  )
}

export default ReportScreen

const styles = StyleSheet.create({
  report_container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    padding: PixelRatio.roundToNearestPixel(10)
  },
  ActionBox_style: {
    maxWidth: "48%",
    maxHeight: "45%",
    width:"48%",

    paddingVertical: PixelRatio.roundToNearestPixel(10)
  }
})