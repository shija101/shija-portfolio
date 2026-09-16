const argon2 = require("argon2");

const hashPassword = async (password) => {
  return argon2.hash(password, {
    type: argon2.argon2id,
  });
};

const verifyPassword = async (passwordHash, password) => {
  return argon2.verify(passwordHash, password);
};

module.exports = {
  hashPassword,
  verifyPassword,
};