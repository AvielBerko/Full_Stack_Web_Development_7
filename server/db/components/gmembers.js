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

async function deleteGroupMember(gmember_id){
    const deleted = {valid: false}
    return generic.update(tables.GROUP_MEMBERS, deleted, {id: gmember_id});
}

module.exports = {getGroupMembers, addGroupMember, /*updateGroupMember,*/ deleteGroupMember};
