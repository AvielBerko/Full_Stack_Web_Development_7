const express = require("express");
const gmembers_db = require('../db/components/gmembers.js');
const router = express.Router();
const {v4: uuidv4} = require('uuid');

router.get("/", async (req, res) => {
    try {
        const groupchat_id = req.locals.groupchat_id;
        const gmembers = await gmembers_db.getGroupMembers(groupchat_id);
        res.send(gmembers);
    } catch (err) {
      res.status(500).send({error: 'Internal server error'});
    }
  });

router.post("/", async (req, res) => {
    try {
        const new_gmember = req.body;
        new_gmember.groupchat_id = req.locals.groupchat_id;
        new_gmember.id = uuidv4();
        await gmembers_db.addGroupMember(new_gmember);
        res.send(new_gmember);
    } catch (err) {
      if(err.code === 'ER_DUP_ENTRY'){
        res.status(400).send({error: 'User is already member of the group!'})
      }
      else res.status(500).send({error: 'Internal server error'});
    }
  });
  
//TODO - decide if delete or enable here and in db
// router.put("/:id", async (req, res) => {
//     try {
//         const gmembers_id = req.params.id;
//         const updated_gmember = {...req.body, id:gmembers_id};
//         const result = await gmembers_db.updateGroupMember(updated_gmember);
//         if (result.changedRows === 0) res.status(404).send({error: 'Group member to update was not found!'});
//         res.send(updated_gmember);
//     } catch (err) {
//       res.status(400).send(err);
//     }
//   });

  router.delete("/:user_id", async (req, res) => {
    try {
        const groupchat_id = req.locals.groupchat_id;
        const user_id = req.params.user_id;
        const result = await gmembers_db.deleteGroupMember(groupchat_id, user_id);
        if (result.changedRows === 0) res.status(404).send({error: 'Group member to delete was not found!'});
        res.status(204).end();
    } catch (err) {
      res.status(500).send({error: 'Internal server error'});
    }
  });

module.exports = router;

