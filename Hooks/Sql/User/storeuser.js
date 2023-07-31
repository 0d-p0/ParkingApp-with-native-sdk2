import React, {useEffect} from 'react';
import getDatabaseConnection from '../getDatabaseConnection';

function storeUsers() {
  // create Table
  const createUserTable = async () => {
    const db = await getDatabaseConnection();
    db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS userDataTable(id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(255)  NULL, user_id VARCHAR(255)  NULL UNIQUE, short_name VARCHAR(255)  NULL ,imei_no VARCHAR(255)  NULL,client_id VARCHAR(255)  NULL,client_type_flag VARCHAR(255)  NULL,allow_flag VARCHAR(255)  NULL,stPassword VARCHAR(255)  NULL,mc_sl_no VARCHAR(255)  NULL,purchase_date VARCHAR(255)  NULL,sub_client_id VARCHAR(255)  NULL,registration_flag VARCHAR(255)  NULL,location_id VARCHAR(255)  NULL  , role VARCHAR(10)  NULL, otp INT(7)  NULL, otp_status  VARCHAR(255)   NULL,email_verified_at TIMESTAMP NULL,  password VARCHAR(255)  NULL, remember_token VARCHAR(100) NULL, created_at TIMESTAMP NULL, updated_at TIMESTAMP NULL,location VARCHAR(255),companyname VARCHAR(255), token  VARCHAR(255) NULL)',
        [],
        // () => console.log('user database  table created'),
        // error => console.error('Error creating table: ', error),
      );
    });
  };

  // add new User
  const addNewUserData = async (data, token,location,companyname) => {
    const db = await getDatabaseConnection();
    console.log("-----------------------------------",location,companyname)
    const {
      name,
      user_id,
      short_name,
      imei_no,
      client_id,
      client_type_flag,
      allow_flag,
      stPassword,
      mc_sl_no,
      purchase_date,
      sub_client_id,
      registration_flag,
      location_id,
      role,
      otp,
      otp_status,
      email_verified_at,
      password,
      remember_token,
      created_at,
      updated_at,
    } = data;

    const user = await getStoreUserData(user_id);
    // if found a user with that id it will return
    if (user) {
      return;
    }

    return new Promise((resolve, reject) => {
      db.transaction(
        tx => {
          tx.executeSql(
            'INSERT INTO userDataTable(name, user_id,short_name, imei_no ,client_id ,client_type_flag ,allow_flag ,stPassword ,mc_sl_no ,purchase_date ,sub_client_id ,registration_flag ,location_id, role, otp, otp_status,email_verified_at,password, remember_token, created_at,updated_at,location,companyname,token) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
            [
              name,
              user_id,
              short_name,
              imei_no,
              client_id,
              client_type_flag,
              allow_flag,
              stPassword,
              mc_sl_no,
              purchase_date,
              sub_client_id,
              registration_flag,
              location_id,
              role,
              otp,
              otp_status,
              email_verified_at,
              password,
              remember_token,
              created_at,
              updated_at,
              location,
              companyname,
              token,
            ],
            (_, resultSet) => {
              console.warn('user data stored offline');
              resolve(resultSet);
            },
            (_, error) => {
              // console.warn(error);
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
  };

  // delete all user data
  const deleteUserData = async () => {
    const db = await getDatabaseConnection();

    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'DELETE FROM userDataTable;',
          [],
          () => resolve('user table deleted successfully'),
          error => reject('Error deleting data: ', error),
        );
      });
    });
  };

  const deleteUserById = async user_id => {
    console.log('userId', user_id);
    const db = await getDatabaseConnection();
    const user = await getStoreUserData(user_id);
    // if found a user with that id it will return
    if (!user) {
      return;
    }
    return new Promise((resolve, reject) => {
      db.transaction(
        tx => {
          tx.executeSql(
            'DELETE FROM userDataTable WHERE user_id = ?',
            [user_id],
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
  };
  // get store user
  const getStoreUserData = async user_id => {
    const db = await getDatabaseConnection();
    return new Promise((resolve, reject) => {
      db.transaction(
        tx => {
          tx.executeSql(
            'SELECT * FROM userDataTable WHERE user_id = ?',
            [user_id],
            (_, resultSet) => {
              const {rows} = resultSet;
              if (rows.length > 0) {
                const data = rows.item(0);
                console.log("user Data ",data)
                resolve(data);
              } else {
                resolve(null); // ID  found
              }
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
  };

  // Function to update a user's details
  const updateUserDetails = async (userId, password,stPassword) => {
    const db = await getDatabaseConnection();

    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'UPDATE userDataTable SET password = ? , stPassword = ?  WHERE user_id = ?',
          [password,stPassword, userId],
          (_, result) => {
            if (result.rowsAffected > 0) {
              resolve('User details updated successfully');
            } else {
              reject('No user found with the given user ID');
            }
          },
          error => {
            console.log(error)
            reject('Error updating user details: ', error);
          },
        );
      });
    });
  };

  // Function to get user details by user_id
  const getUserByToken = async token => {
    const db = await getDatabaseConnection();
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM userDataTable WHERE token = ?',
          [token],
          (_, result) => {
            if (result.rows.length > 0) {
              const user = result.rows.item(0);
              resolve(user);
            } else {
              reject('No user found with the given user ID');
            }
          },
          error => {
            reject('Error retrieving user details: ', error);
          },
        );
      });
    });
  };

  useEffect(() => {
    createUserTable();
    // getStoreUserData2().then((res)=>console.log("helooooo data ",res)).catch(error=>console.error(error))
  }, []);

  return {
    addNewUserData,
    getStoreUserData,
    deleteUserData,
    updateUserDetails,
    getUserByToken,
    deleteUserById,
  };
}

export default storeUsers;
