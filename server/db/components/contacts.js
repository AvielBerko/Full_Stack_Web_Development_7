const db_connection = require('../db_connection');
const generic = require('../crud.js');
const tables = require('../table_names.js');

async function getUserContacts(user_id){
    return generic.read(tables.CONTACTS, {saver_id: user_id, valid: true});
}

async function addContact(new_contact){
    //TODO validate new contact
    new_contact.valid = true;
    return generic.create(tables.CONTACTS, new_contact);
}

async function updateContact(updated_contact){
    //TODO validate new contact
    return generic.update(tables.CONTACTS, updated_contact, {id: updated_contact.id});
}

async function deleteContact(contact_id){
    const deleted = {valid: false}
    return generic.update(tables.CONTACTS, deleted, {id: contact_id});
}

module.exports = {getUserContacts, addContact, updateContact, deleteContact};
