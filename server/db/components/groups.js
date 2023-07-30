const db_connection = require('../db_connection');
const generic = require('../crud.js');
const tables = require('../table_names.js');

async function getActiveGroups(){
    return generic.read(tables.GROUPS, {valid: true});
}

async function getUserGroups(user_id){
    return new Promise( (resolve, reject) => {
        db_connection.getConnection(con => {
            con.query(`
            SELECT ${tables.GROUPS}.id, name, time_created, admin FROM
            ${tables.GROUP_MEMBERS}
            INNER JOIN 
            ${tables.GROUPS}
            ON ${tables.GROUP_MEMBERS}.groupchat_id = ${tables.GROUPS}.id
            WHERE user_id = ? AND ${tables.GROUP_MEMBERS}.valid = 1 AND ${tables.GROUPS}.valid = 1
            ;`,
            [user_id],
            (error, result) => {
                if (error) reject(error);
                resolve(result);
            });
        })
    });
}

async function addGroup(new_group){
    new_group.valid = true;
    return generic.create(tables.GROUPS, new_group);
}

async function updateGroup(updated_group, user_id){
    //return generic.update(tables.GROUPS, updated_group, {id: updated_group.id});
    return new Promise( (resolve, reject) => {
        db_connection.getConnection(con => {
            con.query(`
            UPDATE ${tables.GROUPS}
            INNER JOIN 
            ${tables.GROUP_MEMBERS}
            ON ${tables.GROUP_MEMBERS}.groupchat_id = ${tables.GROUPS}.id
            SET ${tables.GROUPS}.name = ?
            WHERE user_id = ? AND ${tables.GROUP_MEMBERS}.valid = 1 AND ${tables.GROUPS}.valid = 1
            ;`,
            [updated_group.name, user_id],
            (error, result) => {
                if (error) reject(error);
                resolve(result);
            });
        })
    });
}

// async function deleteGroup(group_id){
//     const deleted = {valid: false}
//     return generic.update(tables.GROUPS, deleted, {id: group_id});
// }

module.exports = {getActiveGroups, addGroup, updateGroup, getUserGroups};
