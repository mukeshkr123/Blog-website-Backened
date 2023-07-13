// express async hanler
const expressAsyncHandler = require("express-async-handler");

//user model
const User = require("../../model/user/User");
const generateToken = require("../../config/token/generateToken");
const sgMail = require("@sendgrid/mail");
const crypto = require("crypto");

const validateMongoId = require("../../utils/validateMongodbID");

const { response } = require("express");

sgMail.setApiKey(process.env.SEND_GRID_API_KEY);

//-------------------------------------
//Register
//-------------------------------------

const userRegisterCtrl = expressAsyncHandler(async (req, res) => {
  //Check if user Exist
  const userExists = await User.findOne({ email: req?.body?.email });

  if (userExists) throw new Error("User already exists");
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

//-------------------------------
//Login user
//-------------------------------

const loginUserCtrl = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //check if user exists
  const userFound = await User.findOne({ email });
  //Check if password is match
  if (userFound && (await userFound.isPasswordMatched(password))) {
    res.json({
      _id: userFound?._id,
      firstName: userFound?.firstName,
      lastName: userFound?.lastName,
      email: userFound?.email,
      profilePhoto: userFound?.profilePhoto,
      isAdmin: userFound?.isAdmin,
      token: generateToken(userFound?._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid Login Credentials");
  }
});

//------------------------------
//Users
//-------------------------------
const fetchUsersCtrl = expressAsyncHandler(async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.json(error);
  }
});

//------------------------------
//Delete user
//------------------------------
const deleteUsersCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  //check if user id is valid
  validateMongoId(id);
  try {
    const deletedUser = await User.findByIdAndDelete(id);
    res.json(deletedUser);
  } catch (error) {
    res.json(error);
  }
});

//----------------
//user details
//----------------
const fetchUserDetailsCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  //check if user id is valid
  validateMongoId(id);
  try {
    const user = await User.findById(id);
    res.json(user);
  } catch (error) {
    res.json(error);
  }
});

//------------------------------
//User profile
//------------------------------

const userProfileCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoId(id);
  try {
    const myProfile = await User.findById(id);
    res.json(myProfile);
  } catch (error) {
    res.json(error);
  }
});

//------------------------------
//Update profile
//------------------------------
const updateUserCtrl = expressAsyncHandler(async (req, res) => {
  const { _id } = req?.user;
  console.log(req.user);
  validateMongoId(_id);
  const user = await User.findByIdAndUpdate(
    _id,
    {
      firstName: req?.body?.firstName,
      lastName: req?.body?.lastName,
      email: req?.body?.email,
      bio: req?.body?.bio,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.json(user);
});

//------------------------------
//Update password
//------------------------------

const updateUserPasswordCtrl = expressAsyncHandler(async (req, res) => {
  //destructure the login user
  const { _id } = req.user;
  const { password } = req.body;
  validateMongoId(_id);
  //Find the user by _id
  const user = await User.findById(_id);

  if (password) {
    user.password = password;
    const updatedUser = await user.save();
    res.json(updatedUser);
  } else {
    res.json(user);
  }
});

//------------------------------
//following
//------------------------------

const followingUserCtrl = expressAsyncHandler(async (req, res) => {
  const { followId } = req.body;
  const loginUserId = req.user.id;

  //find the target user and check if loginuser id aleready exists in the following
  const targetUser = await User.findById(followId);

  const alreadyfollowing = targetUser?.followers?.find(
    (user) => user?.toString() === loginUserId.toString()
  );

  if (alreadyfollowing) throw new Error("You have already following this user");

  //1. find the user you want to follow and upadte it's followers field ,
  await User.findByIdAndUpdate(
    followId,
    {
      $push: { followers: loginUserId },
      isFollowing: true,
    },
    {
      new: true,
    }
  );

  //2. update the login user following field
  await User.findByIdAndUpdate(
    loginUserId,
    {
      $push: { following: followId },
    },
    {
      new: true,
    }
  );

  res.json("You have successfully followed this user");
});

//------------------------------
//unfollowing
//------------------------------

const unfollowUserId = expressAsyncHandler(async (req, res) => {
  const { unfollowId } = req.body;
  const loginUserId = req.user.id;

  await User.findByIdAndUpdate(
    unfollowId,
    {
      $pull: { followers: loginUserId },
      isFollowing: false,
    },
    {
      new: true,
    }
  );

  await User.findByIdAndUpdate(
    loginUserId,
    {
      $pull: { following: unfollowId },
    },
    {
      new: true,
    }
  );
  res.json("You have successfully unfollowed this user");
});

//----------------------------------------------------------------
//Block
//----------------------------------------------------------------

const blockUserCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoId(id);
  const user = await User.findByIdAndUpdate(
    id,
    {
      isBlocked: true,
    },
    {
      new: true,
    }
  );
  res.json(user);
});

