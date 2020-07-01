require('dotenv').config();

let mongoUrl = process.env.MONGODB_URI;
let PORT = process.env.PORT;
const CLIENT_ID = process.env.CLIENT_ID;
const SECRET = process.env.SECRET;

module.exports = {
  mongoUrl,
  PORT,
  CLIENT_ID,
  SECRET,
};
