module.exports = function (sequelize, DataTypes) {
  return sequelize.define("payment", {
    cardNumber: DataTypes.STRING,
    securityCode: DataTypes.STRING,
    ownerName: DataTypes.STRING,
    amount: DataTypes.FLOAT,
  });
};
