import app from "express";
import Pin from "../models/pin.js";
const router = app.Router();

router.post("/search", async (req, res) => {
  try {
    const { searchTerm } = req.body;
    const pinDocuments = await Pin.find({
      $or: [
        { title: { $regex: new RegExp(searchTerm, "i") } },
        { about: { $regex: new RegExp(searchTerm, "i") } },
        { category: { $regex: new RegExp(searchTerm, "i") } },
      ],
    });
    if (pinDocuments) {
      res.status(200).json({ pins: pinDocuments });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
export default router;
