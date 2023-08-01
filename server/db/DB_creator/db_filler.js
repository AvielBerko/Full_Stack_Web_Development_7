// write a script to fill the database with data
//
// 1. create a connection to the database
// 2. create a function to insert data to a table

const mysql = require('mysql2');
const {v4: uuidv4} = require('uuid');
const dbConfig = require('../db_config.js')

MYSQL_HOST = dbConfig.HOST;
MYSQL_USER = dbConfig.USER;
MYSQL_PASSWORD = dbConfig.PASSWORD
db_name = dbConfig.DB_NAME

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
const passwords_values = users.map(user=> [uuidv4(), user.id, 'itamar8236', true]);

//contacts data section:
const contacts_values = users.slice(1).map(user=> [uuidv4(), users[0].id, user.id, user.name + '1', true]).concat([[uuidv4(), users[1].id, users[0].id, 'itamar1', true]])

//dmessages data section:
const dmessages_values = [
    [uuidv4(), users[0].id, users[1].id, 'Hello, this is a direct message from itamar to aviel', 'text', new Date(), false, true],
    [uuidv4(), users[1].id, users[0].id, 'Hello, this is a direct message from aviel to itamar', 'text', new Date(), false, true],
    [uuidv4(), users[2].id, users[5].id, 'Hello, this is a direct message from shay to moshe', 'text', new Date(), false, true],
]
for (let i = 0; i < 3; i++) {
    dmessages_values[i][5].setSeconds(i);
  }

//groupchat data section:
const groupchat_values = [
    [uuidv4(), 'work little and get much', new Date(), true],
    [uuidv4(), 'the boring people group', new Date(), true],
]
for (let i = 0; i < 2; i++) {
    groupchat_values[i][2].setSeconds(i);
  }

const g1_id = groupchat_values[0][0]
const g2_id = groupchat_values[1][0]

//groupusers data section:
const groupusers_values = [
    [uuidv4(), g1_id, users[0].id, true, true],
    [uuidv4(), g1_id, users[1].id, false, true],

    [uuidv4(), g2_id, users[1].id, true, true],
    [uuidv4(), g2_id, users[3].id, false, true],
    [uuidv4(), g2_id, users[4].id, false, true],
]

const gmessages_values = [
    [uuidv4(), g1_id, users[0].id, 'this is important group message from itamar', 'text', new Date(), false, true],
    [uuidv4(), g1_id, users[1].id, 'this is important group message from aviel', 'text', new Date(), false, true], 
    
    [uuidv4(), g2_id, users[1].id, 'this is boring group message from aviel', 'text', new Date(), false, true], 
    [uuidv4(), g2_id, users[3].id, 'this is boring group message from david', 'text', new Date(), false, true], 
    [uuidv4(), g2_id, users[4].id, 'this is boring group message from yossi', 'text', new Date(), false, true], 
]
for (let i = 0; i < 5; i++) {
    gmessages_values[i][5].setSeconds(i);
  }


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
    fill_contacts();
    fill_dmessages();
    fill_groupchat();
    fill_groupusers();
    fill_gmessages();
}






//users filler section 
function fill_users(){
    //empty_table('users'); `TRUNCATE TABLE ${table_name};` - issue with deleting reference key, use build to initalize


    //insert data to users
    connection.query(
        `INSERT INTO users (id, username, email, phone_number, valid) VALUES ?;`,
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
        `INSERT INTO passwords (id, user_id, password, valid) VALUES ?;`,
        [passwords_values],
        (err, res) => {
            if (err) throw err;
            console.log(`passwords filled!`);
        }
    );
}

function fill_contacts(){
    //insert data to contacts
    connection.query(
        `INSERT INTO contacts (id, saver_id, user_id, name, valid) VALUES ?;`,
        [contacts_values],
        (err, res) => {
            if (err) throw err;
            console.log(`contacts filled!`);
        }
    );
}

function fill_dmessages(){
    //insert data to dmessages
    connection.query(
        `INSERT INTO dmessages (id, sender_id, receiver_id, message, type, time_sent, edited, valid) VALUES ?;`,
        [dmessages_values],
        (err, res) => {
            if (err) throw err;
            console.log(`dmessages filled!`);
        }
    );
}


function fill_groupchat(){
    //insert data to groups
    connection.query(
        `INSERT INTO groupchat (id, name, time_created, valid) VALUES ?;`,
        [groupchat_values],
        (err, res) => {
            if (err) throw err;
            console.log(`groupchat filled!`);
        }
    );
}

function fill_groupusers(){
    //insert data to groups
    connection.query(
        `INSERT INTO groupusers (id, groupchat_id, user_id, admin, valid) VALUES ?;`,
        [groupusers_values],
        (err, res) => {
            if (err) throw err;
            console.log(`groupusers filled!`);
        }
    );
}

function fill_gmessages(){
    //insert data to groups
    connection.query(
        `INSERT INTO gmessages (id, groupchat_id, sender_id, message, type, time_sent, edited, valid) VALUES ?;`,
        [gmessages_values],
        (err, res) => {
            if (err) throw err;
            console.log(`gmessages filled!`);
        }
    );
}
