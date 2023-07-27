const express = require("express");
const contacts_db = require('../db/components/contacts.js');
const router = express.Router();
const {v4: uuidv4} = require('uuid');
const Joi = require('joi');

// const contact_schema = Joi.object({
//   username: Joi.string().min(3).max(30).alphanum().required(),
//   email: Joi.string().email().required(),
//   phone_number: Joi.string().min(10).max(15), 
//   password: Joi.string().min(4).required()
// })

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
    try {
        const contact_id = req.params.id;
        const updated_contact = {name:req.body.name, id:contact_id};
        const result = await contacts_db.updateContact(updated_contact);
        if (result.changedRows === 0) res.status(404).send({error: 'Contact to update was not found!'});
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
        if (result.changedRows === 0) res.status(404).send({error: 'Contact to delete was not found!'});
        res.status(204).end();
    } catch (err) {
      res.status(500).send({error: 'Internal server error'});
    }
  });

module.exports = router;
