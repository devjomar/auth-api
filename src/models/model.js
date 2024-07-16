const { decode } = require("jsonwebtoken");

class User {
  #users = new Map();

  create(username, role, password) {
    this.#users.set(username, { username, role, password });

    return this.#users.get(username);
  }

  findAll() {
    const users = [];

    this.#users.forEach(value => {
      users.push(value);
    });

    return users;
  }

  findOne(username) {
    const user = this.#users.get(username);

    if (user === undefined) return null;
  
    return user;
  }

  remove(username) {
    return this.#users.delete(username);
  }
}

class BlackListToken {
  #blacklist = new Map();

  verify(token) {
    const signature = decode(token, { complete: true }).signature;
    return this.#blacklist.has(signature);
  }

  add(token) {
    const jwt = decode(token, { complete: true });
    this.#blacklist.set(jwt.signature, jwt);
  }
}

const user = new User();
const blacklist = new BlackListToken();

module.exports = { user, blacklist };