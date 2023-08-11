import { PixelRatio, Pressable, StyleSheet, Text, View, ScrollView, Dimensions, ActivityIndicator, Alert, NativeModules, ToastAndroid,PermissionsAndroid } from 'react-native'
import React, { useEffect, useState } from 'react'
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios'
import BleManager from 'react-native-ble-manager';

import CustomButtonComponent from '../../component/CustomButtonComponent';
import CustomHeader from '../../component/CustomHeader';
import allColor from '../../Resources/Colors/Color';
import icons from '../../Resources/Icons/icons';
import getAuthUser from '../../Hooks/getAuthUser';
import vehicleRatesStorage from '../../Hooks/Sql/vechicles/vehicleRatesStorage';
import VehicleInOutStore from '../../Hooks/Sql/VehicleInOut/VehicleInOutStore';
import getReceiptSettings from '../../Hooks/Controller/ReceiptSetting/getReceiptSettings';
import DeviceInfo from 'react-native-device-info';
import ReceiptImageStorage from '../../Hooks/Sql/Receipt Setting Storage/ReceiptImageStorage';
import storeUsers from '../../Hooks/Sql/User/storeuser';
const width = Dimensions.get("screen").width

const OperatorReport = ({ navigation }) => {
    // NativeModules.MyPrinter is a reference to a native module named MyPrinter.  
    const MyModules = NativeModules.MyPrinter;
    const { retrieveAuthUser } = getAuthUser()
    const { getUserByToken } = storeUsers()
    const [isBlueToothEnable, setIsBlueToothEnable] = useState(false)

    // State for manage the  total price
    const [totalPrice, setTotalPrice] = useState(0)
    // State for manage the  total quantity
    const [totalQTY, setTotalQTY] = useState(0)
    // State for manage the  total Advance Price
    const [totalAdvance, setTotalAdvance] = useState(0)
    // State for manage the unBilled Data
    const [unbilledData, setUnbilledData] = useState()
    // State for manage the  loading values 
    const [loading, setLoading] = useState()
    // State for preventing multiple button press
    const [pl, setpl] = useState(false)
    const date = new Date()
    // GET LOGO

    // HOOKS help us to get local stored image
    const { getReceiptImage } = ReceiptImageStorage()
    // State for manage the  picture/logo/image
    const [pic, setPic] = useState()
    const { receiptSettings } = getReceiptSettings()

    const [fDate, setFDate] = useState()
    // State for manage the From date 

    const [mydateFrom, setDateFrom] = useState(new Date());
    const [displaymodeFrom, setModeFrom] = useState('date');
    const [isDisplayDateFrom, setShowFrom] = useState(false);
    // handle change From date

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
    // handle change to date
    const changeSelectedDateTo = (event, selectedDate) => {
        const currentDate = selectedDate || mydateTo;
        setDateTo(currentDate);
        setShowTo(false)
        // console.log(selectedDate)

    };

    const { getOperatorWiseReports } = VehicleInOutStore()

    const [showGenerate, setShowGenerate] = useState(false)
    const [value, setValue] = useState(0)

    async function checkBluetoothEnabled() {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: 'Bluetooth Permission',
                    message: 'This app needs access to your location to check Bluetooth status.',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                // Permission granted, check Bluetooth status
                BleManager.enableBluetooth()
                    .then(() => {
                        // Success code
                        setIsBlueToothEnable(true)
                        console.log("The bluetooth is already enabled or the user confirm");
                    })
                    .catch((error) => {
                        // Failure code
                        console.log("The user refuse to enable bluetooth");
                    });
                // const isEnabled = await BluetoothStatus.isEnabled();
                // console.log('Bluetooth Enabled:', isEnabled);
            } else {
                // if bluetooth is not enabled call this functions it`s self.
                checkBluetoothEnabled()
                console.log('Bluetooth permission denied');
            }
        } catch (error) {
            console.log('Error checking Bluetooth status:', error);
        }
    }

    // handle add Spaces between texts
    // these are some special spaces
    // because printer ignore the normal spaces
    function addSpecialSpaces(inputString) {
        // Regular expression to match spaces using lookahead assertion
        const regex = /(?=\s)/g;

        // Use the replace method with a replacement string containing the special space character
        const result = inputString.replace(regex, '\u2005');

        return result;
    }
    // handle printing of operator report
    const handleUnbilledPrint = async () => {
        // if (!isBlueToothEnable) {
        //     ToastAndroid.show('please enable the bluetooth first', ToastAndroid.SHORT);
        //     return
        // }
        const options = {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
        };
        if (pl) {
            return
        }
        // store return data into token variable
        const token = await retrieveAuthUser();
        // store return data into user variable
        const user = await getUserByToken(token);

        const extractedData = unbilledData && unbilledData.map(({ opratorName, quantity, TotalAdvance, totalAmount }) => {
            // opratorName, quantity, TotalAdvance, totalAmount
            return `${opratorName?.toString().padEnd(19)}${quantity.toString().padEnd(9)}${TotalAdvance.toString().padEnd(12)}${totalAmount}\n`
        }).join('');
        // console.log("object ", extractedData)
        setpl(true)
        let headerPayload = 'OPERATOR RECEIPT\n'
        if (receiptSettings.header1_flag == "1") {
            headerPayload += `${receiptSettings.header1}\n`
        }
        if (receiptSettings.header2_flag == "1") {
            headerPayload += `${receiptSettings.header2}\n`
        }
        // Printing Header uisng ZCS sdk

        MyModules.printHeader(headerPayload, 24, (err, msg) => {
            if (err) {
                console.error(err)
            }
            console.warn(msg)
        })

        if (pic) {
            // Printing picture uisng ZCS sdk
            const picData = pic.split('data:image/jpeg;base64,')
            MyModules.printImage(picData[1], (err, msg) => {
                if (err) {
                    console.error(err)
                }
                console.log(msg)
            })
        }

        const imein = user?.imei_no

        let payload = "-----------------------------------------------------------------------\n"
        payload += `DT: ${date.toLocaleDateString("en-GB")} TM: ${date.toLocaleTimeString(undefined, options)}\n`
        payload += `FROM: ${mydateFrom.toLocaleDateString("en-GB")}  TO: ${mydateTo.toLocaleDateString("en-GB")}\n`
        payload += `MC.ID: ${imein} \n`
        payload += "--------------------------------------------------------------------------\n"
        payload += "Operator          Qty       Advance       Amount\n "
        payload += "--------------------------------------------------------------------\n"

        payload += extractedData
        payload += `${"TOTAL".padEnd(16)}    ${totalQTY.toString().padEnd(8)} ${totalAdvance.toString().padEnd(11)} ${totalPrice.toString()} \n  `

        let footerPayload = ""
        if (receiptSettings.footer1_flag == "1") {
            footerPayload += `${receiptSettings.footer1} \n`
        }


        if (receiptSettings.footer2_flag == "1") {
            footerPayload += `${receiptSettings.footer2} \n\n\n\n`
        }

        const mainPayLoad = addSpecialSpaces(payload)
        try {
            // Printing Bill uisng ZCS sdk
            MyModules.printBill(mainPayLoad, 18, false, (err, msg) => {
                if (err) {
                    console.error(err)
                    return
                }
                console.log(msg)
            })
            // Printing footer uisng ZCS sdk
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


    async function handleGenerateReport() {
        // [{"opratorName": "pritam", "quantity": 2, "totalAmount": 90}]
        setLoading(true)
        getOperatorWiseReports(mydateFrom.toISOString(), mydateTo.toISOString()).then(res => {
            // console.log("------------------operator wise reports data Error----------------", res)
            setUnbilledData(res)
            const totalAmount = res.reduce((sum, obj) => {
                const amount = parseFloat(obj.totalAmount);
                return sum + amount;
            }, 0);
            setTotalPrice(totalAmount)

            const Qty = res.reduce((sum, obj) => {
                const amount = parseFloat(obj.quantity);
                return sum + amount;
            }, 0);
            setTotalQTY(Qty)
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
                console.error("------------------operator wise reports data Error----------------", error)
            })
    }
    useEffect(() => {
        // all the functions are call when mydateTo, mydateFrom values are changed
        setValue(value + 1)
        if (value != 0) {
            setShowGenerate(true)
        }
        handleGenerateReport()
    }, [mydateTo, mydateFrom])

    useEffect(() => {
        // get stored image and store is pic state.
        checkBluetoothEnabled()
        getReceiptImage().then(res => setPic(res.image)).catch(error => console.error(error))
    }, [])

    return (
        <View style={{ flex: 1 }}>
            <CustomHeader title={"Oprator Wise Receipts"} navigation={navigation} />
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
                                <Text style={[styles.headerText, styles.hcell]}>Operator</Text>
                                <Text style={[styles.headerText, styles.hcell]}>Qty</Text>
                                <Text style={[styles.headerText, styles.hcell]}>Advance</Text>

                                <Text style={[styles.headerText, styles.hcell]}>amount</Text>

                            </View>
                            {unbilledData && unbilledData.map((item, index) => (
                                <View style={[styles.row, index % 2 != 0 ? styles.evenBg : styles.oddbg]} key={index}>
                                    {console.log(item.vehicle_id)}
                                    <Text style={[styles.cell]}>{item.opratorName} </Text>
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
                    {unbilledData && <CustomButtonComponent.CancelButton title={"Back"} style={{ flex: 1, marginRight: 10 }} onAction={() => navigation.goBack()} />}
                    {unbilledData && <CustomButtonComponent.GoButton title={"Print Report"} style={{ flex: 1, marginLeft: 10 }} onAction={() => handleUnbilledPrint()} />}
                </View>
            </View>
        </View>
    )
}

export default OperatorReport

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