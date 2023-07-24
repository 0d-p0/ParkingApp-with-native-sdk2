import React, { useEffect } from 'react'
import getDatabaseConnection from '../getDatabaseConnection';

function advancePriceStorage() {
    const createAdvancePriceTable = async () => {
        const db = await getDatabaseConnection()
        db.transaction(tx => {
            tx.executeSql(
                'CREATE TABLE IF NOT EXISTS advancePrices(id INTEGER PRIMARY KEY, advance_id TEXT,subclient_id TEXT,vehicle_id TEXT,advance_amount TEXT)',
                [],
                // () => console.log('ve setting table created'),
                // error => console.error('Error creating table: ', error),
            );
        });
    }


    // get vehiclerates by id
    const getAdvancePricesByVehicleId = async (vehicleId) => {

        const db = await getDatabaseConnection()

        return new Promise((resolve, reject) => {

            db.transaction(
                tx => {
                    tx.executeSql(
                        'SELECT * FROM advancePrices WHERE vehicle_id = ?',
                        [vehicleId],
                        (_, resultSet) => {
                            const { rows } = resultSet;
                            const data = [];
                            for (let i = 0; i < rows.length; i++) {
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
    };

    const deleteAllAdvancePrices = async () => {
        const db = await getDatabaseConnection();

        return new Promise((resolve, reject) => {
            db.transaction(
                tx => {
                    tx.executeSql(
                        'DELETE FROM advancePrices',
                        [],
                        (_, resultSet) => {
                            console.warn('All advance data deleted successfully');
                            resolve(null); // Resolving with null since all data is deleted
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
    };

    const storeAdvancePrices = async (data) => {
        const db = await getDatabaseConnection()
        const { advance_id, subclient_id, vehicle_id, advance_amount } = data

        // const vehicle = await getVehicleRatesByVehicleId(vehicle_id)

        // if (vehicle.length != 0) {
        //     return
        // }


        return new Promise((resolve, reject) => {
            db.transaction(
                tx => {
                    tx.executeSql(
                        'INSERT INTO advancePrices(advance_id,subclient_id,vehicle_id,advance_amount) VALUES (?,?, ?,?)',
                        [advance_id, subclient_id, vehicle_id, advance_amount],
                        (_, resultSet) => {
                            console.log('advance rates stored offline');
                            resolve(resultSet);
                        },
                        (_, error) => {
                            // console.warn(error);
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

    useEffect(() => {
        createAdvancePriceTable()
    }, [])
    return {getAdvancePricesByVehicleId,deleteAllAdvancePrices,storeAdvancePrices}
}

export default advancePriceStorage
