const db_connection = require('../db_connection');
const generic = require('../crud.js');
const tables = require('../table_names.js');

async function getUserContacts(user_id){
    return new Promise((resolve, reject) => {
        db_connection.getConnection(con => {
            con.query(`
                SELECT ${tables.CONTACTS}.id, saver_id, user_id, name, email, phone_number FROM
                ${tables.CONTACTS}
                INNER JOIN
                ${tables.USERS}
                ON ${tables.CONTACTS}.user_id = ${tables.USERS}.id
                WHERE saver_id = ? AND ${tables.USERS}.valid = 1 AND ${tables.CONTACTS}.valid = 1
                ;`,
                [user_id],
            (error, result) => {
                if (error) reject(error);
                resolve(result);
            })
        });
    });
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
