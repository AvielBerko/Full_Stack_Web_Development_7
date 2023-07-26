const db_connection = require('../db_connection');
const generic = require('../crud.js');
const tables = require('../table_names.js');

async function getGroupMessages(group_id){
    return generic.read(tables.GROUP_MESSAGES, {groupchat_id: group_id, valid: true});
}

async function addGroupMessage(new_gmessage){
    //TODO validate new gmessage
    new_gmessage.valid = true;
    return generic.create(tables.GROUP_MESSAGES, new_gmessage);
}

async function updateGroupMessage(updated_gmessage){
    //TODO validate new gmessage
    return generic.update(tables.GROUP_MESSAGES, updated_gmessage, {id: updated_gmessage.id});
}

async function deleteGroupMessage(gmessage_id){
    const deleted = {valid: false}
    return generic.update(tables.GROUP_MESSAGES, deleted, {id: gmessage_id});
}

module.exports = {getGroupMessages, addGroupMessage, updateGroupMessage, deleteGroupMessage};
