import React, { useEffect } from 'react'
import getDatabaseConnection from '../getDatabaseConnection';

function vehicleRatesStorage() {


    const createVechiclesRatesTable = async () => {
        const db = await getDatabaseConnection()


        db.transaction(tx => {
            tx.executeSql(
                'CREATE TABLE IF NOT EXISTS vechiclesRates(id INTEGER PRIMARY KEY, client_id INTEGER, rate_type TEXT, sub_client_id INTEGER, vehicle_id INTEGER, from_hour INTEGER, to_hour INTEGER, vehicle_rate TEXT, rate_flag TEXT, fixed_rate TEXT, advance TEXT, cgst TEXT, sgst TEXT,night_day_flag TEXT)',
                [],
                // () => console.log('ve setting table created'),
                // error => console.error('Error creating table: ', error),
            );
        });
    }

    //all vechiclesRates
    const getvechiclesRates = async () => {
        const db = await getDatabaseConnection()
        return new Promise((resolve, reject) => {
            db.transaction(
                tx => {
                    tx.executeSql(
                        'SELECT * FROM vechiclesRates',
                        [],
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

    // get vehiclerates by id
    const getVehicleRatesByVehicleId = async (vehicleId) => {

        const db = await getDatabaseConnection()

        return new Promise((resolve, reject) => {

            db.transaction(
                tx => {
                    tx.executeSql(
                        'SELECT * FROM vechiclesRates WHERE vehicle_id = ?',
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

    const deleteAllVehicleRates = async () => {
        const db = await getDatabaseConnection();
      
        return new Promise((resolve, reject) => {
          db.transaction(
            tx => {
              tx.executeSql(
                'DELETE FROM vechiclesRates',
                [],
                (_, resultSet) => {
                  console.warn('All data deleted successfully');
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
      
    const storeVechiclesRates = async (data) => {
        const db = await getDatabaseConnection()
        const { client_id, rate_type, sub_client_id, vehicle_id, from_hour, to_hour, vehicle_rate, rate_flag, fixed_rate, advance, cgst, sgst,night_day_flag } = data

        // const vehicle = await getVehicleRatesByVehicleId(vehicle_id)

        // if (vehicle.length != 0) {
        //     return
        // }

        return new Promise((resolve, reject) => {
            db.transaction(
                tx => {
                    tx.executeSql(
                        'INSERT INTO vechiclesRates(client_id, rate_type, sub_client_id , vehicle_id , from_hour , to_hour , vehicle_rate , rate_flag , fixed_rate , advance , cgst , sgst,night_day_flag) VALUES (?,?, ?,?, ?,?,?, ?,?, ?,?,?,?)',
                        [client_id, rate_type, sub_client_id, vehicle_id, from_hour, to_hour, vehicle_rate, rate_flag, fixed_rate, advance, cgst, sgst,night_day_flag],
                        (_, resultSet) => {
                            // console.log('vehicle rates stored offline');
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
        createVechiclesRatesTable()
    }, [])


    return { getvechiclesRates, storeVechiclesRates, getVehicleRatesByVehicleId,deleteAllVehicleRates }
}

export default vehicleRatesStorage