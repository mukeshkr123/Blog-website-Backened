const expressAsyncHandler = require("express-async-handler");
const Filter = require("bad-words");
const Post = require("../../model/post/Post");
const validateMongoId = require("../../utils/validateMongodbID");
const User = require("../../model/user/User");
const cloudinaryUploadImg = require("../../utils/cloudinary");
const fs = require("fs");

// Create post
const createPostCtrl = expressAsyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { user, title, description } = req.body;
  // validateMongoId(user);
  // Check for bad words
  const filter = new Filter();
  const isProfane = filter.isProfane(title) || filter.isProfane(description);

  if (isProfane) {
    await User.findOneAndUpdate({ _id }, { isBlocked: true });
    throw new Error(
      "Creating Failed because it contains bad words and you have been blocked."
    );
  }

  // 1. Get the path to the image
  const localPath = `public/images/posts/${req.file.filename}`;

  // 2. Upload to Cloudinary
  const imgUploaded = await cloudinaryUploadImg(localPath);

  try {
    const post = await Post.create({
      ...req.body,
      image: imgUploaded?.url,
      user: _id,
    });
    res.json(post);
    //Removed uploaded image after uploading
    fs.unlinkSync(localPath);
  } catch (error) {
    res.json(error);
  }
});

module.exports = { createPostCtrl };
