const { sequelize } = require("../models");

const controller = {
  reset: async (req, res) => {
    try {
      await sequelize.sync({ force: true });
      res.status(201).send({
        message: "Database reset",
      });
    } catch (e) {
      console.error(e);
      res.status(500).send({
        message: "Error",
      });
    }
  },
};

module.exports = controller;
