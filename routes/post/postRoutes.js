const express = require("express");
const { createPostCtrl } = require("../../controllers/posts/postCtrl");
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

module.exports = postRoute;
