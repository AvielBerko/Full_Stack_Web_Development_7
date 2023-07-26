const express = require("express");
const contacts_db = require('../db/components/contacts.js');
const router = express.Router();
const {v4: uuidv4} = require('uuid');

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
        await contacts_db.updateContact(updated_contact);
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
        await contacts_db.deleteContact(contact_id);
        res.status(204).end();
    } catch (err) {
      res.status(500).send({error: 'Internal server error'});
    }
  });

module.exports = router;
