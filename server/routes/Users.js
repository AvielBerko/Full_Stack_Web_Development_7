const db_api = require("../db/db_api.js");
const express = require("express");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const users = await db_api.getUsers();
    res.send(users);
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;