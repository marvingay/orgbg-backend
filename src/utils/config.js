require('dotenv').config();

let mongoUrl = process.env.MONGODB_URI;
let PORT = process.env.PORT;
const CLIENT_ID = process.env.CLIENT_ID;

module.exports = {
  mongoUrl,
  PORT,
  CLIENT_ID,
};
