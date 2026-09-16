const { csrfSync } = require("csrf-sync");

const {
  csrfSynchronisedProtection,
  generateToken,
} = csrfSync({
  ignoredMethods: ["GET", "HEAD", "OPTIONS"],

  getTokenFromRequest: (req) => {
    return req.headers["x-csrf-token"];
  },

  getTokenFromState: (req) => {
    return req.session.csrfToken;
  },

  storeTokenInState: (req, token) => {
    req.session.csrfToken = token;
  },
});

module.exports = {
  csrfSynchronisedProtection,
  generateToken,
};
