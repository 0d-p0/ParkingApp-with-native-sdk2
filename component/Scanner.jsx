import React, { useContext, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Alert,
  Button,
  PixelRatio,
  Pressable,
  ToastAndroid,
} from 'react-native';
import { RNCamera } from 'react-native-camera';
import QRCodeScanner from 'react-native-qrcode-scanner';
import icons from '../Resources/Icons/icons';

import vehicleRatesStorage from '../Hooks/Sql/vechicles/vehicleRatesStorage';

import VehicleInOutStore from '../Hooks/Sql/VehicleInOut/VehicleInOutStore';
import HourlyPriceCalculate from '../Hooks/PriceCalculator/HourlyPriceCalculate';
import DayTimePriceCalculate from '../Hooks/PriceCalculator/DayTimePriceCalculate';
import gstSettingsController from '../Hooks/Controller/GST_Settings/gstSettingsController';
import GstPriceCalculator from '../Hooks/PriceCalculator/GstPriceCalculator';

const Scanner = ({ navigation }) => {
  const { getVehicleRatesByVehicleId } = vehicleRatesStorage();
  const { handleCheckIsVehicleOut } = VehicleInOutStore();

  const [scanning, setScanning] = useState(true);
  const [on, setOn] = useState(false);
  // Get GST Settings
  const { handleGetGstSettingsFromStorage } = gstSettingsController()

  // const entrydate = new Date(data?.[0]?.time || data?.[0]?.date_time_in);

  const options = { hour12: false, hour: '2-digit', minute: '2-digit' };

  const dateoptions = { day: '2-digit', month: '2-digit', year: '2-digit' };
  // const formattedDate = entrydate.toLocaleDateString(undefined, dateoptions);
  // const formattedTime = entrydate.toLocaleTimeString(undefined, options);

  const date = new Date();

  // CALCULATE PRICE AND TIME
  // CALCULATE PRICE
  async function calculateTotalPrice(
    vehicleId,
    inTimestamp,
    outTimestamp,
    start_time,
    end_time,
  ) {
    const result = await getVehicleRatesByVehicleId(vehicleId);

    if (result[0].rate_type == 'H') {
      const price = HourlyPriceCalculate(
        result,
        start_time,
        end_time,
      );
      return price;
    }

    if (result[0].rate_type == 'T') {
      const { price } = DayTimePriceCalculate(start_time, end_time, result);
      return price;
    }
  }

  // ["8", "bus", "ALL LL", "26/06/23 11:54", "4", "A", "50"]

  ['32', 'Car', 'JOJE', '2023-06-28T06:31:02.302Z', '1', 'D'];

  const onSuccess = async e => {
    setScanning(false);
    // console.log(e.data);
    let newVData = e.data.split('-*-');
    // 22-*-bike-*-2-*-S-*-B2-*-2023-06-30T10:39:12.173Z-*-D-*-pritam-*-1-*-0300221120152387-*-0-*-Y-*-0-*-true
    console.log(e.data)
    const keys = [
      'receiptNo',
      'vehicleType',
      'vehicle_id',
      'receipt_type',
      'vehicle_no',
      'date_time_in',
      'oprn_mode',
      'operatorName',
      'user_id_in',
      'mc_srl_no',
      'paid_amt',
      'gst_flag',
      'advance',
      'isUploadedIN',
    ];

    const result = keys.reduce((obj, key, index) => {
      obj[key] = newVData[index];
      return obj;
    }, {});
    result['date_time_out'] = date.toISOString().slice(0, -5) + "Z"; // Use the current date and time

    // console.log("----------- key value obj data ----",result);

    const isAvailable = await handleCheckIsVehicleOut(
      result.vehicle_no,
      result.date_time_in,
    );
    console.log(
      '--------- is available ----------',
      isAvailable,
      result.vehicle_no,
      result.date_time_in,
    );

    if (isAvailable) {
      console.log('--------- is available ----------', isAvailable);
      ToastAndroid.showWithGravity(
        'payment collected',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
      navigation.navigate('bottomNavBAr');

      return;
    }

    // newVData = newVData.map(item => item);

    // key value obj data ---- {"advance": "0", "date_time_in": "2023-06-30T10:39:12.173Z", "date_time_out": "2023-06-30T11:01:05.928Z",
    // "gst_flag": "Y", "isUploadedIN": "true", "mc_srl_no": "0300221120152387", "operatorName": "pritam", "oprn_mode": "D", "paid_amt": "0", "receiptNo":
    // "22", "receipt_type": "S", "user_id_in": "1", "vehicleType": "bike", "vehicle_id": "2", "vehicle_no": "B2"}

    // // newVData.push(date.toISOString())

    function calculateDuration(inTimestamp, outTimestamp) {
      let duration = '';
      const diffInMilliseconds = Math.abs(inTimestamp - outTimestamp);
      const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
      const diffHours = Math.floor(diffInMinutes / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffInMinutes >= 60) {
        duration = `${diffHours} hours ${diffInMinutes % 60} minutes`;
      } else {
        duration = `${diffInMinutes} minutes`;
      }

      if (diffHours >= 24) {
        duration = `${diffDays} days ${diffHours % 24} hours ${diffInMinutes % 60
          } minutes`;
      }

      return duration;
    }

    const dateTimeString = result.date_time_in;
    const inDate = new Date(dateTimeString);
    const timestamp = inDate.getTime();

    const price = await calculateTotalPrice(
      result.vehicle_id,
      timestamp,
      date.getTime(),
      result.date_time_in,
      result.date_time_out,
    );
    const gstSettings = await handleGetGstSettingsFromStorage()
    console.log(gstSettings)
    console.log('--------------price --------------', price);
    const totalDuration = calculateDuration(timestamp, date.getTime());
    const gstPrice = GstPriceCalculator(gstSettings, price)

    const vData = [];
    vData.push({
      label: 'RECEIPT NO',
      value: result.receiptNo,
    });
    if (gstSettings && gstSettings?.gst_flag == "1") {
      vData.push({
        label: 'BASE AMOUNT',
        value: gstPrice.price,
      });
      vData.push({
        label: 'CGST',
        value: gstPrice.CGST,
      });
      vData.push({
        label: 'SGST',
        value: gstPrice.SGST,
      });
      vData.push({
        label: 'PARKING FEES',
        value: gstPrice.totalPrice,
      });
    }
    if (!gstSettings) {
      vData.push({
        label: 'PARKING FEES',
        value: price,
      });
    }
    // ["8", "bus", "ALL LL", "26/06/23 11:54", "4", "A", "50"]

    if (result.advance != '0') {
      vData.push({
        label: 'ADVANCE AMOUNT',
        value: result.advance,
      });

      vData.push({
        label: 'BALANCE AMOUNT',
        value: price - result.advance,
      });
    }

    vData.push({
      label: 'VEHICLE TYPE',
      value: result.vehicleType,
    });

    vData.push({
      label: 'VEHICLE NO',
      value: result.vehicle_no,
    });
    // ["29", "Car", "WB0989", "6", "23", "2023 - 5:50:30 PM",1]

    vData.push({
      label: 'IN TIME',
      value:
        inDate.toLocaleDateString(undefined, dateoptions) +
        ' ' +
        inDate.toLocaleTimeString(undefined, options),
    });

    vData.push({
      label: 'out TIME',
      value:
        date.toLocaleDateString(undefined, dateoptions) +
        ' ' +
        date.toLocaleTimeString(undefined, options),
    });

    vData.push({
      label: 'DURATION',
      value: totalDuration,
    });

    navigation.navigate('outpassPrinterPreview', {
      data: vData,
      others: result,
    });
  };

  const startScanning = () => {
    setScanning(true);
  };

  return (
    <View style={styles.container}>
      {scanning && (
        <View style={{ top: PixelRatio.roundToNearestPixel(50) }}>
          <Text
            style={{
              fontWeight: '600',
              fontSize: PixelRatio.roundToNearestPixel(16),
            }}>
            Scanning...
          </Text>
        </View>
      )}
      <QRCodeScanner
        onRead={onSuccess}
        flashMode={
          on
            ? RNCamera.Constants.FlashMode.torch
            : RNCamera.Constants.FlashMode.off
        }
        cameraProps={{ captureAudio: false }}
        reactivate={true}
        reactivateTimeout={3000}
        showMarker={true}
        markerStyle={styles.marker}
        cameraStyle={styles.camera}
        bottomContent={
          <View>
            {
              <Button
                title={scanning ? 'Scanning ...' : 'Start Scanning'}
                onPress={startScanning}
              />
            }

            <Pressable
              onPress={() => setOn(!on)}
              style={{
                position: 'absolute',
                left: PixelRatio.roundToNearestPixel(200),
              }}>
              {on ? icons.flashOff : icons.flashOn}
            </Pressable>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  marker: {
    borderColor: '#FFF',
    borderRadius: 10,
    borderWidth: 2,
  },
  camera: {
    height: PixelRatio.roundToNearestPixel(60),
    top: PixelRatio.roundToNearestPixel(40),
  },
});

export default Scanner;
