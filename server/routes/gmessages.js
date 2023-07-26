const express = require("express");
const gmessages_db = require('../db/components/gmessages.js');
const router = express.Router();
const {v4: uuidv4} = require('uuid');

router.get("/", async (req, res) => {
    try {
        const group_id = req.query.groupchat_id;//currently supporting only gmsgs of 1 group
        const gmessages = await gmessages_db.getGroupMessages(group_id);
        const sorted_messages = gmessages.slice().sort((a, b) => new Date(a.time_sent) - new Date(b.time_sent));
        res.send(sorted_messages);
    } catch (err) {
      res.status(500).send({error: 'Internal server error'});
    }
  });

router.post("/", async (req, res) => {
    try {
        const new_gmessage = req.body;
        new_gmessage.id = uuidv4();
        new_gmessage.edited = false;
        new_gmessage.time_sent = new Date(new_gmessage.time_sent);//creating date object from received string
        await gmessages_db.addGroupMessage(new_gmessage);
        res.send(new_gmessage);
    } catch (err) {
      res.status(500).send({error: 'Internal server error'});
    }
  });

router.put("/:id", async (req, res) => {
    try {
        const gmessages_id = req.params.id;
        const updated_gmessage = {...req.body, id:gmessages_id};
        updated_gmessage.edited = true;
        await gmessages_db.updateGroupMessage(updated_gmessage);
        res.send(updated_gmessage);
    } catch (err) {
      res.status(500).send({error: 'Internal server error'});
    }
  });

  router.delete("/:id", async (req, res) => {
    try {
        const gmessage_id = req.params.id;
        await gmessages_db.deleteGroupMessage(gmessage_id);
        res.status(204).end();
    } catch (err) {
      res.status(500).send({error: 'Internal server error'});
    }
  });

module.exports = router;

