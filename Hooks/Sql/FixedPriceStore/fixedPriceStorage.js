import React, { useEffect } from 'react'
import getDatabaseConnection from '../getDatabaseConnection';

function fixedPriceStorage() {
  
    const createFixedPriceTable = async () => {
        const db = await getDatabaseConnection()
        db.transaction(tx => {
            tx.executeSql(
                'CREATE TABLE IF NOT EXISTS fixedPriceTable( to_hour TEXT,from_hour TEXT,sub_client_id TEXT,vehicle_id TEXT,vehicle_rate TEXT)',
                [],
                // () => console.log('ve setting table created'),
                // error => console.error('Error creating table: ', error),
            );
        });
    }


    // get vehiclerates by id
    const getFixedPricesByVehicleId = async (vehicleId) => {

        const db = await getDatabaseConnection()

        return new Promise((resolve, reject) => {

            db.transaction(
                tx => {
                    tx.executeSql(
                        'SELECT * FROM fixedPriceTable WHERE vehicle_id = ?',
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

    const deleteAllFixedPrices = async () => {
        const db = await getDatabaseConnection();

        return new Promise((resolve, reject) => {
            db.transaction(
                tx => {
                    tx.executeSql(
                        'DELETE FROM fixedPriceTable',
                        [],
                        (_, resultSet) => {
                            console.warn('All fixed data deleted successfully');
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

    const storeFixedPrices = async (data) => {
        const db = await getDatabaseConnection()
        const { to_hour ,from_hour ,sub_client_id ,vehicle_id ,vehicle_rate } = data || {}

        // const vehicle = await getVehicleRatesByVehicleId(vehicle_id)

        // if (vehicle.length != 0) {
        //     return
        // }


        return new Promise((resolve, reject) => {
            db.transaction(
                tx => {
                    tx.executeSql(
                        'INSERT INTO fixedPriceTable(to_hour ,from_hour ,sub_client_id ,vehicle_id ,vehicle_rate ) VALUES (?,?, ?,?,?)',
                        [to_hour ,from_hour ,sub_client_id ,vehicle_id ,vehicle_rate ],
                        (_, resultSet) => {
                            console.log('Fixed rates stored offline');
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
        createFixedPriceTable()
    }, [])

    return {storeFixedPrices,getFixedPricesByVehicleId,deleteAllFixedPrices};
}

export default fixedPriceStorage
