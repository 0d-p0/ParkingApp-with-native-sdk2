import React, {useEffect} from 'react';
import getDatabaseConnection from '../getDatabaseConnection';

function dashboardStorage() {
  const createDashboardTable = async () => {
    // Create the collectionTable
    const db = await getDatabaseConnection();
    db.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS collectionTable (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        carin INTEGER,
        carout INTEGER,
        totalCollection TEXT
      )`,
        [],
        () => {
          console.log('collectionTable created successfully');
        },
        error => {
          console.error('Error creating collectionTable: ', error);
        },
      );
    });
  };
// Function to create or update entry in collectionTable
// const db = await getDatabaseConnection();

// Function to create or update entry in collectionTable
const createOrUpdateCollectionEntry = async(carIn, carOut, totalCollection) => {
    const db = await getDatabaseConnection();

  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `INSERT OR REPLACE INTO collectionTable (id, carin, carout, totalCollection)
        VALUES ((SELECT id FROM collectionTable LIMIT 1),
        ?, ?, ?)`,
        [carIn, carOut, totalCollection],
        (tx, result) => {
          resolve(result.insertId || null);
        },
        (error) => {
          reject(error);
        }
      );
    });
  });
};


  // Function to get all data from collectionTable
const getAllCollectionData = async() => {
    const db = await getDatabaseConnection();

    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM collectionTable',
          [],
          (tx, result) => {
            const entries = [];
            const rows = result.rows;
            for (let i = 0; i < rows.length; i++) {
              entries.push(rows.item(i));
            }
            resolve(entries);
          },
          (error) => {
            reject(error);
          }
        );
      });
    });
  };
  

  useEffect(() => {
    createDashboardTable();
  }, []);
  return {createOrUpdateCollectionEntry,getAllCollectionData};
}

export default dashboardStorage;
