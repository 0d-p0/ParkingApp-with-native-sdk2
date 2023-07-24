import React,{useEffect} from 'react'
import getDatabaseConnection from '../getDatabaseConnection';


// id INT PRIMARY KEY,
// name VARCHAR(255),
// short_name VARCHAR(50),
// user_id VARCHAR(255),
// imei_no BIGINT,
// client_id INT,
// client_type_flag VARCHAR(1),
// allow_flag VARCHAR(1),
// location_id INT,
// role VARCHAR(1),
// otp INT,
// otp_status VARCHAR(1),
// email_verified_at TIMESTAMP,
// password VARCHAR(255),
// remember_token VARCHAR(255),
// created_at TIMESTAMP,
// updated_at TIMESTAMP,
// sub_clients_id INT,
// sub_client_name VARCHAR(255),
// module_id INT
function userInfo() {
    // create userInfo Table
    const createUserInfoTable = async () => {
        const db = await getDatabaseConnection()
        db.transaction(tx => {
            tx.executeSql(
                'CREATE TABLE IF NOT EXISTS userInfoTable(id INT PRIMARY KEY, name VARCHAR(255),short_name VARCHAR(50),user_id VARCHAR(255),imei_no BIGINT,client_id INT,client_type_flag VARCHAR(1),allow_flag VARCHAR(1),location_id INT,role VARCHAR(1), otp INT, otp_status VARCHAR(1), email_verified_at TIMESTAMP,password VARCHAR(255), remember_token VARCHAR(255),created_at TIMESTAMP,updated_at TIMESTAMP, sub_clients_id INT,sub_client_name VARCHAR(255),  module_id INT)',
                [],
                // () => console.log('user database  table created'),
                // error => console.error('Error creating table: ', error),
            );
        });
    }

    // get All usersinfo from the offline 
    const getStoreUserInfo = async () => {
        const db = await getDatabaseConnection()
        return new Promise((resolve, reject) => {
            db.transaction(
                tx => {
                    tx.executeSql(
                        'SELECT * FROM userInfoTable',
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


    const getUserInfoByID = async (id) => {
        const db = await getDatabaseConnection()
        return new Promise((resolve, reject) => {
            db.transaction(
                tx => {
                    tx.executeSql(
                        'SELECT * FROM userInfoTable WHERE id = ?',
                        [id],
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

    const addNewUserInfo = async (data) => {
        const db = await getDatabaseConnection()
        const { employes_id, employe_name, mobile_no, password, location_id, imei_no, dp, created_at, updated_at } = data
        return new Promise((resolve, reject) => {
            db.transaction(
                tx => {
                    tx.executeSql(
                        'INSERT INTO userInfoTable(employes_id, employe_name,  mobile_no,password,  location_id,imei_no , dp ,created_at , updated_at) VALUES (?,?,?,?,?,?,?,?,?)',
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

    const storeUserInfo = async (data) => {
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
const updateUserInfo =async (employes_id,employe_name, mobile_no,location_id) => {
    const db = await getDatabaseConnection()
      return new Promise((resolve, reject) => {
        db.transaction(tx => {
          tx.executeSql(
            'UPDATE userInfoTable SET employe_name = ?,mobile_no = ?,location_id = ? WHERE employes_id = ?',
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
  createUserInfoTable()
  }, [])
  

  return 
}

export default userInfo
