const { verify, decode } = require("jsonwebtoken");
const { blacklist } = require("./models/model");
require('dotenv').config();

function middleware(req, res, next) {
  const session = req.headers.authorization;

  if (!session) return res.status(401).json({ error: 'token is missing or invalid' });

  const [, token] = session.split(' ');
  
  if (blacklist.verify(token)) return res.status(401).json({ error: 'token is missing or invalid' });

  return verify(token, process.env.SECRET, err => {
    err ? res.status(401).json({ error: 'token is missing or invalid' }) : next();
  });
};

module.exports = { middleware };