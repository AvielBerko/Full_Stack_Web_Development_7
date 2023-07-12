// write a script to fill the database with data
//
// 1. create a connection to the database
// 2. create a function to insert data to a table

const mysql = require('mysql2');

MYSQL_HOST = '127.0.0.1'
MYSQL_USER = 'root'
MYSQL_PASSWORD = 'itamar8236'

db_name = 'fswd7db'

const connection = mysql.createConnection({
    host: MYSQL_HOST,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
});

connection.query(
    `USE ${db_name}`,
    (err, res) => {
        if (err) throw err;
        console.log(`using ${db_name}`);
        fill_db();
    } 
);

function fill_db(){
    //reset the table data
    connection.query(
        `TRUNCATE TABLE users;`,
        (err, res) => {
            if (err) throw err;
            console.log(`users truncated!`);
        }
    );
    //insert data to tables
    //insert data to users
    connection.query(
        `INSERT INTO users (name) VALUES ('itamar'), ('shay'), ('david'), ('yossi'), ('moshe');`,
        (err, res) => {
            if (err) throw err;
            console.log(`users filled!`);
        }
    );
}