//const dbCon = require('./db_connection.js');
const generic = require('../crud.js');
const tables = require('../table_names.js');

async function getCurrentUsers() {
    return generic.read(tables.USERS, {valid:true});
}

module.exports = {getCurrentUsers};
