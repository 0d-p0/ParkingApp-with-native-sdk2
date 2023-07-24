import SQLite from 'react-native-sqlite-storage';
import { useEffect, useState } from "react"

function getDBconnection() {

  const [data, setData] = useState(false)

  const [db, setDb] = useState(null);
// open Database
//  const db = SQLite.openDatabase(
//   { name: 'parkingDatabase.db', location: 'default' },
//   () => console.log("dataBase create succesfully"),
//   error => console.log(error)
// );  


  // create allUser Table
  useEffect(() => {

    const database = SQLite.openDatabase(
      { name: 'parkingDatabase.db', location: 'default' },
      () => {
        // console.log("database created successfully");
        setDb(database); // Store the database object in state
      },
      // error => console.log(error)
    );

    // db.transaction(tx => {
    //   tx.executeSql(
    //     'CREATE TABLE IF NOT EXISTS allUser (id INTEGER PRIMARY KEY AUTOINCREMENT, mobile NUMBER UNIQUE, password TEXT)',
    //     [],
    //     () => {},
    //     error => console.log(error)
    //   );
    // });


    // db.transaction(tx => {
    //   tx.executeSql(
    //     'CREATE TABLE IF NOT EXISTS entryReceiptTable (id INTEGER PRIMARY KEY AUTOINCREMENT,vehicleType TEXT, receiptNo INTEGER, vehicleNumber TEXT, inDate DATE, inTime TEXT)',
    //     [],
    //     () => console.log("leave receipt table"),
    //     error => console.error('Error creating table: ', error)
    //   );
    // });

  }, [])


  const createEntryReceipt = async (vehicleType,receiptNo, vehicleNumber, inDate, inTime ) => {
    await db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO receiptTable (vehicleType,receiptNo, vehicleNumber, inDate, inTime) VALUES (?,?, ?,?, ?)',
        [vehicleType,receiptNo, vehicleNumber, inDate, inTime],
        // () => console.warn('entry Data store in offline'),
        // error => console.warn(error)
      );
    });
  }
  const deleteallReceiptData = () => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM receiptTable;',
        [],
        () => console.log('Data deleted successfully.'),
        error => console.error('Error deleting data: ', error)
      );
    });
  };
  
  const retrieveAllData = callback => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM receiptTable;',
        [],
        (tx, results) => callback(results.rows.raw()),
        error => console.error('Error retrieving data: ', error)
      );
    });
  };

  
  

  // Create new User
  const createUser = async (mobile, password) => await db.transaction(tx => {
    tx.executeSql(
      'INSERT INTO allUser (mobile, password) VALUES (?, ?)',
      [mobile, password],
      // () => console.warn('Data inserted'),
      // error => console.warn(error)
    );
  });

  // check user in database
  const checkUser = async (mobile, password) => {
    try {
      const result = await new Promise((resolve, reject) => {
        db.transaction(tx => {
          tx.executeSql(
            'SELECT * FROM allUser',
            [],
            (tx, results) => {
              const len = results.rows.length;
              for (let i = 0; i < len; i++) {
                const row = results.rows.item(i);
                console.log(`Mobile: ${row.mobile}, password: ${row.password}`);

                if (row.mobile == mobile && row.password == password) {
                  console.log(`Mobile: ${row.mobile}, password: ${row.password}`);
                  resolve(true);
                  return;
                }
              }

              resolve(false);
            },
            error => {
              console.log(error);
              reject(error);
            }
          );
        });
      });

      return result;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  useEffect(() => {
   
    // deleteallReceiptData()
}, [])


  return { createUser, checkUser, data, db , createEntryReceipt}
}

export default getDBconnection
