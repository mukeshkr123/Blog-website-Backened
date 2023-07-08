// express async hanler
const expressAsyncHandler = require("express-async-handler");

//user model
const User = require("../../model/user/User");
const generateToken = require("../../config/token/generateToken");
const sgMail = require("@sendgrid/mail");

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
//send email notification account verification
///--------------------------------

const generateVerificationTokenCtrl = expressAsyncHandler(async (req, res) => {
  try {
    //build your message
    const msg = {
      to: "mukeshmehta2041@gmail.com",
      from: "mkmehta2041@gmail.com",
      subject: "My first Node js email sending",
      text: "Hey check me out for this email",
    };

    await sgMail.send(msg);
    res.json("Email sent");
  } catch (error) {
    res.json(error);
  }
});

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
};
