const express = require("express");
const users_db = require('../db/components/users.js');
const router = express.Router();
const {v4: uuidv4} = require('uuid');
const Joi = require('joi');
const jwt = require('../jwt/jwt.js');

const new_user_schema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  phone_number: Joi.string().length(10), 
  password: Joi.string().min(4).required()
})

router.post("/login", async (req, res) => {
  try {
    const auth_data = req.body;
    const user = await users_db.login(auth_data);
    if (user.length === 0) res.status(401).send({error: 'Invalid credentials'})
    else res.send(jwt.generateJWT(user[0]));
  } catch (err) {
    res.status(500).send({error: 'Internal server error'});
  }
});

router.post("/register", async (req, res) => {
    const { error } = new_user_schema.validate(req.body)
    if (error) return res.status(400).send({error: error.details[0].message});

    try {
        const {password, ...new_user} = req.body;
        new_user.id = uuidv4();
        await users_db.addUser(new_user);
        new_password = {id: uuidv4(), password:password}
        await users_db.addPassword(new_user, new_password);
        res.send(jwt.generateJWT(new_user));
    } catch (err) {
      if(err.code === 'ER_DUP_ENTRY'){
        res.status(400).send({error: 'Username or Email already exists!'});
      }
      else res.status(500).send({error: 'Internal server error'});
    }
  });//TODO - change error message of rows = 0

module.exports = router;
