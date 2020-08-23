const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressJWT = require('express-jwt');
require('express-async-errors');
const config = require('./utils/config');
const errorHandler = require('./middleware/errorHandler');
const announcementRouter = require('./routes/announcements');
const notificationRouter = require('./routes/notifications');
const messageRouter = require('./routes/messages');
const authRouter = require('./routes/auth');
const userRouter = require('./routes/users');

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
    path: ['/api/auth', '/api/announcements', '/api/notifications'],
  })
);
app.use('/api/announcements', announcementRouter);
app.use('/api/messages', messageRouter);
app.use('/api/notifications', notificationRouter);
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use(errorHandler);

module.exports = app;
