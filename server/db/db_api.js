//import { getConnection } from './db_connection.js';
const dbCon = require('./db_connection.js');

async function getUsers() {
    return new Promise((resolve, reject) => {
        dbCon.getConnection((connection) => {
            connection.query('SELECT * FROM users', (err, result) => {
                if (err) {
                    reject(err);
                }
                resolve(result);
            });
        });
    });
}

module.exports = {getUsers};