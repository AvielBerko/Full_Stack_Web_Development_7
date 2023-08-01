const express = require("express");
const users_db = require('../db/components/users.js');
const router = express.Router();
const Joi = require('joi');
const jwt = require('../jwt/jwt.js');
const wrapper = require('./wrapper.js');

const updated_user_schema = Joi.object({//interest
  id: Joi.string().guid({ version: ['uuidv4'] }),
  username: Joi.string().min(3).max(30),
  phone_number: Joi.string().length(10).pattern(/^\d+$/).message({ 'string.pattern.base': 'phone number must contain only numbers.' }),
})

router.get("/", async (req, res) => {
  if (!jwt.verifyJWT(req.headers.authorization)) return wrapper.unauthorized_response(res);

  try {
    const users = await users_db.getCurrentUsers();
    res.send(users);
  } catch (err) {
    res.status(500).send({ error: 'Internal server error' });
  }
});

router.put("/:id", async (req, res) => {
  const user = jwt.verifyJWT(req.headers.authorization);
  const user_id = req.params.id;
  if (!user || user_id !== user.id) return wrapper.unauthorized_response(res);

  const { error } = updated_user_schema.validate(req.body)
  if (error) return res.status(400).send({ error: error.details[0].message });

  try {
    const updated_user = { ...req.body, id: user_id };
    const result = await users_db.updateUser(updated_user);
    if (result.changedRows === 0) return wrapper.no_Changes_response(res);
    res.send(jwt.generateJWT(updated_user));
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      res.status(400).send({ error: 'Username or Email already exists!' })
    }
    else res.status(500).send({ error: 'Internal server error' });
  }
});

module.exports = router;
