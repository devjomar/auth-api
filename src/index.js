const express = require('express');
const { router } = require('./routes/user/user.controller');

const server = express();

server.disable('x-powered-by');
server.use(express.json());

// routes
server.use(router)

// handle error
server.use((err, req, res, next) => {
  console.error(err);
  return res.status(400).json({ error: err.message });
});

server.listen('3333', () => console.log('Server is running'));