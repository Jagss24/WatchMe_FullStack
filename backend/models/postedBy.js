import mongoose from "mongoose";

const postedBySchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId, //Chatgpt has given me here mongoose.Schemas.Types.ObjectId
    ref: "User",
    required: true,
  },
});

export default mongoose.model("PostedBy", postedBySchema);
