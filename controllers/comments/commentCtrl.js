const expressAsyncHandler = require("express-async-handler");
const Comment = require("../../model/comment/Comment");

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

// fetch all comments (You can implement this route handler here)

module.exports = createCommentCtrl;
