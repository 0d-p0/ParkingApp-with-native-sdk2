import React, { useEffect } from 'react'
import getDatabaseConnection from '../getDatabaseConnection';


// "id": 1,
// "name": "pritam",
// "short_name": "Pri",
// "user_id": "0987654321",
// "imei_no": 863019040270411,
// "client_id": 1,
// "client_type_flag": "S",
// "allow_flag": "Y",
// "location_id": 1,
// "role": "U",
// "otp": 720426,
// "otp_status": "A",
// "email_verified_at": null,
// "password": "$2y$10$Jk5f4uzR8tMXArkavnF/w.f1FRtDQMq8lWojlGSfQBRSNmBYLnaQu",
// "remember_token": null,
// "created_at": null,
// "updated_at": null,
// "sub_clients_id": 1,
// "sub_client_name": "kolkata kmc",
// "module_id": 1



function operatorDatabase() {
    
    const createOperatorTable = async () => {
        const db = await getDatabaseConnection()
        db.transaction(tx => {
            tx.executeSql(
                'CREATE TABLE IF NOT EXISTS operatorTable(employes_id INT(11) NOT NULL PRIMARY KEY, employe_name VARCHAR(155) NOT NULL,  mobile_no VARCHAR(15) NOT NULL,password VARCHAR(120) NOT NULL,  location_id INT(11) NOT NULL,imei_no VARCHAR(100) NOT NULL, dp VARCHAR(155) NOT NULL,created_at TIMESTAMP NULL, updated_at TIMESTAMP NULL)',
                [],
                // () => console.log('user database  table created'),
                // error => console.error('Error creating table: ', error),
            );
        });
    }

    const getStoreOperatorData = async () => {
        const db = await getDatabaseConnection()
        return new Promise((resolve, reject) => {
            db.transaction(
                tx => {
                    tx.executeSql(
                        'SELECT * FROM operatorTable',
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


    const getOperatorByID = async (employes_id) => {
        const db = await getDatabaseConnection()
        return new Promise((resolve, reject) => {
            db.transaction(
                tx => {
                    tx.executeSql(
                        'SELECT * FROM operatorTable WHERE employes_id = ?',
                        [employes_id],
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

    const addNewOperatorData = async (data) => {
        const db = await getDatabaseConnection()
        const { employes_id, employe_name, mobile_no, password, location_id, imei_no, dp, created_at, updated_at } = data
        return new Promise((resolve, reject) => {
            db.transaction(
                tx => {
                    tx.executeSql(
                        'INSERT INTO operatorTable(employes_id, employe_name,  mobile_no,password,  location_id,imei_no , dp ,created_at , updated_at) VALUES (?,?,?,?,?,?,?,?,?)',
                        [employes_id, employe_name, mobile_no, password, location_id, imei_no, dp, created_at, updated_at],
                        (_, resultSet) => {
                            console.warn('operator data stored offline');
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

    const storeOperatorData = async (data) => {
        for (let index = 0; index < data.length; index++) {
            const element = data[index];
            const { employes_id, employe_name, mobile_no, password, location_id, imei_no, dp, created_at, updated_at } = element
            const operators = await getOperatorByID(employes_id)
            if (operators) {
                return
            }
           
            await addNewOperatorData(element)
        }
    }

      // Function to update a operator details
const updateOperatorDetails =async (employes_id,employe_name, mobile_no,location_id) => {
    const db = await getDatabaseConnection()
      return new Promise((resolve, reject) => {
        db.transaction(tx => {
          tx.executeSql(
            'UPDATE operatorTable SET employe_name = ?,mobile_no = ?,location_id = ? WHERE employes_id = ?',
            [employe_name, mobile_no,location_id, employes_id],
            (_, result) => {
            
              if (result.rowsAffected > 0) {
                resolve('operator details updated successfully');
              } else {
                reject('No operator found with the given user ID');
              }
            },
            error => {
              reject('Error updating user details: ', error);
            }
          );
        });
      })
      
  };

    useEffect(() => {
        createOperatorTable()
    }, [])

    return { storeOperatorData,getStoreOperatorData,updateOperatorDetails}
}

export default operatorDatabase
