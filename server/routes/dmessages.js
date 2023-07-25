const express = require("express");
const dmessages_db = require('../db/components/dmessages.js');
const router = express.Router();
const {v4: uuidv4} = require('uuid');

router.get("/", async (req, res) => {
    try {
        const id1 = req.query.id1;//currently supporting only dmsgs of conversation
        const id2 = req.query.id2;
        const dmessages_from_id1 = await dmessages_db.getDirectMessages(id1, id2);
        const dmessages_from_id2 = await dmessages_db.getDirectMessages(id2, id1);
        res.send(dmessages_from_id1.concat(dmessages_from_id2));
    } catch (err) {
      res.status(400).send(err);
    }
  });

router.post("/", async (req, res) => {
    try {
        const new_dmessage = req.body;
        new_dmessage.id = uuidv4();
        await dmessages_db.addDirectMessage(new_dmessage);
        res.send(new_dmessage);
    } catch (err) {
      res.status(400).send(err);
    }
  });

router.put("/:id", async (req, res) => {
    try {
        const dmessages_id = req.params.id;
        const updated_dmessage = {...req.body, id:dmessages_id};
        await dmessages_db.updateDirectMessage(updated_dmessage);
        res.send(updated_dmessage);
    } catch (err) {
      res.status(400).send(err);
    }
  });

  router.delete("/:id", async (req, res) => {
    try {
        const dmessage_id = req.params.id;
        await dmessages_db.deleteDirectMessage(dmessage_id);
        res.status(204).end();
    } catch (err) {
      res.status(400).send(err);
    }
  });

module.exports = router;

