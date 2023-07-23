// write a script to fill the database with data
//
// 1. create a connection to the database
// 2. create a function to insert data to a table

const mysql = require('mysql2');
const {v4: uuidv4} = require('uuid');

MYSQL_HOST = '127.0.0.1'
MYSQL_USER = 'root'
MYSQL_PASSWORD = 'itamar8236'

db_name = 'fswd7db'

const connection = mysql.createConnection({
    host: MYSQL_HOST,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
});

//users data section
const users = [
    {id: uuidv4(), name: 'itamar', email: 'itamar@gmail.com', phone_number: '0503812813' }, 
    {id: uuidv4(), name: 'aviel', email: 'aviel@gmail.com', phone_number: '0549155988' }, 
    {id: uuidv4(), name: 'shay', email: 'shay@gmail.com', phone_number: '0506260021' }, 
    {id: uuidv4(), name: 'david', email: 'david@gmail.com', phone_number: '0505216630' }, 
    {id: uuidv4(), name: 'yossi', email: 'yossi@gmail.com', phone_number: '0504087980' }, 
    {id: uuidv4(), name: 'moshe', email: 'moshe@gmail.com', phone_number: '0548433630' }, 
]

const users_values = users.map(user => [user.id, user.name, user.email, user.phone_number, true])


//passwords data section:
const passwords_values = users.map(user=> [user.id, 'itamar8236'])


//admins data section:
const admins_values = users.slice(0, 2).map(user=> [uuidv4(), user.id])


//filling all data
connection.query(
    `USE ${db_name}`,
    (err, res) => {
        if (err) throw err;
        console.log(`using ${db_name}`);
        fill_db();
    } 
);

//filling values - order matters
function fill_db(){
    fill_users();
    fill_passwords();
    fill_admins();
}






//users filler section 
function fill_users(){
    //empty_table('users'); `TRUNCATE TABLE ${table_name};` - issue with deleting reference key, use build to initalize


    //insert data to users
    connection.query(
        `INSERT INTO users (id, name, email, phone_number, valid) VALUES ?;`,
        [users_values],
        (err, res) => {
            if (err) throw err;
            console.log(`users filled!`);
            //console.log(`${users[0].name}'s id: ${users[0].id}`)
        }
    );
}


//passwords filler section:
function fill_passwords(){
    //insert data to passwords
    connection.query(
        `INSERT INTO passwords (user_id, password) VALUES ?;`,
        [passwords_values],
        (err, res) => {
            if (err) throw err;
            console.log(`passwords filled!`);
        }
    );
}

function fill_admins(){
    //insert data to admins
    connection.query(
        `INSERT INTO admins (id, user_id) VALUES ?;`,
        [admins_values],
        (err, res) => {
            if (err) throw err;
            console.log(`admins filled!`);
        }
    );
}
