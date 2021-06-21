module.exports = function (sequelize, DataTypes) {
  return sequelize.define("appointment", {
    duration: DataTypes.INTEGER,
    date: DataTypes.DATE,
    url: DataTypes.STRING,
    observation: DataTypes.TEXT,
  });
};
