const { Sequelize, DataTypes } = require("sequelize");

const sequelize = require("../util/database");

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ispremiumuser: Sequelize.BOOLEAN,
  total_cost: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
});

module.exports = User;
