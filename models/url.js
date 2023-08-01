const {Schema, model} = require("mongoose");

const URLSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  fileURL: {
    type: String,
    required: true,
  },
});

const URL = model("URL", URLSchema);

module.exports = URL;

// const { DataTypes } = require("sequelize");
// const sequelize = require("../util/database");

// const URL = sequelize.define("URL", {
//   id: {
//     type: DataTypes.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true,
//   },
//   email: {
//     type: DataTypes.STRING,
//     allowNull: false,
//     unique: true,
//   },
//   fileURL: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
// });

// module.exports = URL;
