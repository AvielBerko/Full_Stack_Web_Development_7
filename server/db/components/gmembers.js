const db_connection = require('../db_connection');
const generic = require('../crud.js');
const tables = require('../table_names.js');

async function getGroupMembers(group_id) {
    return new Promise((resolve, reject) => {
        db_connection.getConnection(con => {
            con.query(`
                SELECT ${tables.GROUP_MEMBERS}.*, email FROM
                ${tables.GROUP_MEMBERS}
                INNER JOIN
                ${tables.USERS}
                ON ${tables.GROUP_MEMBERS}.user_id = ${tables.USERS}.id
                WHERE groupchat_id = ? AND ${tables.USERS}.valid = 1 AND ${tables.GROUP_MEMBERS}.valid = 1
                ORDER BY ${tables.GROUP_MEMBERS}.id
                ;`,
                [group_id],
                (error, result) => {
                    if (error) reject(error);
                    resolve(result);
                })
        });
    });
}

async function addGroupMember(new_gmember) {
    new_gmember.valid = true;
    return generic.create(tables.GROUP_MEMBERS, new_gmember);
}

async function updateGroupMember(updated_gmember) {
    return generic.update(tables.GROUP_MEMBERS, updated_gmember, { id: updated_gmember.id });
}

async function deleteGroupMember(groupchat_id, user_id) {
    const deleted = { valid: false }
    return generic.update(tables.GROUP_MEMBERS, deleted, { groupchat_id, user_id })
}

module.exports = { getGroupMembers, addGroupMember, updateGroupMember, deleteGroupMember };
