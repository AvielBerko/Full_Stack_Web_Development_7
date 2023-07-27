const db_connection = require('../db_connection');
const generic = require('../crud.js');
const tables = require('../table_names.js');

async function getDirectMessages(sender_id, receiver_id){
    return generic.read(tables.DIRECT_MESSAGES, {sender_id: sender_id, receiver_id:receiver_id, valid: true});
}

async function addDirectMessage(new_dmessage){
    new_dmessage.valid = true;
    return generic.create(tables.DIRECT_MESSAGES, new_dmessage);
}

async function updateDirectMessage(updated_dmessage){
    return generic.update(tables.DIRECT_MESSAGES, updated_dmessage, {id: updated_dmessage.id});
}

async function deleteDirectMessage(dmessage_id){
    const deleted = {valid: false}
    return generic.update(tables.DIRECT_MESSAGES, deleted, {id: dmessage_id});
}

module.exports = {getDirectMessages, addDirectMessage, updateDirectMessage, deleteDirectMessage};
