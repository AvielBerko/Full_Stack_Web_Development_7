const express = require("express");
const users_db = require('../db/components/users.js');
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const users = await users_db.getCurrentUsers();
    res.send(users);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updated_user = req.body;
    const user_id = req.params.id;
    //TODO - validate new user and password!
    const user = await users_db.updateUser(user_id, updated_user);
    res.send(updated_user);
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
