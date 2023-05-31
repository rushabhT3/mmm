const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const sequelize = require("../util/database");

const User = require("../models/users");
const dailyExpense = require("../models/expense");
const URL = require("../models/url");

const { uploadToS3 } = require("../Services/s3services");

const signUp = async (req, res) => {
  // const { name, email, password } = req.body;
  // await User.create({ name, email, password });
  // res.status(201).json({ message: "Successfully created new user:)" });
  try {
    const { name, email, password } = req.body;
    if (!name && email && password) {
      return res
        .status(400)
        .json({ error: "bad parameters: something is missing" });
    }
    // ? generating the hash value using the bycrypt
    bcrypt.hash(password, 10, async (error, hash) => {
      await User.create({ name, email, password: hash });
      res.status(201).json({ message: "Successfully created new user:)" });
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

const generateAccessToken = (id, name, ispremiumuser) => {
  return jwt.sign({ jwtId: id, name: name, ispremiumuser }, "secretkey2");
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const foundUser = await User.findOne({ where: { email } });
    // console.log({ foundUser: foundUser, email: email });
    if (foundUser) {
      // ? compare with the hash with the non hash value and callback me error k baad result hain and result != res
      bcrypt.compare(password, foundUser.password, (error, result) => {
        if (result) {
          console.log({ result: result });
          res.status(200).json({
            message: "Successfully Logged In",
            token: generateAccessToken(
              foundUser.id,
              foundUser.name,
              foundUser.ispremiumuser
            ),
          });
        } else {
          res.status(403).json({ message: "Password is wrong" });
        }
      });
    } else {
      res.status(404).json({ message: "User not found in table" });
    }
  } catch (error) {
    console.log("login error");
    res.status(500).json({ message: error });
  }
};

const postdailyExpense = async (req, res) => {
  // ! sequelize transaction basically checkpost jaisa sequelize hamara database util me se
  // ? const t try k bahar hoga nhi toh error me usko access ni kr paayenge
  const t = await sequelize.transaction();

  try {
    const { amount, description, category } = req.body;
    const response = await dailyExpense.create(
      {
        amount,
        description,
        category,
        UserId: req.authUser.id,
      },
      { transaction: t } // ? Pass the transaction to the create method
    );

    const total_cost = Number(req.authUser.total_cost) + Number(amount);
    await User.update(
      {
        total_cost: total_cost,
      },
      {
        where: { id: req.authUser.id },
        transaction: t, // ? Pass the transaction to the update method
      }
    );

    await t.commit(); // ? Commit the transaction

    res.json(response);
  } catch (error) {
    await t.rollback(); // Rollback the transaction in case of an error
    return res.status(500).json({ "Error in controller post expense": error });
  }
};

const getdailyExpense = async (req, res) => {
  try {
    // ? how many to skip before starting to look. For example, if you have an offset of 10, you would skip the first 10 and start looking from the 11th.
    const page = req.query.page || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const response = await dailyExpense.findAndCountAll({
      where: { UserId: req.authUser.id },
      limit,
      offset,
    });

    res.json({
      expenses: response.rows,
      // ? Math.ceil() rounds a number up to the nearest integer >= that value
      totalPages: Math.ceil(response.count / limit),
      currentPage: page,
    });
  } catch (error) {
    console.log("error in getdailyexpense controller");
  }
};

const deleteExpense = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    // ? params are used to retrieve data from the URL, while body is used to retrieve data from the request.
    // ? The .query method is used to retrieve data from the query string
    const { id } = req.params;
    const expense = await dailyExpense.findOne({
      where: { id: id, UserId: req.authUser.id },
      transaction: t,
    });
    if (expense) {
      await expense.destroy();
      const total_cost =
        Number(req.authUser.total_cost) - Number(expense.amount);
      await User.update(
        {
          total_cost: total_cost,
          transaction: t,
        },
        {
          where: { id: req.authUser.id },
          transaction: t,
        }
      );
      await t.commit();
      res.json({ message: "Expense deleted successfully" });
    } else {
      res.status(404).json({ message: "Expense not found" });
    }
  } catch (error) {
    await t.rollback();
    // console.log("deleteExpense Controller problem");
    res.status(500).json({ message: "Internal server error" });
  }
};

const downloadExpenses = async (req, res) => {
  try {
    const expenses = await dailyExpense.findAll({
      where: { UserId: req.authUser.id },
    });
    // console.log({ controller_downloadExpense: expenses });
    const stringifiedExpenses = JSON.stringify(expenses);
    const UserId = req.authUser.id;
    const filename = `Expense${UserId}/${new Date()}.txt`;
    const fileURL = await uploadToS3(stringifiedExpenses, filename);

    await URL.create(
      { email: req.authUser.email, fileURL: fileURL },
      { where: { email: req.authUser.email } }
    );

    const urls = await URL.findAll();
    const fileURLs = urls.map((url) => url.fileURL);
    console.log({ URL: fileURLs });

    res.status(200).json({ fileURLs, success: true });
  } catch (error) {
    console.log({ downloadExpenses_controller_problem: error });
    res.status(500).json({ message: "Internal server error" });
  }
};

const random = async (req, res) => {
  try {
    res.send({
      message: "hi this is random",
    });
  } catch (error) {
    console.log("random controller problem");
  }
};

module.exports = {
  signUp,
  generateAccessToken,
  login,
  postdailyExpense,
  getdailyExpense,
  deleteExpense,
  downloadExpenses,
  random,
};
