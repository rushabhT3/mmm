const express = require("express");
const cors = require("cors");
const app = express();
// const helmet = require("helmet");
const fs = require("fs");
const path = require("path");
const morgan = require("morgan");
const mongoose = require('mongoose');

const dotenv = require("dotenv");
dotenv.config();

const routes = require("./routes/router");
const purchaseRoutes = require("./routes/razorpayroutes");
const premiumFeatureRoutes = require("./routes/premiumFeature");
const PasswordRoutes = require("./routes/password");

// const sequelize = require("./util/database");

const User = require("./models/users");
const dailyExpense = require("./models/expense");
const Order = require("./models/orders");
const Forgotpassword = require("./models/password");

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ origin: '*' }));
// app.use(helmet());
app.use(morgan("combined", { stream: accessLogStream }));

app.use(async (req, res, next) => {
  try {
    const user = await User.findById(process.env.USER_ID);
    req.user = user;
    next();
  } catch (err) {
    console.log(err);
  }
});

app.use("/purchase", purchaseRoutes);
app.use("/premium", premiumFeatureRoutes);
app.use("/password", PasswordRoutes);
app.use("/", routes);

app.use((req, res) => {
  // console.log("urlll", req.url);
  res.sendFile(path.join(__dirname, `public/${req.url}`));
});

mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((result) => {
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          name: "rushabh",
          email: "email@email.com",
          password: "my-password",
        });
        user.save();
      }
    });
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`listening on port: ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

// User.hasMany(dailyExpense);
// dailyExpense.belongsTo(User);

// User.hasMany(Order);
// Order.belongsTo(User);

// User.hasMany(Forgotpassword);
// Forgotpassword.belongsTo(User);

// const port = process.env.PORT || 3000;
// sequelize.sync().then(
//   app.listen(port, () => {
//     console.log(`listening on port: ${port}`);
//   })
// );


