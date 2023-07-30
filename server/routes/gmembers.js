const express = require("express");
const gmembers_db = require('../db/components/gmembers.js');
const router = express.Router();
const {v4: uuidv4} = require('uuid');
const Joi = require('joi');
const jwt = require('../jwt/jwt.js');
const wrapper = require('./wrapper.js');

const new_gmembers_schema = Joi.object({
  user_id: Joi.string().guid({ version: ['uuidv4']}).required(),
})

const updated_gmembers_schema = Joi.object({
  user_id: Joi.string().guid({ version: ['uuidv4']}).required(),
  admin: Joi.boolean().required(),
})

router.get("/", async (req, res) => {
  if (!jwt.verifyJWT(req.headers.authorization)) 
    return wrapper.unauthorized_response(res);

    try {
        const groupchat_id = req.locals.groupchat_id;
        const gmembers = await gmembers_db.getGroupMembers(groupchat_id);
        res.send(gmembers);
    } catch (err) {
      res.status(500).send({error: 'Internal server error'});
    }
  });

router.post("/", async (req, res) => {//TODO - post other member possible if admin
    const user = jwt.verifyJWT(req.headers.authorization);
    if (!user || req.body.user_id !== user.id) return wrapper.unauthorized_response(res);

    const { error } = new_gmembers_schema.validate(req.body)
    if (error) return res.status(400).send({error: error.details[0].message});
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
  
// router.put("/:id", async (req, res) => {//TODO - enable, only if admin even on myself
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

  router.delete("/:user_id", async (req, res) => {//TODO - delete other member possible if admin
    const user = jwt.verifyJWT(req.headers.authorization);
    if (!user || req.params.user_id !== user.id) return wrapper.unauthorized_response(res);

    try {
        const groupchat_id = req.locals.groupchat_id;
        const user_id = req.params.user_id;
        const result = await gmembers_db.deleteGroupMember(groupchat_id, user_id);
        if (result.changedRows === 0) return res.status(404).send({error: 'Group member to delete was not found!'});
        res.status(204).end();
    } catch (err) {
      res.status(500).send({error: 'Internal server error'});
    }
  });

module.exports = router;

