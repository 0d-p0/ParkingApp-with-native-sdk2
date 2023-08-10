import { useEffect } from "react"
import getDatabaseConnection from "../getDatabaseConnection";

function gstSettingStorage() {
    const createGstSettingsTable = async () => {
        // Create the collectionTable
        const db = await getDatabaseConnection();
        db.transaction(tx => {
            tx.executeSql(
                `CREATE TABLE IF NOT EXISTS gstSettingsTable (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
             gst_id INTEGER,
            subclient_id INTEGER,
            gst_flag TEXT,
            gst_type TEXT,
            gst_number TEXT,
            cgst INTEGER,
            sgst INTEGER,
            created_by INTEGER,
            updated_by TEXT,
            created_at TEXT,
            updated_at TEXT
          )`,
                [],
                () => {
                    console.log('GST TABLE created successfully');
                },
                error => {
                    console.error('Error creating GST TABLE: ', error);
                },
            );
        });
    };


    const deleteAllGSTSettings = async () => {
        const db = await getDatabaseConnection();

        return new Promise((resolve, reject) => {
            db.transaction(
                tx => {
                    tx.executeSql(
                        'DELETE FROM gstSettingsTable',
                        [],
                        (_, resultSet) => {
                            console.warn('All GST SETTINGS data deleted successfully');
                            resolve(null); // Resolving with null since all data is deleted
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


    const storeGSTSettings = async (data) => {
        const db = await getDatabaseConnection()
        const { gst_id, subclient_id, gst_flag, gst_type, gst_number, cgst, sgst, created_by, updated_by, created_at, updated_at } = data ||{}
        await deleteAllGSTSettings()
        return new Promise((resolve, reject) => {
            db.transaction(
                tx => {
                    tx.executeSql(
                        'INSERT INTO gstSettingsTable( gst_id, subclient_id, gst_flag, gst_type, gst_number, cgst, sgst, created_by, updated_by, created_at, updated_at) VALUES (?,?, ?,?,?,?, ?,?,?,?, ?)',
                        [gst_id, subclient_id, gst_flag, gst_type, gst_number, cgst, sgst, created_by, updated_by, created_at, updated_at],
                        (_, resultSet) => {
                            console.log('GST settings stores offline');
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
        });
    }
    const getAllGstSettings = async () => {

        const db = await getDatabaseConnection()

        return new Promise((resolve, reject) => {

            db.transaction(
                tx => {
                    tx.executeSql(
                        'SELECT * FROM gstSettingsTable',
                        [],
                        (_, resultSet) => {
                            const { rows } = resultSet;
                            const data = [];
                            for (let i = 0; i < rows.length; i++) {
                                data.push(rows.item(i));
                            }
                            resolve(data[0]);
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

    useEffect(() => {
        createGstSettingsTable()
    }, [])
    return { getAllGstSettings, storeGSTSettings }
}

export default gstSettingStorage
