const db_connection = require('./db_connection.js');

function create(table, data){
    return new Promise((resolve, reject) => {
        db_connection.getConnection(con => {
            con.query(`INSERT INTO ${table} SET ?;`, 
            data,
            (error, result) => {
                if (error) reject(error);
                resolve(result);
            }
            );
        })
    });
}

function read(table, condition = null, limits = null){
    return new Promise((resolve, reject) => {
        db_connection.getConnection(con => {
            let query = `SELECT * FROM ${table}`;
            let values = [];

            if (condition){
                const conditions = Object.entries(condition).map(([key, value]) => {
                    values.push(value);
                    return `${key} = ?`;
                  });

                  query += ` WHERE ${conditions.join(' AND ')}`;
            } 

            query += ` ORDER BY id`;

            if(limits){
                query += ` LIMIT ?, ?`;
                values.push(limits.start, limits.length)
            }

            query += `;`;
            con.query(query, 
            values,
            (error, result) => {
                if (error) reject(error);
                resolve(result);
            }
            );
        })
    });
}

function update(table, data, condition){
    return new Promise((resolve, reject) => {
        
        const columnsToUpdate = Object.keys(data).map(key => `${key} = ?`).join(', ');
        const conditionColumns = Object.keys(condition).map(key => `${key} = ?`).join(' AND ');

        const valuesToUpdate = Object.values(data);
        const conditionValues = Object.values(condition);

        const query = `UPDATE ${table} SET ${columnsToUpdate} WHERE ${conditionColumns}`;
        const values = [...valuesToUpdate, ...conditionValues];
        db_connection.getConnection(con => {
            con.query(query, 
            values,
            (error, result) => {
                if (error) reject(error);
                resolve(result);
            }
            );
        })
    });
}

//our db rely on updating valid=false as delete (soft delete). 

module.exports = {create, read, update};
