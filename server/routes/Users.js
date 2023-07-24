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

module.exports = router;
