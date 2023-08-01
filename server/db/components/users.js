const db_connection = require('../db_connection');
const generic = require('../crud.js');
const tables = require('../table_names.js');

async function getCurrentUsers() {
    return generic.read(tables.USERS, { valid: true });
}

async function login(user_data) {
    return new Promise((resolve, reject) => {
        const values = [user_data.username, user_data.password]
        db_connection.getConnection(con => {
            con.query(`
            SELECT ${tables.USERS}.id, username, email, phone_number FROM
            ${tables.PASSWORDS}
            INNER JOIN
            ${tables.USERS}
            ON ${tables.PASSWORDS}.user_id = ${tables.USERS}.id
            WHERE username = ? AND password = ? AND ${tables.USERS}.valid = 1 AND ${tables.PASSWORDS}.valid = 1
            ;`,
                values,
                (error, result) => {
                    if (error) reject(error);
                    resolve(result);
                }
            )
        });
    });
}

async function addUser(new_user) {
    new_user.valid = true;
    return generic.create(tables.USERS, new_user)
}

async function updateUser(updated_user) {
    return generic.update(tables.USERS, updated_user, { id: updated_user.id })
}

async function addPassword(user, password) {
    const pwd = { user_id: user.id, valid: true, ...password };
    return generic.create(tables.PASSWORDS, pwd);
}

module.exports = { getCurrentUsers, login, addUser, addPassword, updateUser };
