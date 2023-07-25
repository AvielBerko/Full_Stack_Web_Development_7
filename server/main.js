const express = require('express');
const cors = require('cors');
const app = express();  

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get('/', (req, res) => res.send({data: "hello world!"}));

// Routes
const users = require('./routes/Users');
const auth = require('./routes/user_auth');
const contacts = require('./routes/contacts');
const dmessages = require('./routes/dmessages');
const groups = require('./routes/groups');
const gmessages = require('./routes/gmessages');
const gusers = require('./routes/gmembers');

app.use('/', auth)
app.use('/users', users);
app.use('/contacts', contacts);
app.use('/dmessages', dmessages);
app.use('/groups', groups);
app.use('/gmessages', gmessages);
app.use('/gusers', gusers);

// Listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening to port ${port}`));
