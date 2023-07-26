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
        const conversation = dmessages_from_id1.concat(dmessages_from_id2);
        const sorted_conversation = conversation.slice().sort((a, b) => new Date(a.time_sent) - new Date(b.time_sent));
        res.send(sorted_conversation);
    } catch (err) {
      res.status(500).send({error: 'Internal server error'});
    }
  });

router.post("/", async (req, res) => {
    try {
        const new_dmessage = req.body;
        //TODO - add a check it is from group member(?)
        new_dmessage.id = uuidv4();
        new_dmessage.edited = false;
        new_dmessage.time_sent = new Date(new_dmessage.time_sent);//creating date object from received string
        await dmessages_db.addDirectMessage(new_dmessage);
        res.send(new_dmessage);
    } catch (err) {
      console.log(err)
      res.status(500).send({error: 'Internal server error'});
    }
  });

router.put("/:id", async (req, res) => {
    try {
        const dmessages_id = req.params.id;
        const updated_dmessage = {...req.body, id:dmessages_id};
        updated_dmessage.edited = true;
        await dmessages_db.updateDirectMessage(updated_dmessage);
        res.send(updated_dmessage);
    } catch (err) {
      res.status(500).send({error: 'Internal server error'});
    }
  });

  router.delete("/:id", async (req, res) => {
    try {
        const dmessage_id = req.params.id;
        await dmessages_db.deleteDirectMessage(dmessage_id);
        res.status(204).end();
    } catch (err) {
      res.status(500).send({error: 'Internal server error'});
    }
  });

module.exports = router;

