const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('./utils/config');
const announcementRouter = require('./routes/announcements');
const authRouter = require('./routes/auth');

mongoose.connect(config.mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: true,
  useCreateIndex: true,
});

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api/announcements', announcementRouter);
app.use('/auth', authRouter);

module.exports = app;
