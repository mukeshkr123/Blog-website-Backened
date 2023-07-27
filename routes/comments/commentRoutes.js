const express = require("express");
const {
  createCommentCtrl,
  fetchAllCommentsCtrl,
  fetchCommentCtrl,
} = require("../../controllers/comments/commentCtrl");
const authMiddleware = require("../../middleware/auth/authMiddleware");

const commentRoute = express.Router();

commentRoute.post("/", authMiddleware, createCommentCtrl);
commentRoute.get("/", authMiddleware, fetchAllCommentsCtrl);
commentRoute.get("/:id", authMiddleware, fetchCommentCtrl);

module.exports = commentRoute;
