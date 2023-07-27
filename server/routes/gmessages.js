const express = require("express");
const gmessages_db = require('../db/components/gmessages.js');
const router = express.Router();
const {v4: uuidv4} = require('uuid');
const Joi = require('joi');

const gmessages_schema = Joi.object({
  new: Joi.boolean(),
  id: Joi.string().guid({ version: ['uuidv4']}).when('new', {is: true, then: Joi.required()}),
  sender_id: Joi.string().guid({ version: ['uuidv4']}).when('new', {is: true, then: Joi.required()}),
  message: Joi.string().min(1).required(),
  type: Joi.string().min(3).max(5).when('new', {is: true, then: Joi.required()}),
  time_sent: Joi.string().isoDate().when('new', {is: true, then: Joi.required()}),
})

router.get("/", async (req, res) => {
    try {
        const group_id = req.locals.groupchat_id;
        const gmessages = await gmessages_db.getGroupMessages(group_id);
        //TODO - sort in sql
        const sorted_messages = gmessages.slice().sort((a, b) => new Date(a.time_sent) - new Date(b.time_sent));
        res.send(sorted_messages);
    } catch (err) {
      res.status(500).send({error: 'Internal server error'});
    }
  });

router.post("/", async (req, res) => {
    const { error } = gmessages_schema.validate({...req.body, new: true})
    if (error) return res.status(400).send({error: error.details[0].message});
    try {
        const new_gmessage = req.body;
        new_gmessage.id = uuidv4();
        new_gmessage.groupchat_id = req.locals.groupchat_id;
        new_gmessage.edited = false;
        new_gmessage.time_sent = new Date(new_gmessage.time_sent);//creating date object from received string
        await gmessages_db.addGroupMessage(new_gmessage);
        res.send(new_gmessage);
    } catch (err) {
      res.status(500).send({error: 'Internal server error'});
    }
  });

router.put("/:id", async (req, res) => {
    const { error } = gmessages_schema.validate(req.body)
    if (error) return res.status(400).send({error: error.details[0].message});
    try {
        const gmessages_id = req.params.id;
        const updated_gmessage = {...req.body, id:gmessages_id};
        updated_gmessage.edited = true;
        const result = await gmessages_db.updateGroupMessage(updated_gmessage);
        if (result.changedRows === 0) res.status(404).send({error: 'Group message to update was not found!'});
        res.send(updated_gmessage);
    } catch (err) {
      res.status(500).send({error: 'Internal server error'});
    }
  });

  router.delete("/:id", async (req, res) => {
    try {
        const gmessage_id = req.params.id;
        const result = await gmessages_db.deleteGroupMessage(gmessage_id);
        if (result.changedRows === 0) res.status(404).send({error: 'Group message to delete was not found!'});
        res.status(204).end();
    } catch (err) {
      res.status(500).send({error: 'Internal server error'});
    }
  });

module.exports = router;

