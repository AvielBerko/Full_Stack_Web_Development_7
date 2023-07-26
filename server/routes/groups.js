const express = require("express");
const groups_db = require('../db/components/groups.js');
const router = express.Router();
const {v4: uuidv4} = require('uuid');

router.get("/", async (req, res) => {
    try {
        const groups = await groups_db.getActiveGroups();
        res.send(groups);
    } catch (err) {
      res.status(500).send({error: 'Internal server error'});
    }
  });

router.post("/", async (req, res) => {
    try {
        const new_group = req.body;
        new_group.id = uuidv4();
        await groups_db.addGroup(new_group);
        res.send(new_group);
    } catch (err) {
      if(err.code === 'ER_DUP_ENTRY'){
        res.status(400).send({error: 'Name already exists for another group!'})
      }
      else res.status(500).send({error: 'Internal server error'});
    }
  });

router.put("/:id", async (req, res) => {
    try {
        const group_id = req.params.id;
        const updated_group = {...req.body, id:group_id};
        await groups_db.updateGroup(updated_group);
        res.send(updated_group);
    } catch (err) {
      if(err.code === 'ER_DUP_ENTRY'){
        res.status(400).send({error: 'Name already exists for another group!'})
      }
      else res.status(500).send({error: 'Internal server error'});
    }
  });

  router.delete("/:id", async (req, res) => {
    try {
        const group_id = req.params.id;
        await groups_db.deleteGroup(group_id);
        res.status(204).end();
    } catch (err) {
      res.status(500).send({error: 'Internal server error'});
    }
  });

module.exports = router;

