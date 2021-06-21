module.exports = function (sequelize, DataTypes) {
  return sequelize.define("userSubscription", {
    amountToBePaid: DataTypes.FLOAT,
    dueDate: DataTypes.DATE,
    active: DataTypes.BOOLEAN,
  });
};
