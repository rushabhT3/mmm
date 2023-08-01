const {Schema, model} = require("mongoose");

const orderSchema = new Schema({
  paymentid: {
    type: String,
  },
  orderid: {
    type: String,
  },
  status: {
    type: String,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Order = model("Order", orderSchema);

module.exports = Order;

// const Sequelize = require("sequelize");
// const sequelize = require("../util/database");

// //id, name , password, phone number, role

// const Order = sequelize.define("order", {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true,
//   },
//   paymentid: Sequelize.STRING,
//   orderid: Sequelize.STRING,
//   status: Sequelize.STRING,
// });

// module.exports = Order;
