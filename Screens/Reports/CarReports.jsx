import { PixelRatio, Pressable, StyleSheet, Text, View, ScrollView, Dimensions, ActivityIndicator, Alert, NativeModules } from 'react-native'
import React, { useEffect, useState } from 'react'
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios'
import CustomButtonComponent from '../../component/CustomButtonComponent';
import CustomHeader from '../../component/CustomHeader';
import allColor from '../../Resources/Colors/Color';
import icons from '../../Resources/Icons/icons';
import getAuthUser from '../../Hooks/getAuthUser';
const width = Dimensions.get("screen").width
// import ThermalPrinterModule from 'react-native-thermal-printer';
import VehicleReports from '../../Hooks/Sql/ReportsStore/VehicleReports';
import getReceiptSettings from '../../Hooks/Controller/ReceiptSetting/getReceiptSettings';
import DeviceInfo from 'react-native-device-info';
import ReceiptImageStorage from '../../Hooks/Sql/Receipt Setting Storage/ReceiptImageStorage';
import VehicleInOutStore from '../../Hooks/Sql/VehicleInOut/VehicleInOutStore';

const CarReports = ({ navigation }) => {
    const MyModules = NativeModules.MyPrinter;
    const [totalPrice, setTotalPrice] = useState(0)
    const [totalQTY, setTotalQTY] = useState(0)
    const [totalAdvance, setTotalAdvance] = useState(0)
    const { retrieveAuthUser } = getAuthUser()

    const [unbilledData, setUnbilledData] = useState()
    const [loading, setLoading] = useState()

    const [pl, setpl] = useState(false)
    const date = new Date()
    // GET LOGO
    const { getReceiptImage } = ReceiptImageStorage()
    const [pic, setPic] = useState()
    const { receiptSettings } = getReceiptSettings()

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
        // getUnbilledReport(selectedDate)
    };

    const getUnbilledReport = async (tDate) => {
        return
        setLoading(true)
        const token = await retrieveAuthUser()
        console.log(console.log(mydateFrom, " ------------", mydateTo))

        axios.get(`https://parking.opentech4u.co.in/api/parking/unbilled3?fDate=${mydateFrom.toISOString()}&tDate=${mydateTo.toISOString()}`, {
            headers: { Authorization: `Bearer ${token}` },
        }).then((res) => {
            setUnbilledData(res?.data?.data)

            const totalAmount = res?.data?.data.reduce((sum, obj) => {
                const amount = parseFloat(obj.total_amount);
                return sum + amount;
            }, 0);
            setTotalPrice(totalAmount)

            setLoading(false)
            console.log("-----------------unbuiled data -----------", res.data.data)

        }).catch(error => {
            console.error(error)
            setLoading(false)
        })
    }

    function addSpecialSpaces(inputString) {
        // Regular expression to match spaces using lookahead assertion
        const regex = /(?=\s)/g;

        // Use the replace method with a replacement string containing the special space character
        const result = inputString.replace(regex, '\u2005');

        return result;
    }

    console.log(unbilledData)
    const handleUnbilledPrint = async () => {

        const options = {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
        };
        if (pl) {
            return
        }
        ;

        [{ "TotalAdvance": 0, "opratorName": "Amit Mondal", "quantity": 2, "totalAmount": 160 }]
        const extractedData = unbilledData && unbilledData.map(({ vehicleType, quantity, TotalAdvance, totalAmount }) => ({
            vehicleType, quantity, TotalAdvance, totalAmount
        }));
        setpl(true)
        let headerPayload = 'VEHICLES RECEIPT\n'
        if (receiptSettings.header1_flag == "1") {
            headerPayload += `${receiptSettings.header1}\n`
        }
        if (receiptSettings.header2_flag == "1") {
            headerPayload += `${receiptSettings.header2}\n`
        }

        MyModules.printHeader(headerPayload, 24, (err, msg) => {
            if (err) {
                console.error(err)
            }
            console.warn(msg)
        })

        if (pic) {
            const picData = pic.split('data:image/jpeg;base64,')
            MyModules.printImage(picData[1], (err, msg) => {
                if (err) {
                    console.error(err)
                }
                console.log(msg)
            })
        }

        const imein = DeviceInfo.getSerialNumberSync();
        let payload = "-----------------------------------------------------------------------\n"
        payload += `DT: ${date.toLocaleDateString("en-GB")} TM: ${date.toLocaleTimeString(undefined, options)}\n`
        payload += `FROM: ${mydateFrom.toLocaleDateString("en-GB")}  TO: ${mydateTo.toLocaleDateString("en-GB")}\n`
        payload += `MC.ID: ${imein} \n`
        payload += "--------------------------------------------------------------------------\n"
        payload += "Operator     Qty         Advance      Amount\n "
        payload += "--------------------------------------------------------------------\n"
        extractedData.forEach(({ vehicleType, quantity, TotalAdvance, totalAmount }) => {
            const quantityLen = quantity.toString().length
            const vehicleTypeLen = vehicleType.toString().length
            const TotalAdvanceLen = TotalAdvance.toString().length
            payload += `${vehicleType.toString().padEnd(18 - vehicleTypeLen)}${quantity.toString().padEnd(15 - quantityLen)}${TotalAdvance.toString().padEnd(16 - TotalAdvanceLen)}${totalAmount}\n`;
        });
        payload += "--------------------------------------------------------------------\n"
        payload += `TOTAL ${"".padEnd(5)}    ${totalQTY}${"".toString().padEnd(9)} ${totalAdvance.toString().padEnd(13)} ${totalPrice.toString()} \n  `

        let footerPayload = ""
        if (receiptSettings.footer1_flag == "1") {
            footerPayload += `${receiptSettings.footer1} \n`
        }

        if (receiptSettings.footer2_flag == "1") {
            footerPayload += `${receiptSettings.footer2} \n\n\n\n`
        }

        const mainPayLoad = addSpecialSpaces(payload)
        // console.log(mainPayLoad)
        try {
            MyModules.printBill(mainPayLoad, 18, false, (err, msg) => {
                if (err) {
                    console.error(err)
                    return
                }
                console.log(msg)
            })
            MyModules.printFooter(footerPayload, 20, (err, msg) => {
                if (err) {
                    console.error(err)
                }
                console.log(msg)
            })
            setpl(false)
            // await handleStoreOrUploadCarOut();
        } catch (err) {
            //error handlin
            // alert(err.message);
            setpl(false)

            console.log(err.message);
        }
    }


    const { getVehicleWiseReports } = VehicleInOutStore()
    const [showGenerate, setShowGenerate] = useState(false)
    const [value, setValue] = useState(0)

    async function handleGenerateReport() {
        // Vehicle wise reports data Error---------------- [{"quantity": 1, "totalAmount": 40, "vehicleType": "Car"}, {"quantity": 1, "totalAmount": 50, "vehicleType": "bus"}]
        setLoading(true)
        getVehicleWiseReports(mydateFrom.toISOString(), mydateTo.toISOString()).then(res => {
            console.log("------------------Vehicle wise reports data Error----------------", res)
            setUnbilledData(res)
            const totalAmount = res.reduce((sum, obj) => {
                const amount = parseFloat(obj.totalAmount);
                return sum + amount;
            }, 0);
            setTotalPrice(totalAmount)
            const totalQTY = res.reduce((sum, obj) => {
                const amount = parseFloat(obj.quantity);
                return sum + amount;
            }, 0);
            setTotalQTY(totalQTY)

            const totalAdvance = res.reduce((sum, obj) => {
                const amount = parseFloat(obj.TotalAdvance);
                return sum + amount;
            }, 0);
            setTotalAdvance(totalAdvance)

            setValue(0)
            setShowGenerate(false)
            setLoading(false)
        })
            .catch((error) => {
                setLoading(false)
                console.error("------------------Vehicle wise reports data Error----------------", error)
            })
    }
    useEffect(() => {
        setValue(value + 1)
        if (value != 0) {
            setShowGenerate(true)
        }
        handleGenerateReport()
    }, [mydateTo, mydateFrom])
    useEffect(() => {
        getReceiptImage().then(res => setPic(res.image)).catch(error => console.error(error))
    }, [])

    return (
        <View style={{ flex: 1 }}>
            <CustomHeader title={"Vehicle Wise Reports"} navigation={navigation} />
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
                                <Text style={[styles.headerText, styles.hcell]}>Vh type</Text>
                                <Text style={[styles.headerText, styles.hcell]}>Qty</Text>
                                <Text style={[styles.headerText, styles.hcell]}>Advance</Text>

                                <Text style={[styles.headerText, styles.hcell]}>Amount</Text>

                            </View>
                            {unbilledData && unbilledData.map((item, index) => (
                                <View style={[styles.row, index % 2 != 0 ? styles.evenBg : styles.oddbg]} key={index}>
                                    {console.log(item.vehicle_id)}
                                    <Text style={[styles.cell]}>{item.vehicleType} </Text>
                                    <Text style={[styles.cell]}>{item.quantity}</Text>
                                    <Text style={[styles.cell]}>{item.TotalAdvance}</Text>

                                    <Text style={[styles.cell]}>{item.totalAmount}</Text>
                                    {/* <Text style={[styles.cell]}>{item.age}</Text> */}
                                </View>
                            ))}
                            <View style={{ ...styles.row, backgroundColor: allColor['primary-color'] }}>

                                <Text style={[styles.cell, styles.hcell]}>{"Total"} </Text>
                                <Text style={[styles.cell, styles.hcell]}>{unbilledData && totalQTY}</Text>
                                <Text style={[styles.cell, styles.hcell]}>{unbilledData && totalAdvance}</Text>
                                <Text style={[styles.cell, styles.hcell]}>{unbilledData && totalPrice}</Text>
                                {/* <Text style={[styles.cell]}>{item.age}</Text> */}
                            </View>
                            <View style={{

                            }}>
                                <Text style={{ marginLeft: 10 }}>Report Generated on {date.toLocaleString()} </Text>
                            </View>
                        </View>

                    </ScrollView>
                </View>}
                {/* back and print action button */}
                <View style={styles.actionButton}>
                    {showGenerate && <CustomButtonComponent.GoButton title={"Generate Report"} style={{ flex: 1, marginLeft: 10 }} onAction={() => handleGenerateReport()} />}
                    {<CustomButtonComponent.CancelButton title={"Back"} style={{ flex: 1, marginRight: 10 }} onAction={() => navigation.goBack()} />}
                    {unbilledData && <CustomButtonComponent.GoButton title={"Print Report"} style={{ flex: 1, marginLeft: 10 }} onAction={() => handleUnbilledPrint()} />}
                </View>
            </View>
        </View>
    )
}

export default CarReports

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