import React, { useEffect } from 'react'
import getDatabaseConnection from '../getDatabaseConnection'

function storeVechicles() {

    const createVechiclesTable = async () => {
        const db = await getDatabaseConnection()
        db.transaction(tx => {
            tx.executeSql(
                'CREATE TABLE IF NOT EXISTS vechiclesData(vehicle_id INT(11) NOT NULL PRIMARY KEY, vehicle_name VARCHAR(155) NOT NULL, vehicle_icon VARCHAR(155) NOT NULL, created_at TIMESTAMP NULL, updated_at TIMESTAMP NULL)',
                [],
                // () => console.log('ve setting table created'),
                // error => console.error('Error creating table: ', error),
            );
        });
    }

    const getVechiclesData = async () => {
        const db = await getDatabaseConnection()
        return new Promise((resolve, reject) => {
            db.transaction(
                tx => {
                    tx.executeSql(
                        'SELECT * FROM vechiclesData',
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

    const createVechiclesData = async (data) => {
        const db = await getDatabaseConnection()
        const { vehicle_id, vehicle_name, vehicle_icon, created_at, updated_at } = data
        // console.log("one by one vehicle data is ", data)
        return new Promise((resolve, reject) => {
            db.transaction(
                tx => {
                    tx.executeSql(
                        'INSERT INTO vechiclesData(vehicle_id, vehicle_name, vehicle_icon,created_at,updated_at) VALUES (?,?, ?,?, ?)',
                        [vehicle_id, vehicle_name, vehicle_icon, created_at, updated_at],
                        (_, resultSet) => {
                            console.warn('new vehicle store offline');
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
    const deleteVechiclesData = async () => {
        const db = await getDatabaseConnection()

        return new Promise((resolve, reject) => {
            db.transaction(
                tx => {
                    tx.executeSql(
                        'DELETE FROM vechiclesData',
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

    const storeVechiclesData = async (data) => {
        // const vechiclesData = await getVechiclesData()
        await deleteVechiclesData()
        for (let element of data) {
            await createVechiclesData(element)
        }
    }



    useEffect(() => {
        createVechiclesTable()
        // getVechiclesData().then(res=>console.log("all vehicles data is ",res))
    }, [])
    return { storeVechiclesData, getVechiclesData }
}

export default storeVechicles


// {"created_at": null, "updated_at": null, "vehicle_icon": "car-hatchback", "vehicle_id": 1, "vehicle_name": "Car"}