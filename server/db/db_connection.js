const mysql = require('mysql2')
const dbConfig = require('./db_config.js')

console.log()
const connectionConfig = {
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB_NAME,
  ssl: {
    rejectUnauthorized: false,
  },
};

var connectionPool = mysql.createPool(connectionConfig);

function getConnection(callback) {
  connectionPool.getConnection((err, connection) => {
    if (err) {
      console.error("Error connecting to database: " + err.stack);
      return;
    }
    callback(connection);
    connection.release();
  });
}
module.exports = { getConnection };