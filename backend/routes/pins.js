import app from "express";
import Pin from "../models/pin.js";
import upload from "../middleware/upload.js";
import User from "../models/user.js";
const router = app.Router();

router.post("/post", upload.single("image"), async (req, res) => {
  try {
    const { title, about, destination, category, userId, postedBy } = req.body;
    const existingUser = await User.findById(postedBy);
    if (existingUser) {
      const pin = new Pin({
        title,
        about,
        destination,
        category,
        userId,
        postedBy: existingUser,
      });
      if (!req.file) {
        return res.status(200).json({ message: "image not there" });
      }
      pin.image = req.file.path;
      await pin.save().then(() => {
        res.status(200).json({ message: "Posted Successfully" });
      });
    }
  } catch (error) {
    console.log(error);
    res.status(200).json({ error: { error } });
  }
});

router.post("/pin-detail", async (req, res) => {
  try {
    const { imageId } = req.body;
    const image = await Pin.findById(imageId);
    if (image) {
      const userId = image.postedBy;
      const userDocument = await User.findById(userId);
      return res.status(200).json({
        pins: image,
        userName: userDocument.userName,
        userImage: userDocument.image,
        userId: userDocument._id,
      });
    } else {
      return res.status(200).json({ message: "Image not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/add-comment", async (req, res) => {
  try {
    const { comment, imageId } = req.body;
    const image = await Pin.findById(imageId);
    if (image) {
      image.comment.push(comment);
      await image
        .save()
        .then((res) =>
          res.status(200).json({ message: "Comment posted Successfully" })
        );
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/add-like", async (req, res) => {
  try {
    const { imageId, userId } = req.body;
    const image = await Pin.findById(imageId);
    if (image) {
      if (image.likes.includes(userId)) {
        return res.status(200).json({ message: "Already Liked" });
      }
      image.likes.push(userId);
      await image.save();
      res.status(200).json({ message: "Liked the post" });
    } else {
      res.status(200).json({ message: "User doesn't exist" });
    }
  } catch (error) {
    console.error(error);
    res.status(200).json({ error: "Internal Server Error" });
  }
});

router.post("/remove-like", async (req, res) => {
  try {
    const { imageId, userId } = req.body;
    const image = await Pin.findById(imageId);
    if (image) {
      if (image.likes.includes(userId)) {
        image.likes.remove(userId);
        await image.save();
        return res.status(200).json({ message: "Removed Liked" });
      } else {
        res.status(200).json({ message: "User has not liked yet" });
      }
    } else {
      res.status(200).json({ message: "User doesn't exist" });
    }
  } catch (error) {
    console.error(error);
    res.status(200).json({ error: "Internal Server Error" });
  }
});

router.post("/get-likes", async (req, res) => {
  try {
    const { imageId, userId } = req.body;
    const image = await Pin.findById(imageId);
    if (image) {
      const likedByUser = image.likes.includes(userId);
      const imageLikes = image.likes.length;
      return res.status(200).json({ likedByUser, like: imageLikes });
    } else {
      res.status(200).json({ message: "Image doesn't exist" });
    }
  } catch (error) {
    console.error(error);
    res.status(200).json({ error: "Internal Server Error" });
  }
});

router.post("/total-like", async (req, res) => {
  try {
    const { userId } = req.body;
    const totalPins = await Pin.find({ userId: userId });
    let totalLikes = 0;
    totalPins.forEach((pin) => {
      totalLikes += pin.likes.length;
    });
    res.status(200).json({ totalLikes });
  } catch (error) {
    console.error(error);
    res.status(200).json({ error: "Internal Server Error" });
  }
});

router.post("/savePin", async (req, res) => {
  try {
    const { imageId, userId } = req.body;
    const image = await Pin.findById(imageId);
    if (image) {
      if (image.savedBy.includes(userId)) {
        return res.status(200).json({ message: "Already Saved" });
      }
      image.savedBy.push(userId);
      await image.save();
      res.status(200).json({ message: "Saved the post" });
    } else {
      res.status(200).json({ message: "User doesn't exist" });
    }
  } catch (error) {
    console.error(error);
    res.status(200).json({ error: "Internal Server Error" });
  }
});

router.post("/get-save", async (req, res) => {
  try {
    const { imageId, userId } = req.body;
    const image = await Pin.findById(imageId);
    if (image) {
      const savedByUser = image.savedBy.includes(userId);
      const saveLength = image.savedBy.length;
      return res.status(200).json({ savedByUser, saves: saveLength });
    } else {
      res.status(200).json({ message: "Image doesn't exist" });
    }
  } catch (error) {
    console.error(error);
    res.status(200).json({ error: "Internal Server Error" });
  }
});
router.post("/remove-save", async (req, res) => {
  try {
    const { imageId, userId } = req.body;
    const image = await Pin.findById(imageId);
    if (image) {
      if (image.savedBy.includes(userId)) {
        image.savedBy.remove(userId);
        await image.save();
        return res.status(200).json({ message: "Removed from Saved" });
      } else {
        res.status(200).json({ message: "User has not saved yet" });
      }
    } else {
      res.status(200).json({ message: "User doesn't exist" });
    }
  } catch (error) {
    console.error(error);
    res.status(200).json({ error: "Internal Server Error" });
  }
});

router.post("/userSavedimage", async (req, res) => {
  try {
    const { userId } = req.body;
    const existingSave = await Pin.find({ savedBy: userId });
    if (existingSave.length > 0) {
      const pinDocuments = await Promise.all(
        existingSave.map(async (eachSave) => {
          const pinDocument = await Pin.findById(eachSave._id);
          return pinDocument;
        })
      );
      const filteredPinDocuments = pinDocuments.filter((pin) => pin !== null);
      return res.status(200).json({ pins: filteredPinDocuments });
    } else {
      return res.status(200).json({ message: "No pins saved", pins: 0 });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/post", async (req, res) => {
  try {
    const pinswithImages = await Pin.find({
      image: { $exists: true, $ne: null },
    }).sort({ _id: 1 });
    res.json({ pins: pinswithImages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/delete", async (req, res) => {
  try {
    const { imageId } = req.query;
    const imageExists = await Pin.findByIdAndDelete(imageId);
    if (imageExists)
      return res.status(200).json({ message: "Deleted Successfully" });
    res.status(200).json({ message: "Image not found" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/postedBy", async (req, res) => {
  try {
    const { imageId } = req.body;
    const pinDocument = await Pin.findById(imageId);
    if (pinDocument) {
      const userId = pinDocument.postedBy;
      const userDocument = await User.findById(userId);
      if (userDocument) {
        return res.status(200).json({
          userImage: userDocument.image,
          userName: userDocument.userName,
        });
      }
      return res.status(200).json({ message: "No user found" });
    }
    return res.status(200).json({ message: "Pin doesn't found" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/category", async (req, res) => {
  try {
    const { categoryId } = req.body;
    const existingPin = await Pin.find({ category: categoryId });
    if (existingPin) {
      return res.status(200).json({ pins: existingPin });
    } else {
      return res
        .status(200)
        .json({ message: "No Pins exist for the specified category" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/fetchuserimg", async (req, res) => {
  try {
    const { userId } = req.body;
    const pinDocuments = await Pin.find({ postedBy: userId });
    if (pinDocuments) {
      return res.status(200).json({ pins: pinDocuments });
    } else {
      return res
        .status(200)
        .json({ message: "User has not created any pins yet" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
