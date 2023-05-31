const Razorpay = require("razorpay");
const Order = require("../models/orders");
const controller = require("./controller");

const purchasepremium = async (req, res) => {
  try {
    var rzp = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    const amount = 2500;

    rzp.orders.create({ amount, currency: "INR" }, (err, order) => {
      // if (err) {
      //   throw new Error(JSON.stringify(err));
      // }
      req.authUser
        .createOrder({ orderid: order.id, status: "PENDING" })
        .then(() => {
          return res.status(201).json({ order, key_id: rzp.key_id });
        });
      // .catch((err) => {
      //   throw new Error(err);
      // });
    });
  } catch (err) {
    console.log(["purchase premium controller problem", err]);
    res
      .status(403)
      .json({ message: "purchase premium controller problem", error: err });
  }
};

const updateTransactionStatus = async (req, res) => {
  try {
    const userId = req.authUser.id;
    const { payment_id, order_id } = req.body;
    // console.log({ payment_id, order_id });
    const order = await Order.findOne({ where: { orderid: order_id } });
    const promise1 = order.update({
      paymentid: payment_id,
      status: "SUCCESSFUL",
    });
    const promise2 = req.authUser.update({ ispremiumuser: true });

    Promise.all([promise1, promise2]).then(() => {
      return res.status(202).json({
        sucess: true,
        message: "Transaction Successful",
        token: controller.generateAccessToken(userId, undefined, ispremiumuser),
      });
    });
    // .catch((error) => {
    //   throw new Error(error);
    // });
  } catch (err) {
    console.log(["error in the razorpay controller", err]);
    res
      .status(403)
      .json({ errpr: err, message: "update Transaction controller problem" });
  }
};

module.exports = {
  purchasepremium,
  updateTransactionStatus,
};
