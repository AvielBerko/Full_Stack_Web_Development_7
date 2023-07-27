const db_connection = require('../db_connection');
const generic = require('../crud.js');
const tables = require('../table_names.js');

async function getGroupMembers(group_id){
    return generic.read(tables.GROUP_MEMBERS, {groupchat_id: group_id, valid: true});
}

async function addGroupMember(new_gmember){
    //TODO validate new gmember
    new_gmember.valid = true;
    return generic.create(tables.GROUP_MEMBERS, new_gmember);
}

// async function updateGroupMember(updated_gmember){
//     //TODO validate new gmember
//     return generic.update(tables.GROUP_MEMBERS, updated_gmember, {id: updated_gmember.id});
// }

async function deleteGroupMember(groupchat_id, user_id){
    const deleted = {valid: false}
    return new Promise((resolve, reject) => {
        db_connection.getConnection(con => {
            con.query(`
                UPDATE ${tables.GROUP_MEMBERS}
                SET valid = false
                WHERE groupchat_id = ? AND user_id = ?
                ;`,
                [groupchat_id, user_id],
            (error, result) => {
                if (error) reject(error);
                resolve(result);
            })
        });
    });
}

module.exports = {getGroupMembers, addGroupMember, deleteGroupMember};
