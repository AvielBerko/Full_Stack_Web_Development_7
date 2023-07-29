const express = require('express');
const cors = require('cors');
const app = express();  

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const users = require('./routes/users');
const auth = require('./routes/user_auth');
const contacts = require('./routes/contacts');
const dmessages = require('./routes/dmessages');
const groups = require('./routes/groups');
const gmessages = require('./routes/gmessages');
const gmembers = require('./routes/gmembers');

app.use('/', auth);
app.use('/users', users);
app.use('/contacts', contacts);
app.use('/contacts/:id/messages', (req, res, next) => {
  req.locals = {user_id: req.params.id };
  next()
}, dmessages);
app.use('/groups', groups);
app.use('/groups/:id/messages', (req, res, next) => {
  req.locals = { groupchat_id: req.params.id };
  next();
}, gmessages);
app.use('/groups/:id/members', (req, res, next) => {
    req.locals = { groupchat_id: req.params.id };
    next();
  }, gmembers);

// Listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening to port ${port}`));
