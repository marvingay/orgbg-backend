import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { PORT, mongoUrl, SECRET } from './utils/config';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import expressJWT from 'express-jwt';
require('express-async-errors');
require('typescript-require');
import { errorHandler } from './middleware/errorHandler';
import announcementRouter from './routes/announcements';
import notificationRouter from './routes/notifications';
import messageRouter from './routes/messages';
import authRouter from './routes/auth';
import userRouter from './routes/users';

const main = async () => {
  await mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });
  console.log('MongoDB Connected.');

  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(
    expressJWT({
      secret: SECRET,
      getToken: (req) => req.cookies.webToken,
      algorithms: ['HS256'],
    }).unless({
      path: [
        '/api/auth',
        '/api/auth/logout',
        '/api/messages/all',
        '/api/announcements',
        '/api/notifications',
      ],
    })
  );
  app.use('/api/announcements', announcementRouter);
  app.use('/api/messages', messageRouter);
  app.use('/api/notifications', notificationRouter);
  app.use('/api/auth', authRouter);
  app.use('/api/users', userRouter);
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

main().catch(err => console.log(err));