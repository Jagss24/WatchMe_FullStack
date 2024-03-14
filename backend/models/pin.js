// pin.js
import mongoose from "mongoose";

const pinSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  about: {
    type: String,
    required: true,
  },
  destination: {
    type: String, // Assuming destination is a string, change it to 'url' if it's meant to be a URL
  },
  category: {
    type: String,
    required: true,
  },
  image: {
    type: String, // Assuming image is a URL or file path, adjust it based on your use case
  },
  userId: {
    type: String,
    required: true,
  },
  postedBy: {
    type: mongoose.Types.ObjectId,
    ref: "PostedBy",
    required: true,
  },
  likes: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  ],
  savedBy: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Save",
    },
  ],
  comment: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Comment",
    },
  ],
});

const Pin = mongoose.model("Pin", pinSchema);

export default Pin;
