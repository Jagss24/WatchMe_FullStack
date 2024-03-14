import mongoose from "mongoose";

const conn = async (mongoURI) => {
  try {
    await mongoose.connect(mongoURI).then(() => {
      console.log("MongoDB cloud connected");
    });
  } catch (error) {
    console.log(error);
  }
};

export default conn;
