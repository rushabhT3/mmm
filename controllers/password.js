const uuid = require("uuid");
const SibApiV3Sdk = require("sib-api-v3-sdk");
const bcrypt = require("bcrypt");
require("dotenv").config();

const User = require("../models/users");
const Forgotpassword = require("../models/password");

const client = SibApiV3Sdk.ApiClient.instance;
const apikey = client.authentications["api-key"];
apikey.apiKey = process.env.BREVO_API_KEY;

const forgotpassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    if (user) {
      const id = uuid.v4();
      user.createForgotpassword({ id, active: true }).catch((err) => {
        throw new Error(err);
      });
      // Send email using Sendinblue API
      const sendinblue = new SibApiV3Sdk.TransactionalEmailsApi();

      const sendSmtpEmail = {
        to: [{ email: email }],
        sender: {
          email: "any@email.com",
          name: "anyName",
        },
        subject: "Reset Your Password",
        htmlContent: `<p>Hello,</p>
                      <p>Please click the following link to reset your password:</p>
                      <p><a href="http://localhost:3000/password/resetpassword/${id}">Reset password</a></p>
                      <p>If you did not request a password reset, please ignore this email.</p>
                      <p>Thank you!</p>`,
      };

      await sendinblue.sendTransacEmail(sendSmtpEmail);
      return res.status(200).json({
        message: "Link to reset password sent to your email",
        success: true,
      });
    } else {
      throw new Error("User doesn't exist");
    }
  } catch (err) {
    console.error(err);
    return res.json({ message: err, success: false });
  }
};

const resetpassword = async (req, res) => {
  try {
    const id = req.params.id;
    const forgotpasswordrequest = await Forgotpassword.findOne({
      where: { id },
    });
    if (forgotpasswordrequest) {
      forgotpasswordrequest.update({ active: false });
      res.status(200).send(`<!DOCTYPE html>
        <html>
        <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f1f1f1;
            padding: 20px;
          }
  
          form {
            max-width: 400px;
            margin: 0 auto;
            background-color: #fff;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          }
  
          label {
            display: block;
            margin-bottom: 10px;
            font-weight: bold;
          }
  
          input[type="password"] {
            width: 100%;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 4px;
            box-sizing: border-box;
          }
  
          button {
            background-color: #4CAF50;
            color: #fff;
            padding: 10px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
          }
  
          button:hover {
            background-color: #45a049;
          }
        </style>
        </head>
        <body>
            <form action="/password/updatepassword/${id}" method="get">
                <label for="newpassword">Enter New Password</label>
                <input name="newpassword" type="password" required>
                <button>Reset Password</button>
            </form>
        </body>
        </html>
        `);
      res.end();
    }
  } catch (error) {
    console.log({ password_controller: error });
  }
};

const updatepassword = async (req, res) => {
  try {
    const { newpassword } = req.query;
    const { resetpasswordid } = req.params;
    resetpasswordrequest = await Forgotpassword.findOne({
      where: { id: resetpasswordid },
    });
    const user = await User.findOne({
      where: { id: resetpasswordrequest.UserId },
    });
    if (user) {
      //encrypt the password
      const saltRounds = 10;
      bcrypt.genSalt(saltRounds, function (err, salt) {
        if (err) {
          console.log(err);
          throw new Error(err);
        }
        bcrypt.hash(newpassword, salt, function (err, hash) {
          // Store hash in your password DB.
          if (err) {
            console.log(err);
            throw new Error(err);
          }
          user.update({ password: hash }).then(() => {
            res
              .status(201)
              .json({ message: "Successfuly update the new password" });
          });
        });
      });
    } else {
      return res.status(404).json({ error: "No user Exists", success: false });
    }
  } catch (error) {
    return res.status(403).json({ error, success: false });
  }
};

module.exports = {
  forgotpassword,
  updatepassword,
  resetpassword,
};
