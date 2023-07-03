// express async hanler
const expressAsyncHandler = require("express-async-handler");

//user model
const User = require("../../model/user/User");
const generateToken = require("../../config/token/generateToken");

/// ----------------------------------------------------------------
// REGISTER
//----------------------------------------------------------------
const userRegisterCtrl = expressAsyncHandler(async (req, res) => {
  // check if user is already registered
  const userExist = await User.findOne({ email: req?.body?.email });
  if (userExist) throw new Error("User already registered");
  try {
    //Register user
    const user = await User.create({
      firstName: req?.body?.firstName,
      lastName: req?.body?.lastName,
      email: req?.body?.email,
      password: req?.body?.password,
    });
    res.json(user);
  } catch (error) {
    res.json(error);
  }
});

//----------------------------------------------------------------
// Login User
//----------------------------------------------------------------
const loginUserCtrl = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // check if user is already existing
  const userFound = await User.findOne({ email: req.body.email });
  // check if password is match
  if (userFound && (await userFound.isPasswordMatch(password))) {
    res.json({
      _id: userFound?.id,
      firstName: userFound?.firstName,
      lastName: userFound?.lastName,
      email: userFound?.email,
      profilePhoto: userFound?.profilePhoto,
      isAdmin: userFound?.isAdmin,
      token: generateToken(userFound.id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid login creditionals");
  }
});

// ----------------------------------------------------------------
// Users fetch all users
//--

const fetchUsersCtrl = expressAsyncHandler(async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.json(error);
  }
});

module.exports = {
  userRegisterCtrl,
  loginUserCtrl,
  fetchUsersCtrl,
};
