
const doesColumnExist = (db, tableName, columnName) =>
    new Promise((resolve) => {
        db.transaction((txn) => {
            txn.executeSql(
                `PRAGMA table_info(${tableName});`,
                [],
                (tx, result) => {
                    const columns = result.rows.raw();
                    const columnExists = columns.some((column) =>
                        column.name === columnName
                    );
                    resolve(columnExists);
                },
                (error) => {
                    console.error(error);
                    resolve(false); // Handle the error condition as needed
                }
            );
        });
    });

const addColumnIfNeeded = async (db, tableName, columnName) => {

    if (!db) {
        return
    }
    if (!tableName) {
        return
    }
    if (!columnName) {
        return
    }
    const columnExists = await doesColumnExist(db, tableName, columnName);

    if (!columnExists) {
        db.transaction((txn) => {
            txn.executeSql(
                `ALTER TABLE ${tableName} ADD COLUMN ${columnName} TEXT;`,
                [],
                (tx, result) => {
                    console.log('New column added');
                },
                (error) => {
                    console.error(error);
                }
            );
        });
    }
};

export default addColumnIfNeeded;
