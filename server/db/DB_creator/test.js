// const mysql = require('mysql2');
//this is a test file to be deleted before finishing the project
const {v4: uuidv4} = require('uuid'); 

const generic = require('../crud.js');
const tables = require('../table_names.js');

async function test(){
    //result = await generic.update(tables.USERS, {email:'test555@gmail.com', name:'test55',  valid: false}, {id: '05e4d024-ae19-4b48-a3ae-cd85470d8f1f'});
    result = await generic.read(tables.USERS, {valid: true, name:'test3'})
    console.log(result);
}

test();
