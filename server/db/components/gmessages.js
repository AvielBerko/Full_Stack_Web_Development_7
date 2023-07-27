const db_connection = require('../db_connection');
const generic = require('../crud.js');
const tables = require('../table_names.js');

async function getGroupMessages(group_id){
    return new Promise((resolve, reject) => {
        db_connection.getConnection(con => {
            con.query(`
                SELECT ${tables.GROUP_MESSAGES}.*, email FROM
                ${tables.GROUP_MESSAGES}
                INNER JOIN
                ${tables.USERS}
                ON ${tables.GROUP_MESSAGES}.sender_id = ${tables.USERS}.id
                WHERE groupchat_id = ? AND ${tables.USERS}.valid = 1 AND ${tables.GROUP_MESSAGES}.valid = 1
                ;`,
                [group_id],
            (error, result) => {
                if (error) reject(error);
                resolve(result);
            })
        });
    });
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
