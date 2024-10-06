require('dotenv').config();

const PORT = process.env.PORT;

const isTestEnv = process.env.NODE_ENV === 'test';
const MONGODB_URI = isTestEnv
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI;

module.exports = {
  MONGODB_URI,
  PORT,
};
