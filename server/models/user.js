module.exports = function (sequelize, DataTypes) {
  return sequelize.define("user", {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    birthDate: DataTypes.STRING,
    city: DataTypes.STRING,
    phone: DataTypes.STRING,
    token: DataTypes.STRING,
    info: DataTypes.STRING,
    type: DataTypes.STRING,
  });
};
