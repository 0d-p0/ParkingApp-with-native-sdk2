import React, { useEffect } from 'react'
import getDatabaseConnection from '../getDatabaseConnection'

function ReceiptImageStorage() {
    async function createReceiptImageTable() {
        const db = await getDatabaseConnection()

        db.transaction(tx => {
            tx.executeSql(
                'CREATE TABLE IF NOT EXISTS ReceiptImageTable (id INTEGER PRIMARY KEY AUTOINCREMENT,image BLOB)',
                [],
                // () => console.log("vehicleInOutTable create"),
                // error => console.error('Error creating vehicleInOutTable : ', error)
            );
        });
    }

    async function addNewReceiptImage(image) {
        const db = await getDatabaseConnection()
        await deleteReceiptImage(db)
        return new Promise((resolve, reject) => {
            // if (
            //    ! header1 ||!header2 || !footer1 || !footer2 || !image
            // ) {
            //   reject('Please add all the fields');
            // }
            db.transaction(
                tx => {
                    tx.executeSql(
                        'INSERT INTO ReceiptImageTable (image) VALUES (?)',
                        [
                            image
                        ],
                        (_, resultSet) => {
                            const id = resultSet.insertId;
                            console.warn('RECEIPT IMAGE STORE offline',id);
                            resolve(resultSet);
                        },
                        (_, error) => {
                            console.warn('RECEIPT IMAGE STORE offline error ', error);
                            reject(error);
                        },
                    );
                },
                error => {
                    console.warn("catch error RECEIPT IMAGE STORE offline", error);
                    reject(error);
                },
            );
        });
    }


    async function updateReceiptImage(
        image,
        id
    ) {
        const db = await getDatabaseConnection();
        return new Promise((resolve, reject) => {
            db.transaction(
                tx => {
                    tx.executeSql(
                        'UPDATE receiptSettingTable SET image = ?, WHERE id = ?',
                        [
                            image,
                            id
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


    async function getReceiptImage() {
        const db = await getDatabaseConnection()

        return new Promise((resolve, reject) => {
            db.transaction(
                tx => {
                    tx.executeSql(
                        'SELECT * FROM ReceiptImageTable',
                        [],
                        (_, resultSet) => {
                            const { rows } = resultSet;
                            const data = [];
                            for (let i = 0; i < rows.length; i++) {
                                // console.log(rows.item(i))
                                data.push(rows.item(i));
                            }
                            resolve(data[0]);
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


    async function deleteReceiptImage() {
        const db = await getDatabaseConnection()

        return new Promise((resolve, reject) => {
            db.transaction(
                tx => {
                    tx.executeSql(
                        'DELETE FROM ReceiptImageTable',
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
        createReceiptImageTable()
    }, [])

    return { addNewReceiptImage, getReceiptImage, deleteReceiptImage }
}

export default ReceiptImageStorage
