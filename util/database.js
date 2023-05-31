// ? Imported a class Sequelize
const Sequelize = require("sequelize");
const dotenv = require("dotenv");
dotenv.config();

// ? Creating an object sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
  }
);

// ? Exporting the object created
module.exports = sequelize;
