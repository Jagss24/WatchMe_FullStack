// save.js
import mongoose from "mongoose";

const saveSchema = new mongoose.Schema({
  imageId: {
    type: String,
    required: true,
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PostedBy",
    required: true,
  },
  userId: [
    {
      type: String,
      required: true,
    },
  ],
});

export default mongoose.model("Save", saveSchema);
