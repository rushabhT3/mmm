const { Sequelize, DataTypes } = require("sequelize");

const sequelize = require("../util/database");

const dailyExpense = sequelize.define("dailyExpense", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  description: { type: DataTypes.STRING, allowNull: false },
  category: { type: DataTypes.STRING, allowNull: false },
});

module.exports = dailyExpense;
