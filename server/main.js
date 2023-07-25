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
const contacts = require('./routes/contacts');0
const dmessages = require('./routes/dmessages');

app.use('/', auth)
app.use('/users', users);
app.use('/contacts', contacts);
app.use('/dmessages', dmessages);

// Listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening to port ${port}`));
