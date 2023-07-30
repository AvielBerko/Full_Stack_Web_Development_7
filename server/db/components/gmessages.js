const db_connection = require('../db_connection');
const generic = require('../crud.js');
const tables = require('../table_names.js');

async function getGroupMessages(group_id, user_id){
    return new Promise((resolve, reject) => {
        db_connection.getConnection(con => {
            con.query(`
                SELECT ${tables.GROUP_MESSAGES}.*, email FROM
                ${tables.GROUP_MESSAGES}
                INNER JOIN
                ${tables.USERS}
                ON ${tables.GROUP_MESSAGES}.sender_id = ${tables.USERS}.id
                INNER JOIN
                ${tables.GROUP_MEMBERS}
                ON ${tables.GROUP_MEMBERS}.groupchat_id = ${tables.GROUP_MESSAGES}.groupchat_id
                WHERE ${tables.GROUP_MESSAGES}.groupchat_id = ? AND ${tables.GROUP_MEMBERS}.valid = 1 AND ${tables.GROUP_MEMBERS}.user_id = ? AND ${tables.USERS}.valid = 1 AND ${tables.GROUP_MESSAGES}.valid = 1
                ORDER BY time_sent
                ;`,
                [group_id, user_id],
            (error, result) => {
                if (error) reject(error);
                resolve(result);
            })
        });
    });
}

async function addGroupMessage(new_gmessage){
    new_gmessage.valid = true;
    return generic.create(tables.GROUP_MESSAGES, new_gmessage);
}

async function updateGroupMessage(updated_gmessage){
    return generic.update(tables.GROUP_MESSAGES, updated_gmessage, {id: updated_gmessage.id});
}

async function deleteGroupMessage(gmessage_id){
    const deleted = {valid: false}
    return generic.update(tables.GROUP_MESSAGES, deleted, {id: gmessage_id});
}

module.exports = {getGroupMessages, addGroupMessage, updateGroupMessage, deleteGroupMessage};
