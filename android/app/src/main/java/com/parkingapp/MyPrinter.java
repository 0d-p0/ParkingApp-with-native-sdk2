package com.parkingapp;


import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.text.Layout;
import android.util.Base64;
import android.widget.Toast;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.zcs.sdk.DriverManager;
import com.zcs.sdk.Printer;
import com.zcs.sdk.SdkResult;
import com.zcs.sdk.Sys;
import com.zcs.sdk.print.PrnStrFormat;
import com.zcs.sdk.print.PrnTextStyle;

public class MyPrinter extends ReactContextBaseJavaModule {
    private static ReactApplicationContext context;

    Printer mPrinter;
    DriverManager mDriverManager;
    Sys mSys;

    public MyPrinter(ReactApplicationContext reactContext) {
        super(reactContext);
        context = reactContext;
    }

    @Override
    public String getName() {
        return "MyPrinter";
    }

    @ReactMethod
    public void greet(String name, Promise response) {
        try {
            String res = "hello " + name;
            response.resolve(res);
        } catch (Exception e) {
            response.reject("Error", e);
        }
    }

    void initPrinter(Callback callback) {
        try {
            mDriverManager = DriverManager.getInstance();
            mSys = mDriverManager.getBaseSysDevice();
            mPrinter = mDriverManager.getPrinter();

            int i = mSys.sdkInit();
            int status = mSys.getFirmwareVer(new String[1]);

            Toast toast = Toast.makeText(context, "This is a toast message" + status, Toast.LENGTH_SHORT);
            toast.show();

            if (status != SdkResult.SDK_OK) {
                int sysPowerOn = mSys.sysPowerOn();
                Toast toast1 = Toast.makeText(context, "sysPowerOn: " + sysPowerOn, Toast.LENGTH_SHORT);
                toast1.show();
                try {
                    Thread.sleep(1000);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        } catch (Exception e) {
            callback.invoke(e, null);

        }
    }

    @ReactMethod
    void printBill(String text, int size, Boolean bold, Callback callback) {
        try {
            initPrinter(callback);

            int printStatus = mPrinter.getPrinterStatus();
//           Toast toast1 = Toast.makeText(context, "printStatus: " + printStatus, Toast.LENGTH_SHORT);
//           toast1.show();
            if (printStatus == SdkResult.SDK_PRN_STATUS_PAPEROUT) {
                callback.invoke("No paper available", null);
            } else {
                PrnStrFormat format = new PrnStrFormat();
                format.setTextSize(size);
                format.setAli(Layout.Alignment.ALIGN_NORMAL);
                if (bold) {
                    format.setStyle(PrnTextStyle.BOLD);
                }
                mPrinter.setPrintAppendString(text, format);
                format.setTextSize(18);


                int isPrintStart = mPrinter.setPrintStart();
                Toast toast2 = Toast.makeText(context, "isPrintStart: " + isPrintStart, Toast.LENGTH_SHORT);
                toast2.show();
            }

        } catch (Exception e) {
            callback.invoke(e, null);
        }

    }

    @ReactMethod
    void printHeader(String text, int size, Callback callback) {
        try {
            initPrinter(callback);

            int printStatus = mPrinter.getPrinterStatus();
//           Toast toast1 = Toast.makeText(context, "printStatus: " + printStatus, Toast.LENGTH_SHORT);
//           toast1.show();
            if (printStatus == SdkResult.SDK_PRN_STATUS_PAPEROUT) {
                callback.invoke("No paper available", null);
            } else {
                PrnStrFormat format = new PrnStrFormat();
                format.setTextSize(size);

                format.setAli(Layout.Alignment.ALIGN_CENTER);
                format.setStyle(PrnTextStyle.BOLD);
                mPrinter.setPrintAppendString(text, format);

                int isPrintStart = mPrinter.setPrintStart();
                Toast toast2 = Toast.makeText(context, "isPrintStart: " + isPrintStart, Toast.LENGTH_SHORT);
                toast2.show();
                callback.invoke(null, "header print success fully");
            }

        } catch (Exception e) {
            callback.invoke(e, null);
        }

    }

    @ReactMethod
    void printFooter(String text, int size, Callback callback) {
        try {
            initPrinter(callback);

            int printStatus = mPrinter.getPrinterStatus();
//           Toast toast1 = Toast.makeText(context, "printStatus: " + printStatus, Toast.LENGTH_SHORT);
//           toast1.show();
            if (printStatus == SdkResult.SDK_PRN_STATUS_PAPEROUT) {
                callback.invoke("No paper available", null);
            } else {
                PrnStrFormat format = new PrnStrFormat();
                format.setTextSize(size);
                format.setAli(Layout.Alignment.ALIGN_CENTER);
//                format.setStyle(PrnTextStyle.BOLD);
                mPrinter.setPrintAppendString(text, format);

                int isPrintStart = mPrinter.setPrintStart();
                Toast toast2 = Toast.makeText(context, "isPrintStart: " + isPrintStart, Toast.LENGTH_SHORT);
                toast2.show();
                callback.invoke(null, "header print success fully");
            }

        } catch (Exception e) {
            callback.invoke(e, null);
        }

    }


    @ReactMethod
    void printQRCode(int width, int height, String text, Callback callback) {
        try {
            mDriverManager = DriverManager.getInstance();
            mSys = mDriverManager.getBaseSysDevice();
            mPrinter = mDriverManager.getPrinter();

            int i = mSys.sdkInit();
            int status = mSys.getFirmwareVer(new String[1]);

            Toast toast = Toast.makeText(context, "This is a toast message" + status, Toast.LENGTH_SHORT);
            toast.show();

            if (status != SdkResult.SDK_OK) {
                int sysPowerOn = mSys.sysPowerOn();
                Toast toast1 = Toast.makeText(context, "sysPowerOn: " + sysPowerOn, Toast.LENGTH_SHORT);
                toast1.show();
                try {
                    Thread.sleep(1000);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
            int printStatus = mPrinter.getPrinterStatus();
            Toast toast1 = Toast.makeText(context, "printStatus: " + printStatus, Toast.LENGTH_SHORT);
            toast1.show();
            if (printStatus == SdkResult.SDK_PRN_STATUS_PAPEROUT) {
                callback.invoke("no paper ", null);
                return;
            } else {
                PrnStrFormat format = new PrnStrFormat();
                mPrinter.setPrintAppendQRCode(text, width, height, Layout.Alignment.ALIGN_CENTER);

                int isPrintStart = mPrinter.setPrintStart();
                Toast toast2 = Toast.makeText(context, "isPrintStart: " + isPrintStart, Toast.LENGTH_SHORT);
                toast2.show();
            }

        } catch (Exception e) {
            callback.invoke(e, null);
        }

    }

    @ReactMethod
    void printImage(String image, Callback callback) {
        try {
            mDriverManager = DriverManager.getInstance();
            mSys = mDriverManager.getBaseSysDevice();
            mPrinter = mDriverManager.getPrinter();

            int i = mSys.sdkInit();
            int status = mSys.getFirmwareVer(new String[1]);

            Toast toast = Toast.makeText(context, "This is a toast message" + status, Toast.LENGTH_SHORT);
            toast.show();
//
            byte[] decodedString = Base64.decode(image, Base64.DEFAULT);
            Bitmap decodedByte = BitmapFactory.decodeByteArray(decodedString, 0, decodedString.length);
            if (status != SdkResult.SDK_OK) {
                int sysPowerOn = mSys.sysPowerOn();
                Toast toast1 = Toast.makeText(context, "sysPowerOn: " + sysPowerOn, Toast.LENGTH_SHORT);
                toast1.show();
                try {
                    Thread.sleep(1000);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
            int printStatus = mPrinter.getPrinterStatus();
            Toast toast1 = Toast.makeText(context, "printStatus: " + printStatus, Toast.LENGTH_SHORT);
            toast1.show();
            if (printStatus == SdkResult.SDK_PRN_STATUS_PAPEROUT) {
                return;
            } else {
                PrnStrFormat format = new PrnStrFormat();
                mPrinter.setPrintAppendBitmap(decodedByte, Layout.Alignment.ALIGN_CENTER);
                int isPrintStart = mPrinter.setPrintStart();
                Toast toast2 = Toast.makeText(context, "isPrintStart: ", Toast.LENGTH_SHORT);
                toast2.show();

            }
            callback.invoke(null, "ok");
        } catch (Exception e) {
            callback.invoke(e, null);
        }

    }


    // Method to convert Base64 encoded image to a Bitmap
    public static Bitmap base64ToBitmap(String base64Image) {
        try {
            // Decode Base64 string to byte array
            byte[] imageBytes = Base64.decode(base64Image, Base64.DEFAULT);

            // Create Bitmap from byte array
            Bitmap bitmap = BitmapFactory.decodeByteArray(imageBytes, 0, imageBytes.length);
            return bitmap;
        } catch (Exception e) {
            e.printStackTrace();
            Toast toastt = Toast.makeText(context, "excetion : " + e.getMessage(), Toast.LENGTH_LONG);
            toastt.show();
            return null;
        }
    }

    public Bitmap decodeBase64ToBitmap(String base64Image) {
        byte[] decodedBytes = Base64.decode(base64Image, Base64.URL_SAFE);
        return BitmapFactory.decodeByteArray(decodedBytes, 0, decodedBytes.length);
    }
}
