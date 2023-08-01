const mysql = require('mysql2')
const dbConfig = require('../db_config.js')

MYSQL_HOST = dbConfig.HOST;
MYSQL_USER = dbConfig.USER;
MYSQL_PASSWORD = dbConfig.PASSWORD
db_name = dbConfig.DB_NAME

const tables = {
    users: {
        columns: [
            'id VARCHAR(36) PRIMARY KEY',
            'username VARCHAR(255)',
            'email VARCHAR(255)',
            'phone_number VARCHAR(10)',
            'valid BOOLEAN',
            'unarchived BOOLEAN AS (CASE WHEN valid = 1 THEN 1 ELSE NULL END) VIRTUAL',//interest
        ],
        constraints: [
            'UNIQUE (username, unarchived)',
            'UNIQUE (email, unarchived)',
        ]
    },
    passwords: {
        columns: [
            'id VARCHAR(36) PRIMARY KEY',
            'user_id VARCHAR(36)',
            'password VARCHAR(36)',
            'valid BOOLEAN',
            'unarchived BOOLEAN AS (CASE WHEN valid = 1 THEN 1 ELSE NULL END) VIRTUAL',
        ],
        constraints: [
            'FOREIGN KEY (user_id) REFERENCES users(id)',
            'UNIQUE (user_id, unarchived)',
        ]
    },
    contacts: {
        columns: [
            'id VARCHAR(36) PRIMARY KEY',
            'saver_id VARCHAR(36)',
            'user_id VARCHAR(36)',
            'name VARCHAR(255)',
            'valid BOOLEAN',
            'unarchived BOOLEAN AS (CASE WHEN valid = 1 THEN 1 ELSE NULL END) VIRTUAL',
        ],
        constraints: [
            'UNIQUE (saver_id, user_id, unarchived)',
            'FOREIGN KEY (saver_id) REFERENCES users(id)',
            'FOREIGN KEY (user_id) REFERENCES users(id)',
            'UNIQUE (saver_id, name, unarchived)',
        ]
    },
    dmessages: {
        columns: [
            'id VARCHAR(36) PRIMARY KEY',
            'sender_id VARCHAR(36)',
            'receiver_id VARCHAR(36)',
            'message TEXT',
            'type VARCHAR(5)',//text, pic, video
            'time_sent TIMESTAMP',
            'edited BOOLEAN',
            'valid BOOLEAN',
        ],
        constraints: [
            'FOREIGN KEY (sender_id) REFERENCES users(id)',
            'FOREIGN KEY (receiver_id) REFERENCES users(id)',
        ]
    },

    groupchat: {
        columns: [
            'id VARCHAR(36) PRIMARY KEY',
            'name VARCHAR(255)',
            'time_created TIMESTAMP',
            'valid BOOLEAN',
            'unarchived BOOLEAN AS (CASE WHEN valid = 1 THEN 1 ELSE NULL END) VIRTUAL',
        ],
        constraints: [
            'UNIQUE (name, unarchived)',
        ]
    },

    groupusers: {
        columns: [
            'id VARCHAR(36) PRIMARY KEY',
            'groupchat_id VARCHAR(36)',
            'user_id VARCHAR(36)',
            'admin BOOLEAN',
            'valid BOOLEAN',
            'unarchived BOOLEAN AS (CASE WHEN valid = 1 THEN 1 ELSE NULL END) VIRTUAL',
        ],
        constraints: [
            'UNIQUE (groupchat_id, user_id, unarchived)',
            'FOREIGN KEY (groupchat_id) REFERENCES groupchat(id)',
            'FOREIGN KEY (user_id) REFERENCES users(id)',
        ]
    },

    gmessages: {
        columns: [
            'id VARCHAR(36) PRIMARY KEY',
            'groupchat_id VARCHAR(36)',
            'sender_id VARCHAR(36)',
            'message TEXT',
            'type VARCHAR(5)',//text, pic, video
            'time_sent TIMESTAMP',
            'edited BOOLEAN',
            'valid BOOLEAN',
        ],
        constraints: [
            'FOREIGN KEY (groupchat_id) REFERENCES groupchat(id)',
            'FOREIGN KEY (sender_id) REFERENCES groupusers(user_id)',
        ]
    },
}
    
const con = mysql.createConnection({
    host: MYSQL_HOST,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
})

//check if db already exist

con.query(
    `SHOW DATABASES LIKE '${db_name}';`,
    (err, res) => {
        if (err) throw err;
        
        if (res.length > 0){
            console.log(`droping ${db_name}`);
            con.query(`DROP DATABASE ${db_name};`,
            (err, res) => {
                if (err) throw err;
                console.log(`${db_name} droped!`);
                create_db();
            });
        }
        else create_db();
    }
);

function create_db(){
    con.query(
        `CREATE DATABASE ${db_name};`,

        (err, res) => {
            if (err) throw err;

            console.log(`${db_name} created!`);
            
            con.query(
                `USE ${db_name}`,
                (err, res) => {
                    if (err) throw err;
                    console.log(`using ${db_name}`);
                    build_db();
            });
        });
}

function build_db(){
    //create tabels
    for (tbl in tables){
        //create table
        console.log(tbl)
        con.query(`CREATE TABLE ${tbl} (${tables[tbl].columns.join(', ')});`, (err, res) => {
            if (err) throw err;
            console.log(`${tbl} created!`)
        })
    }

    //add constraints
    for (tbl in tables){
        for (cons in tables[tbl].constraints){
            con.query(`ALTER TABLE ${tbl} ADD CONSTRAINT ${tables[tbl].constraints[cons]}`, (err, res) => {
                if (err) throw err;
                console.log(`added constraints to ${tbl}!`)
            })
        }
    }
}
