const expressAsyncHandler = require("express-async-handler");
const Post = require("../../model/post/Post");
const validateMongoId = require("../../utils/validateMongodbID");

const createPostCtrl = expressAsyncHandler(async (req, res) => {
  const { user } = req.body;
  validateMongoId(user);
  try {
    const post = await Post.create(req.body);
    res.json(post);
  } catch (error) {
    res.json(error);
  }
});

module.exports = { createPostCtrl };
