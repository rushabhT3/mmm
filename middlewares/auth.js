const jwt = require("jsonwebtoken"); // ? This imports the jwt library which helps us work with tokens

const User = require("../models/users");

exports.authenticate = async (req, res, next) => {
  try {
    const token = req.header("Authorization"); // ? This gets the token from the request header
    const user = jwt.verify(token, "secretkey2"); // ? This checks if the token is real using a secret key
    const authUser = await User.findByPk(user.jwtId); // ? This looks up the user's information using their ID
    // console.log({ authUser });
    // console.log(JSON.stringify(authUser));
    req.authUser = authUser; // ? This adds the user's information to the request so we can use it later
    next();
  } catch (error) {
    console.log(["middleware not working", error]);
  } // This lets the person go to the next page
};
