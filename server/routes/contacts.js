const express = require("express");
const contacts_db = require('../db/components/contacts.js');
const router = express.Router();
const {v4: uuidv4} = require('uuid');
const Joi = require('joi');

const contact_schema = Joi.object({
  new: Joi.boolean(),
  id: Joi.string().guid({ version: ['uuidv4']}),
  saver_id: Joi.string().guid({ version: ['uuidv4']}).when('new', {is: true, then: Joi.required()}),
  user_id: Joi.string().guid({ version: ['uuidv4']}).when('new', {is: true, then: Joi.required()}),
  name: Joi.string().min(3).max(30).required(),
})

router.get("/", async (req, res) => {
    try {
        const user_id = req.query.saver_id;//currently supporting only contact of user
        const contacts = await contacts_db.getUserContacts(user_id);
        res.send(contacts);
    } catch (err) {
      res.status(500).send({error: 'Internal server error'});
    }
  });

router.post("/", async (req, res) => {
    const { error } = contact_schema.validate({...req.body, new: true})
    if (error) return res.status(400).send({error: error.details[0].message});
    try {
        const new_contact = req.body;
        new_contact.id = uuidv4();
        await contacts_db.addContact(new_contact);
        res.send(new_contact);
    } catch (err) {
      if(err.code === 'ER_DUP_ENTRY'){
        res.status(400).send({error: 'Duplicate contact or name!'})
      }
      else res.status(500).send({error: 'Internal server error'});
    }
  });

router.put("/:id", async (req, res) => {
    const { error } = contact_schema.validate(req.body)
    if (error) return res.status(400).send({error: error.details[0].message});
    try {
        const contact_id = req.params.id;
        const updated_contact = {name:req.body.name, id:contact_id};
        const result = await contacts_db.updateContact(updated_contact);
        if (result.changedRows === 0) return res.status(404).send({error: 'Contact to update was not found!'});
        res.send(updated_contact);
    } catch (err) {
      if(err.code === 'ER_DUP_ENTRY'){
        res.status(400).send({error: 'Duplicate contact or name!'})
      }
      else res.status(500).send({error: 'Internal server error'});
    }
  });

  router.delete("/:id", async (req, res) => {
    try {
        const contact_id = req.params.id;
        const result = await contacts_db.deleteContact(contact_id);
        if (result.changedRows === 0) return res.status(404).send({error: 'Contact to delete was not found!'});
        res.status(204).end();
    } catch (err) {
      res.status(500).send({error: 'Internal server error'});
    }
  });

module.exports = router;
