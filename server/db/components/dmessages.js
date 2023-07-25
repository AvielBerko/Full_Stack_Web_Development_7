const db_connection = require('../db_connection');
const generic = require('../crud.js');
const tables = require('../table_names.js');

async function getMessages(sender_id, receiver_id){
    return generic.read(tables.DIRECT_MESSAGES, {sender_id: sender_id, receiver_id: receiver_id});
}

module.exports = {getMessages};
