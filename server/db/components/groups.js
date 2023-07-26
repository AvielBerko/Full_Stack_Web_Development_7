const db_connection = require('../db_connection');
const generic = require('../crud.js');
const tables = require('../table_names.js');

async function getActiveGroups(){
    return generic.read(tables.GROUPS, {valid: true});
}

async function addGroup(new_group){
    //TODO validate new group
    new_group.valid = true;
    return generic.create(tables.GROUPS, new_group);
}

async function updateGroup(updated_group){
    //TODO validate new group
    return generic.update(tables.GROUPS, updated_group, {id: updated_group.id});
}

async function deleteGroup(group_id){
    const deleted = {valid: false}
    return generic.update(tables.GROUPS, deleted, {id: group_id});
}

module.exports = {getActiveGroups, addGroup, updateGroup, deleteGroup};
