const express = require('express');
const mongoose = require('mongoose');
var cors = require('cors');
require('dotenv').config()

const app = express();
app.use(express.json());
app.use(cors());

const port = 3000;

//DB connection..
mongoose.connect(process.env.CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true}, () => {
    console.log('Successfully connected with MongoDB');
})

const auth = require('./src/api/auth/auth.routes');
const rooms = require('./src/api/rooms/rooms.routes');
const transactions = require('./src/api/transactions/transactions.routes');
const categorys = require('./src/api/categorys/categorys.routes');

app.use('/api/auth', auth);
app.use('/api/rooms', rooms);
app.use('/api/transactions', transactions);
app.use('/api/categorys', categorys);

app.listen(port, () => {
  console.log("Server has started!");
})