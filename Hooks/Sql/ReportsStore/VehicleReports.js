import React from 'react'
import getDatabaseConnection from '../getDatabaseConnection';

function VehicleReports() {

    const getUnbilledRecords = async (fromDate, toDate) => {
        const db = await getDatabaseConnection()

        console.log("------------------unbilled Time----------------",fromDate,toDate)
        
        return new Promise((resolve, reject) => {
          db.transaction(tx => {
            tx.executeSql(
              'SELECT * FROM vehicleInOutTable WHERE date_time_out IS NULL AND date_time_in >= ? AND date_time_in <= ?',
              [fromDate, toDate],
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
    
      const getVehicleWiseReports = async ()=>{
        const db  = await getDatabaseConnection()
        return new Promise((resolve, reject) => {
          db.transaction(tx => {
            tx.executeSql(
              'SELECT vehicleType, COUNT(*) AS quantity, SUM(paid_amt) AS totalAmount FROM vehicleInOutTable GROUP BY vehicleType',
              [fromDate, toDate],
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

      
  return {getUnbilledRecords,getVehicleWiseReports}
}

export default VehicleReports