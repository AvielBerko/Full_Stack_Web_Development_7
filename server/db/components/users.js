const db_connection = require('../db_connection');
const generic = require('../crud.js');
const tables = require('../table_names.js');

async function getCurrentUsers() {
    return generic.read(tables.USERS, {valid:true});
}

async function login(user_data){
    return new Promise((resolve, reject) => {
        const values = [user_data.username, user_data.password]
        db_connection.getConnection(con => {
            con.query(`
            SELECT ${tables.USERS}.id, username, email, phone_number FROM
            ${tables.PASSWORDS}
            INNER JOIN
            ${tables.USERS}
            ON ${tables.PASSWORDS}.user_id = ${tables.USERS}.id
            WHERE username = ? AND password = ?
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

async function updateUser(user_id, updated_user) {
    return generic.update(tables.USERS, updated_user, {id: user_id})
}

async function addPassword(user, password){
    const pwd = {user_id: user.id, password: password, valid:true};
    return generic.create(tables.PASSWORDS, pwd);
}

module.exports = {getCurrentUsers, login, addUser, addPassword, updateUser};
