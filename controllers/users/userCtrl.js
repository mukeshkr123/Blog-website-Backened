//user model
const User = require("../../model/user/User");

/// ----------------------------------------------------------------
// REGISTER
//----------------------------------------------------------------
const userRegisterCtrl = async (req, res) => {
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
};

module.exports = {
  userRegisterCtrl,
};
