const express = require("express");
const users_db = require('../db/components/users.js');
const router = express.Router();
const {v4: uuidv4} = require('uuid');
const Joi = require('joi');

// const user_schema = {
//   username: Joi.string().min(3).max(30).alphanum().required(),
//   email: Joi.string.email().required()
//   phone_number
// }

// const schema = Joi.string().guid({
//   version: [
//       'uuidv4',
//       'uuidv5'
//   ]string.isoDate()

router.post("/login", async (req, res) => {
  try {
    const auth_data = req.body;
    const user = await users_db.login(auth_data);
    if (user.length === 0) res.status(401).send({error: 'Invalid credentials'})
    else res.send(user[0]);
  } catch (err) {
    console.log(err);
    res.status(500).send({error: 'Internal server error'});
  }
});

router.post("/register", async (req, res) => {
    try {
        const {password, ...new_user} = req.body;
        //TODO - validate new user and password!
        new_user.id = uuidv4();
        await users_db.addUser(new_user);
        new_password = {id: uuidv4(), password:password}
        await users_db.addPassword(new_user, new_password);
        res.send(new_user);
    } catch (err) {
      if(err.code === 'ER_DUP_ENTRY'){
        res.status(400).send({error: 'Username or Email already exists!'})
      }
      else res.status(500).send({error: 'Internal server error'});
    }
  });

module.exports = router;
