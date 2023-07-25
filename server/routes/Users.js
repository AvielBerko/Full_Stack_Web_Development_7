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
    const user_id = req.params.id;
    const updated_user = {...req.body, id:user_id};
    //TODO - validate new user
    await users_db.updateUser(updated_user);
    res.send(updated_user);
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
