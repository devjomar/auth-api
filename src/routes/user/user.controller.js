const { middleware } = require('../../middleware');
const { login, create, list, remove, logout, isAdmin, unregister } = require('./user.service');
const { Router } = require('express');

const router = Router();

// Login
router.post('/login', async (req, res, next) => {
  const { username, password } = req.body;

  return await login(username, password)
    .then(({ token }) => res.status(200).json({ token }))
    .catch(err => next(err));
});

// Register
router.post('/register', async (req, res, next) => {
  const { username, role, password } = req.body;

  return await create(username, role, password)
    .then(user => res.status(201).json(user))
    .catch(err => next(err));
});

// Unregister
router.delete('/unregister', async (req, res, next) => {
  const session = req.headers.authorization;

  const remove = unregister(session);

  if (!remove) return next(remove);

  return res.status(200).json({ info: 'user deleted, see you next time' });
});

// List
router.get('/users', middleware, (req, res) => {
  const users = list();

  return res.status(200).json(users);
});

// Remove user
router.delete('/remove', middleware, (req, res, next) => {
  const { username } = req.body;
  const session = req.headers.authorization;

  if (!isAdmin(session)) return res.status(401).json({ error: 'user have not permission' });

  const user = remove(username);

  if (!user) return next(user);

  return res.status(200).json({ info: 'user deleted' });
});

// Logout
router.delete('/logout', middleware, (req, res, next) => {
  const session = req.headers.authorization;

  logout(session);

  return res.status(200).json();
});

module.exports = { router };