const express = require("express");
const users_db = require('../db/components/users.js');
const router = express.Router();
const {v4: uuidv4} = require('uuid');

router.post("/login", async (req, res) => {
  try {
    const auth_data = req.body;
    const user = await users_db.login(auth_data);
    if (user.length === 0) res.status(401).send({error: 'Invalid credentials'})
    else res.send(user[0]);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post("/register", async (req, res) => {
    try {
        const {password, ...new_user} = req.body;
        //TODO - validate new user and password!
        new_user.id = uuidv4();
        await users_db.addUser(new_user);
        await users_db.addPassword(new_user, password);
        res.send(new_user);
    } catch (err) {
     res.status(400).send(err);
    }
  });

module.exports = router;
