const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./utils/config');

app.use(cors());
app.use(express.json());

module.exports = app;
