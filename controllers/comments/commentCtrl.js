const expressAsyncHandler = require("express-async-handler");
const Comment = require("../../model/comment/Comment");
const validateMongoId = require("../../utils/validateMongodbID");

const createCommentCtrl = expressAsyncHandler(async (req, res) => {
  try {
    const { user, body } = req;

    // Validate the input data
    const { postId, description } = body;
    if (!postId || !description) {
      return res
        .status(400)
        .json({ error: "postId and description are required." });
    }

    const comment = await Comment.create({
      post: postId,
      user: user,
      description: description,
    });

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: "Comment creation failed." }); //
  }
});

// fetch all COMMENTS
const fetchAllCommentsCtrl = expressAsyncHandler(async (req, res) => {
  try {
    const comments = await Comment.find();
    res.json(comments);
  } catch (error) {
    res.json(500).json({ error: "Error fetching comments" });
  }
});
// fetch a COMMENT
const fetchCommentCtrl = expressAsyncHandler(async (req, res) => {
  const id = req.params.id;
  try {
    const comments = await Comment.findById(id);
    res.json(comments);
  } catch (error) {
    res.json(500).json({ error: "Error fetching comments" });
  }
});

// update a comment

const updateCommentCtrl = expressAsyncHandler(async (req, res) => {
  const id = req.params.id;
  validateMongoId(id);
  try {
    const updatedComment = await Comment.findByIdAndUpdate(
      id,
      {
        post: req.body?.postId,
        user: req?.user,
        description: req?.body?.description,
      },
      {
        new: true,
        runValidators: true,
      }
    ).populate("user");
    res.json(updatedComment);
  } catch (error) {
    res.json(500).json({ error: "Error updating comments" });
  }
});

// delete a COMMENT
const deleteCommentCtrl = expressAsyncHandler(async (req, res) => {
  const id = req.params.id;
  validateMongoId(id);
  try {
    const comment = await Comment.findByIdAndDelete(id);
    res.json(comment);
  } catch (error) {
    res.json(500).json({ error: "Error fetching comments" });
  }
});

module.exports = {
  createCommentCtrl,
  fetchAllCommentsCtrl,
  fetchCommentCtrl,
  deleteCommentCtrl,
  updateCommentCtrl,
};
