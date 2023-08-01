const {Schema, model} = require("mongoose");

const forgotPasswordSchema = new Schema({
  // ? Schema.Types.ObjectId: tells Mongoose to use automatically generated _id field as the primary key for ForgotPassword collection.
  id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  active: {
    type: Boolean,
  },
  expiresby: {
    type: Date,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const ForgotPassword = model("ForgotPassword", forgotPasswordSchema);

module.exports = ForgotPassword;

// const Sequelize = require("sequelize");
// const sequelize = require("../util/database");

// //id, name , password, phone number, role

// const Forgotpassword = sequelize.define("forgotpassword", {
//   id: {
//     type: Sequelize.UUID,
//     allowNull: false,
//     primaryKey: true,
//   },
//   active: Sequelize.BOOLEAN,
//   expiresby: Sequelize.DATE,
// });

// module.exports = Forgotpassword;
