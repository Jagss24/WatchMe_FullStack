import app from "express";
import Comment from "../models/comment.js";
import Pin from "../models/pin.js";
import User from "../models/user.js";
const router = app.Router();

router.post("/addComment", async (req, res) => {
  try {
    const { imageId, postedBy, comment } = req.body;

    // Check if the pin exists
    const existingPin = await Pin.findById(imageId);

    if (existingPin) {
      // If no existing comments with the same imageId, create a new comment
      const newComment = new Comment({
        imageId: imageId,
        postedBy: postedBy,
        comment: comment,
      });
      console.log("pura naya hai");
      // Save the new comment
      await newComment.save();

      // Add the new comment to the existing pin
      existingPin.comment.push(newComment);

      // Save the updated pin
      await existingPin.save();

      // Respond with the new comment
      res.status(200).json(newComment);
    } else {
      return res.status(200).json("Image doesn't exist");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/getComments", async (req, res) => {
  try {
    const { imageId } = req.body;
    const existingPin = await Pin.findById(imageId);

    if (existingPin) {
      // Find existing comments with the same imageId
      const existingComments = await Comment.find({ imageId: imageId });
      if (existingComments.length > 0) {
        const comments = await Promise.all(
          existingComments.map(async (currentComment) => {
            const userId = await User.findById(currentComment.postedBy);
            return {
              userName: userId.userName,
              userImg: userId.image,
              comment: currentComment.comment,
              userId: userId._id,
            };
          })
        );
        return res.status(200).json({ comment: comments, pins: existingPin });
      } else {
        return res.status(200).json({ message: "No comments here" });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
