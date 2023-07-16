const expressAsyncHandler = require("express-async-handler");
const Filter = require("bad-words");
const Post = require("../../model/post/Post");
const validateMongoId = require("../../utils/validateMongodbID");
const User = require("../../model/user/User");

// Create post
const createPostCtrl = expressAsyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { user, title, description } = req.body;
  validateMongoId(user);
  // Check for bad words
  const filter = new Filter();
  const isProfane = filter.isProfane(title) || filter.isProfane(description);

  if (isProfane) {
    await User.findOneAndUpdate({ _id }, { isBlocked: true });
    throw new Error(
      "Creating Failed because it contains bad words and you have been blocked."
    );
  }

  try {
    const post = await Post.create({ user, title, description });
    res.json(post);
  } catch (error) {
    res.json(error);
  }
});

module.exports = { createPostCtrl };
