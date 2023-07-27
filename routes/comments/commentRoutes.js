const express = require("express");
const createCommentCtrl = require("../../controllers/comments/commentCtrl");
const authMiddleware = require("../../middleware/auth/authMiddleware");

const commentRoute = express.Router();

commentRoute.post("/", authMiddleware, createCommentCtrl);

module.exports = commentRoute;
