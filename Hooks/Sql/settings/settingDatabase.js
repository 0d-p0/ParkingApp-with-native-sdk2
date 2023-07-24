import React, { useEffect } from 'react';
import getDBconnection from '../getDBconnection';
import getDatabaseConnection from '../getDatabaseConnection';

function settingDatabase() {

  const createGeneralSettingTable = async () => {
    const db = await getDatabaseConnection()
    db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS generalSetting(setting_id INT(11) NOT NULL PRIMARY KEY, mc_iemi_no VARCHAR(10)  NULL,mc_lang  VARCHAR(155)  NULL, dev_mod  VARCHAR(155)  NULL, report_flag  VARCHAR(155)  NULL, otp_val  VARCHAR(155)  NULL,signIn_session VARCHAR(50)  NULL, max_receipt INT(11)  NULL,total_collection  VARCHAR(155)  NULL,  vehicle_no VARCHAR(155)  NULL, adv_pay  VARCHAR(155)  NULL, auto_archive INT(10)  NULL,   reset_recipeit_no VARCHAR(155) NULL, parking_entry_type VARCHAR(155)  NULL, created_at TIMESTAMP NULL, updated_at TIMESTAMP NULL)',
        [],
        // () => console.log('general setting table created'),
        // error => console.error('Error creating table: ', error),
      );
    });
  }

  const getGeneralSettingByID = async (id) => {
    const db = await getDatabaseConnection()
    return new Promise((resolve, reject) => {
      db.transaction(
        tx => {
          tx.executeSql(
            'SELECT * FROM generalSetting WHERE setting_id = ?',
            [id],
            (_, resultSet) => {
              const { rows } = resultSet;
              if (rows.length > 0) {
                const data = rows.item(0);
                resolve(data);
              } else {
                resolve(false); // ID  found
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

  }

  const deleteGeneralSettingsData = async () => {
    const db = await getDatabaseConnection()

    return new Promise((resolve, reject) => {
      db.transaction(
        tx => {
          tx.executeSql(
            'DELETE FROM generalSetting',
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

  const addGeneralSetting = async (data) => {
    const db = await getDatabaseConnection();
    const { setting_id, mc_iemi_no, mc_lang, dev_mod, report_flag, otp_val, signIn_session, max_receipt, total_collection, vehicle_no, adv_pay, auto_archive, reset_recipeit_no, parking_entry_type, created_at, updated_at } = data;

    if (!data) {
      return alert("Please add all the fields");
    }

    await deleteGeneralSettingsData()
    return new Promise((resolve, reject) => {
      db.transaction(
        tx => {
          tx.executeSql(
            'INSERT INTO generalSetting (setting_id, mc_iemi_no, mc_lang, dev_mod, report_flag, otp_val, signIn_session, max_receipt, total_collection, vehicle_no, adv_pay, auto_archive, reset_recipeit_no, parking_entry_type, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [setting_id, mc_iemi_no, mc_lang, dev_mod, report_flag, otp_val, signIn_session, max_receipt, total_collection, vehicle_no, adv_pay, auto_archive, reset_recipeit_no, parking_entry_type, created_at, updated_at],
            (_, resultSet) => {
              const { rows } = resultSet;
              const data = [];
              for (let i = 0; i < rows.length; i++) {
                console.log(rows.item(i))
                data.push(rows.item(i));
              }
              console.log(data, "deveice setting update");
              resolve(resultSet);
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



  const getGeneralSettingData = async () => {
    const db = await getDatabaseConnection()

    return new Promise((resolve, reject) => {
      db.transaction(
        tx => {
          tx.executeSql(
            'SELECT * FROM generalSetting',
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

  useEffect(() => {
    createGeneralSettingTable()
    // getGeneralSettingData().then(res => console.log("settings ----------- ", res))
  }, []);

  return { addGeneralSetting, getGeneralSettingData };
}

export default settingDatabase;
