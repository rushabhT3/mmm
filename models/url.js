const { DataTypes } = require("sequelize");
const sequelize = require("../util/database");

const URL = sequelize.define("URL", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  fileURL: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = URL;
