const {Schema, model} = require("mongoose");

const dailyExpenseSchema = new Schema({
  amount: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const DailyExpense = model("DailyExpense", dailyExpenseSchema);

module.exports = DailyExpense;

// const { Sequelize, DataTypes } = require("sequelize");

// const sequelize = require("../util/database");

// const dailyExpense = sequelize.define("dailyExpense", {
//   id: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//     autoIncrement: true,
//     primaryKey: true,
//   },
//   amount: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//   },
//   description: { type: DataTypes.STRING, allowNull: false },
//   category: { type: DataTypes.STRING, allowNull: false },
// });

// module.exports = dailyExpense;
