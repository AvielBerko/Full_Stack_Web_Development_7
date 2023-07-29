const express = require("express");
const dmessages_db = require('../db/components/dmessages.js');
const router = express.Router();
const {v4: uuidv4} = require('uuid');
const Joi = require('joi');

const dmessages_schema = Joi.object({
  new: Joi.boolean(),
  id: Joi.string().guid({ version: ['uuidv4']}),
  sender_id: Joi.string().guid({ version: ['uuidv4']}).when('new', {is: true, then: Joi.required()}),
  receiver_id: Joi.string().guid({ version: ['uuidv4']}),
  message: Joi.string().min(1).required(),
  type: Joi.string().min(3).max(5).when('new', {is: true, then: Joi.required()}),
  time_sent: Joi.string().isoDate().when('new', {is: true, then: Joi.required()}),
})

router.get("/", async (req, res) => {
    try {

        const id1 = req.query.saver_id;//currently supporting only dmsgs of conversation
        const id2 = req.locals.user_id;
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
    const { error } = dmessages_schema.validate({...req.body, new: true})
    if (error) return res.status(400).send({error: error.details[0].message});
    try {
        const new_dmessage = req.body;
        new_dmessage.receiver_id = req.locals.user_id;
        new_dmessage.id = uuidv4();
        new_dmessage.edited = false;
        new_dmessage.time_sent = new Date(new_dmessage.time_sent);//creating date object from received string
        await dmessages_db.addDirectMessage(new_dmessage);
        res.send(new_dmessage);
    } catch (err) {
      res.status(500).send({error: 'Internal server error'});
    }
  });

router.put("/:id", async (req, res) => {
    const { error } = dmessages_schema.validate(req.body)
    if (error) return res.status(400).send({error: error.details[0].message});
    try {
        const dmessages_id = req.params.id;
        const updated_dmessage = {...req.body, id:dmessages_id};
        updated_dmessage.receiver_id = req.locals.user_id;
        updated_dmessage.edited = true;
        const result = await dmessages_db.updateDirectMessage(updated_dmessage);
        if (result.changedRows === 0) return res.status(404).send({error: 'Direct message to update was not found!'});
        res.send(updated_dmessage);
    } catch (err) {
      res.status(500).send({error: 'Internal server error'});
    }
  });

  router.delete("/:id", async (req, res) => {
    try {
        const dmessage_id = req.params.id;
        const result = await dmessages_db.deleteDirectMessage(dmessage_id);
        if (result.changedRows === 0) return res.status(404).send({error: 'Direct message to delete was not found!'});
        res.status(204).end();
    } catch (err) {
      res.status(500).send({error: 'Internal server error'});
    }
  });

module.exports = router;

