module.exports = function (sequelize, DataTypes) {
  return sequelize.define("service", {
    name: DataTypes.STRING,
    category: DataTypes.STRING,
    description: DataTypes.STRING,
  });
};
