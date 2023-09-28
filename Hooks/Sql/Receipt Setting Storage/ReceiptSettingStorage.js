import React, { useEffect } from 'react'
import getDatabaseConnection from '../getDatabaseConnection'

function ReceiptSettingStorage() {
    async function createReceiptSettingStorageTable() {
        const db = await getDatabaseConnection()

        db.transaction(tx => {
            tx.executeSql(
                'CREATE TABLE IF NOT EXISTS receiptSettingTable (id INTEGER PRIMARY KEY AUTOINCREMENT,header1 Text, header2 Text,header3 Text, header4 Text,footer1 Text,footer2 Text,footer3 Text,footer4 Text,image Text,header1_flag TEXT,header2_flag TEXT,header3_flag TEXT,header4_flag TEXT,footer1_flag TEXT, footer2_flag TEXT,footer3_flag TEXT, footer4_flag TEXT,image_flag TEXT)',
                [],
                // () => console.log("vehicleInOutTable create"),
                // error => console.error('Error creating vehicleInOutTable : ', error)
            );
        });
    }

    async function addNewReceiptSetting(header1, header2, header3, header4, footer1, footer2, footer3, footer4, header1_flag, header2_flag, header3_flag, header4_flag, footer1_flag, footer2_flag, footer3_flag, footer4_flag) {
        const db = await getDatabaseConnection()
        await deleteAllReceiptSettings(db)
        return new Promise((resolve, reject) => {
            // if (
            //    ! header1 ||!header2 || !footer1 || !footer2 || !image
            // ) {
            //   reject('Please add all the fields');
            // }
            db.transaction(
                tx => {
                    tx.executeSql(
                        'INSERT INTO receiptSettingTable (header1, header2, header3, header4, footer1, footer2, footer3, footer4, header1_flag, header2_flag, header3_flag, header4_flag, footer1_flag, footer2_flag, footer3_flag, footer4_flag) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                        [
                            header1, header2, header3, header4, footer1, footer2, footer3, footer4, header1_flag, header2_flag, header3_flag, header4_flag, footer1_flag, footer2_flag, footer3_flag, footer4_flag
                        ],
                        (_, resultSet) => {
                            const id = resultSet.insertId;
                            console.warn('RECEIPT SETTINGS STORE offline', id);
                            resolve(resultSet);
                        },
                        (_, error) => {
                            console.warn('RECEIPT SETTINGS STORE offline error ', error);
                            reject(error);
                        },
                    );
                },
                error => {
                    console.warn("catch error RECEIPT SETTINGS STORE offline", error);
                    reject(error);
                },
            );
        });
    }


    async function updateReceiptSetting(
        header1,
        header2,
        header3,
        header4,
        footer1,
        footer2,
        footer3,
        footer4,
        image,
        header1_flag,
        header2_flag,
        header3_flag,
        header4_flag,
        footer1_flag,
        footer2_flag,
        footer3_flag,
        footer4_flag,
        image_flag,
        id
    ) {
        const db = await getDatabaseConnection();
        return new Promise((resolve, reject) => {
            db.transaction(
                tx => {
                    tx.executeSql(
                        'UPDATE receiptSettingTable SET header1 = ?, header2 = ?, header3 = ?, header4 = ?, footer1 = ?, footer2 = ?, footer3 = ?, footer4 = ?, image = ?, header1_flag = ?, header2_flag = ?, header3_flag = ?, header4_flag = ?, footer1_flag = ?, footer2_flag = ?, footer3_flag = ?, footer4_flag = ?, image_flag = ? WHERE id = ?',
                        [
                            header1,
                            header2,
                            header3,
                            header4,
                            footer1,
                            footer2,
                            footer3,
                            footer4,
                            image,
                            header1_flag,
                            header2_flag,
                            header3_flag,
                            header4_flag,
                            footer1_flag,
                            footer2_flag,
                            footer3_flag,
                            footer4_flag,
                            image_flag,
                            id,
                        ],
                        (_, resultSet) => {
                            console.warn('RECEIPT SETTINGS updated offline');
                            resolve(resultSet);
                        },
                        (_, error) => {
                            console.warn('RECEIPT SETTINGS update offline error ', error);
                            reject(error);
                        },
                    );
                },
                error => {
                    console.warn('catch error RECEIPT SETTINGS update offline', error);
                    reject(error);
                },
            );
        });
    }


    async function getAllReceiptSetting() {
        const db = await getDatabaseConnection()

        return new Promise((resolve, reject) => {
            db.transaction(
                tx => {
                    tx.executeSql(
                        'SELECT * FROM receiptSettingTable',
                        [],
                        (_, resultSet) => {
                            const { rows } = resultSet;
                            const data = [];
                            for (let i = 0; i < rows.length; i++) {
                                console.log(rows.item(i))
                                data.push(rows.item(i));
                            }
                            resolve(data);
                        },
                        (_, error) => {
                            console.warn(error);
                            reject(error);
                        }
                    );
                },
                error => {
                    console.warn(error);
                    reject(error);
                }
            );
        });
    }


    async function deleteAllReceiptSettings(db) {
        return new Promise((resolve, reject) => {
            db.transaction(
                tx => {
                    tx.executeSql(
                        'DELETE FROM receiptSettingTable',
                        [],
                        (_, resultSet) => {
                            resolve(resultSet.rowsAffected); // Number of affected rows
                        },
                        (_, error) => {
                            console.warn(error);
                            reject(error);
                        },
                    );
                },
                error => {
                    console.warn(error);
                    reject(error);
                },
            );
        });
    }

    useEffect(() => {
        createReceiptSettingStorageTable()
    }, [])

    return { addNewReceiptSetting, getAllReceiptSetting, updateReceiptSetting }
}

export default ReceiptSettingStorage
