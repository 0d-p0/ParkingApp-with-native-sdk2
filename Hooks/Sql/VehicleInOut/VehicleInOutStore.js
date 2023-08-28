import React, { useEffect } from 'react'
import getDatabaseConnection from '../getDatabaseConnection';
import addColumnIfNeeded from '../IsColumn';

function VehicleInOutStore() {
  const createVehicleInOutTable = async () => {
    const db = await getDatabaseConnection()
    db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS vehicleInOutTable (id INTEGER PRIMARY KEY AUTOINCREMENT,vehicleType TEXT, vehicle_id TEXT,receiptNo INTEGER,receipt_type TEXT, vehicle_no TEXT,date_time_in TEXT, oprn_mode TEXT, opratorName TEXT,user_id_in  TEXT,mc_srl_no TEXT,date_time_out TEXT,user_id_out INTEGER,paid_amt TEXT,gst_flag TEXT,duration TEXT,mc_srl_no_out TEXT,advance TEXT,isUploadedIN BOOLEAN DEFAULT false,isUploadedOUT BOOLEAN DEFAULT false)',
        [],
        // () => console.log("vehicleInOutTable create"),
        // error => console.error('Error creating vehicleInOutTable : ', error)
      );
    });

    await addColumnIfNeeded(db, "vehicleInOutTable", "base_amt")
    await addColumnIfNeeded(db, "vehicleInOutTable", "cgst")
    await addColumnIfNeeded(db, "vehicleInOutTable", "sgst")
  }

  const createVehicleInOut = async (receiptNo,
    vehicleType, vehicle_id, receipt_type, vehicle_no, date_time_in, oprn_mode, opratorName, user_id_in, mc_srl_no, paid_amt, gst_flag, advance, isUploadedIN
  ) => {

    console.log("is uploaded in ", isUploadedIN)

    const db = await getDatabaseConnection()


    console.log("-------------------------", receiptNo,
      vehicleType, vehicle_id, receipt_type, vehicle_no, date_time_in, oprn_mode, opratorName, user_id_in, mc_srl_no, paid_amt, gst_flag, advance, isUploadedIN)

    return new Promise((resolve, reject) => {
      if (
        !receiptNo, !vehicleType || !vehicle_id || !receipt_type || !vehicle_no || !date_time_in || !oprn_mode || !opratorName || !user_id_in || !mc_srl_no || !gst_flag
      ) {
        reject('Please add all the fields');
      }


      db.transaction(
        tx => {
          tx.executeSql(
            'INSERT INTO vehicleInOutTable (receiptNo, vehicleType, vehicle_id, receipt_type, vehicle_no, date_time_in, oprn_mode, opratorName, user_id_in, mc_srl_no, paid_amt, gst_flag, advance, isUploadedIN) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
              receiptNo,
              vehicleType, vehicle_id, receipt_type, vehicle_no, date_time_in, oprn_mode, opratorName, user_id_in, mc_srl_no, paid_amt, gst_flag, advance, isUploadedIN
            ],
            (_, resultSet) => {
              console.warn('vehicle in data stored offline');
              resolve(resultSet);
            },
            (_, error) => {
              console.warn('vehicle in data stored offline error ', error);
              reject(error);
            },
          );
        },
        error => {
          console.warn("catch error in vehichle in", error);
          reject(error);
        },
      );
    });
  };


  const createOrUpdateVehicleInOut = async (receiptNo,
    vehicleType, vehicle_id, receipt_type, vehicle_no, date_time_in, oprn_mode, opratorName, user_id_in, mc_srl_no, date_time_out, user_id_out, paid_amt, gst_flag, duration, mc_srl_no_out, advance, isUploadedIN, isUploadedOUT, base_amt, cgst, sgst
  ) => {

    const db = await getDatabaseConnection()

    return new Promise((resolve, reject) => {
      console.log("hello all data  -------------------------------------------------------", receiptNo, vehicleType, vehicle_id, receipt_type, vehicle_no, date_time_in, oprn_mode, opratorName, user_id_in, mc_srl_no, paid_amt, gst_flag, advance, date_time_out, user_id_out, duration, paid_amt)

      //       4 bus 4 S POL2 2023-06-30T07:45:57.220Z D pritam pritam 
      // 0300221120152387 100 Y 0 2023-06-30T09:00:32.102Z 8318930255 0 100
      if (
        !receiptNo ||
        !vehicleType ||
        !vehicle_id ||
        !receipt_type ||
        !vehicle_no ||
        !date_time_in ||
        !oprn_mode ||
        !opratorName ||
        !user_id_in ||
        !mc_srl_no ||
        !paid_amt ||
        !gst_flag ||

        !date_time_out ||
        !user_id_out ||

        !paid_amt

      ) {
        reject('Please add all the fields -)');
      }
      //   date_time_out, user_id_out, duration, mc_srl_no_out, paid_amt, isUploaded
      db.transaction(
        tx => {
          tx.executeSql(
            'SELECT * FROM vehicleInOutTable WHERE vehicle_no = ? AND date_time_in = ?',
            [vehicle_no, date_time_in],
            (_, resultSet) => {
              console.log(resultSet.rows.length, vehicle_no, date_time_in)
              if (resultSet.rows.length > 0) {
                // Update existing record
                tx.executeSql(
                  'UPDATE vehicleInOutTable SET date_time_out = ?, user_id_out = ?, mc_srl_no_out = ?, duration = ?, paid_amt = ?, isUploadedOUT = ?, gst_flag = ?, base_amt = ?,cgst = ?,sgst = ? WHERE vehicle_no = ? AND date_time_in = ?',
                  [
                    date_time_out, user_id_out, mc_srl_no_out, duration, paid_amt, isUploadedOUT,
                    gst_flag, base_amt, cgst, sgst, vehicle_no, date_time_in,
                  ],
                  (_, updateResultSet) => {
                    console.warn('vehicle in data updated ________________________________');
                    resolve(updateResultSet);
                  },
                  (_, updateError) => {
                    console.error('vehicle in data updated error ', updateError);
                    reject(updateError);
                  }
                );
              } else {
                // Insert new record
                tx.executeSql(
                  'INSERT INTO vehicleInOutTable (receiptNo, vehicleType, vehicle_id,  receipt_type, vehicle_no, date_time_in, oprn_mode, opratorName, user_id_in, mc_srl_no, date_time_out, user_id_out, paid_amt, gst_flag, duration, mc_srl_no_out, advance, isUploadedIN,isUploadedOUT,base_amt,cgst,sgst) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?,?, ?, ?)',
                  [
                    receiptNo,
                    vehicleType, vehicle_id, receipt_type, vehicle_no, date_time_in, oprn_mode, opratorName, user_id_in, mc_srl_no, date_time_out, user_id_out, paid_amt, gst_flag, duration, mc_srl_no_out, advance, isUploadedIN, isUploadedOUT,
                    base_amt, cgst, sgst
                  ],
                  (_, insertResultSet) => {
                    console.warn('New vehicle in data stored while outpass');
                    resolve(insertResultSet);
                  },
                  (_, insertError) => {
                    console.error('vehicle in data updated insert error ', insertError);
                    reject(insertError);
                  }
                );
              }
            },
            (_, error) => {
              console.error('vehicle in data updated error 1', updateError);
              reject(error);
            }
          );
        },
        error => {
          console.error('vehicle in data updated error  2', updateError);

          reject(error);
        }
      );
    });
  };

  const getDataByIdOrVehicleNumberStartsWith = async pattern => {
    const db = await getDatabaseConnection();
    const page_size = 50
    return new Promise((resolve, reject) => {
      db.transaction(
        tx => {
          tx.executeSql(
            'SELECT * FROM vehicleInOutTable WHERE (receiptNo LIKE ? OR vehicle_no LIKE ?) AND date_time_out IS NULL AND oprn_mode <> "F" LIMIT 10',
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

  const getAllInOutVehicle = async () => {
    const db = await getDatabaseConnection()
    return new Promise((resolve, reject) => {
      db.transaction(
        tx => {
          tx.executeSql(
            'SELECT * FROM vehicleInOutTable WHERE isUploadedOUT IS 1',
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

  const calculateTotalVehicleIn = async () => {
    const db = await getDatabaseConnection();
    return new Promise((resolve, reject) => {

      const currentDate = new Date(); // Get current date in local timezone
      const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()); // Set start date to midnight (00:00 AM) of the current date
      const endDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000 - 1); // Set end date to 11:59 PM of the current date

      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM vehicleInOutTable WHERE date_time_in >= ? AND date_time_in <= ?',
          [startDate.toISOString(), endDate.toISOString()],
          (tx, result) => {
            if (result.rows.length > 0) {
              const { rows } = result;
              const data = [];
              for (let i = 0; i < rows.length; i++) {
                data.push(rows.item(i));
              }
              resolve(data.length);
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

  const calculateTotalVehicleOut = async () => {
    const db = await getDatabaseConnection();
    return new Promise((resolve, reject) => {

      const currentDate = new Date(); // Get current date in local timezone
      const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()); // Set start date to midnight (00:00 AM) of the current date
      const endDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000 - 1); // Set end date to 11:59 PM of the current date


      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM vehicleInOutTable WHERE (date_time_Out >= ? AND date_time_out <= ?) AND date_time_out IS NOT NULL',
          [startDate.toISOString(), endDate.toISOString()],
          (tx, result) => {
            if (result.rows.length > 0) {
              const { rows } = result;
              const data = [];
              for (let i = 0; i < rows.length; i++) {
                data.push(rows.item(i));
              }
              resolve(data.length);
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

  const calculateTotalAmount = async () => {
    const db = await getDatabaseConnection();
    return new Promise((resolve, reject) => {

      const currentDate = new Date(); // Get current date in local timezone
      const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()); // Set start date to midnight (00:00 AM) of the current date
      const endDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000 - 1); // Set end date to 11:59 PM of the current date

      db.transaction(
        tx => {
          tx.executeSql(
            'SELECT SUM(paid_amt) AS totalAmount FROM vehicleInOutTable WHERE date_time_in >= ? AND date_time_in <= ?',
            [startDate.toISOString(), endDate.toISOString()],
            (_, resultSet) => {
              if (resultSet.rows.length > 0) {
                const { totalAmount } = resultSet.rows.item(0);
                resolve(totalAmount);
              } else {
                resolve(0); // Return 0 if no records found
              }
            },
            (_, error) => {
              reject(error);
            }
          );
        },
        error => {
          reject(error);
        }
      );
    });
  };


  const calculateStatistics = async () => {
    const db = await getDatabaseConnection();
    const currentDate = new Date();
    const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    const endDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000 - 1);
  
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          `SELECT
             (SELECT COUNT(*) FROM vehicleInOutTable WHERE date_time_in >= ? AND date_time_in <= ?) AS vehicleInCount,
             (SELECT COUNT(*) FROM vehicleInOutTable WHERE (date_time_Out >= ? AND date_time_out <= ?) AND date_time_out IS NOT NULL) AS vehicleOutCount,
             COALESCE((SELECT SUM(paid_amt) FROM vehicleInOutTable WHERE date_time_in >= ? AND date_time_in <= ?), 0) AS totalAmount`,
          [startDate.toISOString(), endDate.toISOString(), startDate.toISOString(), endDate.toISOString(), startDate.toISOString(), endDate.toISOString()],
          (_, result) => {
            const { vehicleInCount, vehicleOutCount, totalAmount } = result.rows.item(0);
            resolve({
              vehicleInCount,
              vehicleOutCount,
              totalAmount,
            });
          },
          error => {
            reject(error);
          }
        );
      });
    });
  };
  

  const getAllVehicles = async () => {
    const db = await getDatabaseConnection()
    return new Promise((resolve, reject) => {
      db.transaction(
        tx => {
          tx.executeSql(
            'SELECT * FROM vehicleInOutTable',
            [],
            (_, resultSet) => {
              const { rows } = resultSet;
              const data = [];
              for (let i = 0; i < rows.length; i++) {
                data.push(rows.item(i));
              }
              console.log("HEY IND")
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


  const getAllInVehiclesPastMonth = async () => {
    const db = await getDatabaseConnection();

    // Calculate the date of one month ago
    const currentDate = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    return new Promise((resolve, reject) => {
      db.transaction(
        tx => {
          tx.executeSql(
            'DELETE FROM vehicleInOutTable WHERE date_time_in <= ? AND isUploadedIN = 1',
            [oneMonthAgo.toISOString()], // Pass the timestamp of one month ago as the parameter
            (_, resultSet) => {
              const affectedRows = resultSet.rowsAffected;
              // console.log("hello pppp",affectedRows)
              resolve(affectedRows);
            },
            (_, error) => {
              console.warn("helloooo dele", error);
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


  const getAllOutVehiclesPastMonth = async () => {
    const db = await getDatabaseConnection();

    // Calculate the date of one month ago
    const currentDate = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    return new Promise((resolve, reject) => {
      db.transaction(
        tx => {
          tx.executeSql(
            'DELETE FROM vehicleInOutTable WHERE date_time_out IS NOT NULL AND date_time_out <= ? AND isUploadedOUT IS 1',
            [oneMonthAgo.toISOString()], // Pass the timestamp of one month ago as the parameter
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


  const getAllInVehicles = async () => {
    const db = await getDatabaseConnection()
    return new Promise((resolve, reject) => {
      db.transaction(
        tx => {
          tx.executeSql(
            'SELECT * FROM vehicleInOutTable WHERE isUploadedIN IS 0',
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

  const getAllOutVehicles = async () => {
    const db = await getDatabaseConnection()
    return new Promise((resolve, reject) => {
      db.transaction(
        tx => {
          tx.executeSql(
            'SELECT * FROM vehicleInOutTable WHERE isUploadedOUT IS 0 AND date_time_out IS NOT NULL',
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


  const updateIsUploadedINById = async (date_time_in) => {
    const db = await getDatabaseConnection();
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'UPDATE vehicleInOutTable SET isUploadedIN = ? WHERE date_time_in = ?',
          [1, date_time_in],
          (_, resultSet) => {
            if (resultSet.rowsAffected > 0) {
              resolve(true); // Successfully updated
            } else {
              resolve(false); // Record not found or update unsuccessful
            }
          },
          (_, error) => {
            reject(error); // Error occurred during the update
          }
        );
      });
    });
  };


  const updateIsUploadedOUTById = async (date_time_in) => {
    const db = await getDatabaseConnection();
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'UPDATE vehicleInOutTable SET isUploadedOUT = ? WHERE date_time_in = ?',
          [1, date_time_in],
          (_, resultSet) => {
            if (resultSet.rowsAffected > 0) {
              resolve(true); // Successfully updated
            } else {
              resolve(false); // Record not found or update unsuccessful
            }
          },
          (_, error) => {
            reject(error); // Error occurred during the update
          }
        );
      });
    });
  };

  const getAllUnbilledRecords = async (fromDate, toDate) => {
    const db = await getDatabaseConnection()

    const currentDate = new Date(fromDate); // Get current date in local timezone
    const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()); // Set start date to midnight (00:00 AM) of the current date

    const endDate2 = new Date(toDate);
    const endDateStart = new Date(endDate2.getFullYear(), endDate2.getMonth(), endDate2.getDate());
    const endDate = new Date(endDateStart.getTime() + 24 * 60 * 60 * 1000 - 1); // Set end date to 11:59 PM of the current date

    // console.log(startDate, "------------------unbilled Time----------------", endDate)
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM vehicleInOutTable WHERE date_time_out IS NULL AND  oprn_mode <> "F" AND date_time_in >= ? AND date_time_in <= ?',
          [startDate.toISOString(), endDate.toISOString()],
          (_, resultSet) => {
            const records = [];
            for (let i = 0; i < resultSet.rows.length; i++) {
              const record = resultSet.rows.item(i);
              records.push(record);
            }
            resolve(records);
          },
          (_, error) => {
            reject(error); // Error occurred during the query
          }
        );
      });
    });
  };


  const getVehicleWiseReports = async (fromDate, toDate) => {
    const db = await getDatabaseConnection()

    const currentDate = new Date(fromDate); // Get current date in local timezone
    const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()); // Set start date to midnight (00:00 AM) of the current date

    const endDate2 = new Date(toDate);
    const endDateStart = new Date(endDate2.getFullYear(), endDate2.getMonth(), endDate2.getDate());
    const endDate = new Date(endDateStart.getTime() + 24 * 60 * 60 * 1000 - 1); // Set end date to 11:59 PM of the current date

    console.log(startDate, "------------------unbilled Time----------------", endDate)
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT vehicleType, COUNT(*) AS quantity, SUM(paid_amt) AS totalAmount, SUM(advance) AS TotalAdvance FROM vehicleInOutTable WHERE date_time_out IS NOT NULL AND date_time_out >= ? AND date_time_out <= ? GROUP BY vehicleType',
          [startDate.toISOString(), endDate.toISOString()],
          (_, resultSet) => {
            const records = [];
            for (let i = 0; i < resultSet.rows.length; i++) {
              const record = resultSet.rows.item(i);
              records.push(record);
            }
            resolve(records);
          },
          (_, error) => {
            reject(error); // Error occurred during the query
          }
        );
      });
    });
  }

  const getOperatorWiseReports = async (fromDate, toDate) => {
    const db = await getDatabaseConnection()

    const currentDate = new Date(fromDate); // Get current date in local timezone
    const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()); // Set start date to midnight (00:00 AM) of the current date

    const endDate2 = new Date(toDate);
    const endDateStart = new Date(endDate2.getFullYear(), endDate2.getMonth(), endDate2.getDate());
    const endDate = new Date(endDateStart.getTime() + 24 * 60 * 60 * 1000 - 1); // Set end date to 11:59 PM of the current date

    console.log(startDate, "------------------unbilled Time----------------", endDate)
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT opratorName, COUNT(*) AS quantity, SUM(paid_amt) AS totalAmount, SUM(advance) AS TotalAdvance FROM vehicleInOutTable WHERE date_time_out IS NOT NULL AND date_time_out >= ? AND date_time_out <= ? GROUP BY opratorName',
          [startDate.toISOString(), endDate.toISOString()],
          (_, resultSet) => {
            const records = [];
            for (let i = 0; i < resultSet.rows.length; i++) {
              const record = resultSet.rows.item(i);
              records.push(record);
            }
            resolve(records);
          },
          (_, error) => {
            reject(error); // Error occurred during the query
          }
        );
      });
    });
  }

  const handleCheckIsVehicleOut = async (vehicle_no, date_time_in) => {
    const db = await getDatabaseConnection()

    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT COUNT(*) as count FROM vehicleInOutTable WHERE vehicle_no = ? AND date_time_in = ? AND date_time_out IS NOT NULL',
          [vehicle_no, date_time_in],
          (_, resultSet) => {
            const count = resultSet.rows.item(0).count;
            resolve(count > 0);
          },
          (_, error) => {
            reject(error); // Error occurred during the query
          }
        );
      });
    });
  }

  const updateMultipleisUploadedIn = async (dataToUpdate) => {
    const db = await getDatabaseConnection();

    // Convert date-time strings to ISO format

    console.log("moon dataa ", dataToUpdate.length)
    const isoDateTimes = dataToUpdate.map(dateTime => new Date(dateTime).toISOString().slice(0, -5) + "Z");

    const placeholders = isoDateTimes.map(() => '?').join(', ');
    // 2023-08-25 18:02:23 ->  2023-08-25 18:05:23", "2023-08-25 18:05:30
    //?, ?     placeholders -------------------- 2023-08-25T12:35:23.000Z 2023-08-25T12:35:30.000Z
    console.log(placeholders, "    placeholders --------------------", ...isoDateTimes)

    const query = `UPDATE vehicleInOutTable SET isUploadedIN = ? WHERE date_time_in IN (${placeholders})`;

    console.log("query is == ", query)
    //  LOG  query is ==  UPDATE vehicleInOutTable SET isUploadedIN = ? WHERE date_time_in IN (?, ?)

    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          query,
          [1, ...isoDateTimes],
          (_, resultSet) => {
            if (resultSet.rowsAffected > 0) {
              console.log("--------------------------------------true ----------")
              resolve(true); // Successfully updated
            } else {
              console.log("--------------------------------------  false ----------")
              resolve(false); // No records found or update unsuccessful
            }
          },
          (_, error) => {
            console.log("-------------------------------------- error ----------")
            reject(error); // Error occurred during the update
          }
        );
      });
    });
  };



  const updateMultipleisUploadedOut = async (dataToUpdate) => {
    const db = await getDatabaseConnection();

    // Convert date-time strings to ISO format
    const isoDateTimes = dataToUpdate.map(dateTime => new Date(dateTime).toISOString().slice(0, -5) + "Z");

    const placeholders = isoDateTimes.map(() => '?').join(', ');
    // 2023-08-25 18:02:23 ->  2023-08-25 18:05:23", "2023-08-25 18:05:30
    //?, ?     placeholders -------------------- 2023-08-25T12:35:23.000Z 2023-08-25T12:35:30.000Z
    console.log(placeholders, "    placeholders --------------------", ...isoDateTimes)

    const query = `UPDATE vehicleInOutTable SET isUploadedOUT = ? WHERE date_time_out IN (${placeholders})`;

    console.log("query is == ", query)
    //  LOG  query is ==  UPDATE vehicleInOutTable SET isUploadedIN = ? WHERE date_time_in IN (?, ?)

    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          query,
          [1, ...isoDateTimes],
          (_, resultSet) => {
            if (resultSet.rowsAffected > 0) {
              console.log("--------------------------------------true ----------")
              resolve(true); // Successfully updated
            } else {
              console.log("--------------------------------------  false ----------")
              resolve(false); // No records found or update unsuccessful
            }
          },
          (_, error) => {
            console.log("-------------------------------------- error ----------")
            reject(error); // Error occurred during the update
          }
        );
      });
    });
  };



  const amit = async (date_time_out, user_id_out, mc_srl_no_out, duration, paid_amt, isUploadedOUT,
    gst_flag, base_amt, cgst, sgst, vehicle_no, date_time_in) => {
    const db = await getDatabaseConnection();
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'UPDATE vehicleInOutTable SET date_time_out = ?, user_id_out = ?, mc_srl_no_out = ?, duration = ?, paid_amt = ?, isUploadedOUT = ?, gst_flag = ?, base_amt = ?,cgst = ?,sgst = ? ',
          [
            "2023-08-28T09:04:52Z", '1', '1234567890', 0, 200, false,
            "N", 0, 0, 0,
          ],

          (_, resultSet) => {
            if (resultSet.rowsAffected > 0) {
              resolve(true); // Successfully updated
            } else {
              resolve(false); // Record not found or update unsuccessful
            }
          },
          (_, error) => {
            reject(error); // Error occurred during the update
          }
        );
      });
    });
  };


  useEffect(() => {
    createVehicleInOutTable()
    //  getAllVehicles().then(res=>console.log("--------pio-----------",res)).catch(err=>console.error(err))

    // amit().then(res=>console.log("---------------**********amit**********---------",res)).catch(err=>{
    //   console.log("---------------**********amit**********---------",err)
    // })
  }, [])

  return {
    createVehicleInOut, createOrUpdateVehicleInOut, getDataByIdOrVehicleNumberStartsWith, getAllInOutVehicle,
    calculateTotalAmount, calculateTotalVehicleIn, calculateTotalVehicleOut,
    getAllInVehicles, getAllOutVehicles,
    updateIsUploadedINById, updateIsUploadedOUTById,
    getAllUnbilledRecords,
    getVehicleWiseReports,
    getOperatorWiseReports,
    handleCheckIsVehicleOut,
    getAllInVehiclesPastMonth,
    getAllOutVehiclesPastMonth,
    updateMultipleisUploadedIn,
    updateMultipleisUploadedOut,
    amit,

    calculateStatistics
  }
}

export default VehicleInOutStore
