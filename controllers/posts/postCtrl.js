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

// fetch all posts
const fetchAllPostsCtrl = expressAsyncHandler(async (req, res) => {
  try {
    const posts = await Post.find({}).populate("user");
    res.json(posts);
  } catch (error) {
    res.json(error);
  }
});

//fetch single posts
const fetchPostCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoId(id);
  try {
    const post = await Post.findById(id).populate("user");
    // update number of views
    await Post.findByIdAndUpdate(
      id,
      { $inc: { numViews: 1 } },
      {
        new: true,
      }
    );
    res.json(post);
  } catch (error) {
    res.json(error);
  }
});

//delete a post
const deletePostCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoId(id);
  try {
    await Post.findByIdAndDelete(id);
    res.json("Deleted successfully");
  } catch (error) {
    res.json(error);
  }
});

// update the posts
const updatePostCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoId(id);
  try {
    const post = await Post.findByIdAndUpdate(
      id,
      {
        ...req.body,
      },
      {
        new: true,
      }
    );
    res.json(post);
  } catch (error) {
    res.json(error);
  }
});

//----------------------------------------------------------------
// likes
//----------------------------------------------------------------
const addLikeToPostCtrl = expressAsyncHandler(async (req, res) => {
  //find the post to be liked
  const { postId } = req.body;
  const post = await Post.findById(postId);
  //find the login user
  const loginUserId = req?.user?._id;
  //fint this user liked in this post
  const isLiked = post?.isLiked;
  // check if this user disliked this post
  const alreadyDisliked = post?.dislikes?.find(
    (userId) => userId?.toString() === loginUserId?.toString()
  );
  // remove the user from dislikes array if it exists
  if (alreadyDisliked) {
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $pull: { dislikes: loginUserId },
        isDisliked: false,
      },
      {
        new: true,
      }
    );
    res.json(post);
  }
  // remove the user if he has likes
  if (isLiked) {
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $pull: { likes: loginUserId },
        isLiked: false,
      },
      {
        new: true,
      }
    );
    res.json(post);
  } else {
    //add to likes
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $push: { likes: loginUserId },
        isLiked: true,
      },
      {
        new: true,
      }
    );
    res.json(post);
  }
});

//dislikes
const addDisLikeToPostCtrl = expressAsyncHandler(async (req, res) => {
  const { postId } = req.body;
  const post = await Post.findById(postId);
  const loginUserId = req?.user?._id;

  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  const isDisliked = post.dislikes.includes(loginUserId);

  if (isDisliked) {
    await Post.findByIdAndUpdate(postId, {
      $pull: { dislikes: loginUserId },
      isDisliked: false,
    });
  } else {
    await Post.findByIdAndUpdate(postId, {
      $push: { dislikes: loginUserId },
      isDisliked: true,
    });

    // Remove user from likes if they already liked the post
    if (post.likes.includes(loginUserId)) {
      await Post.findByIdAndUpdate(postId, {
        $pull: { likes: loginUserId },
        isLiked: false,
      });
    }
  }

  const updatedPost = await Post.findById(postId);
  res.json(updatedPost);
});

module.exports = {
  createPostCtrl,
  fetchPostCtrl,
  fetchAllPostsCtrl,
  deletePostCtrl,
  updatePostCtrl,
  addLikeToPostCtrl,
  addDisLikeToPostCtrl,
};
