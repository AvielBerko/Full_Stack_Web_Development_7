const express = require("express");
const groups_db = require('../db/components/groups.js');
const gmembers_db = require('../db/components/gmembers.js');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const Joi = require('joi');
const jwt = require('../jwt/jwt.js');
const wrapper = require('./wrapper.js');

const groups_schema = Joi.object({
  new: Joi.boolean(),
  id: Joi.string().guid({ version: ['uuidv4'] }),
  name: Joi.string().min(1).required(),
  time_created: Joi.string().isoDate().when('new', { is: true, then: Joi.required() }),
})

router.get("/", async (req, res) => {
  const user = jwt.verifyJWT(req.headers.authorization);
  if (!user) return wrapper.unauthorized_response(res);

  try {
    if (req.query.user_id) {//get user groups
      if (user.id !== req.query.user_id) return wrapper.unauthorized_response(res);
      const groups = await groups_db.getUserGroups(req.query.user_id);
      res.send(groups)
    }
    else {//get all groups
      const groups = await groups_db.getActiveGroups();
      res.send(groups);
    }
  } catch (err) {
    res.status(500).send({ error: 'Internal server error' });
  }
});

router.post("/", async (req, res) => {
  const user = jwt.verifyJWT(req.headers.authorization);
  if (!user) return wrapper.unauthorized_response(res);

  const { error } = groups_schema.validate({ ...req.body, new: true })
  if (error) return res.status(400).send({ error: error.details[0].message });
  try {
    const new_group = req.body;
    new_group.id = uuidv4();
    new_group.time_created = new Date(new_group.time_created);
    await groups_db.addGroup(new_group);
    await gmembers_db.addGroupMember({ id: uuidv4(), groupchat_id: new_group.id, user_id: user.id, admin: true });
    res.send({ ...new_group, admin: true });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      res.status(400).send({ error: 'Name already exists for another group!' })
    }

    else res.status(500).send({ error: 'Internal server error' });
  }
});

router.put("/:id", async (req, res) => {
  const user = jwt.verifyJWT(req.headers.authorization);
  if (!user) return wrapper.unauthorized_response(res);

  const { error } = groups_schema.validate(req.body)
  if (error) return res.status(400).send({ error: error.details[0].message });
  try {
    const group_id = req.params.id;
    const updated_group = { ...req.body, id: group_id };
    const result = await groups_db.updateGroup(updated_group, user.id);
    if (result.changedRows === 0) return wrapper.no_Changes_response(res);
    res.send(updated_group);
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      res.status(400).send({ error: 'Name already exists for another group!' })
    }
    else res.status(500).send({ error: 'Internal server error' });
  }
});

router.delete("/:id", async (req, res) => {
  const user = jwt.verifyJWT(req.headers.authorization);
  if (!user) return wrapper.unauthorized_response(res);
  try {
    const group_id = req.params.id;
    const result = await groups_db.deleteGroup(group_id, user.id);
    if (result.changedRows === 0) return res.status(404).send({ error: 'Group to delete was not found!' });
    res.status(204).end();
  } catch (err) {
    res.status(500).send({ error: 'Internal server error' });
  }
});

module.exports = router;

