const configuration = require("../../configuration");
const { sessionKey } = process.env.PROD
  ? configuration.prod
  : configuration.dev;
const session = require("client-sessions");

module.exports = session({
  cookieName: "session",
  secret: sessionKey,
  duration: 720000000,
  activeDuration: 30000000,
  httpOnly: true,
  ephemeral: true,
});
