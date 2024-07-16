const { compare, hash, genSalt } = require('bcrypt');
const { user, blacklist } = require('../../models/model');
const { sign, decode } = require('jsonwebtoken');
require('dotenv').config();

async function login(username, password) {
  const findUser = await user.findOne(username);

  if (findUser === null) throw new Error('user not found');

  const valid = await compare(password, findUser.password);

  if (!valid) throw new Error('username or password invalids');

  const token = sign({ username: findUser.username, role: findUser.role }, process.env.SECRET, {
    algorithm: "HS256",
    expiresIn: "2min",
  });

  return { token };
}

async function create(username, role, password) {
  const findUser = await user.findOne(username);

  if (findUser) throw new Error('username always exist');

  const cryptoPassword = await hash(password, await genSalt(10));

  return user.create(username, role, cryptoPassword);
}

function list() {
  return user.findAll();
}

function remove(username) {
  const remove = user.remove(username);

  if (!remove) throw new Error('user not exists');

  return remove;
}

function unregister(session) {
  const [, token] = session.split(' ');

  const jwt = decode(token, { complete: true }).payload;

  const userRemove = user.remove(jwt.username);

  if (!userRemove) throw new Error('something went wrong');

  blacklist.add(token);

  return userRemove;
}

function logout(session) {
  const [, token] = session.split(' ');

  blacklist.add(token);
}

function isAdmin(session) {
  const [, token] = session.split(' ');

  const { role } = decode(token, {
    complete: true,
  }).payload
  
  return role === 'admin' ? true : false;
}

module.exports = { login, create, list, remove, logout, isAdmin, unregister };