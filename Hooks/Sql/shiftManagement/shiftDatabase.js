
import React, { useEffect } from 'react'
import getDatabaseConnection from '../getDatabaseConnection';

function shiftDatabase() {
    const createShiftTable = async () => {
        const db = await getDatabaseConnection()
        db.transaction(tx => {
            tx.executeSql(
                'CREATE TABLE IF NOT EXISTS shiftTable(shift_id INT(11) NOT NULL PRIMARY KEY,dt_no VARCHAR(155)  NULL,shift_name VARCHAR(155) NOT NULL, f_time DATETIME NOT NULL, t_time DATETIME NOT NULL,  employ_id INT(11) NOT NULL, created_at TIMESTAMP NULL, updated_at TIMESTAMP NULL,employes_id VARCHAR(155) NOT NULL,id VARCHAR(155) NOT NULL)',
                [],
                // () => console.log('user database  table created'),
                // error => console.error('Error creating table: ', error),
            );
        });
    }


    const getShiftData = async () => {
        const db = await getDatabaseConnection()
        return new Promise((resolve, reject) => {
            db.transaction(
                tx => {
                    tx.executeSql(
                        'SELECT * FROM shiftTable',
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


    const getShiftByID = async (employ_id) => {
        const db = await getDatabaseConnection()
        return new Promise((resolve, reject) => {
            db.transaction(
                tx => {
                    tx.executeSql(
                        'SELECT * FROM shiftTable WHERE employ_id = ?',
                        [employ_id],
                        (_, resultSet) => {
                            const { rows } = resultSet;
                            if (rows.length > 0) {
                                const data = rows.item(0);
                                resolve(data);
                            } else {
                                resolve(false); // ID not found
                            }
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

    const addNewShiftData = async (data) => {
        const db = await getDatabaseConnection()
        const {shift_id,dt_no ,shift_name , f_time, t_time,  employ_id, created_at, updated_at,employes_id ,id} = data
        return new Promise((resolve, reject) => {
            db.transaction(
                tx => {
                    tx.executeSql(
                        'INSERT INTO shiftTable(shift_id,dt_no ,shift_name , f_time, t_time,  employ_id, created_at, updated_at,employes_id ,id) VALUES (?,?,?,?,?,?,?,?,?,?)',
                        [shift_id,dt_no ,shift_name , f_time, t_time,  employ_id, created_at, updated_at,employes_id ,id],
                        (_, resultSet) => {
                            console.warn('shift data stored offline');
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
        })

    }

    const storeShiftData = async (data) => {
        for (let index = 0; index < data.length; index++) {
            const element = data[index];
            const {shift_id,dt_no,shift_name , f_time, t_time,  employ_id, created_at, updated_at } = element
            const operators = await getShiftByID(shift_id)
            if (operators) {
                return
            }
           
            await addNewShiftData(element)
        }
    }

    useEffect(() => {
        createShiftTable()
    }, [])

    return { storeShiftData,getShiftData,getShiftByID }
}

export default shiftDatabase

