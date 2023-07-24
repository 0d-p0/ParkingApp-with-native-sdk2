import SQLite from 'react-native-sqlite-storage';


function getDatabaseConnection() {
  return SQLite.openDatabase(
    { name: 'parkingDatabase.db', location: 'default' },
    // () => {
    //   console.log("database opened successfully");
     
    // },
    //  error => console.log(error)
    );
}

export default getDatabaseConnection
