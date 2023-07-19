const express = require("express");
const {
  createPostCtrl,
  fetchAllPostsCtrl,
  fetchPostCtrl,
  deletePostCtrl,
  updatePostCtrl,
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

postRoute.get("/", fetchAllPostsCtrl); // fetch all posts
postRoute.get("/:id", fetchPostCtrl); // fetch a posts
postRoute.delete("/:id", deletePostCtrl); // fetch a posts
postRoute.put("/:id", updatePostCtrl); // update  a posts

module.exports = postRoute;