//----------------------------------------------------------------
//UnBlock
//----------------------------------------------------------------

const unBlockUserCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoId(id);
  const user = await User.findByIdAndUpdate(
    id,
    {
      isBlocked: false,
    },
    {
      new: true,
    }
  );
  res.json(user);
});

///--------------------------------
//generate email verification token
///--------------------------------
const generateVerificationTokenCtrl = expressAsyncHandler(async (req, res) => {
  const loginUserid = req.user.id;

  try {
    // Find the user
    const user = await User.findById(loginUserid);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate verification token
    const verificationToken = await user.createAccountVerificationToken();
    // save the user
    await user.save();

    // Build your message

    const resetURL = `if you are requested to verify your account , verify now with 10 minutes , otherwise ignore the <a href="http://localhost:3000/verify-account/${verificationToken} >Click here </a>`;

    const msg = {
      to: "mukeshmehta2041@gmail.com",
      from: "mkmehta2041@gmail.com",
      subject: "My first Node.js email sending",
      text: resetURL,
    };

    // Send the email
    await sgMail.send(msg);

    res.json({ message: "Email sent", verificationToken, resetURL });
  } catch (error) {
    res.status(500).json({ message: "Error sending email", error });
  }
});

///--------------------------------
/// Account verification
////----------------------------------------------------

const accountVerificationCtrl = expressAsyncHandler(async (req, res) => {
  const { token } = req.body;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  //find the user by token
  const userFound = await User.findOne({
    accountVerificationToken: hashedToken,
    accountVerificationTokenExpires: { $gt: new Date() },
  });

  if (!userFound) throw new Error("Token expire Try again later");
  //update the properties to true
  userFound.isAccountVerified = true;
  userFound.accountVerificationToken = undefined;
  userFound.accountVerificationTokenExpires = undefined;
  await userFound.save();
  res.json(userFound);
});

//----------------------------------------------------------------
// Generate a Forgot Password Token
//----------------------------------------------------------------

const forgetPasswordTokenCtrl = expressAsyncHandler(async (req, res) => {
  // find the user by emai;
  const { email } = req.body;

  const userFound = await User.findOne({ email });
  if (!userFound) throw new Error("User not found");

  try {
    const token = await userFound.createPasswordResetToken();
    await userFound.save();
    res.json(userFound);
  } catch (error) {
    res.json(error);
  }
});

//----------------------------------------------------------------
// Take the token, the user by token
//----------------------------------------------------------------

module.exports = {
  userRegisterCtrl,
  loginUserCtrl,
  fetchUsersCtrl,
  deleteUsersCtrl,
  fetchUserDetailsCtrl,
  userProfileCtrl,
  updateUserCtrl,
  updateUserPasswordCtrl,
  followingUserCtrl,
  unfollowUserId,
  blockUserCtrl,
  unBlockUserCtrl,
  generateVerificationTokenCtrl,
  accountVerificationCtrl,
  forgetPasswordTokenCtrl,
};
