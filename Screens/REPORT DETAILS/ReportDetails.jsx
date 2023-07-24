import { PixelRatio, Pressable, StyleSheet, Text, View, ScrollView, Dimensions, ActivityIndicator, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomHeader from '../../component/CustomHeader'
import allColor from '../../Resources/Colors/Color'
import icons from '../../Resources/Icons/icons'
import CustomButtonComponent from '../../component/CustomButtonComponent'

import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios'
import { address } from '../../Router/address'
import getAuthUser from '../../Hooks/getAuthUser'
// import ThermalPrinterModule from 'react-native-thermal-printer';


const data = [
    { id: 1, name: 'John', age: 30 },
    { id: 2, name: 'Jane', age: 25 },
    { id: 3, name: 'Bob', age: 40 },
    { id: 4, name: 'Alice', age: 35 },
];
const width = Dimensions.get("screen").width
const ReportDetails = () => {
    const { retrieveAuthUser } = getAuthUser()

    const [unbilledData, setUnbilledData] = useState()
    const [loading, setLoading] = useState()

    const[pl, setpl] = useState(false)
    const date = new Date()
   

    const [fDate, setFDate] = useState()

    const [mydateFrom, setDateFrom] = useState(new Date());
    const [displaymodeFrom, setModeFrom] = useState('date');
    const [isDisplayDateFrom, setShowFrom] = useState(false);

    const changeSelectedDateFrom = (event, selectedDate) => {
        const currentDate = selectedDate || mydateFrom;
        setDateFrom(currentDate);
        setFDate(selectedDate)
        setShowFrom(false)
        setShowFrom(false)

    };

    const [mydateTo, setDateTo] = useState(new Date());
    const [displaymodeTo, setModeTo] = useState('date');
    const [isDisplayDateTo, setShowTo] = useState(false);

    const changeSelectedDateTo = (event, selectedDate) => {
        const currentDate = selectedDate || mydateTo;
        setDateTo(currentDate);
        setShowTo(false)
        // console.log(selectedDate)
        getUnbilledReport(selectedDate)
    };

    const getUnbilledReport = async (tDate) => {
        setLoading(true)
        const token = await retrieveAuthUser()
        console.log(console.log(mydateFrom, " ------------", mydateTo))

        axios.get(`https://parking.opentech4u.co.in/api/parking/unbilled?fDate=${mydateFrom.toISOString()}&tDate=${mydateTo.toISOString()}`, {
            headers: { Authorization: `Bearer ${token}` },
        }).then((res) => {
            setUnbilledData(res?.data?.data)
            setLoading(false)
            console.log("-----------------unbuiled data -----------", res.data.data)

        }).catch(error => {
            console.error(error)
            setLoading(false)
        })
    }


    const handleUnbilledPrint = async () => {
        if (pl) {
            return
        }
        const extractedData = unbilledData && unbilledData.map(({ sl_no, date_time_in, vehicle_no }) => ({
            sl_no,
            date_time_in,
            vehicle_no
        }));
        setpl(true)
         let payload = `[C]<font size='small'></font>`;

        extractedData.forEach(({ sl_no, vehicle_no, date_time_in }) => {
            payload += `[L]${sl_no} ${vehicle_no} ${date_time_in}\n`;
        });

        payload += `[C]THANK YOU`;
        try {
            await ThermalPrinterModule.printBluetooth({
                payload: payload,
                printerNbrCharactersPerLine: 30,
                printerDpi: 120,
                printerWidthMM: 58,
                mmFeedPaper: 25,
            });
            setpl(false)
            // await handleStoreOrUploadCarOut();
        } catch (err) {
            //error handlin
            // alert(err.message);
            setpl(false)

            console.log(err.message);
        }
    }

    const check = () => {
        // [{"date_time_in": "2023-06-27 12:20:00", "sl_no": 144, "vehicle_no": "1220"}, {"date_time_in": "2023-06-27 12:21:00", "sl_no": 145, "vehicle_no": "1221"}, {"date_time_in": "2023-06-27 12:22:00", "sl_no": 146, "vehicle_no": "1222"}, {"date_time_in": "2023-06-27 12:35:00", "sl_no": 147, "vehicle_no": "WB8569"}, {"date_time_in": "2023-06-27 12:35:00", "sl_no": 148, "vehicle_no": "SDHI"}, {"date_time_in": "2023-06-27 12:52:00", "sl_no": 151, "vehicle_no": "ALL OF"}]
        alert("s")
        const extractedData = unbilledData && unbilledData.map(({ sl_no, date_time_in, vehicle_no }) => ({
            sl_no,
            date_time_in,
            vehicle_no
        }));

        console.log("-------------extrac-----------", extractedData)
    }

    // mydateFrom.getDate()
    // console.log("-----------------unbuiled data -----------", unbilledData)
    return (

        <View style={{ flex: 1 }}>
            <CustomHeader title={"Unbilled Receipts"} />
            {isDisplayDateFrom && <DateTimePicker
                testID="dateTimePicker"
                value={mydateFrom}
                mode={displaymodeFrom}
                is24Hour={true}
                display="default"
                onChange={changeSelectedDateFrom}
            />
            }

            {isDisplayDateTo && <DateTimePicker
                testID="dateTimePicker"
                value={mydateTo}
                mode={displaymodeTo}
                is24Hour={true}
                display="default"
                onChange={changeSelectedDateTo}
            />
            }

            <View style={{ padding: PixelRatio.roundToNearestPixel(20), flex: 1 }}>
                <Text style={styles.select_date_header}>
                    Select Date

                    { }
                </Text>
                {/* date selector button */}
                <View style={styles.select_date_button_container}>
                    <Text style={{ ...styles.date_text, marginRight: 50 }}>
                        From Date
                    </Text>
                    <Text style={{ ...styles.date_text, marginLeft: 20 }}>
                        To Date
                    </Text>

                </View>
                <View style={styles.select_date_button_container}>

                    <Pressable style={styles.select_date_button} onPress={() => setShowFrom(true)}>

                        {icons.calendar}
                        <Text style={styles.date_text}>
                            {mydateFrom.toLocaleDateString('en-GB')}
                        </Text>
                    </Pressable>

                    <Pressable style={styles.select_date_button} onPress={() => setShowTo(true)}>
                        {icons.calendar}
                        <Text style={styles.date_text}>
                            {mydateTo.toLocaleDateString('en-GB')}
                        </Text>
                    </Pressable>

                </View>

                {loading && <Text> fetchig data... </Text>}

                {/* report genarate table */}
                {unbilledData && <View>
                    <ScrollView>
                        <View style={styles.container}>
                            <View style={[styles.row, styles.header]}>
                                <Text style={[styles.headerText, styles.hcell]}>Receipt No</Text>
                                <Text style={[styles.headerText, styles.hcell]}>Vehicle No</Text>
                                <Text style={[styles.headerText, styles.hcell]}>In Time</Text>

                            </View>
                            {unbilledData && unbilledData.map((item, index) => (
                                <View style={[styles.row, index % 2 != 0 ? styles.evenBg : styles.oddbg]} key={index}>
                                    <Text style={[styles.cell]}>{item.sl_no}</Text>
                                    <Text style={[styles.cell]}>{item.vehicle_no}</Text>
                                    <Text style={[styles.cell]}>{item.date_time_in}</Text>
                                    {/* <Text style={[styles.cell]}>{item.age}</Text> */}
                                </View>
                            ))}

                            <View style={{
                                ...styles.header, borderTopRightRadius: PixelRatio.roundToNearestPixel(0),
                                borderTopLeftRadius: PixelRatio.roundToNearestPixel(0),
                            }}>
                                <Text style={{ ...styles.headerText, ...styles.hcell, marginLeft: 10 }}>Total                             {unbilledData && unbilledData.length} </Text>
                            </View>
                        </View>
                    </ScrollView>
                </View>}
                {/* back and print action button */}
                <View style={styles.actionButton}>
                    <CustomButtonComponent.CancelButton title={"Back"} style={{ flex: 1, marginRight: 10 }} onAction={check} />
                    <CustomButtonComponent.GoButton title={"Print Report"} style={{ flex: 1, marginLeft: 10 }} onAction={() => handleUnbilledPrint()} />
                </View>
            </View>
        </View>
    )
}

export default ReportDetails

const styles = StyleSheet.create({
    select_date_header: {
        alignSelf: "center",
        fontSize: PixelRatio.roundToNearestPixel(16),
        paddingBottom: PixelRatio.roundToNearestPixel(10),
        fontWeight: "500",
        color: allColor.black
    },
    select_date_button: {
        flex: 1,
        borderWidth: 2,
        borderColor: allColor['light-gray'],
        padding: PixelRatio.roundToNearestPixel(10),
        margin: PixelRatio.roundToNearestPixel(5),
        borderRadius: PixelRatio.roundToNearestPixel(20),
        flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
        backgroundColor: allColor.white,
        elevation: PixelRatio.roundToNearestPixel(20)
    },
    date_text: {
        marginLeft: PixelRatio.roundToNearestPixel(10),
        fontWeight: '600',
        color: allColor.black
    },
    select_date_button_container: {
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: "space-between",
        position: 'absolute',
        bottom: 0,
        marginBottom: PixelRatio.roundToNearestPixel(5),
        width: width,
        padding: PixelRatio.roundToNearestPixel(10)
    },
    container: {
        flex: 1,
        borderRadius: PixelRatio.roundToNearestPixel(10),
        backgroundColor: allColor.white,
        marginBottom: 200
    },
    header: {
        backgroundColor: allColor['primary-color'],
        borderTopRightRadius: PixelRatio.roundToNearestPixel(10),
        borderTopLeftRadius: PixelRatio.roundToNearestPixel(10),


    },
    headerText: {
        fontWeight: 'bold',
        color: allColor.white
    },
    row: {

        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 5,
        paddingHorizontal: PixelRatio.roundToNearestPixel(10),

    },
    cell: {
        flex: 1,
        color: allColor.black
    },
    hcell: {
        flex: 1,
        color: allColor.white
    },
    oddbg: {

    },

    evenBg: {
        backgroundColor: "#dddddd"
    }

})