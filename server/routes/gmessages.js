const express = require("express");
const gmessages_db = require('../db/components/gmessages.js');
const router = express.Router();
const {v4: uuidv4} = require('uuid');

router.get("/", async (req, res) => {
    try {
        const group_id = req.query.groupchat_id;//currently supporting only gmsgs of 1 group
        const gmessages = await gmessages_db.getGroupMessages(group_id);
        res.send(gmessages);
    } catch (err) {
      res.status(400).send(err);
    }
  });

router.post("/", async (req, res) => {
    try {
        const new_gmessage = req.body;
        new_gmessage.id = uuidv4();
        await gmessages_db.addGroupMessage(new_gmessage);
        res.send(new_gmessage);
    } catch (err) {
      res.status(400).send(err);
    }
  });

router.put("/:id", async (req, res) => {
    try {
        const gmessages_id = req.params.id;
        const updated_gmessage = {...req.body, id:gmessages_id};
        await gmessages_db.updateGroupMessage(updated_gmessage);
        res.send(updated_gmessage);
    } catch (err) {
      res.status(400).send(err);
    }
  });

  router.delete("/:id", async (req, res) => {
    try {
        const gmessage_id = req.params.id;
        await gmessages_db.deleteGroupMessage(gmessage_id);
        res.status(204).end();
    } catch (err) {
      res.status(400).send(err);
    }
  });

module.exports = router;
