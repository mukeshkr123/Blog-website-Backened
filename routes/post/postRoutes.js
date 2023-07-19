const express = require("express");
const {
  createPostCtrl,
  fetchAllPostsCtrl,
  fetchPostCtrl,
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
postRoute.get("/:id", fetchPostCtrl); // fetch all posts

module.exports = postRoute;
