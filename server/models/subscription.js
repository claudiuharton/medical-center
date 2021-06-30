module.exports = function (sequelize, DataTypes) {
  return sequelize.define("subscription", {
    type: DataTypes.STRING,
    pricePercent: DataTypes.FLOAT,
    count: DataTypes.INTEGER,
  });
};
