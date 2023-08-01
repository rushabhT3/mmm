const {Schema, model} = require("mongoose");

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  ispremiumuser: {
    type: Boolean,
    default: false,
  },
  total_cost: {
    type: Number,
    default: 0,
  },
});

const User = model("User", userSchema);

module.exports = User;

// const { Sequelize, DataTypes } = require("sequelize");

// const sequelize = require("../util/database");

// const User = sequelize.define("User", {
//   id: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//     autoIncrement: true,
//     primaryKey: true,
//   },
//   name: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   email: {
//     type: DataTypes.STRING,
//     allowNull: false,
//     unique: true,
//   },
//   password: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   ispremiumuser: Sequelize.BOOLEAN,
//   total_cost: {
//     type: Sequelize.INTEGER,
//     defaultValue: 0,
//   },
// });

// module.exports = User;
