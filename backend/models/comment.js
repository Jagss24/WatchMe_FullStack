import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  imageId: {
    type: String,
    required: true,
  },
  postedBy: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Comment", commentSchema);
