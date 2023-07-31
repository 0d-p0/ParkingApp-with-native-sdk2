import { PixelRatio, Pressable, StyleSheet, Text, View, ScrollView, Dimensions, ActivityIndicator, Alert, NativeModules,ToastAndroid ,PermissionsAndroid} from 'react-native'
import React, { useEffect, useState } from 'react'
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios'
import BleManager from 'react-native-ble-manager';

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
import storeUsers from '../../Hooks/Sql/User/storeuser';

const CarReports = ({ navigation }) => {
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
    // create a new Date object
    const date = new Date()

    // HOOKS help us to get local stored image
    const { getReceiptImage } = ReceiptImageStorage()
    // State for manage the  picture/logo/image
    const [pic, setPic] = useState()
    // this state manage the receipt Settings
    const { receiptSettings } = getReceiptSettings()

    // State for manage the From date 
    const [mydateFrom, setDateFrom] = useState(new Date());
    const [displaymodeFrom, setModeFrom] = useState('date');
    const [isDisplayDateFrom, setShowFrom] = useState(false);

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

    // handle change From date
    const changeSelectedDateFrom = (event, selectedDate) => {
        const currentDate = selectedDate || mydateFrom;
        setDateFrom(currentDate);
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
        // getUnbilledReport(selectedDate)
    };


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

    // handle printing of Veicle report
    const handleUnbilledPrint = async () => {
        // if (!isBlueToothEnable) {
        //     ToastAndroid.show('please enable the bluetooth first', ToastAndroid.SHORT);
        //     return
        //   }
        const options = {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
        };
        if (pl) {
            return
        };
         // store return data into token variable
         const token = await retrieveAuthUser();
         // store return data into user variable
         const user = await getUserByToken(token);

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

        // Printing Header uisng ZCS sdk
        MyModules.printHeader(headerPayload, 24, (err, msg) => {
            if (err) {
                console.error(err)
            }
            console.warn(msg)
        })

        if (pic) {
            const picData = pic.split('data:image/jpeg;base64,')
            // Printing picture uisng ZCS sdk
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

    // getVehicleWiseReports() return list of vihicle
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
        // all the functions are call when mydateTo, mydateFrom values are changed
        setValue(value + 1)
        if (value != 0) {
            setShowGenerate(true)
        }
        handleGenerateReport()
    }, [mydateTo, mydateFrom])

    // run only once time
    useEffect(() => {
        checkBluetoothEnabled()
        // get stored image and store is pic state.
        getReceiptImage().then(res => setPic(res.image)).catch(error => console.error(error))
    }, [])

    return (
        <View style={{ flex: 1 }}>
            {/* render custom Header */}
            <CustomHeader title={"Vehicle Wise Reports"} navigation={navigation} />
            {/* render from date picker */}
            {isDisplayDateFrom && <DateTimePicker
                testID="dateTimePicker"
                value={mydateFrom}
                mode={displaymodeFrom}
                is24Hour={true}
                display="default"
                onChange={changeSelectedDateFrom}
            />
            }

            {/* render to date picker */}
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
                    {/* Generate Button */}
                    {showGenerate && <CustomButtonComponent.GoButton title={"Generate Report"} style={{ flex: 1, marginLeft: 10 }} onAction={() => handleGenerateReport()} />}
                    {/* Back Button */}

                    {<CustomButtonComponent.CancelButton title={"Back"} style={{ flex: 1, marginRight: 10 }} onAction={() => navigation.goBack()} />}
                    {/* Print Button */}
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