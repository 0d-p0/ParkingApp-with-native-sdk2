import React, { useEffect } from 'react';
import getDBconnection from '../getDBconnection';
import getDatabaseConnection from '../getDatabaseConnection';

function receiptDataBase() {
  const { db } = getDBconnection();

  useEffect(() => {
    if (db) {
      db.transaction(tx => {
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS entryReceiptTable (id INTEGER PRIMARY KEY AUTOINCREMENT,vehicleType TEXT,vehicle_id TEXT, receiptNo INTEGER, receipt_type TEXT, vehicle_no TEXT, date_time_in TEXT,oprn_mode TEXT,opratorName TEXT,userId TEXT,Price TEXT,mc_srl_no TEXT)',
          [],
          // () => console.log("leave receipt table"),
          // error => console.error('Error creating table: ', error)
        );
      });

      // Create outpassTable
      db.transaction(tx => {
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS outpassTable (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date_time_in TEXT,
      oprn_mode TEXT,
      vehicle_id TEXT,
      vehicle_no TEXT,
      receipt_type TEXT,
      date_time_out TEXT,
      user_id_out INTEGER,
      paid_amt REAL,
      gst_flag TEXT,
      duration TEXT,
      mc_srl_no_out TEXT
    )`,
          [],
          () => {
            console.log('outpassTable created successfully');
          },
          error => {
            console.error('Error creating outpassTable: ', error);
          },
        );
      });
    }
  }, [db]);

  const createEntryReceipt = async (
    vehicleType,
    vehicle_id,
    receiptNo,
    receipt_type,
    vehicle_no,
    date_time_in,
    oprn_mode,
    opratorName,
    userId,
    price,
    mc_srl_no
  ) => {

    console.log(vehicleType,
      vehicle_id,
      receiptNo,
      receipt_type,
      vehicle_no,
      date_time_in,
      oprn_mode,
      opratorName,
      userId,
      price,)
    return new Promise((resolve, reject) => {
      if (
        !vehicleType ||
        !receiptNo ||
        !vehicle_no ||
        !date_time_in ||
        !vehicle_id ||
        !userId ||
        !oprn_mode ||
        !opratorName ||
        !receipt_type ||
        !mc_srl_no
      ) {
        reject('please add all the feild');
      }
      db.transaction(
        tx => {
          tx.executeSql(
            'INSERT INTO entryReceiptTable (vehicleType,vehicle_id, receiptNo, receipt_type, vehicle_no, date_time_in ,oprn_mode ,opratorName,userId,price,mc_srl_no) VALUES (?, ?, ?, ?, ?,?,?,?,?,?,?)',
            [
              vehicleType,
              vehicle_id,
              receiptNo,
              receipt_type,
              vehicle_no,
              date_time_in,
              oprn_mode,
              opratorName,
              userId,
              price,
              mc_srl_no
            ],
            (_, resultSet) => {
              console.warn('Entry data stored offline');
              const rows = resultSet.rows;
              const numResults = rows.length;

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

  const createLeaveReceipt = async (
    vehicleType,
    receiptNo,
    receiptType,
    vehicleNumber,
    inDate,
    inTime,
    outPassNumber,
    outTime,
    parkingFee,
    duration,
  ) => {
    return new Promise((resolve, reject) => {
      if (
        !vehicleType ||
        !receiptNo ||
        !vehicleNumber ||
        !inDate ||
        !inTime ||
        !outPassNumber ||
        !outTime ||
        !parkingFee ||
        !duration
      ) {
        reject('please add all the feild');
      }
      db.transaction(
        tx => {
          tx.executeSql(
            'INSERT INTO leaveReceiptTable (vehicleType,receiptNo,receiptType, vehicleNumber, inDate, inTime, outPassNumber, outTime, parkingFee, duration) VALUES (?,?, ?,?, ?,?, ?,?, ?,?)',
            [
              vehicleType,
              receiptNo,
              receiptType,
              vehicleNumber,
              inDate,
              inTime,
              outPassNumber,
              outTime,
              parkingFee,
              duration,
            ],
            (_, resultSet) => {
              // console.warn('Entry data stored offline');
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

  // const createLeaveReceipt = async (vehicleType,receiptNo,receiptType, vehicleNumber, inDate, inTime, outPassNumber, outTime, parkingFee, duration) => {
  //   await db.transaction(tx => {
  //     tx.executeSql(
  //       'INSERT INTO receiptTable (vehicleType,receiptNo,receiptType, vehicleNumber, inDate, inTime, outPassNumber, outTime, parkingFee, duration) VALUES (?,?, ?,?, ?,?, ?,?, ?,?)',
  //       [vehicleType,receiptNo,receiptType, vehicleNumber, inDate, inTime, outPassNumber, outTime, parkingFee, duration],
  //       () => console.warn('Data inserted'),
  //       error => console.warn(error)
  //     );
  //   });
  // }

  // car IN DATSBASE
  const getAllDataFromTable = async () => {
    if (db) {
      return new Promise((resolve, reject) => {
        db.transaction(
          tx => {
            tx.executeSql(
              'SELECT * FROM entryReceiptTable',
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
  };

  const deleteDataById = async id => {
    return new Promise((resolve, reject) => {
      db.transaction(
        tx => {
          tx.executeSql(
            'DELETE FROM leaveReceiptTable WHERE outPassNumber = ?',
            [id],
            (_, resultSet) => {
              console.warn('Data deleted successfully');
              resolve(resultSet);
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

  const getDataById = async id => {
    if (db) {
      console.log('from receipt db = ', id);
      return new Promise((resolve, reject) => {
        db.transaction(
          tx => {
            tx.executeSql(
              'SELECT * FROM entryReceiptTable WHERE vehicleNumber = ?',
              [id],
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
  };

  const getDataByIdOrVehicleNumberStartsWith = async pattern => {
    const db = await getDatabaseConnection();
      return new Promise((resolve, reject) => {
        db.transaction(
          tx => {
            tx.executeSql(
              'SELECT * FROM entryReceiptTable WHERE receiptNo LIKE ? OR vehicle_no LIKE ?',
              [pattern + '%', pattern + '%'],
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

  // Function to add data to outpassTable
  const addOutpassEntry = async outpassData => {
    const db = await getDatabaseConnection();

    console.log(
      '-------------------------------*******************************-----------------------',
      outpassData,
    )

    const {
      date_time_in,
      oprn_mode,
      vehicle_id,
      vehicle_no,
      receipt_type,
      date_time_out,
      user_id_out,
      paid_amt,
      gst_flag,
      duration,
      mc_srl_no_out
    } = outpassData;

    if (
      !date_time_in ||
      !oprn_mode ||
      !vehicle_id ||
      !vehicle_no ||
      !receipt_type ||
      !date_time_out ||
      !user_id_out ||
      !paid_amt ||
      !gst_flag
    ) {
      return alert('jjjj');
    }

    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          `INSERT INTO outpassTable (
          date_time_in,
          oprn_mode,
          vehicle_id,
          vehicle_no,
          receipt_type,
          date_time_out,
          user_id_out,
          paid_amt,
          gst_flag,
          duration,
          mc_srl_no_out
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)`,
          [
            date_time_in,
            oprn_mode,
            vehicle_id,
            vehicle_no,
            receipt_type,
            date_time_out,
            user_id_out,
            paid_amt,
            gst_flag,
            duration,
            mc_srl_no_out
          ],
          (tx, result) => {
            console.log('ok new car out store in database');
            resolve(result.insertId);
          },
          error => {
            console.log('no new car out not store in database', error);

            reject(error);
          },
        );
      });
    });
  };

  // Function to delete an entry from outpassTable by ID
  const deleteOutpassEntryById = async id => {
    const db = await getDatabaseConnection();

    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'DELETE FROM outpassTable WHERE id = ?',
          [id],
          (tx, result) => {
            if (result.rowsAffected > 0) {
              resolve(true);
            } else {
              resolve(false);
            }
          },
          error => {
            reject(error);
          },
        );
      });
    });
  };

  // Function to retrieve an entry from outpassTable by ID
  const getOutpassEntryById = async id => {
    const db = await getDatabaseConnection();

    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM outpassTable WHERE id = ?',
          [id],
          (tx, result) => {
            if (result.rows.length > 0) {
              const entry = result.rows.item(0);
              resolve(entry);
            } else {
              resolve(null);
            }
          },
          error => {
            reject(error);
          },
        );
      });
    });
  };

  // Function to get all entries from outpassTable
  const getAllOutpassEntries = async () => {
    const db = await getDatabaseConnection();

    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM outpassTable',
          [],
          (tx, result) => {
            const entries = [];
            const rows = result.rows;
            for (let i = 0; i < rows.length; i++) {
              entries.push(rows.item(i));
            }
            resolve(entries);
          },
          error => {
            reject(error);
          },
        );
      });
    });
  };

  // Function to get the last entry from outpassTable
  const getLastOutpassEntry = async () => {
    const db = await getDatabaseConnection();

    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM outpassTable ORDER BY id DESC LIMIT 1',
          [],
          (tx, result) => {
            if (result.rows.length > 0) {
              const lastEntry = result.rows.item(0);
              resolve(lastEntry);
            } else {
              resolve(null); // No entries in the table
            }
          },
          error => {
            reject(error);
          },
        );
      });
    });
  };

  // Function to get the last entry from outpassTable
  const getLastCarINEntry = async () => {
    const db = await getDatabaseConnection();

    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM entryReceiptTable ORDER BY id DESC LIMIT 1',
          [],
          (tx, result) => {
            if (result.rows.length > 0) {
              const lastEntry = result.rows.item(0);
              resolve(lastEntry);
            } else {
              resolve(null); // No entries in the table
            }
          },
          error => {
            reject(error);
          },
        );
      });
    });
  };

  // Function to calculate the total amount from outpassTable
  const calculateTotalAmount = async () => {
    const db = await getDatabaseConnection();

    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT SUM(paid_amt) AS totalAmount FROM outpassTable',
          [],
          (tx, result) => {
            if (result.rows.length > 0) {
              const totalAmount = result.rows.item(0).totalAmount;
              resolve(totalAmount);
            } else {
              resolve(0); // No entries in the table, return 0 as total amount
            }
          },
          error => {
            reject(error);
          },
        );
      });
    });
  };

  // Function to delete all data from outpassTable
  const deleteAllOutpassData = () => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'DELETE FROM outpassTable',
          [],
          (tx, result) => {
            resolve(result.rowsAffected);
          },
          error => {
            reject(error);
          },
        );
      });
    });
  };

  const deleteAllFromINTable = () => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'DELETE FROM entryReceiptTable',
          [],
          (tx, result) => {
            resolve(result.rowsAffected);
          },
          error => {
            reject(error);
          },
        );
      });
    });
  };

  function checkIfVehicleOutExists(date_time_in, vehicle_no) {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT COUNT(*) as count FROM outpassTable WHERE date_time_in = ? AND vehicle_no = ?',
          [date_time_in, vehicle_no],
          (_, result) => {
            const count = result.rows.item(0).count;
            resolve(count > 0);
          },
          (_, error) => {
            reject(error);
          }
        );
      });
    });
  }
  

  return {
    createEntryReceipt,
    createLeaveReceipt,
    getAllDataFromTable,
    deleteDataById,
    getDataById,
    getDataByIdOrVehicleNumberStartsWith,
    getLastCarINEntry,
    deleteAllFromINTable,
    // outpass
    addOutpassEntry,
    deleteOutpassEntryById,
    getAllOutpassEntries,
    getLastOutpassEntry,
    calculateTotalAmount,
    deleteAllOutpassData,
    checkIfVehicleOutExists
  };
}

export default receiptDataBase;

// db.transaction(tx => {
//   // Check if the columns exist in the table
//   tx.executeSql(
//     `PRAGMA table_info(entryReceiptTable)`,
//     [],
//     (tx, result) => {
//       const columns = result.rows.raw();

//       // Check if 'userId' and 'open_mode' columns exist
//       const hasUserIdColumn = columns.some(
//         column => column.name === 'userId',
//       );
//       const hasOpenModeColumn = columns.some(
//         column => column.name === 'open_mode',
//       );
//       const hasOpratorNameColumn = columns.some(
//         columns => columns.name == 'opratorName',
//       );

//       if (!hasUserIdColumn) {
//         // 'userId' column is missing, so execute ALTER TABLE statement
//         tx.executeSql(
//           'ALTER TABLE entryReceiptTable ADD COLUMN userId INTEGER',
//           [],
//           (tx, result) => {
//             // 'userId' column added successfully
//             console.log('car in schema ok');
//           },
//           error => {
//             // Error occurred while adding 'userId' column
//             console.error('car in schema', error.message);
//           },
//         );
//       }

//       if (!hasOpenModeColumn) {
//         // 'open_mode' column is missing, so execute ALTER TABLE statement
//         tx.executeSql(
//           'ALTER TABLE entryReceiptTable ADD COLUMN open_mode TEXT',
//           [],
//           (tx, result) => {
//             // 'open_mode' column added successfully
//             console.log('car in schema opernmode');
//           },
//           error => {
//             // Error occurred while adding 'open_mode' column
//             console.error('car in schema opernmode', error.message);
//           },
//         );
//       }

//       if (!hasOpratorNameColumn) {
//         // 'open_mode' column is missing, so execute ALTER TABLE statement
//         tx.executeSql(
//           'ALTER TABLE entryReceiptTable ADD COLUMN opratorName TEXT',
//           [],
//           (tx, result) => {
//             // 'open_mode' column added successfully
//             console.log('car in schema opernmode');
//           },
//           error => {
//             // Error occurred while adding 'open_mode' column
//             console.error('car in schema opernmode', error.message);
//           },
//         );
//       }
//     },
//     error => {
//       // Error occurred while checking the schema
//     },
//   );
// });
