const express = require("express");
const groups_db = require('../db/components/groups.js');
const router = express.Router();
const {v4: uuidv4} = require('uuid');

router.get("/", async (req, res) => {
    try {
      if (req.query.user_id){
        const groups = await groups_db.getUserGroups(req.query.user_id);
        res.send(groups)
      }
      else{
        const groups = await groups_db.getActiveGroups();
        res.send(groups);
      }
    } catch (err) {
      res.status(500).send({error: 'Internal server error'});
    }
  });

router.post("/", async (req, res) => {
    try {
        const new_group = req.body;
        new_group.id = uuidv4();
        new_group.time_created = new Date(new_group.time_created);
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
        const result = await groups_db.updateGroup(updated_group);
        if (result.changedRows === 0) res.status(404).send({error: 'Group to update was not found!'});
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
        const result = await groups_db.deleteGroup(group_id);
        if (result.changedRows === 0) res.status(404).send({error: 'Group to delete was not found!'});
        res.status(204).end();
    } catch (err) {
      res.status(500).send({error: 'Internal server error'});
    }
  });

module.exports = router;

