module.exports = function (sequelize, DataTypes) {
  return sequelize.define("subscription", {
    type: DataTypes.STRING,
    price: DataTypes.FLOAT,
  });
};
