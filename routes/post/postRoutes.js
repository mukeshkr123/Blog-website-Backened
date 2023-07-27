const express = require("express");
const {
  createPostCtrl,
  fetchAllPostsCtrl,
  fetchPostCtrl,
  deletePostCtrl,
  updatePostCtrl,
  addLikeToPostCtrl,
  addDisLikeToPostCtrl,
} = require("../../controllers/posts/postCtrl");
const authMiddleware = require("../../middleware/auth/authMiddleware");
const {
  PhotoUpload,
  PostImgPhotoResize,
} = require("../../middleware/upload/PhotoUpload");

const postRoute = express.Router();

postRoute.post(
  "/",
  authMiddleware,
  PhotoUpload.single("image"),
  PostImgPhotoResize,
  createPostCtrl
);

postRoute.put("/likes", authMiddleware, addLikeToPostCtrl);
postRoute.put("/dislikes", authMiddleware, addDisLikeToPostCtrl);
postRoute.get("/", fetchAllPostsCtrl); // fetch all posts
postRoute.get("/:id", fetchPostCtrl); // fetch a posts
postRoute.delete("/:id", deletePostCtrl); // fetch a posts
postRoute.put("/:id", updatePostCtrl); // update a post

module.exports = postRoute;
