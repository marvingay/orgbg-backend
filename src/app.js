const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressJWT = require('express-jwt');
const config = require('./utils/config');
const announcementRouter = require('./routes/announcements');
const authRouter = require('./routes/auth');

mongoose
  .connect(config.mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => console.log('MongoDB Connected.'));

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  expressJWT({
    secret: config.SECRET,
    getToken: (request) => request.cookies.webToken,
    algorithms: ['HS256'],
  }).unless({
    path: ['/auth'],
  })
);
app.use('/api/announcements', announcementRouter);
app.use('/auth', authRouter);

module.exports = { app, AutoIncrement };
