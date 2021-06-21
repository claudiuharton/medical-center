const Sequelize = require("sequelize");

const configuration = require("../../configuration");

const { db } = process.env.PROD ? configuration.prod : configuration.dev;
const sequelize = new Sequelize(db.database, db.username, db.password, {
  dialect: db.dialect,
  host: db.host,
  dialectOptions: process.env.PROD
    ? {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      }
    : null,
});

module.exports = sequelize;
