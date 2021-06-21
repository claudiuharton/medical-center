const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const router = require("./routes");
const session = require("./config/session");

const serveStatic = require("serve-static");
const history = require("connect-history-api-fallback");
const port = process.env.PORT || require("../configuration").dev.port;
const { sequelize, User } = require("./models");

const app = express();

sequelize.sync().then(async () => {
  console.log("Database syncronized");
  const user = await User.findOne({ where: { email: "admin" } });
  if (!user) {
    await User.create({
      firstName: "Admin",
      lastName: "Admin",
      email: "admin",
      type: "admin",
      token: Math.random().toString(36),
      password: "admin",
    });
    console.log("Admin user was created");
  }
});

const configure = (app) => {
  app.use(cors());
  app.use(session);
  app.use(bodyParser.json());
  app.use(history());
  app.use(serveStatic(__dirname + "/../client/dist/spa"));
  app.use("/api", router);
};
module.exports = configure;

configure(app);

app.listen(port, () => {
  console.log(`server started on http://localhost:${port}`);
});
