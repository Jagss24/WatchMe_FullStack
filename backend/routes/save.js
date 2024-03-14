import app from "express";
import Save from "../models/save.js";
import Pin from "../models/pin.js";
import PostedBy from "../models/postedBy.js";
import User from "../models/user.js";

const router = app.Router();

router.post("/save", async (req, res) => {
  try {
    const { imageId, userId, postedById } = req.body; // Assuming you're sending the 'id' in the request body

    const existingPin = await Pin.findById(imageId);
    if (existingPin) {
      const existingSave = await Save.findOne({ imageId });
      if (existingSave) {
        if (existingSave.userId.includes(userId)) {
          return res.status(200).json({ message: "Already Saved" });
        } else {
          existingSave.userId.push(userId);
          await existingSave.save();
        }
        if (existingPin.savedBy.includes(existingSave._id)) {
          return res
            .status(200)
            .json({ message: "Saved Successfully without duplicating" });
        } else {
          existingPin.savedBy.push(existingSave);
          await existingPin.save();
          return res.status(200).json({ message: "Saved Successfully" });
        }
      } else {
        const newSave = new Save({
          imageId: imageId,
          postedBy: postedById,
          userId: [userId],
        });
        await newSave.save().then(() => res.status(200).json(newSave));
        existingPin.savedBy.push(newSave);
        await existingPin.save();
      }
    } else {
      res.status(200).json({
        message: "Pin doesn't exist",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/getsave", async (req, res) => {
  try {
    const { imageId } = req.body; // Assuming you're sending the 'id' in the request body

    const existingPin = await Pin.findById(imageId);
    if (existingPin) {
      const existingSave = await Save.findOne({ imageId });
      if (existingSave) {
        return res
          .status(200)
          .json({ length: existingSave.userId.length, existingSave: true });
      }
      return res.status(200).json({ length: 0, existingSave: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post('/removeFromSave', async(req,res) => {
   try {
     const { imageId, userId, postedById } = req.body; // Assuming you're sending the 'id' in the request body

     const existingPin = await Pin.findById(imageId);
     if (existingPin) {
       const existingSave = await Save.findOne({ imageId });
       if (existingSave) {
         if (existingSave.userId.includes(userId)) {
            existingSave.userId.remove(userId);
            await existingSave.save();
           return res.status(200).json({ message: "Already Saved" });
         }       
       } else {
         const newSave = new Save({
           imageId: imageId,
           postedBy: postedById,
           userId: [userId],
         });
         await newSave.save().then(() => res.status(200).json(newSave));
         existingPin.savedBy.push(newSave);
         await existingPin.save();
       }
     } else {
       res.status(200).json({
         message: "Pin doesn't exist",
       });
     }
   } catch (error) {
     console.error(error);
     res.status(500).json({ error: "Internal server error" });
   }
})
router.post("/userSavedimage", async (req, res) => {
  try {
    const { userId } = req.body;
    const existingSave = await Save.find({ userId: userId });
    if (existingSave.length> 0) {
      const pinDocuments = await Promise.all(
        existingSave.map(async (eachSave) => {
          const pinDocument = await Pin.findById(eachSave.imageId);
          return pinDocument;
        })
        
      );
      const filteredPinDocuments = pinDocuments.filter((pin) => pin !== null);
      return res.status(200).json({ pins: filteredPinDocuments });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});
export default router;
